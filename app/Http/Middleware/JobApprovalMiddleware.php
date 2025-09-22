<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class JobApprovalMiddleware
{
    /**
     * Handle an incoming request.
     * Allows Manager, Askep, and Asisten Bengkel to approve jobs.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!auth()->check() || !auth()->user()->canApproveJobs()) {
            abort(403, 'Access denied. You do not have permission to approve jobs.');
        }

        return $next($request);
    }
}