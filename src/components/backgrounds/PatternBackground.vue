<script setup lang="ts">
import { computed } from 'vue'

type PatternDirection =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
type PatternVariant = 'grid' | 'dot' | 'big-dot'
type PatternSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type PatternMask = 'none' | 'ellipse' | 'ellipse-top'

const props = withDefaults(
  defineProps<{
    animate?: boolean
    direction?: PatternDirection
    variant?: PatternVariant
    size?: PatternSize
    mask?: PatternMask
    speed?: number
  }>(),
  {
    animate: false,
    direction: 'bottom',
    variant: 'big-dot',
    size: 'md',
    mask: 'ellipse',
    speed: 25000,
  }
)

const rootClasses = computed(() => [
  'pattern-background',
  `pattern-background--${props.variant}`,
  `pattern-background--${props.size}`,
  `pattern-background--${props.direction}`,
  `pattern-background--mask-${props.mask}`,
  { 'pattern-background--animated': props.animate },
])
</script>

<template>
  <div :class="rootClasses" :style="{ animationDuration: `${speed}ms` }">
    <slot />
  </div>
</template>

<style scoped>
/* Adapted from Inspira UI's PatternBackground without adding its UI dependencies. */
.pattern-background {
  --pattern-color: rgba(183, 201, 223, 0.24);
  --pattern-dot-size: 2px;
  --pattern-size: 24px;
  --pattern-start: 0 0;
  --pattern-end: 0 var(--pattern-size);
  background-repeat: repeat;
  pointer-events: none;
}

.pattern-background--grid {
  background-image:
    linear-gradient(to right, var(--pattern-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--pattern-color) 1px, transparent 1px);
}

.pattern-background--dot {
  --pattern-dot-size: 1.5px;
  background-image: radial-gradient(circle, var(--pattern-color) var(--pattern-dot-size), transparent calc(var(--pattern-dot-size) + 0.5px));
}

.pattern-background--big-dot {
  background-image: radial-gradient(circle, var(--pattern-color) var(--pattern-dot-size), transparent calc(var(--pattern-dot-size) + 0.5px));
}

.pattern-background--xs { --pattern-size: 8px; }
.pattern-background--sm { --pattern-size: 16px; }
.pattern-background--md { --pattern-size: 24px; }
.pattern-background--lg { --pattern-size: 32px; }
.pattern-background--xl { --pattern-size: 40px; }

.pattern-background {
  background-size: var(--pattern-size) var(--pattern-size);
}

.pattern-background--top { --pattern-start: 0 var(--pattern-size); --pattern-end: 0 0; }
.pattern-background--left { --pattern-start: var(--pattern-size) 0; --pattern-end: 0 0; }
.pattern-background--right { --pattern-start: 0 0; --pattern-end: var(--pattern-size) 0; }
.pattern-background--top-right { --pattern-start: var(--pattern-size) var(--pattern-size); --pattern-end: 0 0; }
.pattern-background--top-left { --pattern-start: 0 var(--pattern-size); --pattern-end: var(--pattern-size) 0; }
.pattern-background--bottom-right { --pattern-start: var(--pattern-size) 0; --pattern-end: 0 var(--pattern-size); }
.pattern-background--bottom-left { --pattern-start: 0 0; --pattern-end: var(--pattern-size) var(--pattern-size); }

.pattern-background--mask-ellipse {
  mask-image: radial-gradient(ellipse at center, #000 24%, transparent 88%);
  -webkit-mask-image: radial-gradient(ellipse at center, #000 24%, transparent 88%);
}

.pattern-background--mask-ellipse-top {
  mask-image: radial-gradient(ellipse at 50% 0, #000 18%, transparent 82%);
  -webkit-mask-image: radial-gradient(ellipse at 50% 0, #000 18%, transparent 82%);
}

.pattern-background--animated {
  animation-name: pattern-scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes pattern-scroll {
  from { background-position: var(--pattern-start); }
  to { background-position: var(--pattern-end); }
}

@media (prefers-reduced-motion: reduce) {
  .pattern-background--animated { animation: none; }
}
</style>
