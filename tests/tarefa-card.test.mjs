import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let server;
let TarefaCard;
let render;

before(async () => {
	server = await createServer({
		logLevel: 'silent',
		server: { host: '127.0.0.1', port: 0 }
	});
	await server.listen();
	({ default: TarefaCard } = await server.ssrLoadModule('/src/lib/components/TarefaCard.svelte'));
	({ render } = await server.ssrLoadModule('svelte/server'));
});

after(async () => {
	await server?.close();
});

const exemplo = {
	id: '42',
	projetoId: '1',
	titulo: 'Documentar o componente',
	descricao: 'Explicar o uso para a equipe',
	status: 'a-fazer',
	prioridade: 'media',
	responsavel: 'Gabriel',
	prazo: '2026-10-14'
};

test('o cartão mostra os dados e os rótulos de todos os status e prioridades', () => {
	for (const [status, nomeStatus] of [
		['a-fazer', 'A fazer'],
		['em-andamento', 'Em andamento'],
		['em-revisao', 'Em revisão'],
		['concluida', 'Concluída']
	]) {
		for (const [prioridade, nomePrioridade] of [
			['baixa', 'Baixa'],
			['media', 'Média'],
			['alta', 'Alta']
		]) {
			const tarefa = Object.freeze({ ...exemplo, status, prioridade });
			const html = render(TarefaCard, { props: { tarefa } }).body;
			for (const valor of [tarefa.titulo, tarefa.descricao, tarefa.responsavel, nomeStatus, nomePrioridade]) {
				assert(html.includes(valor), `O cartão deve mostrar ${valor}`);
			}
			assert(html.includes('href="/tarefas/42"'));
			assert(html.includes('datetime="2026-10-14"'));
			assert(html.includes('14/10/2026'));
		}
	}
});

test('o cartão preserva a prop, escapa texto e codifica o identificador do link', () => {
	const tarefa = Object.freeze({
		...exemplo,
		id: 'a/b?c',
		titulo: '<script>alert(1)</script>'
	});
	const antes = { ...tarefa };
	const html = render(TarefaCard, { props: { tarefa } }).body;
	assert.deepEqual(tarefa, antes);
	assert(!html.includes('<script>alert(1)</script>'));
	assert(html.includes('&lt;script>'));
	assert(html.includes('href="/tarefas/a%2Fb%3Fc"'));
});

test('o mesmo componente pode apresentar duas tarefas diferentes', () => {
	const primeira = { ...exemplo, id: '1', titulo: 'Primeira tarefa' };
	const segunda = { ...exemplo, id: '2', titulo: 'Segunda tarefa' };
	const primeiroHtml = render(TarefaCard, { props: { tarefa: primeira } }).body;
	const segundoHtml = render(TarefaCard, { props: { tarefa: segunda } }).body;
	assert(primeiroHtml.includes('Primeira tarefa'));
	assert(primeiroHtml.includes('href="/tarefas/1"'));
	assert(segundoHtml.includes('Segunda tarefa'));
	assert(segundoHtml.includes('href="/tarefas/2"'));
	assert(!segundoHtml.includes('Primeira tarefa'));
});
