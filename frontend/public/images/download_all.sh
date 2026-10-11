#!/bin/bash

# Alle Bild-IDs aus HomePage extrahieren
declare -A images=(
  ["7e0492ba-db18-4f56-99e9-2768d1038917"]="price-einzelzimmer"
  ["75ee7bb8-ba55-47f2-aa0a-8df1068ff58a"]="price-doppelzimmer"
  ["047d3db3-35fe-433d-859c-abdef02ae37f"]="pearse-lyons-header"
  ["6a6caec8-e335-4df1-87a6-a895295c6494"]="pearse-lyons-1"
  ["9855ca4e-3cdf-4b43-8d2f-0ce084bb7412"]="pearse-lyons-2"
  ["2c6644ab-189c-4c28-8344-6d1900646833"]="pearse-lyons-3"
  ["030d5ed7-cfae-4608-85cb-11b8ba9191ae"]="ahascragh-header"
  ["5fdaf1af-44ac-4102-ba1d-08b6444c19db"]="ahascragh-1"
  ["b69e4156-dd75-4897-ab90-106d19e8da78"]="ahascragh-2"
  ["2af1cc02-224a-4ceb-9ef8-2a322d99b8ab"]="ahascragh-3"
  ["2a1589bc-fcbf-4021-9ba6-53fb9f330b8c"]="micil-header"
  ["0ea718bc-9595-4592-8a82-488051783892"]="micil-1"
  ["1e4f0ed1-02dd-4caf-9886-dc2bb9984a37"]="micil-2"
  ["b88a7539-16fe-44da-bae3-2edff21ce51e"]="micil-3"
  ["c95ed09c-cb85-40a9-a946-c3c1fb15bb8d"]="highlight-1"
  ["15cbdd55-df1e-4c96-8df2-b1036d92d274"]="highlight-2"
  ["018dd861-cc74-4e83-9e78-1b3c274f1c2b"]="highlight-3"
  ["bbe54526-882b-451d-990e-c2ce9c4d4c03"]="highlight-4"
  ["cf479a45-277e-4a88-8b78-9a7d4ac358b7"]="highlight-5"
)

echo "Lade ${#images[@]} zusätzliche Bilder herunter..."

for id in "${!images[@]}"; do
  name="${images[$id]}"
  if [ ! -f "$name.jpg" ]; then
    echo "Lade $name.jpg..."
    curl -s "https://irish-whiskey-booking.fly.dev/api/images/$id" -o "$name.jpg"
  fi
done

echo "Download abgeschlossen!"
