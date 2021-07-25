<template>
  <div class="list-item">
    <div class="list-content">
      <slot></slot>
    </div>
    <div class="list-buttons">
      <button v-if="edit" @click="edit()">Edit</button>
      <button v-if="remove" @click="remove()">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.list-item {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
}
</style>