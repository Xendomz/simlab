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
        Schema::create('practicum_classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practicum_scheduling_id')->constrained()->onDelete('cascade');
            $table->foreignId('lecturer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('laboratory_room_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('practicum_assistant');
            $table->integer('total_participant');
            $table->integer('total_group');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practicum_classes');
    }
};
