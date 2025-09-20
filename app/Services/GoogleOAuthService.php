<?php

namespace App\Services;

use Google\Client;
use Illuminate\Support\Facades\Log;

class GoogleOAuthService
{
    private $client;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setClientId(env('GOOGLE_CLIENT_ID', ''));
        $this->client->setClientSecret(env('GOOGLE_CLIENT_SECRET', ''));
        $this->client->setApplicationName(env('GOOGLE_PROJECT_ID', ''));
        $this->client->setRedirectUri(env('GOOGLE_REDIRECT_URI', ''));
        $this->client->setAccessType('offline');
        $this->client->setPrompt('select_account consent');
        $this->client->setIncludeGrantedScopes(true);
        $this->client->addScope('https://www.googleapis.com/auth/forms.body');
    }

    public function getAuthUrl(): string
    {
        return $this->client->createAuthUrl();
    }

    public function handleCallback(string $code): array
    {
        $accessToken = $this->client->fetchAccessTokenWithAuthCode($code);
        auth()->user()->update(['google_session' => $accessToken]);
        if (isset($accessToken['error'])) {
            throw new \Exception('OAuth error: ' . $accessToken['error_description'] ?? $accessToken['error']);
        }

        return $accessToken;
    }

    public function refreshToken(array $tokenData): array
    {
        if (!isset($tokenData['refresh_token'])) {
            throw new \Exception('No refresh token available. User needs to re-authenticate.');
        }

        $this->client->setAccessToken($tokenData);
        
        try {
            $newToken = $this->client->fetchAccessTokenWithRefreshToken($tokenData['refresh_token']);
            
            if (isset($newToken['error'])) {
                throw new \Exception('Token refresh failed: ' . $newToken['error_description'] ?? $newToken['error']);
            }

            // Preserve the refresh token if it's not included in the new token
            if (!isset($newToken['refresh_token']) && isset($tokenData['refresh_token'])) {
                $newToken['refresh_token'] = $tokenData['refresh_token'];
            }

            Log::info('Access token refreshed successfully');
            return $newToken;
            
        } catch (\Exception $e) {
            Log::error('Token refresh failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function isTokenExpired(array $tokenData): bool
    {
        if (!isset($tokenData['expires_in']) || !isset($tokenData['created'])) {
            return true;
        }

        $expiryTime = $tokenData['created'] + $tokenData['expires_in'];
        $currentTime = time();
        
        // Consider token expired if it expires within the next 5 minutes
        return ($expiryTime - 300) <= $currentTime;
    }

    public function getValidToken(): ?array
    {
        $tokenData = session()->get('google_access_token');
        if (!$tokenData) {

            if(auth()->user()){
                $tokenData = json_decode(auth()->user()->google_session, true);
            }

            if(!$tokenData){
                return null;
            }
        }

        // If token is not expired, return it
        if (!$this->isTokenExpired($tokenData)) {
            return $tokenData;
        }

        // Try to refresh the token
        try {
            $refreshedToken = $this->refreshToken($tokenData);
            session(['google_access_token' => $refreshedToken]);
            auth()->user()->update(['google_session' => $refreshedToken]);
            return $refreshedToken;
        } catch (\Exception $e) {
            // Refresh failed, clear the token
            session()->forget('google_access_token');
            Log::warning('Token refresh failed, user needs to re-authenticate: ' . $e->getMessage());
            return null;
        }
    }

    public function GetValidAccessTokenString()
    {
        $tokenData = $this->getValidToken();

        return $tokenData['access_token'];
    }
}