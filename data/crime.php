<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
die(file_get_contents("raw/crime.json"));
//DATA FROM https://ukcrimestats.com/
?>