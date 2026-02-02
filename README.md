# Sistem Pencatatan Keuangan & Klinik (SCB)

Aplikasi Web Terintegrasi untuk manajemen keuangan pribadi dan pencatatan pendapatan klinik, dibangun dengan teknologi web modern untuk performa tinggi dan pengalaman pengguna yang seamless.

## 🚀 Teknologi Utama

Project ini dibangun menggunakan stack teknologi terkini:

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
*   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
*   **Authentication**: [Auth.js (NextAuth v5)](https://authjs.dev/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Form Handling**: React Hook Form + Zod

## ✨ Fitur Utama

Sistem ini memiliki dua modul utama yang terintegrasi:

### 1. Manajemen Keuangan Pribadi
Solusi lengkap untuk mengatur arus kas harian Anda.

*   **Multi-Wallet Support**: Buat dan kelola berbagai "Dompet" (misal: Tabungan, Harian, Darurat) untuk pos keuangan yang berbeda.
*   **Pencatatan Transaksi**:
    *   **Pemasukan**: Catat sumber pendapatan dengan mudah.
    *   **Pengeluaran**: Pantau belanja harian dengan kategori dan keterangan.
*   **Statistik Real-time**:
    *   Total Saldo (Balance)
    *   Ringkasan Pemasukan & Pengeluaran
*   **Filtering Canggih**: Filter riwayat transaksi berdasarkan:
    *   Dompet
    *   Tanggal Spesifik
    *   Bulan & Tahun

### 2. Pencatatan Klinik (Clinic Finance)
Modul khusus untuk profesional medis/klinik.

*   **Rekap Pendapatan**: Catat pendapatan dari setiap tindakan medis.
*   **Detail Tindakan**: Input data lengkap meliputi:
    *   Nama Tindakan Medis
    *   Nama Pasien
    *   Biaya Tindakan (Format Rupiah Otomatis)
    *   Metode Pembayaran

### 🛠️ Fitur Teknis Unggulan
*   **Keamanan Terjamin**: Sistem login aman dengan enkripsi password.
*   **Auto-Refresh Data**: Data diperbarui secara otomatis tanpa perlu reload halaman manual setelah input (menggunakan Next.js caching revalidation).
*   **Format Rupiah Otomatis**: Input nominal uang langsung terformat ke dalam mata uang Indonesia (IDR) saat pengetikan.
*   **Responsive Design**: Tampilan optimal di Desktop, Tablet, dan Smartphone.

## 🎯 Tujuan Sistem

Sistem ini dibuat dengan tujuan untuk:
1.  **Sentralisasi Data**: Menggabungkan pencatatan keuangan pribadi dan profesional (klinik) dalam satu platform yang aman.
2.  **Efisiensi**: Mempercepat proses pencatatan keuangan harian yang seringkali manual dan rentan kesalahan.
3.  **Transparansi Finansial**: Memberikan gambaran jelas mengenai kondisi keuangan (cash flow) secara real-time untuk membantu pengambilan keputusan finansial yang lebih baik.

## 📦 Cara Menjalankan Project

1.  **Clone Repository**
    ```bash
    git clone https://github.com/username/pencatatan_keuangan.git
    cd pencatatan_keuangan
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env` dan sesuaikan dengan `.env.example` (Database URL & Auth Secret).

4.  **Database Setup**
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Jalankan Development Server**
    ```bash
    npm run dev
    ```

    Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
