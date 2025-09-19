// Cursor light effect
const cursorLight = document.querySelector('.cursor-light');
document.addEventListener('mousemove', (event) => {
    if (!cursorLight) return;
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
});

const markdownConverter = new showdown.Converter({
    tables: true,
    ghCodeBlocks: true,
    simplifiedAutoLink: true,
    strikethrough: true,
    tasklists: true,
    simpleLineBreaks: true
});

const playerCountSpan = document.getElementById('player-count');
const playerStatusIndicator = document.getElementById('player-status-indicator');
const playerStatusText = document.getElementById('player-status-text');
const playerUpdatedSpan = document.getElementById('player-updated');
const changelogMeta = document.getElementById('changelog-updated');
const vaultCatalogContainer = document.getElementById('vault-catalog');
const vaultNoteContainer = document.getElementById('vault-note');
const vaultStatus = document.getElementById('vault-status');
const vaultBreadcrumbs = document.getElementById('vault-breadcrumbs');
const vaultSearchInput = document.getElementById('vault-search');
const vaultRefresh = document.getElementById('vault-refresh');

const vaultManifestCandidates = [
    'vault/manifest.json',
    'vault/index.json',
    'vault/_manifest.json',
    'vault/catalog.json',
    'vault/data.json'
];

let lastPlayerCountTimestamp = null;
let hasPlayerResponse = false;
let vaultEntries = [];
let filteredVaultEntries = [];
let activeVaultPath = null;

function setStatusIndicator(state) {
    if (!playerStatusIndicator || !playerStatusText) return;

    playerStatusIndicator.classList.remove('status-online', 'status-offline', 'status-unknown');

    switch (state) {
        case 'online':
            playerStatusIndicator.classList.add('status-online');
            playerStatusText.textContent = 'Realm is online';
            break;
        case 'offline':
            playerStatusIndicator.classList.add('status-offline');
            playerStatusText.textContent = 'Realm offline';
            break;
        default:
            playerStatusIndicator.classList.add('status-unknown');
            playerStatusText.textContent = 'Checking realm...';
            break;
    }
}

function formatRelativeTime(date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds} second${seconds === 1 ? '' : 's'} ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
}

function updatePlayerTimestamp() {
    if (!playerUpdatedSpan || !hasPlayerResponse) return;

    if (!lastPlayerCountTimestamp) {
        playerUpdatedSpan.textContent = 'Unavailable';
        return;
    }

    playerUpdatedSpan.textContent = formatRelativeTime(lastPlayerCountTimestamp);
}

