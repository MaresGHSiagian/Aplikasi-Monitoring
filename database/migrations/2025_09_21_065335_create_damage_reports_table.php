<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('damage_reports', function (Blueprint $table) {
            $table->id();
            $table->string('no')->unique(); // Nomor laporan
            $table->enum('stasiun', [
                'stasiun rebusan',
                'stasiun threser', 
                'stasiun empty bunch press',
                'stasiun press',
                'stasiun kernel',
                'stasiun klarifikasi',
                'stasiun boiler',
                'stasiun water treatment',
                'lainnya'
            ]); // Stasiun yang mengalami kerusakan
            $table->text('keterangan_kerusakan'); // Keterangan kerusakan
            $table->text('catatan')->nullable(); // Detail catatan
            $table->string('gambar')->nullable(); // Path gambar
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('damage_reports');
    }
};
