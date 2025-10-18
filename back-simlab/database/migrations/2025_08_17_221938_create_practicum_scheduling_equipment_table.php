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
        Schema::create('practicum_scheduling_equipment', function (Blueprint $table) {
            $table->id();
            $table->foreignId('practicum_scheduling_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');

            // make manual polymorph configuration because index is to long if using morph
            $table->unsignedBigInteger('equipmentable_id');
            $table->string('equipmentable_type');
            $table->index(['equipmentable_type', 'equipmentable_id'], 'equipable_index');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('practicum_scheduling_equipment');
    }
};
