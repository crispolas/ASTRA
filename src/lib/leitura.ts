type Opcoes = { fetcher?: typeof fetch; esperar?: (ms:number)=>Promise<void>; limiteMs?:number; tentativas?:number };
const pausa=(ms:number)=>new Promise<void>(resolve=>setTimeout(resolve,ms));
/** Somente GET: falhas temporárias podem ser repetidas; 404/validação não. */
export async function lerComTentativas(url:string,{fetcher=fetch,esperar=pausa,limiteMs=15000,tentativas=4}:Opcoes={}){
 for(let tentativa=0;tentativa<tentativas;tentativa++){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),limiteMs);
  let resposta:Response|undefined,erro:unknown;
  try{resposta=await fetcher(url,{signal:controller.signal});}catch(falha){erro=falha;}
  finally{clearTimeout(timer);}
  const temporaria=resposta&&[408,429,500,502,503,504].includes(resposta.status);
  if(resposta&&!temporaria)return resposta;
  if(tentativa===tentativas-1){if(resposta)return resposta;throw erro;}
  // Não conserva corpos de respostas temporárias durante o backoff.
  await resposta?.body?.cancel();
  await esperar(2000*2**tentativa);
 }
 throw new Error('Não foi possível consultar o servidor.');
}
