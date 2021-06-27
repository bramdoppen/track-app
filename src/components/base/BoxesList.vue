<template>
  <div class="list">
    <slot></slot>
  </div>
</template>

<style scoped>
  .list {
    display: flex;
    flex-direction: column;
    & >>> > * + * {
      margin-top: 20px;
    }
  }
</style>
