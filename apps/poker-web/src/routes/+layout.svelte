<script>
  import '$lib/base.css'
</script>

<slot />

<style lang="postcss">
  :global(html) {
    color: theme('colors.stone.100');
    background-color: theme('colors.zinc.950');
    font-family: 'Inter', sans-serif;
  }
</style>