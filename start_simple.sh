#!/bin/bash

# Make the script executable
chmod +x start_simple.sh

# Install dependencies if needed
npm install

# Start the simplified server
echo "Starting server..."
npx tsx server_simple.ts