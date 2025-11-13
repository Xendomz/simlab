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
        Schema::create('booking_approvals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->enum('action', ['request_booking', 'verified_by_head', 'verified_by_laboran', 'return_by_requestor', 'return_confirmed_by_laboran']);
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
        Schema::dropIfExists('booking_approvals');
    }
};
