<|vq_10456|>template
<template>
  <div class="sidebar bg-gray-800 text-white w-64 h-full">
    <h2 class="text-2xl font-bold p-4">Control Panel</h2>
    <nav class="flex flex-col">
      <router-link to="/xp" class="p-4 hover:bg-gray-700">XP</router-link>
      <router-link to="/coach" class="p-4 hover:bg-gray-700">Coach</router-link>
      <router-link to="/voice" class="p-4 hover:bg-gray-700">Voice</router-link>
      <!-- Add more navigation links as needed -->
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
}
</script>

<style scoped>
.sidebar {
  transition: width 0.3s;
}
</style>