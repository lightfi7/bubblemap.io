<template>
  <button
    :class="
      'mdc-button' +
      (raised
        ? ' mdc-button--raised' +
          ('--primary-color' in colorScheme ? ' --flat' : '')
        : '') +
      (outlined ? ' mdc-button--outlined' : '') +
      (smallText ? ' --small-text' : '')
    "
    :style="style"
  >
    <a v-if="link" :href="link" :target="target">
      <div class="mdc-button__ripple"></div>
      <slot></slot>
    </a>
    <router-link v-else-if="route" :to="route">
      <div class="mdc-button__ripple"></div>
      <slot></slot>
    </router-link>
    <div v-else>
      <div class="mdc-button__ripple"></div>
      <slot></slot>
    </div>
  </button>
</template>

<script>
import { MDCRipple } from "@material/ripple/index";
import chainUtils from "@/utils/chains.js";

export default {
  name: "Button",
  props: {
    link: String,
    route: String,
    target: String,
    raised: Boolean,
    outlined: Boolean,
    chainColor: Boolean,
  },
  data() {
    return {
      mdcComponent: undefined,
    };
  },
  mixins: [chainUtils],
  mounted: function () {
    this.mdcComponent = new MDCRipple(this.$el);
  },
  unmounted: function () {
    this.mdcComponent.destroy();
  },
  computed: {
    style() {
      var that = this;
      if (that.chainColor) {
        if (that.raised) {
          return `
            background: ${that.get_chain_color()};
            background: -webkit-linear-gradient(90deg, ${that.get_chain_darker_color()}, ${that.get_chain_color()}) !important;
            background: linear-gradient(90deg, ${that.get_chain_darker_color()}, ${that.get_chain_color()}) !important;
          `;
        } else if (that.outlined) {
          return `
            color: ${that.get_chain_color()};
            border-color: ${that.get_chain_color()};
          `;
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped lang="scss">
@use "@material/button";
@import "assets/variables";

.mdc-button {
  @include button.shape-radius(50%);
}

.mdc-button:hover::before {
  opacity: 0.15;
}

.mdc-button--raised:not(:disabled),
.mdc-button--unelevated:not(:disabled) {
  &:not(.--flat) {
    @include theme-pink-gradient(45deg);
  }
  &.--flat {
    background: $theme-pink;
    background: var(--primary-color, $theme-pink);
  }
}

.mdc-button {
  &:not(:disabled):not(.mdc-button--raised) {
    color: $theme-light-pink;
    color: var(--primary-color, $theme-light-pink);
  }

  &.mdc-button--outlined:not(:disabled) {
    border-color: $theme-blue;
    border-color: var(--primary-color, $theme-light-pink);
  }

  .mdc-button__ripple::before,
  .mdc-button__ripple::after {
    background-color: $theme-pink;
    background-color: var(--primary-color, $theme-pink);
  }

  &.--small-text {
    font-size: 12px;
    height: 30px;
  }
}

.mdc-button.mdc-ripple-upgraded--background-focused
  .mdc-button__ripple::before {
  opacity: 0;
}
</style>
