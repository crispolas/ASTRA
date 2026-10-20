// Página de teste isolada: não adiciona rotas de cadastro/edição à aplicação.
import { createServer } from 'vite';

const server = await createServer({
	server: { host: '127.0.0.1', port: 5174, strictPort: true },
	plugins: [{
		name: 'pagina-de-teste-do-formulario',
		configureServer(vite) {
			vite.middlewares.use(async (req, res, next) => {
				if (req.url !== '/__teste-formulario') return next();
				try {
					const html = await vite.transformIndexHtml(req.url, `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Teste do formulário</title></head>
<body><div id="app"></div><script type="module">
import { mount } from 'svelte';
import Demo from '/tests/fixtures/TarefaFormularioDemo.svelte';
mount(Demo, { target: document.getElementById('app') });
</script></body></html>`);
					res.setHeader('Content-Type', 'text/html; charset=utf-8');
					res.end(html);
				} catch (err) { next(err); }
			});
		}
	}]
});
await server.listen();
console.log('Teste do formulário: http://127.0.0.1:5174/__teste-formulario');
console.log('A API deve estar em localhost:3000. Use um banco de teste: o formulário grava dados.');
for (const sinal of ['SIGINT', 'SIGTERM']) {
	process.once(sinal, async () => { await server.close(); process.exit(0); });
}
