<script lang="ts">
 import {onMount} from 'svelte';
 let {nome='tarefas',modo='lista'}:{nome?:string;modo?:'lista'|'quadro'}=$props();
 let acordando=$state(false);
 onMount(()=>{const timer=setTimeout(()=>acordando=true,3000);return()=>clearTimeout(timer);});
</script>
<div class="carregamento" aria-busy="true">
 <p class="astra-muted" role="status">{acordando?'Acordando o servidor… isso pode levar até um minuto.':`Carregando ${nome}…`}</p>
 <div class="esqueletos" class:quadro={modo==='quadro'} aria-hidden="true">
  {#each Array(modo==='quadro'?4:6) as _,i (i)}
   <div class="esqueleto"><span class="barra titulo"></span><span class="barra"></span><span class="barra curta"></span><div class="metadados"><span></span><span></span><span></span></div></div>
  {/each}
 </div>
</div>
<style>
 .carregamento{width:100%}.carregamento p{margin:0 0 20px;font:400 14px var(--obs-ui,inherit);color:var(--obs-tinta-3,#a9adb8)}
 .esqueletos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 24px}
 /* fichas de canto reto, como os cartões */
 .esqueleto{position:relative;min-height:250px;padding:32px;border:1px solid var(--obs-fio,#383a40);
  background:linear-gradient(var(--obs-tinta-3),var(--obs-tinta-3)) top left/10px 1px no-repeat,linear-gradient(var(--obs-tinta-3),var(--obs-tinta-3)) top left/1px 10px no-repeat,
   linear-gradient(var(--obs-tinta-3),var(--obs-tinta-3)) bottom right/10px 1px no-repeat,linear-gradient(var(--obs-tinta-3),var(--obs-tinta-3)) bottom right/1px 10px no-repeat,rgba(12,13,17,.6)}
 /* linhas de pontos que acendem em onda, como estrelas se condensando */
 .barra,.metadados span{display:block;height:9px;margin-bottom:22px;
  background:radial-gradient(circle,rgba(220,232,255,.55) .9px,transparent 1.3px) 0 50%/6px 6px repeat-x;
  -webkit-mask:linear-gradient(90deg,rgba(0,0,0,.25) 0 35%,#000 50%,rgba(0,0,0,.25) 65% 100%) 0 0/300% 100%;
  mask:linear-gradient(90deg,rgba(0,0,0,.25) 0 35%,#000 50%,rgba(0,0,0,.25) 65% 100%) 0 0/300% 100%;
  animation:condensar 1.8s ease-in-out infinite}
 .titulo{width:58%;height:12px;background-size:7px 7px}.curta{width:55%}
 .metadados{display:flex;gap:18px;margin-top:35px}.metadados span{width:28%;margin:0}
 .esqueleto:nth-child(2) :is(.barra,.metadados span){animation-delay:.25s}
 .esqueleto:nth-child(3) :is(.barra,.metadados span){animation-delay:.5s}
 .esqueleto:nth-child(4) :is(.barra,.metadados span){animation-delay:.75s}
 .quadro{grid-template-columns:repeat(4,minmax(0,1fr))}.quadro .esqueleto{min-height:380px}
 @keyframes condensar{from{-webkit-mask-position:100% 0;mask-position:100% 0}to{-webkit-mask-position:0 0;mask-position:0 0}}
 @media(max-width:1100px){.quadro{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:760px){.esqueletos,.quadro{grid-template-columns:1fr}}
 @media(prefers-reduced-motion:reduce){.barra,.metadados span{animation:none}}
</style>
