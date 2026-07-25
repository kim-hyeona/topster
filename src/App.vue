<template>
  <div class="layout">
    <!-- 왼쪽 컨트롤 패널 -->
    <aside class="panel">
      <h1 class="logo">TOPSTER</h1>

      <!-- 타이틀 입력 -->
      <div class="section">
        <label class="label" for="title-input">타이틀 입력</label>
        <input
          id="title-input"
          v-model="titleDraft"
          class="input-field"
          placeholder="어떤 취향인가요?"
          @keydown.enter="applyTitle"
        />
      </div>

      <!-- 검색 -->
      <div class="section">
        <p class="hint">아티스트의 활동명이나 앨범 / 음원이름을 검색해주세요</p>
        <div class="search-row">
          <input
            v-model="searchQuery"
            class="input-field search-input"
            placeholder="검색"
            @keydown.enter="searchAlbums"
          />
          <button class="btn" @click="searchAlbums">검색</button>
        </div>

        <!-- 검색결과 -->
        <div class="search-results" ref="searchResultsEl">
          <div
            v-for="(album, i) in searchResults"
            :key="i"
            class="result-item"
            draggable="true"
            @dragstart="onDragStart($event, album)"
            @click="insertAlbum(album)"
            :title="album.name"
          >
            <img
              v-if="album.image"
              :src="album.image"
              :alt="album.name"
              class="result-img"
            />
            <div v-else class="result-placeholder">?</div>
          </div>
          <p v-if="searchError" class="hint error">{{ searchError }}</p>
          <p v-if="searchResults.length === 0 && !searchError && hasSearched" class="hint">검색 결과가 없습니다. 영문으로 시도해보세요.</p>
        </div>
      </div>

      <!-- 컬러 슬라이더 (그리드 셀 테두리/간격 색) -->
      <div class="section color-section">
        <div class="color-bar-wrap">
          <input
            type="range"
            min="0"
            max="360"
            v-model="colorHue"
            class="color-slider"
          />
          <span class="color-preview" :style="{ background: borderColor }"></span>
        </div>

        <!-- 그리드 사이즈 -->
        <div class="grid-size-row">
          <span class="label">{{ gridCols }}×{{ gridRows }}</span>
          <div class="grid-size-controls">
            <div class="size-control">
              <span class="size-label">열</span>
              <button class="size-btn" @click="gridCols = Math.max(1, gridCols - 1)">−</button>
              <span class="size-val">{{ gridCols }}</span>
              <button class="size-btn" @click="gridCols = Math.min(8, gridCols + 1)">+</button>
            </div>
            <div class="size-control">
              <span class="size-label">행</span>
              <button class="size-btn" @click="gridRows = Math.max(1, gridRows - 1)">−</button>
              <span class="size-val">{{ gridRows }}</span>
              <button class="size-btn" @click="gridRows = Math.min(8, gridRows + 1)">+</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 다운로드 -->
      <button class="btn btn-download" @click="downloadCapture">↓ 저장</button>
    </aside>

    <!-- 오른쪽 캡처 영역 -->
    <main class="capture-area" ref="captureEl" :style="captureStyle">
      <h2 class="capture-title">{{ displayTitle }}</h2>
      <div
        class="grid"
        :style="gridStyle"
        ref="gridEl"
      >
        <div
          v-for="(cell, i) in totalCells"
          :key="i"
          class="cell"
          :style="cellStyle"
          @dragover.prevent
          @drop="onDrop($event, i)"
          @click="removeAlbum(i)"
        >
          <img
            v-if="cells[i]"
            :src="cells[i].image"
            :alt="cells[i].name"
            class="cell-img"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import domtoimage from 'dom-to-image'

const API_KEY = '7108708792074ac473a8d262368a6c78'

// 타이틀
const titleDraft = ref('')
const displayTitle = ref('2024 my best k-pop')
function applyTitle() {
  if (titleDraft.value.trim()) {
    displayTitle.value = titleDraft.value.trim()
    titleDraft.value = ''
  }
}

// 검색
const searchQuery = ref('')
const searchResults = ref([])
const searchError = ref('')
const hasSearched = ref(false)
const draggingAlbum = ref(null)

