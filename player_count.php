<?php
$file = 'playercount.txt';
$key = '9A@2U0764JqB'; // Key from your WebsitePlayerCountService.java

// Update player count from the server
if (isset($_GET['key']) && $_GET['key'] === $key && isset($_GET['amount'])) {
    $playerCount = intval($_GET['amount']);
    file_put_contents($file, $playerCount);
    echo "Player count updated to " . $playerCount;
} else {
    // Display player count on the website
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo "0";
    }
}
?>