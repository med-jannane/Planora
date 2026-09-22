<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role');
            $table->string('email')->unique();
            $table->string('avatar')->nullable();
            $table->boolean('is_owner')->default(false);
            $table->timestamps();
        });

        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('summary')->nullable();
            $table->integer('total_estimated_hours')->default(0);
            $table->integer('total_story_points')->default(0);
            $table->float('estimated_duration_weeks')->default(0);
            $table->timestamps();
        });

        Schema::create('sprints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('duration');
            $table->string('focus');
            $table->string('status')->default('Planifie');
            $table->timestamps();
        });

        Schema::create('user_stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('code_id');
            $table->string('title');
            $table->string('module');
            $table->string('priority')->default('Moyenne');
            $table->integer('story_points')->default(0);
            $table->integer('estimated_hours')->default(0);
            $table->string('assigned_to')->nullable();
            $table->json('criteria')->nullable();
            $table->timestamps();
        });

        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->string('code_id');
            $table->string('user_story_code');
            $table->string('title');
            $table->string('assignee');
            $table->string('role')->nullable();
            $table->integer('estimated_hours')->default(0);
            $table->string('status')->default('A faire');
            $table->string('sprint')->default('Sprint 1');
            $table->integer('gantt_start_day')->default(1);
            $table->integer('duration_days')->default(2);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('user_stories');
        Schema::dropIfExists('sprints');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('team_members');
    }
};
