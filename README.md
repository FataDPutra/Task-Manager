# Task Management System

Aplikasi Task Management System yang dibangun dengan Laravel (Backend) dan React (Frontend) menggunakan Docker untuk containerization.

## Deskripsi Aplikasi

Task Management System adalah aplikasi web untuk mengelola tugas sehari-hari. Aplikasi ini memungkinkan pengguna untuk:

- **Registrasi dan Login** - Sistem autentikasi menggunakan JWT
- **Membuat Task** - Menambahkan tugas baru dengan detail lengkap
- **Mengelola Task** - Update, delete, dan melihat detail task
- **Filter & Sort** - Filter berdasarkan status dan sort berdasarkan deadline
- **Tracking Progress** - Melihat status task (To Do, In Progress, Done)

## Teknologi yang Digunakan

### Backend

- **Laravel 12** - PHP Framework
- **PostgreSQL 15** - Database
- **JWT Auth** - Autentikasi menggunakan JSON Web Token
- **PHP 8.2** - Bahasa pemrograman
- **Nginx** - Web Server
- **Docker** - Containerization

### Frontend

- **React 19** - JavaScript Library
- **React Router DOM** - Routing
- **Axios** - HTTP Client
- **Tailwind CSS** - CSS Framework
- **React Icons** - Icon Library
- **Docker** - Containerization

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstall:

