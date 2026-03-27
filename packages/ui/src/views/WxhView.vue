<script setup>
import { computed, ref } from 'vue';

const baseUrl = ref(typeof window !== 'undefined' ? window.location.origin : '');
const width = ref(400);
const height = ref(300);
const usePathText = ref(false);
const pathText = ref('Hello');
const queryText = ref('');
const bg = ref('cccccc');
const fg = ref('333333');
const rounded = ref(0);
const font = ref('');
const gradient = ref('');

function encodePathSegment(s) {
  return encodeURIComponent(s).replace(/%20/g, '+');
}

const builtPath = computed(() => {
  const w = String(width.value).trim();
  const h = String(height.value).trim();
  let p = `/wxh/${w}/${h}`;
  if (usePathText.value && pathText.value !== '') {
    p += `/${encodePathSegment(pathText.value)}`;
  }
  const q = new URLSearchParams();
  if (!usePathText.value && queryText.value !== '') q.set('text', queryText.value);
  if (bg.value.trim()) q.set('bg', bg.value.replace(/^#/, ''));
  if (fg.value.trim()) q.set('fg', fg.value.replace(/^#/, ''));
  if (rounded.value > 0) q.set('rounded', String(rounded.value));
  if (font.value.trim()) q.set('font', font.value.trim());
  if (gradient.value.trim()) q.set('gradient', gradient.value.trim());
  const qs = q.toString();
  return qs ? `${p}?${qs}` : p;
});

const fullUrl = computed(() => {
  const b = baseUrl.value.replace(/\/$/, '');
  return b ? `${b}${builtPath.value}` : builtPath.value;
});

const copyState = ref('');

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(fullUrl.value);
    copyState.value = 'Скопировано';
    setTimeout(() => {
      copyState.value = '';
    }, 2000);
  } catch {
    copyState.value = 'Не удалось скопировать';
  }
}
</script>

<template>
  <section class="card">
    <h2 class="card__title">Плейсхолдер WxH</h2>
    <p class="card__hint">Соберите URL для SVG-картинки заданного размера.</p>

    <label class="field">
      <span class="field__label">Базовый URL (для копирования)</span>
      <input v-model="baseUrl" type="text" class="field__input" autocomplete="off" placeholder="http://localhost:4700" />
    </label>

    <div class="row">
      <label class="field field--half">
        <span class="field__label">Ширина</span>
        <input v-model.number="width" type="number" min="1" class="field__input" />
      </label>
      <label class="field field--half">
        <span class="field__label">Высота</span>
        <input v-model.number="height" type="number" min="1" class="field__input" />
      </label>
    </div>

    <label class="field field--check">
      <input v-model="usePathText" type="checkbox" />
      <span>Текст в пути URL</span>
    </label>

    <label v-if="usePathText" class="field">
      <span class="field__label">Текст (в пути)</span>
      <input v-model="pathText" type="text" class="field__input" />
    </label>
    <label v-else class="field">
      <span class="field__label">Текст (query <code>text</code>)</span>
      <input v-model="queryText" type="text" class="field__input" />
    </label>

    <div class="row">
      <label class="field field--half">
        <span class="field__label">Фон <code>bg</code> (hex)</span>
        <input v-model="bg" type="text" class="field__input" placeholder="cccccc" />
      </label>
      <label class="field field--half">
        <span class="field__label">Текст <code>fg</code> (hex)</span>
        <input v-model="fg" type="text" class="field__input" placeholder="333333" />
      </label>
    </div>

    <div class="row">
      <label class="field field--half">
        <span class="field__label">Скругление <code>rounded</code></span>
        <input v-model.number="rounded" type="number" min="0" class="field__input" />
      </label>
      <label class="field field--half">
        <span class="field__label">Шрифт <code>font</code></span>
        <input v-model="font" type="text" class="field__input" placeholder="по умолчанию" />
      </label>
    </div>

    <label class="field">
      <span class="field__label">Градиент <code>gradient</code> (h|v-c1-c2)</span>
      <input v-model="gradient" type="text" class="field__input" placeholder="h-3498db-2ecc71" />
    </label>

    <div class="url-row">
      <label class="field field--grow">
        <span class="field__label">Итоговый URL</span>
        <input :value="fullUrl" type="text" readonly class="field__input field__input--mono" />
      </label>
      <button type="button" class="btn" @click="copyUrl">{{ copyState || 'Копировать' }}</button>
    </div>

    <div class="preview">
      <span class="field__label">Превью</span>
      <div class="preview__box">
        <img :src="builtPath" alt="Превью плейсхолдера" class="preview__img" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.35rem 1.35rem 1.5rem;
  box-shadow: 0 14px 40px -24px rgba(28, 25, 23, 0.35);
}

.card__title {
  margin: 0 0 0.35rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.card__hint {
  margin: 0 0 1.1rem;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.45;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 0.85rem;
}

.field--check {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.65rem;
}

.field__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--muted);
}

.field__label code {
  font-size: 0.85em;
  font-weight: 600;
  color: var(--accent);
}

.field__input {
  font: inherit;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: #fff;
}

.field__input:focus {
  outline: 2px solid var(--accent-soft);
  border-color: var(--accent);
}

.field__input--mono {
  font-family: ui-monospace, monospace;
  font-size: 0.82rem;
}

.row {
  display: flex;
  gap: 0.75rem;
}

.field--half {
  flex: 1;
}

.field--grow {
  flex: 1;
  margin-bottom: 0;
}

.url-row {
  display: flex;
  gap: 0.75rem;
  align-items: flex-end;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}

.btn {
  flex-shrink: 0;
  font: inherit;
  font-weight: 600;
  padding: 0.55rem 1rem;
  border: none;
  border-radius: 8px;
  background: var(--accent);
  color: #fff;
  cursor: pointer;
}

.btn:hover {
  filter: brightness(1.05);
}

.preview__box {
  margin-top: 0.35rem;
  padding: 1rem;
  border-radius: 8px;
  background: repeating-linear-gradient(45deg, #fafaf9, #fafaf9 8px, #f5f5f4 8px, #f5f5f4 16px);
  border: 1px dashed var(--border);
}

.preview__img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}
</style>
