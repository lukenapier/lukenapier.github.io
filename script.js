// Cursor light effect
const cursorLight = document.querySelector('.cursor-light');
document.addEventListener('mousemove', (event) => {
    if (!cursorLight) return;
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
});

const playerCountSpan = document.getElementById('player-count');
const playerStatusIndicator = document.getElementById('player-status-indicator');
const playerStatusText = document.getElementById('player-status-text');
const playerUpdatedSpan = document.getElementById('player-updated');
const changelogMeta = document.getElementById('changelog-updated');
let lastPlayerCountTimestamp = null;
let hasPlayerResponse = false;

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
}

function fetchChangelog() {
    fetch('CHANGELOG.md')
        .then((response) => response.text())
        .then((markdown) => {
            const converter = new showdown.Converter({ tables: true });
            const html = converter.makeHtml(markdown);
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

function init() {
    setStatusIndicator('unknown');
    updatePlayerTimestamp();

    fetchPlayerCount();
    fetchChangelog();

    setInterval(fetchPlayerCount, 30000);
    setInterval(updatePlayerTimestamp, 15000);
}

document.addEventListener('DOMContentLoaded', init);
