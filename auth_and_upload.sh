#!/bin/bash

BASE_URL=https://xray.cloud.getxray.app
token=$(curl -H "Content-Type: application/json" -X POST --data @"cloud_auth.json" "$BASE_URL/api/v2/authenticate" | tr -d '"')

for file in xml-results/*.xml; do
  curl -H "Content-Type: text/xml" -X POST -H "Authorization: Bearer $token" --data @"$file" "$BASE_URL/api/v2/import/execution/junit?projectKey=QAHORIZON&&testExecKey=QAHORIZON-2083"
done
