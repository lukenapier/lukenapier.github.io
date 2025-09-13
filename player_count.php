<?php
// --- ADD THIS LINE ---
// This header gives your GitHub website permission to fetch data from this script.
header("Access-Control-Allow-Origin: *");
// --------------------

// File to store player count and timestamp
$file = 'playercount.txt';
// Key from your WebsitePlayerCountService.java
$key = '9A@2U0764JqB';
// Set the timezone to avoid errors
date_default_timezone_set('UTC');

// --- Part 1: Update player count from the server ---
if (isset($_GET['key']) && $_GET['key'] === $key && isset($_GET['amount'])) {
    $playerCount = intval($_GET['amount']);

    // Create an associative array with player count and the current timestamp
    $data = [
        'players' => $playerCount,
        'last_update' => time() // `time()` gets the current Unix timestamp
    ];

    // Encode the array into a JSON string and save it to the file
    file_put_contents($file, json_encode($data));
    echo "Player count updated successfully.";

// --- Part 2: Display player count on the website ---
} else {
    header('Content-Type: application/json'); // Tell the browser we're sending JSON
    header('Cache-Control: no-cache'); // Prevent caching issues

    if (file_exists($file)) {
        $json_data = file_get_contents($file);
        $data = json_decode($json_data, true);

        // Check if the last update was more than 60 seconds ago
        if (time() - $data['last_update'] > 60) {
            // If it's too old, the server is likely offline
            echo json_encode(['status' => 'offline']);
        } else {
            // Otherwise, send the player count
            echo json_encode(['status' => 'online', 'players' => $data['players']]);
        }
    } else {
        // If the file doesn't exist, the server has never been online
        echo json_encode(['status' => 'offline']);
    }
}
?>