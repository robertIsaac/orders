type AuthResponse = FalseResponse | AuthTrueResponse;

interface FalseResponse {
    success: false;
    message: string;
}

interface AuthTrueResponse {
    success: true;
    token: string;
}

