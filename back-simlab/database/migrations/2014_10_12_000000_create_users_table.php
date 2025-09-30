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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->enum('role', ['admin', 'admin_keuangan', 'kepala_lab_terpadu', 'dosen', 'koorprodi', 'kepala_lab_jurusan', 'laboran', 'mahasiswa', 'pihak_luar']);
            $table->foreignId('study_program_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('institution_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('identity_num')->nullable();
            $table->enum('is_active', ['Active', 'Deactive']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
