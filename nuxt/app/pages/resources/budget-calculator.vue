<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import { computed, ref } from 'vue'

// internal imports
import { BudgetUtil } from '~/utils/BudgetUtil'
import { CurrencyUtil } from '~/utils/CurrencyUtil'

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
  BudgetUtil.getTotal(production.value, usageRights.value, commission.value),
)

// hooks
useHead({ title: 'Budget calculator' })
</script>

<template>
  <NuxtLink to="/resources" class="btn btn-outline-secondary btn-sm mb-4">
    ← All resources
  </NuxtLink>

  <header class="mb-4">
    <h1 class="h2 fw-bold mb-1">Budget calculator</h1>
    <p class="text-body-secondary mb-0">
      Work out the budget of an order from the creator rate, the number of pieces, the usage rights
      and the agency commission.
    </p>
  </header>

  <div class="row g-4 align-items-start">
    <div class="col-12 col-lg-6">
      <form class="card card-body" @submit.prevent>
        <div class="mb-3">
          <label class="form-label" for="rate">Creator rate per piece (COP)</label>
          <input
            id="rate"
            v-model.number="rate"
            class="form-control"
            type="number"
            min="0"
            step="100"
          />
        </div>

        <div class="mb-3">
          <label class="form-label" for="pieces">Number of pieces</label>
          <input
            id="pieces"
            v-model.number="pieces"
            class="form-control"
            type="number"
            min="1"
            step="1"
          />
        </div>

        <div class="mb-3">
          <label class="form-label" for="usage-rights">Usage rights (%)</label>
          <input
            id="usage-rights"
            v-model.number="usagePercent"
            class="form-control"
            type="number"
            min="0"
            max="200"
            step="5"
          />
        </div>

        <div>
          <label class="form-label" for="commission">Agency commission (%)</label>
          <input
            id="commission"
            v-model.number="commissionPercent"
            class="form-control"
            type="number"
            min="0"
            max="100"
            step="5"
          />
        </div>
      </form>
    </div>

    <section class="col-12 col-lg-6" aria-label="Order budget breakdown">
      <div class="card">
        <div class="card-body">
          <h2 class="h5 fw-bold">Order budget breakdown</h2>
          <ul class="list-group list-group-flush">
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-body-secondary">Production (rate × pieces)</span>
              <span class="fw-semibold">{{ CurrencyUtil.format(production) }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-body-secondary">Usage rights</span>
              <span class="fw-semibold">{{ CurrencyUtil.format(usageRights) }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="text-body-secondary">Agency commission</span>
              <span class="fw-semibold">{{ CurrencyUtil.format(commission) }}</span>
            </li>
            <li class="list-group-item d-flex justify-content-between">
              <span class="fw-bold">Total order budget</span>
              <span class="fw-bold text-primary">{{ CurrencyUtil.format(total) }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
