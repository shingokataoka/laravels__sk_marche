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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shop_id')->constrained()
                ->onUpdate('cascade')
                ->onDelete('cascade');
            $table->foreignId('secondary_category_id')->constrained('secondary_categories')
                ->onUpdate('cascade');
            $table->foreignId('image1')->nullable()->constrained('images')
                ->onUpdate('cascade');
            $table->foreignId('image2')->nullable()->constrained('images')
                ->onUpdate('cascade');
            $table->foreignId('image3')->nullable()->constrained('images')
                ->onUpdate('cascade');
            $table->foreignId('image4')->nullable()->constrained('images')
                ->onUpdate('cascade');
            $table->string('name');
            $table->text('information');
            $table->integer('price');
            $table->boolean('is_selling');
            $table->bigInteger('sort_order');
            $table->datetime('created_at')->nullable();
            $table->datetime('updated_at')->nullable();
            $table->datetime('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
