import { onMount } from 'svelte';
/** Estado de leitura no componente, sem bloquear a navegação esperando o Render. */
export function criarColecao<T>(iniciais:T[],buscar:()=>Promise<T[]>,nome:string){
 let itens=$state<T[]>(iniciais),carregando=$state(iniciais.length===0),erro=$state('');
 let ativa=true,versao=0;
 async function carregar(mostrarEspera=true){
  const atual=++versao;
  if(mostrarEspera)carregando=true;
  erro='';
  try{const recebidos=await buscar();if(ativa&&atual===versao)itens=recebidos;}
  catch{if(ativa&&atual===versao)erro=`Não foi possível carregar ${nome}. Tente novamente em instantes.`;}
  finally{if(ativa&&atual===versao)carregando=false;}
 }
 onMount(()=>{void carregar();return()=>{ativa=false;versao++;};});
 return {get itens(){return itens},set itens(valor:T[]){itens=valor},get carregando(){return carregando},get erro(){return erro},carregar};
}
