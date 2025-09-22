<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClearDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Nonaktifkan foreign key checks sementara
        DB::statement('PRAGMA foreign_keys = OFF'); // Untuk SQLite

        // Kosongkan data dari tabel (kecuali users)
        DB::table('bengkel_jobs')->truncate();
        DB::table('damage_reports')->truncate();
        DB::table('jobs')->truncate();
        DB::table('failed_jobs')->truncate();
        
        // Aktifkan kembali foreign key checks
        DB::statement('PRAGMA foreign_keys = ON');

        echo "✅ Semua data berhasil dikosongkan (kecuali tabel users)!\n";
    }
}
