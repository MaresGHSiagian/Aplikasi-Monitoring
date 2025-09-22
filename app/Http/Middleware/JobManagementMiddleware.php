<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JobManagementMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();
        $route = $request->route();
        $routeName = $route->getName();

        // Allow all users to view jobs (index, show)
        if (in_array($routeName, ['jobs.index', 'jobs.show', 'dashboard'])) {
            return $next($request);
        }

        // Only allow asisten bengkel to create, edit, delete, START jobs
        $asistenBengkelOnlyActions = ['jobs.create', 'jobs.store', 'jobs.edit', 'jobs.update', 'jobs.destroy', 'jobs.start'];
        if (in_array($routeName, $asistenBengkelOnlyActions) && !$user->isAsistenBengkel()) {
            abort(403, 'Access denied. Only asisten bengkel can create, edit, delete, or start jobs.');
        }

        // Allow job completion for both admin and karyawan (with different logic in controller)
        if (in_array($routeName, ['jobs.complete'])) {
            return $next($request);
        }

        // Allow completion submission for karyawan and asisten bengkel
        if (in_array($routeName, ['jobs.complete-form', 'jobs.submit-completion']) && ($user->isKaryawan() || $user->isAsistenBengkel())) {
            return $next($request);
        }

        // Allow approval/rejection for management only (Manager, Askep, Asisten Bengkel)
        if (in_array($routeName, ['jobs.approve', 'jobs.reject']) && $user->canApproveJobs()) {
            return $next($request);
        }

        return $next($request);
    }
}