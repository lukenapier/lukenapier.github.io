// --- Unchanged: Cursor Light Effect ---
document.addEventListener('mousemove', (e) => {
    const light = document.querySelector('.cursor-light');
    light.style.left = `${e.clientX}px`;
    light.style.top = `${e.clientY}px`;
});

// --- Updated: Player Count Fetching ---
function fetchPlayerCount() {
    const url = 'http://tamir.great-site.net/player_count.php?t=' + new Date().getTime();

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const playerCountSpan = document.getElementById('player-count');
            if (data.status === 'online') {
                playerCountSpan.textContent = data.players;
            } else {
                playerCountSpan.textContent = 'Offline';
            }
        })
        .catch(error => {
            console.error('Error fetching player count:', error);
            document.getElementById('player-count').textContent = 'Offline';
        });
}

// --- New: Changelog Fetching and Rendering ---
function fetchChangelog() {
    fetch('CHANGELOG.md')
        .then(response => response.text())
        .then(markdown => {
            const converter = new showdown.Converter();
            const html = converter.makeHtml(markdown);
            document.getElementById('changelog-content').innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching changelog:', error);
            document.getElementById('changelog-content').innerHTML = '<h2>Error: Could not load changelog.</h2>';
        });
}

// --- Run functions on page load and set intervals ---
document.addEventListener('DOMContentLoaded', () => {
    fetchPlayerCount();
    fetchChangelog();
    setInterval(fetchPlayerCount, 30000);
});