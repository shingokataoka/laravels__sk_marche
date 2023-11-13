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
        Schema::create('primary_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('sort_order');
            $table->datetime('created_at')->nullable();
            $table->datetime('updated_at')->nullable();

        });
        Schema::create('secondary_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('primary_category_id')->constrained('primary_categories')
                ->onUpdate('cascade');
            $table->string('name');
            $table->integer('sort_order');
            $table->datetime('created_at')->nullable();
            $table->datetime('updated_at')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('primary_categories');
        Schema::dropIfExists('secondary_categories');
    }
};
