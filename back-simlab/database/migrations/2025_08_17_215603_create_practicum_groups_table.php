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
        Schema::create('practicum_groups', function (Blueprint $table) {
            $table->id();
            $table->string('group_name');
            $table->string('practicum_assistant');
            $table->string('practicum_session');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->foreignId('practicum_scheduling_id')->constrained()->onDelete('cascade');
            $table->integer('total_participant');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practicum_groups');
    }
};
