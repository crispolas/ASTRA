import assert from 'node:assert/strict';
import { after, afterEach, before, test } from 'node:test';
import { createServer } from 'vite';

let server, render, Quadro, AlternarVisao, filtros;
before(async () => {
	server = await createServer({ logLevel: 'silent', server: { host: '127.0.0.1', port: 0 } });
	await server.listen();
	({ render } = await server.ssrLoadModule('svelte/server'));
	({ default: Quadro } = await server.ssrLoadModule('/src/routes/quadro/+page.svelte'));
	({ default: AlternarVisao } = await server.ssrLoadModule('/src/lib/components/AlternarVisao.svelte'));
	filtros = await server.ssrLoadModule('/src/lib/stores/filtros.ts');
});
after(async () => { await server?.close(); });
afterEach(() => {
	filtros.buscaTexto.set('');
	filtros.filtroStatus.set('');
	filtros.filtroPrioridade.set('');
});

const base = {
	projetoId: '1', descricao: 'Descrição de exemplo', responsavel: 'Gabriel', prazo: '2026-10-28'
};
const tarefas = [
	{ ...base, id: '1', titulo: 'Revisar relatório', status: 'em-andamento', prioridade: 'alta' },
	{ ...base, id: '2', titulo: 'Revisar apresentação', status: 'a-fazer', prioridade: 'alta' },
	{ ...base, id: '3', titulo: 'Revisar documentação', status: 'em-andamento', prioridade: 'baixa' },
	{ ...base, id: '4', titulo: 'Enviar relatório', status: 'concluida', prioridade: 'alta' }
].map(Object.freeze);

test('busca, status e prioridade se combinam sem alterar os dados recebidos', () => {
	const antes = structuredClone(tarefas);
	assert.deepEqual(filtros.aplicarFiltros(tarefas, 'REVISAR', 'em-andamento', 'alta'), [tarefas[0]]);
	assert.deepEqual(filtros.aplicarFiltros(tarefas, '', '', ''), tarefas);
	assert.deepEqual(filtros.aplicarFiltros(tarefas, 'REVISAR', 'concluida', 'alta'), []);
	assert.deepEqual(tarefas, antes);
});

test('o quadro usa os filtros compartilhados antes de agrupar e contar os cartões', () => {
	filtros.buscaTexto.set('REVISAR');
	filtros.filtroStatus.set('em-andamento');
	filtros.filtroPrioridade.set('alta');
	const html = render(Quadro, { props: { data: { tarefas } } }).body;
	assert.equal(html.match(/<article\b/g)?.length, 1);
	assert(html.includes('Revisar relatório'));
	assert(!html.includes('Revisar apresentação'));
	assert(!html.includes('Revisar documentação'));
	assert(!html.includes('Enviar relatório'));
	assert.equal(html.match(/data-status=/g)?.length, 4);
	assert(html.includes('aria-label="1 tarefas"'));
	assert(html.includes('id="busca-titulo"'));
	assert(html.includes('id="filtro-status"'));
	assert(html.includes('id="filtro-prioridade"'));
});

test('as duas visões oferecem links reais e identificam qual está aberta', () => {
	for (const [atual, href, nome] of [['lista', '/', 'Lista'], ['quadro', '/quadro', 'Quadro']]) {
		const html = render(AlternarVisao, { props: { atual } }).body;
		assert(html.includes('aria-label="Visualização de tarefas"'));
		assert(html.includes('href="/"'));
		assert(html.includes('href="/quadro"'));
		assert.match(html, new RegExp(`<a[^>]*href="${href}"[^>]*aria-current="page"[^>]*>${nome}</a>`));
	}
});
