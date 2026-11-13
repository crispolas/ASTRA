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
 .carregamento{width:100%}.carregamento p{margin:0 0 20px;font-size:14px}
 .esqueletos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 24px}
 .esqueleto{position:relative;overflow:hidden;min-height:250px;padding:32px;border:1px solid #383a40;border-radius:12px;background:#121315}
 .esqueleto::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,#ffffff08,transparent);transform:translateX(-100%);animation:shimmer 1800ms ease-in-out infinite}
 .barra{display:block;height:14px;border-radius:8px;background:#292b30;margin-bottom:22px}.titulo{width:72%;height:23px}.curta{width:55%}
 .metadados{display:flex;gap:18px;margin-top:35px}.metadados span{background:#25272b;width:28%;height:34px;border-radius:10px}
 .quadro{grid-template-columns:repeat(4,minmax(0,1fr))}.quadro .esqueleto{min-height:380px}
 @keyframes shimmer{to{transform:translateX(100%)}}
 @media(max-width:1100px){.quadro{grid-template-columns:repeat(2,minmax(0,1fr))}}
 @media(max-width:760px){.esqueletos,.quadro{grid-template-columns:1fr}}
 @media(prefers-reduced-motion:reduce){.esqueleto::after{animation:none;display:none}}
</style>
