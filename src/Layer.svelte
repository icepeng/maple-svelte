<script lang="ts">
  import type { SkillData } from './skill-data';
  import { layers } from './stores';

  function removeLayer(skill: SkillData) {
    return () => {
      layers.update((state) =>
        state.filter((x) => x.location !== skill.location),
      );
    };
  }
</script>

<main>
  <div class="search-container">
    <div class="skill-list">
      {#each $layers as skill}
        <div class="clickable" on:click={removeLayer(skill)}>
          {skill.job} | {skill.name}
        </div>
      {/each}
    </div>
  </div>
</main>

<style>
  .search-container {
    border: solid 1px #ccc;
    border-radius: 0px 0px 4px;
    background: white;
    padding: 20px 10px;
    font-size: 14px;
  }

  .skill-list {
    height: 320px;
    overflow-y: scroll;
  }

  .clickable {
    cursor: pointer;
  }
  .clickable:hover {
    background: rgba(0, 0, 0, 0.04);
  }
</style>
