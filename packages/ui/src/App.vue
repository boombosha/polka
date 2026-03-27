<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';

const version = __POLKA_VERSION__;
const route = useRoute();

const tabs = [
  { path: '/wxh', label: 'WxH' },
  { path: '/avatars', label: 'Аватары' },
];

const activePath = computed(() => route.path);
</script>

<template>
  <div class="page">
    <header class="header">
      <div class="header__top">
        <h1 class="logo">Polka</h1>
        <span class="version">v{{ version }}</span>
      </div>
      <a class="api-link" href="/docs" target="_blank" rel="noopener noreferrer">Документация API</a>
      <nav class="tabs" aria-label="Разделы">
        <RouterLink v-for="t in tabs" :key="t.path" :to="t.path" class="tab" :class="{ 'tab--active': activePath === t.path }">
          {{ t.label }}
        </RouterLink>
      </nav>
    </header>

    <main class="main">
      <div class="column">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style>
:root {
  --bg: #f6f4ef;
  --surface: #fffdfa;
  --ink: #1c1917;
  --muted: #57534e;
  --accent: #c2410c;
  --accent-soft: #fed7aa;
  --border: #e7e5e4;
  --radius: 12px;
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-display: 'Instrument Serif', Georgia, serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--font-sans);
  color: var(--ink);
  background: radial-gradient(1200px 800px at 10% -10%, #fff7ed 0%, transparent 55%), radial-gradient(900px 600px at 100% 0%, #fce7f3 0%, transparent 45%), var(--bg);
}

#app {
  min-height: 100vh;
}

.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding: 1.75rem clamp(1rem, 4vw, 2rem) 1rem;
  border-bottom: 1px solid var(--border);
  background: rgba(255, 253, 250, 0.72);
  backdrop-filter: blur(10px);
}

.header__top {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.logo {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1;
}

.version {
  font-size: 0.875rem;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.api-link {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
}

.api-link:hover {
  text-decoration: underline;
}

.tabs {
  display: flex;
  gap: 0.25rem;
  margin-top: 1.25rem;
  padding: 0.2rem;
  background: var(--border);
  border-radius: 999px;
  width: fit-content;
}

.tab {
  padding: 0.45rem 1.15rem;
  border-radius: 999px;
  text-decoration: none;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;
}

.tab:hover {
  color: var(--ink);
}

.tab--active {
  background: var(--surface);
  color: var(--ink);
  box-shadow: 0 1px 3px rgba(28, 25, 23, 0.08);
}

.main {
  flex: 1;
  padding: 1.5rem clamp(1rem, 4vw, 2rem) 3rem;
}

.column {
  max-width: 42rem;
  margin: 0 auto;
}
</style>
