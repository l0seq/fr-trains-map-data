#!/bin/bash
mkdir -p static/
rm static/*
wget -O static/intercites.json "https://transport.data.gouv.fr/resources/conversions/55940/GeoJSON"
wget -O static/ter.zip "https://eu.ftp.opendatasoft.com/sncf/gtfs/export-ter-gtfs-last.zip"
unzip static/ter.zip -d static/
bun run src/terCsvToGeoJson.ts
bun run src/getAllStopsOfLines.ts
bun run src/allPointsToGeojson.ts
rm static/*.txt
rm static/ter.zip
echo "finished"