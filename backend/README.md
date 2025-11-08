# Backend - Task Management System

Backend API untuk Task Management System menggunakan Laravel 12 dengan PostgreSQL dan JWT Authentication.

## Deskripsi

Backend ini menyediakan RESTful API untuk mengelola tasks dan autentikasi user. Dibangun dengan Laravel 12, menggunakan PostgreSQL sebagai database, dan JWT untuk autentikasi.

## Teknologi yang Digunakan

- **Laravel 12** - PHP Framework
- **PostgreSQL 15** - Database
- **PHP 8.2** - Bahasa pemrograman
- **JWT Auth (tymon/jwt-auth)** - Autentikasi
- **Nginx** - Web Server
- **Docker & Docker Compose** - Containerization

## Prasyarat

- Docker & Docker Compose terinstall
- Git terinstall

## Langkah-langkah Setup & Menjalankan

### 1. Masuk ke Folder Backend

```bash
cd backend
```

### 2. Setup Environment File

Buat file `.env` dari `.env.example` (jika ada) atau buat manual:

```bash
# Jika ada .env.example
cp src/.env.example src/.env

# Atau buat manual
touch src/.env
```

Isi file `.env` dengan konfigurasi berikut:

```env
APP_NAME="Task Management System"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL=http://localhost:8000

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=task_management
DB_USERNAME=postgres
DB_PASSWORD=password

JWT_SECRET=
JWT_TTL=60
JWT_REFRESH_TTL=20160
```

### 3. Build dan Jalankan Container

```bash
# Build dan jalankan container
docker-compose up -d --build
```

Ini akan:

- Build image PHP 8.2 dengan extensions yang diperlukan
- Setup PostgreSQL database
- Setup Nginx web server
- Menghubungkan semua service dalam network yang sama

### 4. Install Dependencies

```bash
# Masuk ke container app
docker-compose exec app bash

# Install Composer dependencies
composer install

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Keluar dari container
exit
```

### 5. Setup Database

```bash
# Masuk ke container app
docker-compose exec app bash

# Jalankan migration
php artisan migrate

# (Opsional) Jalankan seeder untuk data dummy
php artisan db:seed

# Keluar dari container
exit
```

### 6. Set Permission (jika diperlukan)

```bash
# Set permission untuk storage dan cache
docker-compose exec app chmod -R 775 storage bootstrap/cache
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### 7. Verifikasi Setup

Cek apakah semua container berjalan:

```bash
docker-compose ps
```

Anda harus melihat 3 container running:

- `task_backend` (PHP-FPM)
- `task_nginx` (Nginx)
- `task_db` (PostgreSQL)

### 8. Test API

Buka browser atau gunakan curl:

```bash
# Test health check (jika ada route)
curl http://localhost:8000/api

# Test register
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

## Informasi Login Dummy

Setelah menjalankan seeder, gunakan kredensial berikut:

```
Email: test@example.com
Password: password
```

## Struktur Database

### Tabel Users

| Field             | Type      | Constraints      | Description            |
| ----------------- | --------- | ---------------- | ---------------------- |
| user_id           | bigint    | PRIMARY KEY      | ID unik user           |
| name              | string    | NOT NULL         | Nama lengkap           |
| username          | string    | NOT NULL         | Username unik          |
| email             | string    | UNIQUE, NOT NULL | Email unik             |
| password          | string    | NOT NULL         | Password (hashed)      |
| email_verified_at | timestamp | NULLABLE         | Waktu verifikasi email |
| remember_token    | string    | NULLABLE         | Token remember         |
| created_at        | timestamp |                  | Waktu dibuat           |
| updated_at        | timestamp |                  | Waktu diupdate         |

### Tabel Tasks

| Field       | Type      | Constraints                 | Description                            |
| ----------- | --------- | --------------------------- | -------------------------------------- |
| task_id     | bigint    | PRIMARY KEY                 | ID unik task                           |
| user_id     | bigint    | FOREIGN KEY → users.user_id | ID pemilik task                        |
| title       | string    | NOT NULL                    | Judul task                             |
| description | text      | NULLABLE                    | Deskripsi task                         |
| status      | enum      | DEFAULT 'To Do'             | Status: 'To Do', 'In Progress', 'Done' |
| deadline    | date      | NOT NULL                    | Deadline task                          |
| created_by  | bigint    | FOREIGN KEY → users.user_id | ID pembuat task                        |
| created_at  | timestamp |                             | Waktu dibuat                           |
| updated_at  | timestamp |                             | Waktu diupdate                         |

### Relasi Database

```
users (1) ──< (many) tasks.user_id
users (1) ──< (many) tasks.created_by
```

## Struktur Folder

