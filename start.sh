#!/bin/bash

# Add dev script to package.json without directly editing it
npx json -I -f package.json -e 'this.scripts.dev="tsx --watch server/index.ts"'

# Start the application
echo "Starting COMITALE application..."
npm run dev