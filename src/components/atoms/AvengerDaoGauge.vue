<template>
  <div class="gauge">
    <div class="gauge__body">
      <div class="gauge__fill" :style="fillStyle"></div>
      <div class="gauge__cover">
        <span
          :class="
            'gauge__title' + (riskLevel.startsWith('Very') ? ' --smaller' : '')
          "
          >{{ riskLevel }}</span
        ><span class="gauge__subtitle">Risk</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AvengerDaoGauge",
  props: {
    score: Number,
    trustLevel: String,
  },
  computed: {
    percent() {
      return (this.score / 99).toFixed(2);
    },
    color() {
      return this.percent < 0.25
        ? "#ff0d0c"
        : this.percent < 0.4
        ? "#ff8e16"
        : this.percent < 0.6
        ? "#fab733"
        : this.percent < 0.75
        ? "#acb334"
        : this.percent < 0.9
        ? "#69b34c"
        : "#28a73a";
    },
    fillStyle() {
      var that = this;
      return `
        transform: rotate(${that.percent / 2}turn);
        background: ${that.color};
      `;
    },
    riskLevel() {
      if (this.trustLevel == "Very Low") {
        return "Very High";
      } else if (this.trustLevel == "Low") {
        return "High";
      } else if (this.trustLevel == "Medium") {
        return "Medium";
      } else if (this.trustLevel == "High") {
        return "Low";
      } else if (this.trustLevel == "Very High") {
        return "Very Low";
      } else {
        return "/";
      }
    },
  },
};
</script>

<style lang="scss">
.gauge {
  color: white;
}

.gauge__body {
  width: 100%;
  height: 0;
  padding-bottom: 50%;
  background: rgba(white, 0.2);
  position: relative;
  border-top-left-radius: 100% 200%;
  border-top-right-radius: 100% 200%;
  overflow: hidden;
}

.gauge__fill {
  position: absolute;
  top: 100%;
  left: 0;
  width: inherit;
  height: 100%;
  transform-origin: center top;
  transform: rotate(0.25turn);
  transition: transform 0.2s ease-out;
}

.gauge__cover {
  width: 90%;
  height: 180%;
  background: #1d1921;
  border-radius: 50%;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  /* Text */
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 25%;
  box-sizing: border-box;
  flex-direction: column;
  font-size: 0.8em;
}

.gauge__title {
  &.--smaller {
    font-size: smaller;
  }
}

.gauge__subtitle {
  font-size: smaller;
}
</style>
