<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import { computed, ref } from 'vue'

// internal imports
import { BudgetUtil } from '~/utils/BudgetUtil'
import { CurrencyUtil } from '~/utils/CurrencyUtil'
import RenderingBadgeComponent from '~/components/RenderingBadgeComponent.vue'

// reactive variables
const rate = ref(1500)
const pieces = ref(2)
const usagePercent = ref(20)
const commissionPercent = ref(15)

// computed variables
const production = computed(() => BudgetUtil.getProduction(rate.value, pieces.value))

const usageRights = computed(() =>
  BudgetUtil.getPercentageAmount(production.value, usagePercent.value),
)

const commission = computed(() =>
  BudgetUtil.getPercentageAmount(production.value, commissionPercent.value),
)

const total = computed(() =>
  BudgetUtil.getTotal(rate.value, pieces.value, usagePercent.value, commissionPercent.value),
)
</script>

<template>
  <main class="calculator">
    <RenderingBadgeComponent rendering="CSR" />
    <h1>Budget calculator</h1>
    <p class="calculator__lead">
      Work out the budget of an order from the creator rate, the number of pieces, the usage rights
      and the agency commission. This tool runs only in the browser.
    </p>

    <div class="calculator__layout">
      <form class="calculator__form" @submit.prevent>
        <div class="calculator__field">
          <label class="calculator__label" for="rate">Creator rate per piece (COP)</label>
          <input
            id="rate"
            v-model.number="rate"
            class="calculator__input"
            type="number"
            min="0"
            step="100"
          />
        </div>

        <div class="calculator__field">
          <label class="calculator__label" for="pieces">Number of pieces</label>
          <input
            id="pieces"
            v-model.number="pieces"
            class="calculator__input"
            type="number"
            min="1"
            step="1"
          />
        </div>

        <div class="calculator__field">
          <label class="calculator__label" for="usage-rights">Usage rights (%)</label>
          <input
            id="usage-rights"
            v-model.number="usagePercent"
            class="calculator__input"
            type="number"
            min="0"
            max="200"
            step="5"
          />
        </div>

        <div class="calculator__field">
          <label class="calculator__label" for="commission">Agency commission (%)</label>
          <input
            id="commission"
            v-model.number="commissionPercent"
            class="calculator__input"
            type="number"
            min="0"
            max="100"
            step="5"
          />
        </div>
      </form>

      <section class="calculator__summary" aria-label="Order budget breakdown">
        <h2 class="calculator__summary-title">Order budget breakdown</h2>

        <dl class="calculator__list">
          <div class="calculator__row">
            <dt class="calculator__term">Production (rate × pieces)</dt>
            <dd class="calculator__value">{{ CurrencyUtil.format(production) }}</dd>
          </div>

          <div class="calculator__row">
            <dt class="calculator__term">Usage rights ({{ usagePercent || 0 }}%)</dt>
            <dd class="calculator__value">{{ CurrencyUtil.format(usageRights) }}</dd>
          </div>

          <div class="calculator__row">
            <dt class="calculator__term">Agency commission ({{ commissionPercent || 0 }}%)</dt>
            <dd class="calculator__value">{{ CurrencyUtil.format(commission) }}</dd>
          </div>

          <div class="calculator__row calculator__row--total">
            <dt class="calculator__term calculator__term--total">Total order budget</dt>
            <dd class="calculator__value calculator__value--total">
              {{ CurrencyUtil.format(total) }}
            </dd>
          </div>
        </dl>
      </section>
    </div>

    <NuxtLink to="/resources" class="calculator__back">← Back to resources</NuxtLink>
  </main>
</template>

<style scoped>
.calculator {
  padding: 1rem 0;
}

.calculator__lead {
  margin-bottom: 2rem;
  max-width: 70ch;
  color: var(--color-text);
  opacity: 0.8;
}

.calculator__layout {
  display: grid;
  gap: 1.5rem;
}

.calculator__form,
.calculator__summary {
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 14px;
  background: var(--color-background-soft);
}

.calculator__form {
  display: grid;
  gap: 1rem;
}

.calculator__field {
  display: grid;
  gap: 0.35rem;
}

.calculator__label {
  font-size: 0.85rem;
  color: var(--color-text);
}

.calculator__input {
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-heading);
  font: inherit;
}

.calculator__summary-title {
  margin-bottom: 1.25rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--color-heading);
}

.calculator__list {
  display: grid;
  gap: 0.85rem;
}

.calculator__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--color-border);
}

.calculator__row--total {
  padding-top: 0.25rem;
  padding-bottom: 0;
  border-bottom: none;
}

.calculator__term {
  color: var(--color-text);
  opacity: 0.75;
}

.calculator__term--total {
  font-weight: 600;
  color: var(--color-heading);
  opacity: 1;
}

.calculator__value {
  font-weight: 600;
  color: var(--color-heading);
}

.calculator__value--total {
  font-size: 1.2rem;
  color: var(--color-primary);
}

.calculator__back {
  display: inline-block;
  margin-top: 2rem;
  color: var(--color-primary);
  font-size: 0.9rem;
}

@media (min-width: 1024px) {
  .calculator__layout {
    grid-template-columns: repeat(2, 1fr);
    align-items: start;
  }
}
</style>