- [Docker](https://www.docker.com/get-started) (versi 20.10 atau lebih baru)
- [Docker Compose](https://docs.docker.com/compose/install/) (versi 2.0 atau lebih baru)
- [Git](https://git-scm.com/downloads)

## Langkah-langkah Instalasi & Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd Task-Manager
```

### 2. Setup Backend

Masuk ke folder backend dan ikuti langkah-langkah di [README Backend](./backend/README.md)

```bash
cd backend
# Ikuti instruksi di backend/README.md
```

### 3. Setup Frontend

Masuk ke folder frontend dan ikuti langkah-langkah di [README Frontend](./frontend/README.md)

```bash
cd frontend
# Ikuti instruksi di frontend/README.md
```

### 4. Menjalankan Aplikasi Lengkap

#### Menjalankan Backend

```bash
cd backend
docker-compose up -d
```

#### Menjalankan Frontend

```bash
cd frontend
docker-compose up -d
```

### 5. Akses Aplikasi

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **API Documentation**: http://localhost:8000/api/documentation (jika tersedia)

## Informasi Login Dummy

Setelah menjalankan seeder, Anda dapat login dengan kredensial berikut:

```
Email: test@example.com
Password: password
```

**Atau** Anda dapat membuat akun baru melalui halaman Register di aplikasi.

## Struktur Database

### Tabel Users

| Field             | Type            | Description            |
| ----------------- | --------------- | ---------------------- |
| user_id           | bigint (PK)     | ID unik user           |
| name              | string          | Nama lengkap           |
| username          | string          | Username unik          |
| email             | string (unique) | Email unik             |
| password          | string          | Password ter-hash      |
| email_verified_at | timestamp       | Waktu verifikasi email |
| created_at        | timestamp       | Waktu dibuat           |
| updated_at        | timestamp       | Waktu diupdate         |

### Tabel Tasks

| Field       | Type        | Description                            |
| ----------- | ----------- | -------------------------------------- |
| task_id     | bigint (PK) | ID unik task                           |
| user_id     | bigint (FK) | ID user pemilik task                   |
| title       | string      | Judul task                             |
| description | text        | Deskripsi task                         |
| status      | enum        | Status: 'To Do', 'In Progress', 'Done' |
| deadline    | date        | Deadline task                          |
| created_by  | bigint (FK) | ID user yang membuat                   |
| created_at  | timestamp   | Waktu dibuat                           |
| updated_at  | timestamp   | Waktu diupdate                         |

### Relasi

- `tasks.user_id` → `users.user_id` (Many to One)
- `tasks.created_by` → `users.user_id` (Many to One)

### Database Dump

File `db.sql` tersedia di root folder yang berisi struktur database lengkap dengan data dummy. File ini dapat digunakan untuk restore database dengan cepat.

**Menggunakan Database Dump:**

```bash
# Restore database dari dump file
./restore-dump.sh db.sql
```

**Membuat Database Dump Baru:**

```bash
# Pastikan container backend sudah running
cd backend
docker-compose up -d

# Kembali ke root folder dan buat dump
cd ..
./create-dump.sh
```

File `db.sql` berisi:

- Struktur database lengkap (tables, sequences, constraints, indexes)
- Data dummy user (test@example.com / password)
- Data dummy tasks (8 sample tasks)

## Struktur Folder

```
Task-Manager/
├── backend/              # Backend Laravel
│   ├── src/             # Source code Laravel
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── README.md
├── frontend/            # Frontend React
│   ├── src/            # Source code React
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── README.md
├── Screenshot/         # Screenshot aplikasi
│   ├── Desktop/       # Screenshot versi Desktop
│   └── Mobile/        # Screenshot versi Mobile
├── create-dump.sh       # Script untuk membuat database dump
├── restore-dump.sh      # Script untuk restore database
├── db.sql              # Database dump file
├── postman_collection.json  # Postman API collection
└── README.md           # File ini
```

## Testing

### Backend

```bash
cd backend
docker-compose exec app php artisan test
```

### Frontend

```bash
cd frontend
docker-compose exec frontend npm test
```

## Menghentikan Aplikasi

### Menghentikan Backend

```bash
cd backend
docker-compose down
```

### Menghentikan Frontend

```bash
cd frontend
docker-compose down
```

### Menghentikan Semua (termasuk data)

```bash
# Backend
cd backend
docker-compose down -v

# Frontend
cd frontend
docker-compose down -v
```

## Screenshot Tampilan Aplikasi

### Versi Desktop

#### Halaman Login

![Login Desktop](./Screenshot/Desktop/Login%20Desktop.png)

#### Halaman Register

![Register Desktop](./Screenshot/Desktop/Register%20Desktop.png)

#### Halaman All Tasks

![All Task Desktop](./Screenshot/Desktop/All%20Task%20Desktop.png)

#### Halaman Create Task

![Create Task Desktop](./Screenshot/Desktop/Create%20Task%20Desktop.png)

#### Halaman Detail Task

![Detail Task Desktop](./Screenshot/Desktop/Detail%20Task%20Desktop.png)

#### Halaman Edit Task

![Edit Task Desktop](./Screenshot/Desktop/Edit%20Task%20Desktop.png)

#### Filter Task

![Filter Task Desktop](./Screenshot/Desktop/Filter%20Task%20Desktop.png)

#### Delete Task

![Delete Task Desktop](./Screenshot/Desktop/Delete%20Task%20Desktop.png)

#### Logout

![Logout Desktop](./Screenshot/Desktop/Logout%20Desktop.png)

### Versi Mobile

#### Halaman Login

![Login Mobile](./Screenshot/Mobile/Login%20Mobile.png)

#### Halaman Register

![Register Mobile](./Screenshot/Mobile/Register%20Mobile.png)

#### Halaman All Tasks

![All Task Mobile](./Screenshot/Mobile/All%20Task%20Mobile.png)

#### Halaman Create Task

![Create Task Mobile](./Screenshot/Mobile/Create%20Task%20Mobile.png)

#### Halaman Detail Task

![Detail Task Mobile](./Screenshot/Mobile/Detail%20Task%20Mobile.png)

#### Halaman Edit Task

![Edit Task Mobile](./Screenshot/Mobile/Edit%20Task%20Mobile.png)

#### Filter Task

![Filter Task Mobile](./Screenshot/Mobile/FIlter%20Task%20Mobile.png)

#### Delete Task

![Delete Task Mobile](./Screenshot/Mobile/Delete%20Task%20Mobile.png)

#### Logout

![Logout Mobile](./Screenshot/Mobile/Logout%20Mobile.png)

## Troubleshooting

### Port sudah digunakan

Jika port 3000 atau 8000 sudah digunakan, ubah port di `docker-compose.yml`:

- Frontend: Ubah `"3000:3000"` menjadi `"3001:3000"` (atau port lain)
- Backend: Ubah `"8000:80"` menjadi `"8001:80"` (atau port lain)

### Database connection error

Pastikan container database sudah running:

```bash
cd backend
docker-compose ps
```

### Permission denied

Jika ada masalah permission, jalankan:

```bash
# Linux/Mac
sudo chown -R $USER:$USER .

# Atau ubah permission
chmod -R 755 .
```

## API Endpoints

### Authentication

- `POST /api/register` - Registrasi user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (protected)
- `GET /api/me` - Get user yang sedang login (protected)

### Tasks

- `GET /api/tasks` - Get semua tasks (protected)
- `POST /api/tasks` - Create task baru (protected)
- `GET /api/tasks/{id}` - Get task by ID (protected)
- `PUT /api/tasks/{id}` - Update task (protected)
- `DELETE /api/tasks/{id}` - Delete task (protected)

## Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Proyek ini menggunakan lisensi MIT.

## Kontak

Untuk pertanyaan atau dukungan, silakan buat issue di repository ini.
