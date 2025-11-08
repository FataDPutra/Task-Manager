#!/bin/bash

# Script untuk restore database dari dump file
# Usage: ./restore-dump.sh [db.sql]

DUMP_FILE=${1:-db.sql}

if [ ! -f "$DUMP_FILE" ]; then
    echo "Error: File $DUMP_FILE tidak ditemukan!"
    exit 1
fi

echo "Restoring database from $DUMP_FILE..."

# Cek apakah container running
if ! docker ps | grep -q task_db; then
    echo "Error: Container task_db tidak running!"
    echo "Jalankan: cd backend && docker-compose up -d"
    exit 1
fi

# Restore database
docker exec -i -e PGPASSWORD=password task_db psql \
    -U postgres \
    -h localhost \
    postgres < "$DUMP_FILE"

if [ $? -eq 0 ]; then
    echo "✓ Database berhasil di-restore dari $DUMP_FILE"
else
    echo "✗ Error: Gagal restore database"
    exit 1
fi

