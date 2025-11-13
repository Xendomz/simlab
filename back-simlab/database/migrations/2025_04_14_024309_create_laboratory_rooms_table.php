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
        Schema::create('laboratory_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('floor');
            $table->integer('student_price')->default(0);
            $table->integer('lecturer_price')->default(0);
            $table->integer('external_price')->default(0);
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laboratory_rooms');
    }
};
