<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DamageReportMiddleware
{
    /**
     * Handle an incoming request.
     * Allows Manager, Askep, Asisten Bengkel, and Asisten Proses to access damage reports.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->canAddDamageReports()) {
            abort(403, 'Access denied. You do not have permission to access damage reports.');
        }

        return $next($request);
    }
}