<template>
  <div class="icon-times">
    <svg :class="iconClass" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M4 4L20 20M20 4L4 20"
          stroke="#000000"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
    </svg>
  </div>
</template>

<script setup>
const props = defineProps({
  stroke: { type: String, default: '#000000' },
  iconClass: { type: String, default: 'h-5' }
})
</script>
