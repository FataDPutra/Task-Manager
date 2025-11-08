# Frontend - Task Management System

Frontend aplikasi Task Management System menggunakan React 19 dengan Tailwind CSS.

## Deskripsi

Frontend ini adalah Single Page Application (SPA) yang dibangun dengan React 19. Aplikasi ini menyediakan antarmuka pengguna yang modern dan responsif untuk mengelola tasks.

## Teknologi yang Digunakan

- **React 19** - JavaScript Library untuk UI
- **React Router DOM 6** - Client-side routing
- **Axios** - HTTP client untuk API calls
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Icons** - Icon library
- **Docker & Docker Compose** - Containerization

## Prasyarat

- Docker & Docker Compose terinstall
- Git terinstall

## Langkah-langkah Setup & Menjalankan

### 1. Masuk ke Folder Frontend

```bash
cd frontend
```

### 2. Setup Environment Variables

Buat file `.env` di folder `src/` (jika diperlukan):

```bash
cd src
touch .env
```

Isi file `.env`:

```env
REACT_APP_API_URL=http://localhost:8000/api
PORT=3000
```

**Catatan**: Environment variable sudah dikonfigurasi di `docker-compose.yml`, jadi langkah ini opsional.

### 3. Build dan Jalankan Container

```bash
# Kembali ke folder frontend
cd ..

# Build dan jalankan container
docker-compose up -d --build
```

Ini akan:

- Build image Node.js 20
- Install dependencies npm
- Start development server
- Expose aplikasi di port 3000

### 4. Verifikasi Setup

Cek apakah container berjalan:

```bash
docker-compose ps
```

Anda harus melihat container `task_frontend` running.

### 5. Akses Aplikasi

Buka browser dan akses:

```
http://localhost:3000
```

## Informasi Login

Gunakan kredensial berikut untuk login:

```
Email: test@example.com
Password: password
```

**Atau** buat akun baru melalui halaman Register.

## Struktur Folder

```
frontend/
├── src/
│   ├── src/                      # Source code React
│   │   ├── components/           # React components
│   │   │   ├── ErrorBoundary.js
│   │   │   ├── Layout.js
│   │   │   ├── Login.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── Register.js
│   │   │   ├── TaskDetail.js
│   │   │   ├── TaskForm.js
│   │   │   ├── TaskItem.js
│   │   │   └── TaskList.js
│   │   ├── constants/            # Constants
│   │   │   └── apiConstants.js
│   │   ├── context/              # React Context
│   │   │   └── AuthContext.js
│   │   ├── hooks/                # Custom hooks
│   │   ├── services/             # API services
│   │   │   └── api.js
│   │   ├── utils/                # Utilities
│   │   │   └── errorHandler.js
│   │   ├── App.js                # Main App component
│   │   ├── index.js              # Entry point
│   │   └── index.css             # Global styles
│   ├── public/                   # Static files
│   ├── package.json              # Dependencies
│   └── tailwind.config.js        # Tailwind configuration
├── docker-compose.yml            # Docker Compose configuration
├── Dockerfile                    # Node.js Docker image
└── README.md                     # File ini
```

## Fitur Aplikasi

### 1. Authentication

- **Login** - Login dengan email dan password
- **Register** - Registrasi user baru
- **Logout** - Keluar dari aplikasi
- **Protected Routes** - Route yang memerlukan autentikasi

### 2. Task Management

- **Create Task** - Membuat task baru dengan form
- **View Tasks** - Melihat daftar semua tasks
- **Update Task** - Mengupdate task yang sudah ada
- **Delete Task** - Menghapus task
- **Task Detail** - Melihat detail lengkap task

### 3. Filter & Sort

- **Filter by Status** - Filter berdasarkan status (To Do, In Progress, Done)
- **Sort by Deadline** - Sort berdasarkan deadline (ascending/descending)
- **Date Range Filter** - Filter berdasarkan range tanggal deadline

### 4. UI/UX Features

- **Responsive Design** - Mobile-friendly
- **Loading States** - Loading indicator saat fetch data
- **Error Handling** - Error messages yang user-friendly
- **Form Validation** - Client-side validation

## Konfigurasi API

API URL dikonfigurasi di `docker-compose.yml`:

```yaml
environment:
  - REACT_APP_API_URL=http://localhost:8000/api
```

Untuk mengubah API URL, edit `docker-compose.yml` atau buat file `.env` di folder `src/`.

## Testing

```bash
# Masuk ke container
docker-compose exec frontend sh

# Jalankan tests
npm test

# Jalankan tests dengan coverage
npm test -- --coverage

# Exit dari container
exit
```

## Development

### Hot Reload

Aplikasi menggunakan hot reload, jadi perubahan kode akan otomatis ter-refresh di browser.

### Menambah Dependencies

```bash
# Masuk ke container
docker-compose exec frontend sh

# Install package
npm install <package-name>

# Exit
exit

# Restart container untuk apply changes
docker-compose restart frontend
```

### Build untuk Production

```bash
# Masuk ke container
docker-compose exec frontend sh

# Build production
npm run build

# Build files akan ada di src/build/
```

## Menghentikan Aplikasi

```bash
# Stop container
docker-compose stop

# Stop dan hapus container
docker-compose down

# Stop, hapus container dan volume
docker-compose down -v
```

## 🔧 Troubleshooting

### Port 3000 sudah digunakan

Edit `docker-compose.yml`:

```yaml
ports:
  - "3001:3000" # Ubah 3000 menjadi 3001
```

### Container tidak bisa start

```bash
# Cek logs
docker-compose logs -f frontend

# Rebuild container
docker-compose up -d --build --force-recreate
```

### Dependencies tidak terinstall

```bash
# Masuk ke container
docker-compose exec frontend sh

# Install ulang dependencies
rm -rf node_modules package-lock.json
npm install

# Exit dan restart
exit
docker-compose restart frontend
```

### API connection error

Pastikan:

1. Backend sudah running di `http://localhost:8000`
2. `REACT_APP_API_URL` di `docker-compose.yml` sudah benar
3. Tidak ada CORS issue di backend

### Hot reload tidak bekerja

```bash
# Restart container
docker-compose restart frontend
```

## Screenshot

### Halaman Login

- Form login dengan validasi
- Link ke halaman register
- Error handling

### Halaman Register

- Form registrasi dengan validasi
- Link ke halaman login
- Error handling

### Halaman Task List

- Daftar semua tasks
- Filter dan sort options
- Create task button
- Task cards dengan status indicator

### Halaman Task Detail

- Detail lengkap task
- Edit dan delete buttons
- Status update

## Production Build

Untuk build production:

```bash
# Build
docker-compose exec frontend npm run build

# Build files ada di src/build/
# Serve dengan web server seperti Nginx
```

## 📚 Scripts yang Tersedia

- `npm start` - Start development server
- `npm build` - Build untuk production
- `npm test` - Run tests
- `npm eject` - Eject dari Create React App (tidak bisa di-undo)

## Update Dependencies

```bash
# Masuk ke container
docker-compose exec frontend sh

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

## Support

Untuk pertanyaan atau masalah, silakan buat issue di repository.
