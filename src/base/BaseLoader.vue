<template>
  <div class="flex justify-center">
    <div class="spinner h-20 w-20"></div>
    <div></div>
  </div>
</template>

<script setup></script>

<style scoped>
.spinner {
  border-radius: 50%;
  border: 5px solid;
  border-color: #dbdcef;
  border-right-color: #883ae1;
  animation: spinner-d3wgkg 1s infinite linear;
}

@keyframes spinner-d3wgkg {
  to {
    transform: rotate(1turn);
  }
}
</style>
