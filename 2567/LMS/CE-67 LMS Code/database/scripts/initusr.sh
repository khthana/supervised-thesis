#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create backend role
    CREATE ROLE ${DB_BACKEND_USER} WITH LOGIN PASSWORD '${DB_BACKEND_PASSWORD}';

    -- Grant permissions to the backend role
    GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO ${DB_BACKEND_USER};
    GRANT pg_read_all_data TO ${DB_BACKEND_USER};
    GRANT pg_write_all_data TO ${DB_BACKEND_USER};
EOSQL