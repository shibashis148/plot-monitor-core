#!/bin/sh

echo "Starting Farm Plot Backend..."

echo "Waiting for database to be ready..."
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready!"

echo "Ensuring PostGIS extensions are enabled..."
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE EXTENSION IF NOT EXISTS postgis;"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE EXTENSION IF NOT EXISTS postgis_topology;"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;"

echo "Running database migrations..."
yarn run migrate

if [ $? -eq 0 ]; then
  echo "Migrations completed successfully"
else
  echo "Migration failed"
  exit 1
fi

echo "Checking if database needs seeding..."
SEED_COUNT=$(PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -t -c "SELECT COUNT(*) FROM farms;" 2>/dev/null | tr -d ' \n' || echo "0")

echo "Found $SEED_COUNT farms in database"

if [ "$SEED_COUNT" -eq "0" ]; then
  echo "Database is empty, running seeds..."
  yarn run seed
  
  if [ $? -eq 0 ]; then
    echo "Seeds completed successfully"
  else
    echo "Seeding failed"
    exit 1
  fi
else
  echo "Database already has data, skipping seeds"
fi

echo "Starting the application..."
yarn start
