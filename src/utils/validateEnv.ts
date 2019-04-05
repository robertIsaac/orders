import {bool, cleanEnv, num, port, str} from 'envalid';

function validateEnv() {
    cleanEnv(process.env, {
        MONGO_PASSWORD: str(),
        MONGO_PATH: str(),
        MONGO_USER: str(),
        PORT: port(),
        JWT_SECRET: str(),
        JWT_EXP: str(),
        SALT_ROUNDS: num(),
        PRODUCTION: bool(),
    });
}

export = validateEnv;
