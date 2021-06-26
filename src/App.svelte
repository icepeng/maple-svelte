<script lang="ts">
  import Canvas from './Canvas.svelte';
  import Layer from './Layer.svelte';
  import Search from './Search.svelte';
</script>

<main>
  <div class="wrapper">
    <h1>스킬 범위</h1>
    <Canvas />
    <div class="container">
      <div class="layer">
        <Layer />
      </div>
      <div class="search">
        <Search />
      </div>
    </div>
  </div>
</main>

<style>
  .wrapper {
    margin: 20px;
    font-family: 'Noto sans KR';
  }

  .container {
    display: flex;
    align-items: flex-start;
    width: 1366px;
    margin-top: 12px;
  }

  .layer {
    width: 480px;
    box-sizing: border-box;
  }

  .search {
    flex: 1 1 auto;
    margin-left: 12px;
  }
</style>