```
backend/
├── src/                          # Laravel application
│   ├── app/
│   │   ├── Constants/           # Constants (TaskStatus)
│   │   ├── Http/
│   │   │   ├── Controllers/     # Controllers (AuthController, TaskController)
│   │   │   ├── Middleware/      # Custom middleware
│   │   │   └── Requests/        # Form requests (validation)
│   │   ├── Models/              # Eloquent models
│   │   ├── Services/            # Business logic (AuthService, TaskService)
│   │   ├── Traits/              # Reusable traits (ApiResponse)
│   │   └── Utils/               # Utilities (Logger, Sanitizer)
│   ├── config/                  # Configuration files
│   ├── database/
│   │   ├── migrations/          # Database migrations
│   │   └── seeders/             # Database seeders
│   ├── routes/
│   │   └── api.php              # API routes
│   └── storage/                 # Storage (logs, cache)
├── docker-compose.yml           # Docker Compose configuration
├── Dockerfile                   # PHP-FPM Docker image
├── nginx.conf                   # Nginx configuration
└── README.md                    # File ini
```

## API Endpoints

### Authentication Endpoints

#### Register

```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User

```http
GET /api/me
Authorization: Bearer {token}
```

#### Logout

```http
POST /api/logout
Authorization: Bearer {token}
```

### Task Endpoints

#### Get All Tasks

```http
GET /api/tasks?status=To Do&sort=asc&deadline_from=2024-01-01&deadline_to=2024-12-31
Authorization: Bearer {token}
```

#### Create Task

```http
POST /api/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management project",
  "status": "To Do",
  "deadline": "2024-12-31"
}
```

#### Get Task by ID

```http
GET /api/tasks/{id}
Authorization: Bearer {token}
```

#### Update Task

```http
PUT /api/tasks/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated title",
  "status": "In Progress"
}
```

#### Delete Task

```http
DELETE /api/tasks/{id}
Authorization: Bearer {token}
```

## Testing

```bash
# Masuk ke container
docker-compose exec app bash

# Jalankan tests
php artisan test

# Atau dengan coverage
php artisan test --coverage
```

## Logs

```bash
# Lihat logs aplikasi
docker-compose logs -f app

# Lihat logs database
docker-compose logs -f db

# Lihat logs nginx
docker-compose logs -f nginx

# Lihat semua logs
docker-compose logs -f
```

## Menghentikan Aplikasi

```bash
# Stop container (data tetap tersimpan)
docker-compose stop

# Stop dan hapus container (data tetap tersimpan)
docker-compose down

# Stop, hapus container dan volume (hapus semua data)
docker-compose down -v
```

## Troubleshooting

### Container tidak bisa start

```bash
# Cek logs
docker-compose logs

# Rebuild container
docker-compose up -d --build --force-recreate
```

### Database connection error

```bash
# Cek apakah database container running
docker-compose ps db

# Cek koneksi database
docker-compose exec app php artisan tinker
# Lalu jalankan: DB::connection()->getPdo();
```

### Permission denied

```bash
# Fix permission
docker-compose exec app chmod -R 775 storage bootstrap/cache
docker-compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### Port 8000 sudah digunakan

Edit `docker-compose.yml`:

```yaml
ports:
  - "8001:80" # Ubah 8000 menjadi 8001
```

## Reset Database

```bash
# Masuk ke container
docker-compose exec app bash

# Reset database (hapus semua data)
php artisan migrate:fresh

# Reset dan seed
php artisan migrate:fresh --seed
```

## Database Dump & Restore

### Menggunakan Database Dump dari Root Folder

File `db.sql` tersedia di root folder project yang berisi struktur database lengkap dengan data dummy.

**Restore dari dump file:**

```bash
# Dari root folder project
cd ../..
./restore-dump.sh db.sql
```

**Membuat dump baru:**

```bash
# Dari root folder project
./create-dump.sh
```

### Manual Dump & Restore

**Membuat dump:**

```bash
docker exec -e PGPASSWORD=password task_db pg_dump \
    -U postgres \
    -h localhost \
    -d task_management \
    --clean \
    --if-exists \
    --create \
    --format=plain \
    > db.sql
```

**Restore dari dump:**

```bash
docker exec -i -e PGPASSWORD=password task_db psql \
    -U postgres \
    -h localhost \
    postgres < db.sql
```

**Catatan:**

- File `db.sql` berisi struktur database lengkap dengan data dummy
- Password untuk user dummy: `password`
- Email: `test@example.com`
- Jika password hash tidak bekerja, jalankan seeder: `php artisan db:seed`

## Production Deployment

Untuk production, pastikan:

1. Set `APP_ENV=production` dan `APP_DEBUG=false` di `.env`
2. Generate key: `php artisan key:generate`
3. Optimize: `php artisan config:cache` dan `php artisan route:cache`
4. Setup SSL/HTTPS
5. Gunakan environment variables untuk sensitive data
