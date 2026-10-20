import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let server;
let Formulario;
let render;
before(async () => {
	server = await createServer({ logLevel: 'silent', server: { middlewareMode: true } });
	({ default: Formulario } = await server.ssrLoadModule('/src/lib/components/TarefaFormulario.svelte'));
	({ render } = await server.ssrLoadModule('svelte/server'));
});
after(async () => { await server?.close(); });

test('o formulário oferece os sete campos editáveis, sem pedir ID', () => {
	const html = render(Formulario, { props: { aoEnviar() {} } }).body;
	for (const campo of ['titulo', 'descricao', 'projetoId', 'status', 'prioridade', 'responsavel', 'prazo']) {
		assert(html.includes(`name="${campo}"`), campo);
	}
	assert(!html.includes('name="id"'));
	assert(html.includes('Salvar tarefa'));
});

test('o mesmo formulário recebe valores de edição sem modificar o objeto original', () => {
	const valoresIniciais = Object.freeze({
		titulo: 'Revisar API', descricao: 'Descrição inicial', projetoId: '1',
		status: 'em-revisao', prioridade: 'alta', responsavel: 'Gabriel', prazo: '2026-10-21'
	});
	const antes = { ...valoresIniciais };
	const html = render(Formulario, { props: { valoresIniciais, aoEnviar() {}, textoBotao: 'Atualizar' } }).body;
	for (const texto of ['Revisar API', 'Descrição inicial', 'Gabriel', '2026-10-21', 'Atualizar']) {
		assert(html.includes(texto), texto);
	}
	assert.deepEqual(valoresIniciais, antes);
});
