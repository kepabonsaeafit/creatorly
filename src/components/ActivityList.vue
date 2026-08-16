<script setup>
import ActivityItem from '@/components/ActivityItem.vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <ul class="activity-list">
    <ActivityItem v-for="item in items" :key="item.id" v-bind="item" />
  </ul>
</template>

<style scoped>
.activity-list {
  list-style: none;
  padding: 0;
}

.activity-list > :not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}
</style>