async function searchAlbums() {
  if (!searchQuery.value.trim()) return
  searchError.value = ''
  hasSearched.value = true
  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${encodeURIComponent(searchQuery.value)}&api_key=${API_KEY}&format=json`
    const res = await fetch(url)
    const json = await res.json()
    const albums = json?.results?.albummatches?.album ?? []
    searchResults.value = albums
      .filter(a => a.image?.[2]?.['#text'])
      .map(a => ({
        name: a.name,
        artist: a.artist,
        image: a.image[2]['#text'],
      }))
  } catch (e) {
    searchError.value = '검색 실패. 잠시 후 다시 시도해주세요.'
  }
}

// 드래그
function onDragStart(event, album) {
  draggingAlbum.value = album
  event.dataTransfer.effectAllowed = 'copy'
}

// 그리드
const gridCols = ref(4)
const gridRows = ref(4)
const totalCells = computed(() => gridCols.value * gridRows.value)
const cells = ref([])

watch(totalCells, (newVal) => {
  cells.value = cells.value.slice(0, newVal)
  while (cells.value.length < newVal) cells.value.push(null)
}, { immediate: true })

// 클릭으로 첫 번째 빈 셀에 삽입
function insertAlbum(album) {
  const emptyIdx = cells.value.findIndex(c => c === null)
  if (emptyIdx !== -1) {
    cells.value[emptyIdx] = album
  }
}

// 드롭으로 특정 셀에 삽입
function onDrop(event, cellIndex) {
  event.preventDefault()
  if (draggingAlbum.value) {
    cells.value[cellIndex] = draggingAlbum.value
    draggingAlbum.value = null
  }
}

// 셀 클릭으로 제거 (이미지 있을 때만)
function removeAlbum(i) {
  if (cells.value[i]) cells.value[i] = null
}

// 컬러
const colorHue = ref(0)
const borderColor = computed(() => `hsl(${colorHue.value}, 70%, 60%)`)

// 스타일
const captureStyle = computed(() => ({
  background: `hsl(${colorHue.value}, 60%, 80%)`,
}))

const CELL_SIZE = 160
const GAP = 8

const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${gridCols.value}, ${CELL_SIZE}px)`,
  gridTemplateRows: `repeat(${gridRows.value}, ${CELL_SIZE}px)`,
  gap: `${GAP}px`,
  padding: `${GAP}px`,
  background: borderColor.value,
  borderRadius: '4px',
}))

const cellStyle = computed(() => ({
  width: `${CELL_SIZE}px`,
  height: `${CELL_SIZE}px`,
  background: 'white',
  cursor: 'pointer',
  overflow: 'hidden',
}))

// 다운로드
const captureEl = ref(null)
async function downloadCapture() {
  try {
    const blob = await domtoimage.toBlob(captureEl.value)
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'topster.png'
    a.click()
    URL.revokeObjectURL(url)
  } catch (e) {
    alert('저장 실패. 다시 시도해주세요.')
  }
}
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.panel {
  width: 440px;
  min-width: 440px;
  background: #e8e8e8;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logo {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.hint {
  font-size: 11px;
  color: #888;
}

.hint.error {
  color: #e55;
}

.input-field {
  background: #d4d4d4;
  border: none;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 13px;
  font-family: inherit;
  outline: none;
  width: 100%;
}

.input-field:focus {
  box-shadow: inset 0 0 0 1.5px #aaa;
}

.search-row {
  display: flex;
  gap: 8px;
}

.search-input {
  flex: 1;
}

.btn {
  background: #d4d4d4;
  border: none;
  border-radius: 4px;
  padding: 8px 14px;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.btn:hover {
  background: #c0c0c0;
}

.search-results {
  background: #d4d4d4;
  border-radius: 4px;
  min-height: 100px;
  max-height: 280px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  padding: 8px;
}

.result-item {
  cursor: grab;
  border-radius: 3px;
  overflow: hidden;
  aspect-ratio: 1;
  background: #bbb;
  transition: opacity 0.15s;
}

.result-item:hover {
  opacity: 0.85;
}

.result-item:active {
  cursor: grabbing;
}

.result-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.result-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #999;
}

/* 컬러 & 그리드 사이즈 */
.color-section {
  gap: 12px;
}

.color-bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-slider {
  flex: 1;
  -webkit-appearance: none;
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(to right,
    hsl(0,70%,60%), hsl(45,70%,60%), hsl(90,70%,60%),
    hsl(135,70%,60%), hsl(180,70%,60%), hsl(225,70%,60%),
    hsl(270,70%,60%), hsl(315,70%,60%), hsl(360,70%,60%)
  );
  outline: none;
  cursor: pointer;
}

.color-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 2px solid #aaa;
  cursor: pointer;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #bbb;
  flex-shrink: 0;
}

.grid-size-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.grid-size-controls {
  display: flex;
  gap: 12px;
}

.size-control {
  display: flex;
  align-items: center;
  gap: 6px;
}

.size-label {
  font-size: 12px;
  color: #666;
}

.size-btn {
  background: #d4d4d4;
  border: none;
  border-radius: 3px;
  width: 24px;
  height: 24px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.size-btn:hover {
  background: #bbb;
}

.size-val {
  font-size: 14px;
  font-weight: 600;
  min-width: 16px;
  text-align: center;
}

.btn-download {
  margin-top: auto;
  padding: 10px;
  font-weight: 600;
}

/* 캡처 영역 */
.capture-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 20px;
  transition: background 0.2s;
}

.capture-title {
  font-size: 22px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.6);
  letter-spacing: -0.3px;
}

.grid {
  /* gridStyle로 동적 설정 */
}

.cell {
  transition: opacity 0.15s;
}

.cell:hover {
  opacity: 0.85;
}

.cell-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
}
</style>
