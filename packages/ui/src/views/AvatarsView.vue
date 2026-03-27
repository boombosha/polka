<script setup></script>

<template>
  <section class="card">
    <h2 class="card__title">Аватары</h2>
    <p class="muted">Раздел в разработке. Здесь появится конструктор ссылок, когда API аватаров будет готово.</p>
  </section>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.35rem;
  box-shadow: 0 14px 40px -24px rgba(28, 25, 23, 0.35);
}

.card__title {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.muted {
  margin: 0;
  color: var(--muted);
  line-height: 1.5;
  font-size: 0.95rem;
}
</style>
