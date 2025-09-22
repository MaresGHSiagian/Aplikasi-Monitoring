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
        Schema::create('bengkel_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pekerjaan');
            $table->string('mekanik');
            $table->integer('estimasi_menit');
            $table->datetime('waktu_mulai')->nullable();
            $table->enum('status', ['Belum Mulai', 'Proses', 'Selesai', 'Lewat Waktu'])->default('Belum Mulai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bengkel_jobs');
    }
};
