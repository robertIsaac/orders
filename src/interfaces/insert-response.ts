type InsertResponse = FalseResponse | TrueResponse;

interface FalseResponse {
    success: false;
    message: string;
}

interface TrueResponse {
    success: true;
    insertedId: string;
}

