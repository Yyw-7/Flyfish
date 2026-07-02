<!-- src/components/travel/BoardingPass.vue -->
<template>
  <div class="boarding-pass">
    <!-- 左侧主区 -->
    <div class="boarding-main">
      <div class="boarding-header">
        <span class="boarding-badge">BOARDING PASS</span>
        <span class="boarding-class">Cozy Adventure</span>
      </div>

      <div class="flight-route">
        <div class="route-from">
          <span class="route-label">始发站 (FROM)</span>
          <span class="route-code">北京 PEK</span>
        </div>
        <div class="route-icon">
          <div class="plane-icon">✈️</div>
          <span class="flight-code">FLIGHT: {{ station.flightCode }}</span>
        </div>
        <div class="route-to">
          <span class="route-label">目的地站 (TO)</span>
          <span class="route-code destination">{{ station.airportCode }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <div class="passenger-info">
        <div>
          <span class="info-label">探险玩家 (EXPLORER)</span>
          <span class="info-value">小飞鱼</span>
        </div>
        <div>
          <span class="info-label">登机日期 (DATE)</span>
          <span class="info-value">{{ formattedDate }}</span>
        </div>
        <div>
          <span class="info-label">冒险席位 (SEAT)</span>
          <span class="info-value">COZY-9F</span>
        </div>
      </div>
    </div>

    <!-- 虚线分割 -->
    <div class="divider-line"></div>

    <!-- 右侧副券 -->
    <div class="boarding-stub">
      <div class="stamp" :class="{ active: station.stamped }">
        💮 {{ station.stampText }}
      </div>

      <div>
        <span class="gate-label">GATE</span>
        <span class="gate-number">NO.14</span>
      </div>

      <svg class="barcode" viewBox="0 0 100 30">
        <rect width="1" height="22" fill="#1e293b" x="2"/>
        <rect width="3" height="22" fill="#1e293b" x="5"/>
        <rect width="1" height="22" fill="#1e293b" x="10"/>
        <rect width="2" height="22" fill="#1e293b" x="13"/>
        <rect width="1" height="22" fill="#1e293b" x="17"/>
        <rect width="4" height="22" fill="#1e293b" x="20"/>
        <rect width="2" height="22" fill="#1e293b" x="26"/>
        <rect width="1" height="22" fill="#1e293b" x="30"/>
        <rect width="3" height="22" fill="#1e293b" x="33"/>
        <rect width="1" height="22" fill="#1e293b" x="38"/>
        <rect width="2" height="22" fill="#1e293b" x="41"/>
        <rect width="4" height="22" fill="#1e293b" x="45"/>
        <rect width="1" height="22" fill="#1e293b" x="51"/>
        <rect width="2" height="22" fill="#1e293b" x="54"/>
        <rect width="3" height="22" fill="#1e293b" x="58"/>
        <rect width="1" height="22" fill="#1e293b" x="63"/>
        <rect width="2" height="22" fill="#1e293b" x="66"/>
        <rect width="4" height="22" fill="#1e293b" x="70"/>
        <rect width="1" height="22" fill="#1e293b" x="76"/>
        <rect width="3" height="22" fill="#1e293b" x="79"/>
        <rect width="2" height="22" fill="#1e293b" x="84"/>
        <rect width="1" height="22" fill="#1e293b" x="88"/>
        <rect width="4" height="22" fill="#1e293b" x="91"/>
        <text x="50" y="29" font-size="6" text-anchor="middle" font-family="monospace" fill="#1e293b" font-weight="bold">CQ-{{ station.flightCode }}</text>
      </svg>

      <button
        class="stamp-btn"
        :class="{ stamped: station.stamped }"
        :disabled="station.stamped"
        @click="$emit('collectStamp')"
      >
        {{ station.stamped ? '💮 已盖签到章' : '🔴 点击盖章' }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  station: { type: Object, required: true },
  formattedDate: { type: String, required: true },
  photo: { type: Object, 
    required: true, 
    default: () => ({ hp: 0, caption: '', varietyQuote: '' }) // ✅ 添加默认值 }
  }
})

defineEmits(['collectStamp'])
</script>

