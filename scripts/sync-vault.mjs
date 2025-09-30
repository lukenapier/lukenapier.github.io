import { promises as fs } from 'node:fs';
import { dirname, join, relative as pathRelative, resolve, basename, extname, posix, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import fg from 'fast-glob';
import matter from 'gray-matter';
import slugify from '@sindresorhus/slugify';
import GithubSlugger from 'github-slugger';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const vaultDir = join(repoRoot, 'vault');
const contentOutDir = join(repoRoot, 'src/content/notes');
const publicAssetsDir = join(repoRoot, 'public/garden-assets');
const searchIndexPath = join(repoRoot, 'public/garden-search.json');

function toPosixPath(value) {
  if (!value || value === '.') return '';
  return value.split(sep).filter(Boolean).join('/');
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function pathExists(path) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

function titleize(value) {
  if (!value) return '';
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function cleanDate(date) {
  if (!date) return undefined;
  try {
    const normalized = new Date(date);
    if (!Number.isNaN(normalized.getTime())) {
      return normalized.toISOString();
    }
  } catch {
    // ignore
  }
  return undefined;
}

function normalizeLinkTarget(target) {
  return target.replace(/\\/g, '/').replace(/^\.\//, '');
}

function slugifyPathParts(parts) {
  return parts
    .map((segment) => slugify(segment, { separator: '-', decamelize: false }))
    .filter(Boolean)
    .join('/');
}

function slugHeading(value) {
  const slugger = new GithubSlugger();
  return slugger.slug(String(value ?? ''));
}

function getGitDate(filePath) {
  const relative = pathRelative(repoRoot, filePath);
  const result = spawnSync('git', ['log', '-1', '--pretty=format:%cI', '--', relative], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
  if (result.status === 0) {
    const output = result.stdout.trim();
    return output ? output : undefined;
  }
  return undefined;
}

async function copyAsset(sourcePath, destDir, preferredName) {
  await ensureDir(destDir);
  const originalName = preferredName || basename(sourcePath);
  let baseName = originalName;
  let counter = 1;
  const ext = extname(originalName);
  const nameWithoutExt = ext ? originalName.slice(0, -ext.length) : originalName;
  let destination = join(destDir, baseName);
  while (await pathExists(destination)) {
    baseName = `${nameWithoutExt}-${counter}${ext}`;
    destination = join(destDir, baseName);
    counter += 1;
  }
  await fs.copyFile(sourcePath, destination);
  return destination;
}

function createResolutionMaps(notes) {
  const byRelative = new Map();
  const byBase = new Map();
  for (const note of notes) {
    const key = note.relativeNoExtLower;
    if (!byRelative.has(key)) {
      byRelative.set(key, note);
    }
    const arrKey = note.baseNameLower;
    const arr = byBase.get(arrKey) ?? [];
    arr.push(note);
    byBase.set(arrKey, arr);
  }
  for (const arr of byBase.values()) {
    arr.sort((a, b) => a.relativeNoExtLower.localeCompare(b.relativeNoExtLower));
  }
  return { byRelative, byBase };
}

function resolveNoteTarget(target, fromNote, maps) {
  if (!target) return undefined;
  const normalizedTarget = normalizeLinkTarget(target);
  const normalized = normalizedTarget.replace(/^\//, '');
  const fromDir = fromNote.dirLower;
  const candidates = [];
  if (normalized.includes('/')) {
    const joined = posix.normalize(normalized);
    if (fromDir) {
      const relativeFromDir = posix.normalize(`${fromDir}/${joined}`);
      candidates.push(relativeFromDir);
    }
    candidates.push(joined);
  } else {
    if (fromDir) {
      candidates.push(fromDir ? posix.normalize(`${fromDir}/${normalized}`) : normalized);
    }
    candidates.push(normalized);
  }
  for (const candidate of candidates) {
    const note = maps.byRelative.get(candidate.toLowerCase());
    if (note) return note;
  }
  const baseMatches = maps.byBase.get(normalized.toLowerCase());
  if (baseMatches && baseMatches.length) {
    const sameDir = baseMatches.find((note) => note.dirLower === fromDir);
    return sameDir ?? baseMatches[0];
  }
  return undefined;
}

function extractPlainTextSummary(content, maxWords = 60) {
  const sanitized = content
    .replace(/`{3}[\s\S]*?`{3}/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/\[.*?\]\(.*?\)/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!sanitized) return '';
  const words = sanitized.split(' ');
  return words.slice(0, maxWords).join(' ');
}

function extractHeadings(content) {
  const headingRegex = /^#{1,6}\s+(.+)$/gm;
  const headings = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const [full, title] = match;
    const depth = full.indexOf(' ');
    headings.push({ depth, title: title.trim() });
  }
  return headings;
}

async function syncVault({ verbose = false } = {}) {
  if (!(await pathExists(vaultDir))) {
    await ensureDir(contentOutDir);
    await ensureDir(publicAssetsDir);
    await fs.writeFile(searchIndexPath, '[]');
    return;
  }

  const noteFiles = await fg('**/*.md', { cwd: vaultDir, dot: false });
  const notes = [];

  for (const relativePath of noteFiles) {
    const absolutePath = join(vaultDir, relativePath);
    const fileContent = await fs.readFile(absolutePath, 'utf8');
    const parsed = matter(fileContent);
    const relativeNoExt = relativePath.replace(/\.md$/i, '');
    const slugParts = relativeNoExt.split(/\\|\//g).filter(Boolean);
    const slug = slugifyPathParts(slugParts);
    const dir = toPosixPath(dirname(relativeNoExt));
    const dirLower = dir.toLowerCase();
    const baseName = basename(relativeNoExt);
    const baseNameLower = baseName.toLowerCase();
    const stats = await fs.stat(absolutePath);

    notes.push({
      absolutePath,
      relativePath,
      relativeNoExt,
      relativeNoExtLower: relativeNoExt.toLowerCase(),
      dir,
      dirLower,
      baseName,
      baseNameLower,
      slug,
      data: parsed.data ?? {},
      content: parsed.content ?? '',
      stats,
    });
  }

  const maps = createResolutionMaps(notes);

  await fs.rm(contentOutDir, { recursive: true, force: true });
  await fs.rm(publicAssetsDir, { recursive: true, force: true });
  await ensureDir(contentOutDir);
  await ensureDir(publicAssetsDir);

  const searchDocuments = [];

  for (const note of notes) {
        const resolvedTitle = (typeof note.data.title === 'string' && note.data.title.trim().length > 0)
      ? note.data.title.trim()
      : (() => {
          const h1Match = note.content.match(/^#\s+(.+)$/m);
          if (h1Match) return h1Match[1].trim();
          return titleize(note.baseName);
        })();

    const gitDate = getGitDate(note.absolutePath);
    const fsDate = note.stats?.mtime?.toISOString?.() ?? undefined;
    const resolvedDate = cleanDate(note.data.date) ?? gitDate ?? fsDate;

    const tagsRaw = note.data.tags;
    const resolvedTags = Array.isArray(tagsRaw)
      ? tagsRaw.map((tag) => String(tag))
      : tagsRaw
        ? [String(tagsRaw)]
        : [];

    let updatedContent = note.content;

    // Handle embedded wiki media ![[...]]
    const embedRegex = /!\[\[([^\]]+)\]\]/g;
    let embedMatch;
    while ((embedMatch = embedRegex.exec(updatedContent)) !== null) {
      const full = embedMatch[0];
      const inner = embedMatch[1];
      const [targetPartRaw, aliasRaw] = inner.split('|');
      const targetPart = targetPartRaw.trim();
      const alias = aliasRaw ? aliasRaw.trim() : '';
      const mediaPath = targetPart.replace(/#/g, '#');
      const { assetPath, altText } = await resolveAsset(mediaPath, note);
      if (assetPath) {
        const alt = alias || altText || titleize(basename(mediaPath));
        const replacement = `![${alt}](${assetPath})`;
        updatedContent = updatedContent.replace(full, replacement);
      }
    }

    // Wiki links [[...]] (textual)
    const wikiLinkRegex = /\[\[([^\]]+)\]\]/g;
    updatedContent = updatedContent.replace(wikiLinkRegex, (match, inner) => {
      const [targetRaw, aliasRaw] = inner.split('|');
      const targetSegment = targetRaw?.trim() ?? '';
      const alias = aliasRaw?.trim();
      if (!targetSegment) {
        return alias ?? match;
      }
      let headingPart = '';
      let fileSegment = targetSegment;
      if (targetSegment.includes('#')) {
        const [filePart, heading] = targetSegment.split('#');
        fileSegment = filePart;
        headingPart = heading ?? '';
      }
      const resolved = resolveNoteTarget(fileSegment, note, maps);
      if (!resolved) {
        return alias ?? fileSegment;
      }
      const headingSlug = headingPart ? `#${slugHeading(headingPart)}` : '';
      const linkText = alias || (headingPart && !alias ? headingPart : resolved.baseName);
      return `[${linkText}](/garden/${resolved.slug}${headingSlug})`;
    });

    // Standard markdown links relative to vault
    const linkRegex = /(\!)?\[(.*?)\]\((.*?)\)/g;
    updatedContent = await replaceAsync(updatedContent, linkRegex, async (match, bang, text, url) => {
      if (bang === '!') {
        const { assetPath } = await resolveAsset(url, note);
        if (assetPath) {
          return `![${text}](${assetPath})`;
        }
        return match;
      }
      const cleanUrl = url.trim();
      if (/^(https?:|mailto:|#|\w+:)/i.test(cleanUrl)) {
        return match;
      }
      const withoutHash = cleanUrl.split('#')[0];
      const hash = cleanUrl.includes('#') ? `#${cleanUrl.split('#').slice(1).join('#')}` : '';
      const normalized = withoutHash.replace(/\.mdx?$/i, '');
      const resolved = resolveNoteTarget(normalized, note, maps);
      if (!resolved) {
        return match;
      }
      const headingSlug = hash ? `#${slugHeading(hash.replace(/^#/, ''))}` : '';
      return `[${text}](/garden/${resolved.slug}${headingSlug})`;
    });

    const headings = extractHeadings(updatedContent);
    const summary = extractPlainTextSummary(updatedContent);

    const finalFrontmatter = {
      ...note.data,
      title: resolvedTitle,
      date: resolvedDate,
      tags: resolvedTags,
      slug: note.slug,
      folder: note.dir,
    };

    const finalMarkdown = matter.stringify(updatedContent.trim(), finalFrontmatter);
    const destinationPath = join(contentOutDir, `${note.slug}.md`);
    await ensureDir(dirname(destinationPath));
    await fs.writeFile(destinationPath, `${finalMarkdown}\n`, 'utf8');

    searchDocuments.push({
      slug: note.slug,
      title: resolvedTitle,
      folder: note.dir,
      tags: resolvedTags,
      headings: headings.filter((h) => h.depth <= 3).map((h) => h.title),
      excerpt: summary,
    });

    if (verbose) {
      console.log(`Synced note: ${note.relativePath} -> ${destinationPath}`);
    }
  }

  await fs.writeFile(searchIndexPath, `${JSON.stringify(searchDocuments, null, 2)}\n`, 'utf8');
}

async function replaceAsync(str, regex, asyncFn) {
  const promises = [];
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(match, ...args);
    promises.push(promise);
    return match;
  });
  const data = await Promise.all(promises);
  return str.replace(regex, () => data.shift());
}

async function resolveAsset(rawTarget, note) {
  if (!rawTarget) {
    return { assetPath: undefined, altText: undefined };
  }
  const cleanTarget = rawTarget.trim().replace(/\?.*$/, '');
  if (/^(https?:|data:|\/)/i.test(cleanTarget)) {
    return { assetPath: cleanTarget, altText: undefined };
  }
  const target = cleanTarget.split('#')[0];
  const normalizedTarget = normalizeLinkTarget(target);
  const fromDir = note.dir;
  const candidates = [];
  if (normalizedTarget.includes('/')) {
    if (fromDir) {
      candidates.push(posix.normalize(`${fromDir}/${normalizedTarget}`));
    }
    candidates.push(posix.normalize(normalizedTarget));
  } else {
    if (fromDir) {
      candidates.push(posix.normalize(`${fromDir}/${normalizedTarget}`));
    }
    candidates.push(normalizedTarget);
  }
  for (const candidate of candidates) {
    const assetPath = join(vaultDir, candidate);
    if (await pathExists(assetPath)) {
      const destDir = join(publicAssetsDir, note.slug);
      const copied = await copyAsset(assetPath, destDir);
      const publicPath = `/garden-assets/${note.slug}/${basename(copied)}`;
      return { assetPath: publicPath, altText: titleize(basename(candidate)) };
    }
  }
  return { assetPath: undefined, altText: undefined };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  syncVault({ verbose: process.argv.includes('--verbose') }).catch((error) => {
    console.error('Failed to sync vault:', error);
    process.exitCode = 1;
  });
}

export { syncVault };