function fetchPlayerCount() {
    const url = `http://tamir.great-site.net/player_count.php?t=${Date.now()}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            hasPlayerResponse = true;
            if (data.status === 'online') {
                if (playerCountSpan) {
                    playerCountSpan.textContent = data.players;
                }
                lastPlayerCountTimestamp = new Date();
                setStatusIndicator('online');
                updatePlayerTimestamp();
            } else {
                if (playerCountSpan) {
                    playerCountSpan.textContent = 'Offline';
                }
                lastPlayerCountTimestamp = null;
                setStatusIndicator('offline');
                updatePlayerTimestamp();
            }
        })
        .catch((error) => {
            console.error('Error fetching player count:', error);
            hasPlayerResponse = true;
            if (playerCountSpan) {
                playerCountSpan.textContent = '--';
            }
            lastPlayerCountTimestamp = null;
            setStatusIndicator('offline');
            updatePlayerTimestamp();
        });
}

function formatLatestHeading(line) {
    const sanitized = line.replace(/^##\s*/, '').trim();
    const parts = sanitized.split(' - ');

    if (parts.length >= 3) {
        const version = parts[0].replace(/^[\[]|[\]]$/g, '');
        const date = parts[1].trim();
        const title = parts.slice(2).join(' - ').trim();

        const displayParts = [];
        if (title) {
            displayParts.push(title);
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            displayParts.push(date);
        }

        if (version) {
            const formattedVersion = version.toLowerCase() === 'unreleased'
                ? 'Unreleased build'
                : `Version ${version}`;
            displayParts.push(formattedVersion);
        }

        return displayParts.join(' • ');
    }

    return sanitized.replace(/[\[\]]/g, '');
}

function extractLatestHeading(markdown) {
    const lines = markdown.split('\n');
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (line.startsWith('## ')) {
            return formatLatestHeading(line);
        }
    }
    return null;
}

function enhanceChangelog(container) {
    if (!container) return;

    container.querySelectorAll('h3').forEach((heading) => {
        heading.classList.add('article-subheading');
    });

    container.querySelectorAll('ul').forEach((list) => {
        list.classList.add('article-list');
    });

    container.querySelectorAll('table').forEach((table) => {
        table.classList.add('article-table');
    });
}

function fetchChangelog() {
    fetch('CHANGELOG.md')
        .then((response) => response.text())
        .then((markdown) => {
            const html = markdownConverter.makeHtml(markdown);
            const changelogContainer = document.getElementById('changelog-content');

            if (changelogContainer) {
                changelogContainer.innerHTML = html;
                enhanceChangelog(changelogContainer);
            }

            const latestHeading = extractLatestHeading(markdown);
            if (changelogMeta) {
                changelogMeta.textContent = latestHeading || 'Latest records catalogued';
            }
        })
        .catch((error) => {
            console.error('Error fetching changelog:', error);
            const changelogContainer = document.getElementById('changelog-content');
            if (changelogContainer) {
                changelogContainer.innerHTML = '<p class="error">Error: Could not load the changelog records.</p>';
            }
            if (changelogMeta) {
                changelogMeta.textContent = 'Unable to retrieve records';
            }
        });
}

function normalizeTags(tags) {
    if (!tags) return [];
    if (Array.isArray(tags)) {
        return tags.map(String).map((tag) => tag.replace(/^#/, '').trim()).filter(Boolean);
    }
    if (typeof tags === 'string') {
        return tags
            .split(/[,#]/)
            .map((tag) => tag.trim())
            .filter(Boolean);
    }
    return [];
}

function deriveTitleFromPath(path) {
    if (!path) return 'Untitled note';
    const normalized = path.replace(/\\/g, '/');
    const segments = normalized.split('/').filter(Boolean);
    const fileName = segments.pop() || normalized;
    return fileName.replace(/\.md$/i, '').replace(/[-_]/g, ' ').replace(/\s+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function deriveAncestorsFromPath(path) {
    if (!path) return [];
    const normalized = path.replace(/\\/g, '/');
    const segments = normalized.split('/').filter(Boolean);
    segments.pop();
    return segments;
}

function addVaultEntry(entry) {
    if (!entry || !entry.path) return;

    const normalizedPath = entry.path.replace(/\\/g, '/');
    const ancestors = Array.isArray(entry.ancestors) && entry.ancestors.length
        ? entry.ancestors
        : deriveAncestorsFromPath(normalizedPath);

    const parsedEntry = {
        title: entry.title || deriveTitleFromPath(normalizedPath),
        path: normalizedPath,
        ancestors: ancestors.filter(Boolean),
        tags: normalizeTags(entry.tags),
        summary: entry.summary || entry.excerpt || '',
        updated: entry.updated || entry.modified || entry.mtime || null,
        pinned: Boolean(entry.pinned)
    };

    if (entry.order !== undefined) {
        const parsedOrder = Number(entry.order);
        if (!Number.isNaN(parsedOrder)) {
            parsedEntry.order = parsedOrder;
        }
    }

    vaultEntries.push(parsedEntry);
}

function parseManifestNode(node, ancestors = []) {
    if (!node) return;

    if (Array.isArray(node)) {
        node.forEach((child) => parseManifestNode(child, ancestors));
        return;
    }

    if (typeof node === 'string') {
        addVaultEntry({ path: node });
        return;
    }

    if (typeof node !== 'object') {
        return;
    }

    if (node.type && (node.type === 'folder' || node.type === 'directory')) {
        const folderName = node.name || node.title || node.label || node.path || '';
        const nextAncestors = folderName ? [...ancestors, folderName] : ancestors;
        const children = node.children || node.notes || node.files || node.items;
        if (children) {
            parseManifestNode(children, nextAncestors);
        }
        return;
    }

    if (node.type && (node.type === 'note' || node.type === 'file' || node.type === 'document')) {
        addVaultEntry({
            title: node.title || node.name,
            path: node.path || node.file || node.url || node.source,
            tags: node.tags,
            summary: node.summary || node.description || node.excerpt,
            updated: node.updated || node.modified || node.mtime,
            ancestors: node.ancestors || ancestors,
            pinned: node.pinned,
            order: node.order
        });
        return;
    }

    if (node.notes || node.children || node.items || node.files) {
        const folderName = node.name || node.title || node.label || node.folder || '';
        const nextAncestors = folderName ? [...ancestors, folderName] : ancestors;
        const collection = node.notes || node.children || node.items || node.files;
        if (Array.isArray(collection)) {
            collection.forEach((child) => parseManifestNode(child, nextAncestors));
        } else {
            parseManifestNode(collection, nextAncestors);
        }
    } else if (node.path || node.file) {
        addVaultEntry({
            title: node.title || node.name,
            path: node.path || node.file,
            tags: node.tags,
            summary: node.summary || node.description,
            updated: node.updated || node.modified,
            ancestors: node.ancestors || ancestors,
            pinned: node.pinned,
            order: node.order
        });
    }
}

function buildVaultEntries(manifest) {
    vaultEntries = [];

    if (!manifest) return;

    if (manifest.collections && Array.isArray(manifest.collections)) {
        manifest.collections.forEach((collection) => {
            const baseAncestors = [collection.name || collection.title || collection.folder || 'Collection'];
            if (collection.notes) {
                parseManifestNode(collection.notes, baseAncestors);
            }
        });
    } else if (manifest.notes || manifest.children || manifest.items || manifest.files) {
        parseManifestNode(manifest.notes || manifest.children || manifest.items || manifest.files, []);
    } else {
        parseManifestNode(manifest, []);
    }

    const deduped = new Map();
    vaultEntries.forEach((entry) => {
        if (!entry.path) return;
        if (!deduped.has(entry.path)) {
            deduped.set(entry.path, entry);
            return;
        }

        const existing = deduped.get(entry.path);
        if (!existing.summary && entry.summary) {
            existing.summary = entry.summary;
        }
        if (!existing.updated && entry.updated) {
            existing.updated = entry.updated;
        }
        if (entry.tags && entry.tags.length) {
            const mergedTags = new Set([...(existing.tags || []), ...entry.tags]);
            existing.tags = Array.from(mergedTags);
        }
        if (entry.pinned) {
            existing.pinned = true;
        }
    });

    vaultEntries = Array.from(deduped.values());
    vaultEntries.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        if (a.order !== undefined && b.order === undefined) return -1;
        if (a.order === undefined && b.order !== undefined) return 1;
        if (a.order !== undefined && b.order !== undefined && a.order !== b.order) {
            return a.order - b.order;
        }
        return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
    });
}

function setActiveVaultLink(path) {
    if (!vaultCatalogContainer) return;
    const buttons = vaultCatalogContainer.querySelectorAll('.vault-note-link__button');
    buttons.forEach((button) => {
        if (button.dataset.path === path) {
            button.classList.add('is-active');
            button.setAttribute('aria-current', 'true');
        } else {
            button.classList.remove('is-active');
            button.removeAttribute('aria-current');
        }
    });
}

function displayVaultMessage(message, type = 'info') {
    if (!vaultNoteContainer) return;
    const paragraph = document.createElement('p');
    paragraph.className = `vault__message vault__message--${type}`;
    paragraph.textContent = message;
    vaultNoteContainer.innerHTML = '';
    vaultNoteContainer.appendChild(paragraph);
    if (type === 'loading') {
        vaultNoteContainer.setAttribute('aria-busy', 'true');
    } else {
        vaultNoteContainer.removeAttribute('aria-busy');
    }
}

function updateVaultBreadcrumbs(entry) {
    if (!vaultBreadcrumbs) return;
    const crumbs = [...(entry.ancestors || []), entry.title].filter(Boolean);
    vaultBreadcrumbs.innerHTML = '';
    if (!crumbs.length) {
        vaultBreadcrumbs.classList.remove('is-visible');
        return;
    }

    vaultBreadcrumbs.classList.add('is-visible');
    const fragment = document.createDocumentFragment();
    crumbs.forEach((crumb, index) => {
        const crumbSpan = document.createElement('span');
        crumbSpan.className = 'vault__crumb';
        crumbSpan.textContent = crumb;
        fragment.appendChild(crumbSpan);
        if (index < crumbs.length - 1) {
            const divider = document.createElement('span');
            divider.className = 'vault__crumb-separator';
            divider.setAttribute('aria-hidden', 'true');
            divider.textContent = '›';
            fragment.appendChild(divider);
        }
    });
    vaultBreadcrumbs.appendChild(fragment);
}

function formatVaultDate(value) {
    if (!value) return 'Unknown date';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return typeof value === 'string' ? value : 'Unknown date';
    }
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatVaultTimestamp(value) {
    if (!value) return 'Unknown';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return typeof value === 'string' ? value : 'Unknown';
    }
    return date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function parseFrontMatter(source) {
    const meta = {};
    const lines = source.split(/\r?\n/);
    let currentKey = null;

    lines.forEach((rawLine) => {
        const line = rawLine.trim();
        if (!line) return;

        if (/^[A-Za-z0-9_.-]+\s*:/u.test(line)) {
            const [keyPart, ...rest] = rawLine.split(':');
            currentKey = keyPart.trim();
            const valuePart = rest.join(':').trim();
            if (!valuePart) {
                meta[currentKey] = [];
            } else if (valuePart.startsWith('[') && valuePart.endsWith(']')) {
                meta[currentKey] = valuePart
                    .slice(1, -1)
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean);
            } else if (valuePart === 'true' || valuePart === 'false') {
                meta[currentKey] = valuePart === 'true';
            } else {
                meta[currentKey] = valuePart;
            }
        } else if (currentKey && rawLine.trim().startsWith('-')) {
            const value = rawLine.replace(/^\s*-\s*/, '').trim();
            if (!Array.isArray(meta[currentKey])) {
                meta[currentKey] = meta[currentKey] ? [meta[currentKey]] : [];
            }
            if (value) {
                meta[currentKey].push(value);
            }
        }
    });

    return meta;
}

function stripFrontMatter(markdown) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n?/;
    const match = markdown.match(frontMatterRegex);
    if (!match) {
        return { meta: {}, body: markdown };
    }

    const meta = parseFrontMatter(match[1]);
    const body = markdown.slice(match[0].length);
    return { meta, body };
}

function enhanceVaultContent(container) {
    if (!container) return;
    container.querySelectorAll('h1, h2, h3').forEach((heading) => {
        heading.classList.add('vault-note__heading');
    });
    container.querySelectorAll('ul, ol').forEach((list) => {
        list.classList.add('vault-note__list');
    });
    container.querySelectorAll('blockquote').forEach((quote) => {
        quote.classList.add('vault-note__quote');
    });
    container.querySelectorAll('pre').forEach((block) => {
        block.classList.add('vault-note__code-block');
    });
    container.querySelectorAll('table').forEach((table) => {
        table.classList.add('vault-note__table');
    });
}

function loadVaultNote(entry) {
    if (!vaultNoteContainer || !entry) return;
    activeVaultPath = entry.path;
    setActiveVaultLink(entry.path);
    updateVaultBreadcrumbs(entry);
    displayVaultMessage(`Transcribing "${entry.title}"…`, 'loading');

    const encodedPath = encodeURI(entry.path).replace(/#/g, '%23');

    fetch(encodedPath)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Failed to retrieve ${entry.path}`);
            }
            return response.text();
        })
        .then((markdown) => {
            const { meta, body } = stripFrontMatter(markdown);
            const html = markdownConverter.makeHtml(body);

            const tags = normalizeTags(meta.tags || entry.tags);
            const updated = meta.updated || meta.modified || meta.date || entry.updated;
            const summary = meta.summary || meta.description || entry.summary;
            const noteTitle = meta.title || entry.title;

            const fragment = document.createDocumentFragment();
            const header = document.createElement('header');
            header.className = 'vault-note__header';

            const heading = document.createElement('h3');
            heading.textContent = noteTitle;
            header.appendChild(heading);

            const metaLine = document.createElement('div');
            metaLine.className = 'vault-note__meta';

            if (updated) {
                const updatedSpan = document.createElement('span');
                updatedSpan.className = 'vault-note__meta-item';
                updatedSpan.textContent = `Last updated ${formatVaultDate(updated)}`;
                metaLine.appendChild(updatedSpan);
            }

            if (summary) {
                const summarySpan = document.createElement('span');
                summarySpan.className = 'vault-note__meta-item vault-note__meta-item--summary';
                summarySpan.textContent = summary;
                metaLine.appendChild(summarySpan);
            }

            if (tags.length) {
                const tagsSpan = document.createElement('span');
                tagsSpan.className = 'vault-note__meta-item';
                tagsSpan.setAttribute('data-label', 'Tags');
                tags.forEach((tag) => {
                    const tagChip = document.createElement('span');
                    tagChip.className = 'vault-note__tag';
                    tagChip.textContent = tag;
                    tagsSpan.appendChild(tagChip);
                });
                metaLine.appendChild(tagsSpan);
            }

            if (metaLine.children.length) {
                header.appendChild(metaLine);
            }

            fragment.appendChild(header);

            const content = document.createElement('div');
            content.className = 'vault-note__content';
            content.innerHTML = html;
            enhanceVaultContent(content);
            fragment.appendChild(content);

            vaultNoteContainer.innerHTML = '';
            vaultNoteContainer.removeAttribute('aria-busy');
            vaultNoteContainer.appendChild(fragment);
        })
        .catch((error) => {
            console.error('Error loading vault entry:', error);
            displayVaultMessage('We could not transcribe this manuscript. Ensure the note exists within the vault.', 'error');
        });
}

