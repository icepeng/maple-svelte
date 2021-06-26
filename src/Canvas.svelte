<script lang="ts">
  import { onMount } from 'svelte';
  import type { SkillData } from './skill-data';
  import { layers } from './stores';

  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D;
  let isDrag = false;
  let zoom = 1;
  let needDraw = false;
  const images: Record<string, HTMLImageElement> = {};

  $: if (needDraw) {
    draw($layers);
  }

  $: Promise.all($layers.map((layer) => loadImage(layer.location))).then(() =>
    draw($layers),
  );

  onMount(async () => {
    ctx = canvas.getContext('2d');
    ctx.font = '500 22px Noto Sans KR, sans-serif';
    ctx.translate(683, 600);

    await loadImage('assets/chtr.png');
    draw([]);
  });

  function handleMouseDown(e: MouseEvent) {
    isDrag = true;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!isDrag) {
      return;
    }
    ctx.translate(e.movementX, e.movementY);
    needDraw = true;
  }

  function handleMouseUp(e: MouseEvent) {
    isDrag = false;
  }

  function handleMouseWheel(e: WheelEvent) {
    e.preventDefault();
    const updatedZoom =
      e.deltaY > 0 ? Math.max(zoom - 0.05, 0.5) : Math.min(zoom + 0.05, 1);
    ctx.scale(updatedZoom / zoom, updatedZoom / zoom);
    zoom = updatedZoom;

    needDraw = true;
  }

  function loadImage(location: string) {
    if (images[location] && images[location].complete) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      images[location] = new Image();
      images[location].onload = () => resolve(images[location]);
      images[location].onerror = (err) => reject(err);
      images[location].src = location;
    });
  }

  function draw(layers: SkillData[]) {
    if (!ctx) {
      return;
    }

    const transform = ctx.getTransform();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawInit();
    drawGrid(transform);
    ctx.setTransform(transform);

    for (const layer of layers) {
      drawSkill(layer);
    }
    for (const layer of layers) {
      drawSkillRect(layer);
    }
    drawChtr();

    needDraw = false;
  }

  function drawInit() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.textAlign = 'end';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`${zoom.toFixed(2)}x`, ctx.canvas.width, ctx.canvas.height);
  }

  function drawGrid(transform: DOMMatrix) {
    const { a: zoom, e: translateX, f: translateY } = transform;
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([2]);
    ctx.beginPath();
    for (
      let x = translateX % (100 * zoom);
      x <= ctx.canvas.width;
      x += 100 * zoom
    ) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, ctx.canvas.height);
    }
    for (
      let y = translateY % (100 * zoom);
      y <= ctx.canvas.height;
      y += 100 * zoom
    ) {
      ctx.moveTo(0, y);
      ctx.lineTo(ctx.canvas.width, y);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
  }

  function drawImage(
    location: string,
    originX: number,
    originY: number,
    scale: number = 100,
  ) {
    const img = images[location];
    ctx.globalAlpha = 0.5;
    ctx.drawImage(
      img,
      -(originX * scale) / 100,
      -(originY * scale) / 100,
      (img.width * scale) / 100,
      (img.height * scale) / 100,
    );
    ctx.globalAlpha = 1;
  }

  function drawSkill(layer: SkillData) {
    drawImage(layer.location, layer.origin.x, layer.origin.y, layer.scale);
  }

  function drawSkillRect(layer: SkillData) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'black';
    ctx.strokeRect(
      layer.lt.x,
      layer.lt.y,
      layer.rb.x - layer.lt.x,
      layer.rb.y - layer.lt.y,
    );
    if (layer.lt2) {
      ctx.strokeRect(
        layer.lt2.x,
        layer.lt2.y,
        layer.rb2.x - layer.lt2.x,
        layer.rb2.y - layer.lt2.y,
      );
    }
    if (layer.lt3) {
      ctx.strokeRect(
        layer.lt3.x,
        layer.lt3.y,
        layer.rb3.x - layer.lt3.x,
        layer.rb3.y - layer.lt3.y,
      );
    }
    if (layer.hit_lt) {
      ctx.setLineDash([6]);
      ctx.strokeRect(
        layer.hit_lt.x,
        layer.hit_lt.y,
        layer.hit_rb.x - layer.hit_lt.x,
        layer.hit_rb.y - layer.hit_lt.y,
      );
      ctx.setLineDash([]);
    }
    ctx.textAlign = 'start';
    ctx.textBaseline = 'bottom';
    ctx.fillText(layer.name, layer.lt.x, layer.lt.y - 5);

    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'black';
  }

  function drawChtr() {
    drawImage('assets/chtr.png', 42, 60);
  }
</script>

<main>
  <canvas
    bind:this={canvas}
    on:mousedown={handleMouseDown}
    on:mousemove={handleMouseMove}
    on:mouseup={handleMouseUp}
    on:wheel={handleMouseWheel}
    width="1366"
    height="768"
  />
</main>

<style>
  canvas {
    border: 1px solid black;
  }
</style>
