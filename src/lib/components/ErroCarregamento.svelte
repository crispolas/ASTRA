<script lang="ts">
 let {mensagem,tentar}:{mensagem:string;tentar:()=>void}=$props();
</script>
<div class="erro-leitura"><p class="astra-error" role="alert">{mensagem}</p><button class="astra-pill" type="button" onclick={tentar}>Tentar novamente</button></div>
<style>.erro-leitura{display:grid;justify-items:start;gap:16px}.erro-leitura p{margin:0}</style>
