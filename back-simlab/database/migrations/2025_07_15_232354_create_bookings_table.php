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
            $table->foreignId('academic_year_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('laboran_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('laboratory_room_id')->nullable()->constrained()->onDelete('cascade');
            $table->char('phone_number', 14);
            $table->string('purpose');
            $table->string('supporting_file')->nullable();
            $table->string('activity_name');
            $table->string('supervisor')->nullable();
            $table->string('supervisor_email')->nullable();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected', 'revision', 'returned']);
            $table->enum('booking_type', ['room', 'room_n_equipment', 'equipment']);
            $table->integer('total_participant');
            $table->text('participant_list')->nullable();
            $table->boolean('is_allowed_offsite')->default(0);
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
