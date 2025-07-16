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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('academic_year_id')->constrained('tahun_akademiks')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->char('phone_number', 14);
            $table->string('purpose');
            $table->string('supporting_file');
            $table->string('supervisor');
            $table->string('supervisor_email');
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected']);
            $table->enum('booking_type', ['room', 'room_n_equipment', 'equipment']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
