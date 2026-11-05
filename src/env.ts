import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_API_URL: {
		public: true,
		static: true,
		schema: (valor) => {
			if (!valor || !/^https?:\/\//.test(valor)) {
				throw new Error('Defina PUBLIC_API_URL com a URL HTTP(S) da API no ambiente ou no arquivo .env.');
			}
			return valor.replace(/\/+$/, '');
		}
	}
});
