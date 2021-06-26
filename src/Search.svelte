<script lang="ts">
  import type { SkillData } from './skill-data';
  import { skillData } from './skill-data';
  import { layers } from './stores';

  let job = '';
  let skillname = '';

  function addLayer(skill: SkillData) {
    return () => {
      layers.update((state) => [...state, skill]);
    };
  }

  $: skills = skillData.filter(
    (skill) =>
      skill.job.includes(job) &&
      skill.name.includes(skillname) &&
      !$layers.find((l) => l.location === skill.location),
  );
</script>

<main>
  <div class="search-container">
    <form>
      <span>직업</span>
      <input bind:value={job} class="job-input" />
      <span>스킬명</span>
      <input bind:value={skillname} class="skill-input" />
    </form>
    <div class="skill-list">
      {#each skills as skill}
        <div class="clickable" on:click={addLayer(skill)}>
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

  form {
    display: flex;
  }

  input {
    border: none;
    border-bottom: 1px solid black;
    margin-left: 8px;
    margin-right: 8px;
  }

  .skill-input {
    flex: 1 1 auto;
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
