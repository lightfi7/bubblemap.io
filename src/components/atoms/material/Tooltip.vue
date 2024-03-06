<template>
  <div
    ref="tooltip"
    :id="id"
    class="mdc-tooltip"
    role="tooltip"
    aria-hidden="true"
  >
    <div
      class="mdc-tooltip__surface mdc-tooltip__surface-animation tooltip__text"
    >
      <transition name="fade" mode="out-in">
        <span :key="text">
          {{ text }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script>
import { MDCTooltip } from "@material/tooltip/index";

export default {
  name: "Tooltip",
  props: {
    text: String,
    id: String,
  },
  data() {
    return {
      mdcComponent: undefined,
    };
  },
  mounted: function () {
    this.mdcComponent = new MDCTooltip(this.$refs.tooltip);
    this.mdcComponent.setShowDelay(400);
    this.mdcComponent.setHideDelay(300);
  },
  unmounted: function () {
    this.mdcComponent.destroy();
  },
};
</script>

<style scoped lang="scss">
@use "@material/tooltip/styles";

.tooltip__text {
  background-color: black;
}

.mdc-tooltip__surface {
  max-width: 300px;
  text-align: center;
}
</style>
