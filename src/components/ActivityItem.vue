<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'default',
  },
})

const formattedTimestamp = computed(() =>
  new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(props.timestamp),
  ),
)
</script>

<template>
  <li class="activity-item">
    <span class="activity-item__dot" :class="type"></span>
    <div class="activity-item__body">
      <p class="activity-item__title">{{ title }}</p>
      <p class="activity-item__timestamp">{{ formattedTimestamp }}</p>
    </div>
  </li>
</template>

<style scoped>
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.5rem 0;
}

.activity-item__dot {
  margin-top: 0.4rem;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border-hover);
  flex-shrink: 0;
}

.activity-item__dot.milestone {
  background: var(--color-success);
}

.activity-item__dot.payment {
  background: var(--color-danger);
}

.activity-item__title {
  color: var(--color-heading);
}

.activity-item__timestamp {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
  margin-top: 0.15rem;
}
</style>