function renderVaultCatalog(entries) {
    if (!vaultCatalogContainer) return;
    vaultCatalogContainer.innerHTML = '';

    if (!entries || !entries.length) {
        displayVaultMessage('No manuscripts match the current view. Adjust your filters to continue.', 'empty');
        if (vaultStatus) {
            vaultStatus.textContent = 'No manuscripts indexed';
        }
        return;
    }

    const grouped = new Map();
    entries.forEach((entry) => {
        const groupName = entry.ancestors && entry.ancestors.length ? entry.ancestors[0] : 'Loose leaves';
        if (!grouped.has(groupName)) {
            grouped.set(groupName, []);
        }
        grouped.get(groupName).push(entry);
    });

    const groupNames = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    groupNames.forEach((groupName) => {
        const groupNotes = grouped.get(groupName);
        const details = document.createElement('details');
        details.className = 'vault-group';

        const summary = document.createElement('summary');
        summary.className = 'vault-group__title';
        summary.textContent = groupName;
        details.appendChild(summary);

        const list = document.createElement('ul');
        list.className = 'vault-group__list';

        groupNotes
            .slice()
            .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }))
            .forEach((entry) => {
                const item = document.createElement('li');
                item.className = 'vault-note-link';

                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'vault-note-link__button';
                button.dataset.path = entry.path;

                const titleSpan = document.createElement('span');
                titleSpan.className = 'vault-note-link__title';
                titleSpan.textContent = entry.title;
                button.appendChild(titleSpan);

                if (entry.summary) {
                    const summarySpan = document.createElement('span');
                    summarySpan.className = 'vault-note-link__summary';
                    summarySpan.textContent = entry.summary;
                    button.appendChild(summarySpan);
                } else if (entry.ancestors && entry.ancestors.length > 1) {
                    const locationSpan = document.createElement('span');
                    locationSpan.className = 'vault-note-link__location';
                    locationSpan.textContent = entry.ancestors.slice(1).join(' › ');
                    button.appendChild(locationSpan);
                }

                if (entry.updated) {
                    const updatedSpan = document.createElement('span');
                    updatedSpan.className = 'vault-note-link__updated';
                    updatedSpan.textContent = formatVaultDate(entry.updated);
                    button.appendChild(updatedSpan);
                }

                if (entry.tags && entry.tags.length) {
                    const tagsContainer = document.createElement('span');
                    tagsContainer.className = 'vault-note-link__tags';
                    entry.tags.slice(0, 3).forEach((tag) => {
                        const tagChip = document.createElement('span');
                        tagChip.className = 'vault-note-link__tag';
                        tagChip.textContent = tag;
                        tagsContainer.appendChild(tagChip);
                    });
                    button.appendChild(tagsContainer);
                }

                button.addEventListener('click', () => loadVaultNote(entry));

                item.appendChild(button);
                list.appendChild(item);
            });

        const groupHasActive = groupNotes.some((note) => note.path === activeVaultPath);
        if (groupHasActive || groupNames.length <= 4) {
            details.open = true;
        }

        details.appendChild(list);
        vaultCatalogContainer.appendChild(details);
    });

    if (vaultStatus) {
        vaultStatus.textContent = `${entries.length} manuscript${entries.length === 1 ? '' : 's'} catalogued`;
    }

    setActiveVaultLink(activeVaultPath);
}

