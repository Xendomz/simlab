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
        Schema::create('practicum_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practicum_scheduling_id')->constrained()->onDelete('cascade');
            $table->enum('role', ['pemohon', 'kepala_lab_terpadu', 'laboran']);
            $table->foreignId('approver_id')->constrained('users')->onDelete('cascade');
            $table->boolean('is_approved');
            $table->string('information')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practicum_approvals');
    }
};
