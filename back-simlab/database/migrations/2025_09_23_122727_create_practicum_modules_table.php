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
        Schema::create('practicum_modules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practicum_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->enum('status', ['Active', 'Deactive'])->default('Deactive');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practicum_modules');
    }
};
