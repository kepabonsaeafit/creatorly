<script setup lang="ts">
// Author: Kevin Pabón

/** A NavBarComponent link to one of the three sections. */
interface NavLink {
  to: string
  label: string
}

// non-reactive variables
const LINKS: NavLink[] = [
  { to: '/blog', label: 'Blog' },
  { to: '/creators', label: 'Creators' },
  { to: '/resources', label: 'Resources' },
]
</script>

<template>
  <header class="navbar">
    <NuxtLink to="/" class="navbar__brand">
      <svg class="navbar__logo" viewBox="0 0 32 32" aria-hidden="true">
        <defs>
          <linearGradient id="navbar-logo-gradient" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0" stop-color="var(--brand-primary)" />
            <stop offset="1" stop-color="var(--brand-primary-dark)" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="9" fill="url(#navbar-logo-gradient)" />
        <g transform="scale(0.228571) translate(-47.875,10.125)">
          <path
            d="M 84.6 30.7 A 42 42 0 1 1 84.6 89.3"
            stroke="var(--brand-white)"
            stroke-width="15"
            stroke-linecap="round"
            fill="none"
          />
          <rect
            x="76"
            y="51"
            width="24"
            height="24"
            rx="2"
            transform="rotate(45 88 63)"
            fill="var(--brand-white)"
          />
        </g>
      </svg>
      <span class="navbar__wordmark">Creatorly</span>
    </NuxtLink>

    <nav class="navbar__links">
      <NuxtLink v-for="link in LINKS" :key="link.to" :to="link.to" class="navbar__link">
        {{ link.label }}
      </NuxtLink>
    </nav>
  </header>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 1rem;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 0.65rem 1.1rem;
  border-radius: 14px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 16px 32px -22px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.2rem;
  border-radius: 10px;
  transition: opacity 0.2s ease;
}

.navbar__brand:hover {
  background: transparent;
  opacity: 0.85;
}

.navbar__logo {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.navbar__wordmark {
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.01em;
  color: var(--color-heading);
}

.navbar__links {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.navbar__link {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  color: var(--color-text);
  font-size: 0.92rem;
  font-weight: 500;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.navbar__link:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.navbar__link.router-link-active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 600;
}
</style>
