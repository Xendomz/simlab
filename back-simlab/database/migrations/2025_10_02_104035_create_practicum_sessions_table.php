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
        Schema::create('practicum_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practicum_class_id')->constrained()->onDelete('cascade');
            $table->foreignId('practicum_module_id')->constrained()->onDelete('cascade');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->boolean('is_class_conducted')->nullable();
            $table->string('laboran_comment')->nullable();
            $table->dateTime('laboran_commented_at')->nullable();
            $table->string('lecturer_comment')->nullable();
            $table->dateTime('lecturer_commented_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practicum_sessions');
    }
};
