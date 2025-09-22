<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class KaryawanJobManagementMiddleware
{
    /**
     * Handle an incoming request.
     * Allows only Asisten Bengkel to create and manage jobs for karyawan.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->canManageKaryawanJobs()) {
            abort(403, 'Access denied. Only Asisten Bengkel can manage karyawan jobs.');
        }

        return $next($request);
    }
}