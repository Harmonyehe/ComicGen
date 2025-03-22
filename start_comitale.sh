#!/bin/bash

# Check if NODE_ENV is set, if not set it to development
export NODE_ENV=${NODE_ENV:-development}

# Print a startup message
echo "Starting COMITALE Comic Creator Server..."
echo "Environment: $NODE_ENV"
echo "Server will be available at http://localhost:3000"

# Start the server using tsx to handle TypeScript
npx tsx server/index.ts