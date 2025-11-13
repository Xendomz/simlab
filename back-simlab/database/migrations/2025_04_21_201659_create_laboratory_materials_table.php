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
        Schema::create('laboratory_materials', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->foreignId('laboratory_room_id')->constrained()->onDelete('cascade');
            $table->string('material_name');
            $table->string('brand')->nullable();
            $table->integer('stock');
            $table->string('unit');
            $table->date('purchase_date');
            $table->date('expiry_date')->nullable();
            $table->text('description')->nullable();
            $table->date('refill_date');
            $table->integer('student_price')->default(0);
            $table->integer('lecturer_price')->default(0);
            $table->integer('external_price')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laboratory_materials');
    }
};
