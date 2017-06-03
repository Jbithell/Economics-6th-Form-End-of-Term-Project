<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
die(file_get_contents("raw/hocl-ge2010-results.json"));
//DATA FROM polling dataset
?>