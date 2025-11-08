#!/bin/bash

# Script untuk membuat dump database PostgreSQL
# Pastikan container task_db sudah running

echo "Creating database dump..."

# Cek apakah container running
if ! docker ps | grep -q task_db; then
    echo "Error: Container task_db tidak running!"
    echo "Jalankan: cd backend && docker-compose up -d"
    exit 1
fi

# Buat dump database
docker exec -e PGPASSWORD=password task_db pg_dump \
    -U postgres \
    -h localhost \
    -d task_management \
    --clean \
    --if-exists \
    --create \
    --format=plain \
    > db.sql

if [ $? -eq 0 ]; then
    echo "✓ Database dump berhasil dibuat: db.sql"
    echo "File size: $(du -h db.sql | cut -f1)"
else
    echo "✗ Error: Gagal membuat database dump"
    exit 1
fi

