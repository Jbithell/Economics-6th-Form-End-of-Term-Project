<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
die(file_get_contents("raw/hocl-ge2015-results-summary.json"));
//DATA FROM http://www.data.parliament.uk/dataset/general-election-2015
?>