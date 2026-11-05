import { PUBLIC_API_URL } from '$app/env/public';

// Remove a barra final para preservar os caminhos usados nas requisições.
export const API_URL = PUBLIC_API_URL.replace(/\/+$/, '');
