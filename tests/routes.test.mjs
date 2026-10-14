import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let server;
let baseUrl;

before(async () => {
    server = await createServer({
        logLevel: 'silent',
        server: { host: '127.0.0.1', port: 0 }
    });

    await server.listen();

    const address = server.httpServer?.address();
    assert(address && typeof address !== 'string');
    baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
    await server.close();
});

const pages = [
    ['/', 'Tarefas', 'Página inicial'],
    ['/projetos', 'Projetos', 'Lista de projetos']
];

for (const [path, heading, subheading] of pages) {
    test(`${path} responde com a página provisória`, async () => {
        const response = await fetch(`${baseUrl}${path}`);
        const html = await response.text();

        assert.equal(response.status, 200);
        assert.match(html, new RegExp(`<h1(?:\\s[^>]*)?>${heading}</h1>`));
        assert.match(html, new RegExp(`<h2(?:\\s[^>]*)?>${subheading}</h2>`));
    });
}

test('/tarefas/1 exibe os dados da tarefa e o link Voltar', async () => {
    const response = await fetch(`${baseUrl}/tarefas/1`);
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /Voltar/);
    assert.match(html, /Criar o repositório/);
});

test('uma URL desconhecida mostra a página de erro personalizada', async () => {
    const response = await fetch(`${baseUrl}/pagina-inexistente`);
    const html = await response.text();

    assert.equal(response.status, 404);
    assert.match(html, /<h1>Página não encontrada<\/h1>/);
    assert.match(html, /<h2>Erro 404<\/h2>/);
});