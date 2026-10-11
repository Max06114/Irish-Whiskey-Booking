#!/bin/bash

# Alle Bild-URLs aus der HomePage extrahieren
declare -a images=(
  "77d88d5b-10b7-4547-bb50-5e5c56f7425a:dublin-arrival"
  "8b8a3efd-0995-4ff3-a4f0-098f59ff03b0:pearse-lyons"
  "1c600c5a-4218-4470-a129-3ed39f1af10d:ahascragh"
  "dd70b422-6eac-40d0-aa39-be12b347952b:micil"
  "94d5f24e-c7fc-471d-892f-140319e7ab79:liberator"
  "57f14fa4-0e5c-4fd5-b70f-ff1e38c0ad1d:skellig"
  "927c83ec-2926-494d-835c-662a2833c14c:blackwater"
  "e8b1b4de-8e9c-41c7-b28c-75baa30fe628:departure"
)

echo "Lade 8 Bilder herunter..."

for img in "${images[@]}"; do
  IFS=':' read -r id name <<< "$img"
  echo "Lade $name.jpg..."
  curl -s "https://irish-whiskey-booking.fly.dev/api/images/$id" -o "$name.jpg"
done

echo "Download abgeschlossen!"
ls -lh *.jpg
