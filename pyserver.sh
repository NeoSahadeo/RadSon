#!/usr/bin/bash

# Last updated: 28 Aug 2024

cd ./build/html
echo "Starting Python server"
python -m http.server -b localhost
