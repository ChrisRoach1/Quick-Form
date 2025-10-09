<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RapidAPIMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $headers = $request->header();
        $rapid_api_secret = $request->header('X-RapidAPI-Proxy-Secret');

        if(!$rapid_api_secret) {
            return response()->json(['error' => 'No RapidAPI secret provided'], 500);
        }

        if($rapid_api_secret !== env('X_RAPIDAPI_SECRET')) {
            return response()->json(['error' => 'unauthorized'], 401);
        }


        return $next($request);
    }
}
