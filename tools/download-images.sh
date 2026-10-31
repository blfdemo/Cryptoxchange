#!/bin/sh
# Run once with internet: sh tools/download-images.sh
DIR="$(dirname "$0")/../assets/img/photos"
mkdir -p "$DIR"
curl -L --fail -o "$DIR/chart.jpg" "https://images.unsplash.com/photo-1639754391037-98dd3cb74e09?auto=format&fit=crop&w=1400&q=70"
curl -L --fail -o "$DIR/trader.jpg" "https://images.unsplash.com/photo-1768055104929-cf2317674a80?auto=format&fit=crop&w=1400&q=70"
curl -L --fail -o "$DIR/laptop.jpg" "https://images.unsplash.com/photo-1635236198091-33d5aa8466cc?auto=format&fit=crop&w=1400&q=70"
curl -L --fail -o "$DIR/towers.jpg" "https://images.unsplash.com/photo-1764193875922-9c7df90a44cc?auto=format&fit=crop&w=1400&q=70"
curl -L --fail -o "$DIR/skyline.jpg" "https://images.unsplash.com/photo-1767187571489-e2499f056f74?auto=format&fit=crop&w=1400&q=70"
echo Done
