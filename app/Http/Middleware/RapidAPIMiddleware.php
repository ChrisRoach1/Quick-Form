<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class RapidAPIMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->header();
        $rapid_api_secret = $request->header('X-RapidAPI-Proxy-Secret');

        if (! $rapid_api_secret) {
            return response()->json(['error' => 'No RapidAPI secret provided'], 500);
        }

        if ($rapid_api_secret !== env('X_RAPIDAPI_SECRET')) {
            return response()->json(['error' => 'unauthorized'], 401);
        }

        return $next($request);
    }
}