function handleVaultSearch(event) {
    const query = event.target.value.trim().toLowerCase();
    if (!query) {
        filteredVaultEntries = [...vaultEntries];
    } else {
        filteredVaultEntries = vaultEntries.filter((entry) => {
            const haystack = [
                entry.title,
                ...(entry.ancestors || []),
                ...(entry.tags || []),
                entry.summary || ''
            ]
                .join(' ')
                .toLowerCase();
            return haystack.includes(query);
        });
    }

    renderVaultCatalog(filteredVaultEntries);

    if (!filteredVaultEntries.length) {
        displayVaultMessage('No manuscripts match this search. Adjust your query to continue.', 'empty');
        return;
    }

    const activeStillVisible = filteredVaultEntries.some((entry) => entry.path === activeVaultPath);
    if (!activeStillVisible) {
        loadVaultNote(filteredVaultEntries[0]);
    }
}

function fetchVaultManifest() {
    if (!vaultCatalogContainer) return;

    displayVaultMessage('Awaiting a manuscript selection.', 'info');
    if (vaultStatus) {
        vaultStatus.textContent = 'Indexing the shelves…';
    }

    requestVaultManifest(vaultManifestCandidates)
        .then((manifest) => {
            buildVaultEntries(manifest);
            if (!vaultEntries.length) {
                displayVaultMessage('The vault manifest contains no manuscripts yet. Add notes to the vault to begin.', 'empty');
                if (vaultStatus) {
                    vaultStatus.textContent = 'No manuscripts catalogued';
                }
                return;
            }

            filteredVaultEntries = [...vaultEntries];
            renderVaultCatalog(filteredVaultEntries);
            const initialEntry = vaultEntries.find((entry) => entry.pinned) || vaultEntries[0];
            loadVaultNote(initialEntry);

            if (vaultRefresh) {
                vaultRefresh.textContent = formatVaultTimestamp(new Date());
            }
        })
        .catch((error) => {
            console.error('Error loading vault manifest:', error);
            displayVaultMessage('We could not retrieve the vault manifest. Ensure a manifest file is available inside the vault directory.', 'error');
            if (vaultStatus) {
                vaultStatus.textContent = 'Unable to index the vault';
            }
            if (vaultRefresh) {
                vaultRefresh.textContent = 'Unavailable';
            }
        });
}

function requestVaultManifest(candidates, index = 0) {
    if (index >= candidates.length) {
        return Promise.reject(new Error('No manifest candidates resolved'));
    }

    const source = candidates[index];

    return fetch(source)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Manifest request for ${source} failed with status ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            if (index < candidates.length - 1) {
                return requestVaultManifest(candidates, index + 1);
            }
            throw error;
        });
}

function init() {
    setStatusIndicator('unknown');
    updatePlayerTimestamp();

    fetchPlayerCount();
    fetchChangelog();
    fetchVaultManifest();

    if (vaultSearchInput) {
        vaultSearchInput.addEventListener('input', handleVaultSearch);
    }

    setInterval(fetchPlayerCount, 30000);
    setInterval(updatePlayerTimestamp, 15000);
}

document.addEventListener('DOMContentLoaded', init);
