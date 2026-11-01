<script setup lang="ts">
// Author: Felipe Gómez

// external imports
import { ref } from 'vue'

// internal imports
import { CalculatorUtil } from '~/utils/CalculatorUtil'
import type { CalculatorOperator } from '~/utils/CalculatorUtil'

// non-reactive variables
const keys = ['7', '8', '9', '÷', '4', '5', '6', '×', '1', '2', '3', '-', '0', '.', '=', '+']

// reactive variables
const display = ref('0')
const firstNumber = ref<number | null>(null)
const operator = ref<CalculatorOperator | null>(null)
// true right after choosing an operator or getting a result, so the next
// digit starts a new number instead of extending the one on the display
const startsNewNumber = ref(false)

// functions
function press(key: string): void {
  if (CalculatorUtil.isOperator(key)) {
    chooseOperator(key)
  } else if (key === '=') {
    showResult()
  } else {
    typeKey(key)
  }
}

function typeKey(key: string): void {
  if (startsNewNumber.value || display.value === CalculatorUtil.ERROR) {
    display.value = key === '.' ? '0.' : key
    startsNewNumber.value = false
    return
  }

  display.value = CalculatorUtil.appendKey(display.value, key)
}

function chooseOperator(nextOperator: CalculatorOperator): void {
  if (operator.value && !startsNewNumber.value) {
    showResult()
  }
  if (display.value === CalculatorUtil.ERROR) {
    return
  }

  firstNumber.value = Number(display.value)
  operator.value = nextOperator
  startsNewNumber.value = true
}

function showResult(): void {
  if (firstNumber.value === null || !operator.value) {
    return
  }

  display.value = CalculatorUtil.calculate(firstNumber.value, Number(display.value), operator.value)
  firstNumber.value = null
  operator.value = null
  startsNewNumber.value = true
}

function clear(): void {
  display.value = '0'
  firstNumber.value = null
  operator.value = null
  startsNewNumber.value = false
}

// hooks
useHead({ title: 'Calculator' })
</script>

<template>
  <NuxtLink to="/other" class="btn btn-outline-secondary btn-sm mb-4">← Other</NuxtLink>

  <div class="row justify-content-center">
    <div class="col-12 col-sm-8 col-md-6 col-lg-4">
      <h1 class="h2 fw-bold mb-3">Calculator</h1>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="bg-body-tertiary rounded p-3 mb-3 text-end">
            <small class="d-block text-body-secondary" style="min-height: 1.5em">
              <template v-if="operator">{{ firstNumber }} {{ operator }}</template>
            </small>
            <output class="d-block display-6 fw-semibold text-truncate">{{ display }}</output>
          </div>

          <div class="row g-2">
            <div class="col-12">
              <button type="button" class="btn btn-outline-danger w-100" @click="clear">C</button>
            </div>
            <div v-for="key in keys" :key="key" class="col-3">
              <button
                type="button"
                class="btn w-100 py-3"
                :class="
                  CalculatorUtil.isOperator(key) || key === '=' ? 'btn-primary' : 'btn-light border'
                "
                @click="press(key)"
              >
                {{ key }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
