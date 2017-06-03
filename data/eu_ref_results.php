<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
die(file_get_contents("raw/eu_ref_results.json"));
//DATA FROM https://www.electoralcommission.org.uk/find-information-by-subject/elections-and-referendums/past-elections-and-referendums/eu-referendum/electorate-and-count-information and wikipedia
?>