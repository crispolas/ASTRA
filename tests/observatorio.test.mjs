import assert from 'node:assert/strict';
import { test } from 'node:test';
import { orientar, orientacaoAgora, setorDaRota, projetarX } from '../src/lib/visual/observatorio.ts';

test('detalhes e formulários mantêm o setor da rota sem criar novos endereços', () => {
	assert.equal(setorDaRota('/tarefas/7/editar'), 'tarefas');
	assert.equal(setorDaRota('/projetos/2'), 'projetos');
	assert.equal(setorDaRota('/quadro'), 'quadro');
});
test('o giro interpola a orientação e pode ser interrompido sem salto', () => {
	orientar('tarefas');
	assert.equal(orientacaoAgora(), -28);
	orientar('projetos', 800);
	const inicio = performance.now();
	assert.ok(Math.abs(orientacaoAgora(inicio) + 28) < .05);
	assert.ok(Math.abs(orientacaoAgora(inicio + 400) + 14) < .1);
	assert.equal(orientacaoAgora(inicio + 1000), 0);
	const antes = orientacaoAgora();
	orientar('quadro', 800);
	assert.ok(Math.abs(orientacaoAgora() - antes) < .1);
	orientar('quadro');
	assert.equal(orientacaoAgora(), 28);
});
test('projeção preserva a vista frontal e desloca planos conforme profundidade', () => {
	assert.equal(projetarX(500, 1000, 0), 500);
	assert.ok(projetarX(500, 1000, 20, 1) < projetarX(500, 1000, 20, .3));
	assert.ok(projetarX(500, 1000, -20) > 500);
});
