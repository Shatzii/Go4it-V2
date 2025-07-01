<template>
  <div class="module-toggle">
    <label :for="moduleName" class="flex items-center">
      <span class="mr-2">{{ moduleName }}</span>
      <input type="checkbox" :id="moduleName" v-model="isActive" @change="updateModuleStatus" />
    </label>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  props: {
    moduleName: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const isActive = ref(false);

    const loadModuleStatus = async () => {
      try {
        const response = await fetch('/config.json');
        const config = await response.json();
        isActive.value = config.modules[props.moduleName] || false;
      } catch (error) {
        console.error('Error loading module status:', error);
      }
    };

    const updateModuleStatus = async () => {
      const updatedConfig = {
        ...config,
        modules: {
          ...config.modules,
          [props.moduleName]: isActive.value
        }
      };

      try {
        await axios.post('/update-config', updatedConfig);
      } catch (error) {
        console.error('Error updating module status:', error);
      }
    };

    onMounted(loadModuleStatus);

    return {
      isActive,
      updateModuleStatus
    };
  }
};
</script>

<style scoped>
.module-toggle {
  @apply flex items-center justify-between p-2;
}
</style>