import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { excluirTarefa } from '../src/lib/api.ts';

const fetchOriginal = globalThis.fetch;
afterEach(() => { globalThis.fetch = fetchOriginal; });

test('excluirTarefa envia DELETE com ID codificado e aceita 204 sem tentar ler JSON', async () => {
	globalThis.fetch = async (url, opcoes) => {
		assert.equal(url, 'http://localhost:3000/tarefas/a%2Fb%3Fc');
		assert.equal(opcoes.method, 'DELETE');
		assert.equal(opcoes.body, undefined);
		return { ok: true, status: 204, json() { throw new Error('204 não contém JSON'); } };
	};
	assert.equal(await excluirTarefa('a/b?c'), undefined);
});

test('excluirTarefa também aceita sucesso com corpo JSON sem depender desse corpo', async () => {
	globalThis.fetch = async () => Response.json({ id: '1' });
	assert.equal(await excluirTarefa('1'), undefined);
});

test('excluirTarefa rejeita erro HTTP e propaga falha de rede', async () => {
	globalThis.fetch = async () => new Response(null, { status: 500, statusText: 'Internal Server Error' });
	await assert.rejects(excluirTarefa('1'), /500 Internal Server Error/);
	const falha = new TypeError('Rede indisponível');
	globalThis.fetch = async () => { throw falha; };
	await assert.rejects(excluirTarefa('1'), (erro) => erro === falha);
});
