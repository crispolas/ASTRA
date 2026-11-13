import type {Status,Prioridade} from '../tipos';
export const nomesStatus = {'a-fazer':'A fazer','em-andamento':'Em andamento','em-revisao':'Em revisão',concluida:'Concluída'} satisfies Record<Status,string>;
export const opcoesStatus=Object.entries(nomesStatus).map(([valor,nome])=>({valor:valor as Status,nome}));
export const nomesPrioridade={baixa:'Baixa',media:'Média',alta:'Alta'} satisfies Record<Prioridade,string>;
export const opcoesPrioridade=Object.entries(nomesPrioridade).map(([valor,nome])=>({valor:valor as Prioridade,nome}));
