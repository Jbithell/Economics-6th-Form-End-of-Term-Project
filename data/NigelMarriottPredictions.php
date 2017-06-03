<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
die(file_get_contents("raw/NigelMarriottPredictions.json"));
//DATA FROM https://marriott-stats.com/nigels-blog/uk-general-election-2017-forecast-1-latest-prediction/
?>