<style scoped>
.boarding-pass {
  background: white;
  border: 4px solid var(--border-dark, #1e293b);
  border-radius: 24px;
  box-shadow: 8px 8px 0px var(--border-dark, #1e293b);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.boarding-pass:hover {
  transform: translateY(-2px);
}

@media (min-width: 768px) {
  .boarding-pass {
    flex-direction: row;
  }
}

.boarding-main {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.boarding-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
}

.boarding-badge {
  background: #ff7096;
  color: white;
  border: 2px solid #1e293b;
  font-weight: 900;
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 0.5rem;
  box-shadow: 4px 4px 0px #1e293b;
}

.boarding-class {
  font-size: 0.5rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 0.1em;
}

.flight-route {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.route-from,
.route-to {
  display: flex;
  flex-direction: column;
}

.route-to {
  text-align: right;
}

.route-label {
  font-size: 0.65rem;
  font-weight: 900;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.route-code {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1e293b;
}

@media (min-width: 768px) {
  .route-code {
    font-size: 2rem;
  }
}

.route-code.destination {
  color: #f43f5e;
  font-family: monospace;
}

.route-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.plane-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: #3b82f6;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  border: 2px solid #1e293b;
  box-shadow: 4px 4px 0px #1e293b;
  transform: rotate(-12deg);
}

.flight-code {
  background: #f1f5f9;
  border: 2px solid #1e293b;
  font-size: 0.65rem;
  font-weight: 900;
  padding: 0.125rem 0.75rem;
  border-radius: 8px;
  color: #1e293b;
  margin-top: 0.25rem;
}

.divider {
  border-bottom: 2px dashed #e2e8f0;
  margin: 1rem 0;
}

.passenger-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  grid-template-columns: repeat(3, 1fr);
}



.info-label {
  font-size: 0.6rem;
  font-weight: 900;
  color: #94a3b8;
  display: block;
  text-transform: uppercase;
}

.info-value {
  font-size: 0.75rem;
  font-weight: 900;
  color: #1e293b;
  display: block;
}

@media (min-width: 768px) {
  .info-value {
    font-size: 0.875rem;
  }
}

.info-value.hp {
  color: #10b981;
  font-family: monospace;
}

.divider-line {
  border-left: 4px dashed #1e293b;
  margin: 0.5rem 0;
}

@media (max-width: 767px) {
  .divider-line {
    border-left: none;
    border-top: 4px dashed #1e293b;
    margin: 0 0.5rem;
  }
}

.boarding-stub {
  width: 100%;
  padding: 1.5rem;
  background: #eef2ff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  border-top: 4px solid #1e293b;
  position: relative;
}

@media (min-width: 768px) {
  .boarding-stub {
    width: 200px;
    border-top: none;
    border-left: 4px solid #1e293b;
  }
}

.stamp {
  border: 4px dashed #ef4444;
  color: #ef4444;
  padding: 4px 12px;
  font-size: 1rem;
  font-weight: 900;
  border-radius: 12px;
  transform: rotate(-12deg);
  background: rgba(239, 68, 68, 0.08);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.5);
}

.stamp.active {
  opacity: 1;
  transform: scale(1) rotate(-15deg);
  animation: stampBounce 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards;
}

@keyframes stampBounce {
  0% { transform: scale(3.5) rotate(-45deg); opacity: 0; }
  100% { transform: scale(1.1) rotate(-15deg); opacity: 0.9; }
}

.gate-label {
  font-size: 0.65rem;
  font-weight: 900;
  color: #94a3b8;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gate-number {
  font-size: 1.5rem;
  font-weight: 900;
  color: #1e293b;
  display: block;
}

.barcode {
  width: 9rem;
  height: 3rem;
  opacity: 0.8;
}

.stamp-btn {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 2px solid #1e293b;
  font-weight: 900;
  font-size: 0.75rem;
  transition: all 0.15s;
  box-shadow: 3px 3px 0px #1e293b;
  cursor: pointer;
  background: #f43f5e;
  color: white;
}

.stamp-btn:hover:not(:disabled) {
  background: #e11d48;
}

.stamp-btn:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 1px 1px 0px #1e293b;
}

.stamp-btn.stamped {
  background: #d1fae5;
  color: #065f46;
  cursor: not-allowed;
  box-shadow: none;
}
</style>