import {fly} from 'svelte/transition';
export function duracaoMovimento(ms:number){return typeof matchMedia!=='undefined'&&matchMedia('(prefers-reduced-motion: reduce)').matches?0:ms;}
export function entradaCartao(node:Element,{indice=0}={}){
 const duration=duracaoMovimento(240);
 return duration?fly(node,{y:12,duration,delay:Math.min(indice,10)*50}):{duration:0};
}
