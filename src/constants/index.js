import path from 'node:path';

export const sortOrderList = ["asc", "desc"];

export const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;

export const REFRESH_TOKEN_LIFETIME = 30 * 24 * 3600 * 1000;

export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');