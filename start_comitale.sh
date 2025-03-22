#!/bin/bash

# Run the database migrations
echo "Running database migrations..."
tsx server/db-migrate.ts

# Start the server
echo "Starting the COMITALE server..."
tsx server/index.ts