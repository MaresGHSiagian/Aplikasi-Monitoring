<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BengkelJobController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\DamageReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Redirect logged-in users to dashboard
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [BengkelJobController::class, 'dashboard'])->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Job routes - basic access for all authenticated users
    Route::get('/jobs', [BengkelJobController::class, 'index'])->name('jobs.index');
    
    // Job creation routes (Asisten Bengkel only for karyawan jobs) - MUST be before dynamic routes
    Route::middleware('karyawan.job.management')->group(function () {
        Route::get('/jobs/create', [BengkelJobController::class, 'create'])->name('jobs.create');
        Route::post('/jobs', [BengkelJobController::class, 'store'])->name('jobs.store');
        Route::patch('/jobs/{job}/start', [BengkelJobController::class, 'start'])->name('jobs.start');
    });
    
    Route::get('/jobs/{job}', [BengkelJobController::class, 'show'])->name('jobs.show');
    
    // Job completion routes (for job workers)
    Route::middleware('job.management')->group(function () {
        // Job completion form routes - MUST be before dynamic routes
        Route::get('/jobs/{job}/complete-form', [BengkelJobController::class, 'showCompletionForm'])->name('jobs.complete-form');
        Route::post('/jobs/{job}/submit-completion', [BengkelJobController::class, 'submitCompletion'])->name('jobs.submit-completion');
        
        Route::get('/jobs/{job}/edit', [BengkelJobController::class, 'edit'])->name('jobs.edit');
        Route::patch('/jobs/{job}', [BengkelJobController::class, 'update'])->name('jobs.update');
        Route::delete('/jobs/{job}', [BengkelJobController::class, 'destroy'])->name('jobs.destroy');
        Route::patch('/jobs/{job}/complete', [BengkelJobController::class, 'complete'])->name('jobs.complete');
        Route::get('/jobs/{job}/download-image', [BengkelJobController::class, 'downloadCompletionImage'])->name('jobs.download-image');
        Route::get('/api/mechanics', [BengkelJobController::class, 'getMechanics'])->name('api.mechanics');
    });
    
    // Job approval routes (Manager, Askep, Asisten Bengkel only)
    Route::middleware('job.approval')->group(function () {
        Route::patch('/jobs/{job}/approve', [BengkelJobController::class, 'approveCompletion'])->name('jobs.approve');
        Route::patch('/jobs/{job}/reject', [BengkelJobController::class, 'rejectCompletion'])->name('jobs.reject');
    });

    // User management routes (All roles except karyawan)
    Route::middleware('admin')->group(function () {
        Route::resource('users', UserManagementController::class);
    });

    // Damage reports routes (Manager, Askep, Asisten Bengkel, Asisten Proses)
    Route::middleware('damage.reports')->group(function () {
        Route::resource('damage-reports', DamageReportController::class);
    });
});

require __DIR__.'/auth.php';
