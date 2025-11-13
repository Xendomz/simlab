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
        Schema::create('practicum_schedulings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('laboran_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('practicum_id')->constrained()->onDelete('cascade');
            $table->char('phone_number', 14);
            $table->enum('status', ['draft', 'pending', 'rejected', 'approved', 'revision']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practicum_schedulings');
    }
};
