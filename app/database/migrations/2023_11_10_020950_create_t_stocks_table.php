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
        Schema::create('t_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()
                ->onUpdate('cascade');
            $table->tinyInteger('type');
            $table->integer('quantity');
            $table->datetime('created_at')->nullable();
            $table->datetime('updated_at')->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_stocks');
    }
};
