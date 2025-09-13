document.addEventListener('mousemove', (e) => {
    const light = document.querySelector('.cursor-light');
    light.style.left = `${e.clientX}px`;
    light.style.top = `${e.clientY}px`;
});

function fetchPlayerCount() {
    fetch('http://tamir.great-site.net/player_count.php')
        .then(response => response.text())
        .then(data => {
            document.getElementById('player-count').textContent = data;
        })
        .catch(error => {
            console.error('Error fetching player count:', error);
            document.getElementById('player-count').textContent = 'Error';
        });
}

// Fetch player count on page load
fetchPlayerCount();

// Fetch player count every 30 seconds
setInterval(fetchPlayerCount, 30000);