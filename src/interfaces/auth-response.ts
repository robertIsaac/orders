export type AuthResponse = FalseResponse | TrueResponse;

interface FalseResponse {
    success: false;
    message: string;
}

interface TrueResponse {
    success: true;
    token: string;
}

