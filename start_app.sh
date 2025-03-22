#!/bin/bash

# Make script executable
chmod +x start_app.sh

# Kill any existing Node processes
echo "Stopping any running servers..."
killall node 2>/dev/null

# Install dependencies if needed
echo "Checking dependencies..."
npm install --silent

# Start the server
echo "Starting COMITALE Comic Creator..."
echo "Server will be available at http://localhost:3000"
node run.js

# This script will keep running as long as the server is running