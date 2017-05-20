<?php
header("Access-Control-Allow-Origin: *");
header('Content-type: application/json');
die(file_get_contents("Westminster_Parliamentary_Constituencies_December_2016_Generalised_Clipped_Boundaries_in_Great_Britain.geojson"));
?>