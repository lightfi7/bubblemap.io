<template>
  <div class="chain-selector">
    <span
      v-for="(chain, index) in all_chains"
      class="chain-selector__button"
      :ref="(el) => itemRefs.push(el)"
      :tabindex="0"
      :value="chain"
      :key="chain"
      @click="$parent.$parent.go_to_input(chain)"
      @keyup.enter="$parent.$parent.go_to_input(chain)"
      @keyup.right="focusChain(index + 1)"
      @keyup.left="focusChain(index - 1)"
      :style="`background-color: ${all_chains_ref[chain]['color']};`"
    >
      <span class="material-icons"> south </span>
      <SvgChainLogo :chain="chain" />
      {{ chain }}
    </span>
  </div>
</template>

<script>
import chainUtils from "@/utils/chains.js";

export default {
  name: "ChainSelector",
  data() {
    return {
      itemRefs: [],
    };
  },
  mixins: [chainUtils],
  methods: {
    focusChain(index) {
      if (index < 0) {
        this.focusChain(this.itemRefs.length + index);
      } else {
        this.itemRefs[index % this.itemRefs.length].focus();
      }
    },
  },
  mounted() {
    const index = this.all_chains.findIndex(
      (el) => el == this.$route.params.chain
    );
    this.$nextTick(() => this.focusChain(index));
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.chain-selector {
  padding-top: 15px;
}

.chain-selector__button {
  margin: 4px;
  cursor: pointer;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  text-transform: uppercase;
  font-weight: 700;
  padding: 18px 0 8px 0;
  box-sizing: border-box;
  border: 2px solid transparent;
  position: relative;

  .material-icons {
    position: absolute;
    font-size: 30px;
    top: -30px;
    display: none;
  }

  &:focus {
    outline: 2px rgba($theme-pink, 0.6) solid;
    border-color: $theme-dark-grey;
    .material-icons {
      display: initial;
      color: rgba($theme-pink, 0.6);
    }
  }

  &:hover {
    outline: 2px $theme-pink solid;
    border-color: $theme-dark-grey;
    .material-icons {
      display: initial;
      color: $theme-pink;
    }
  }

  svg {
    fill: white;
    height: 40px;
  }
}

@media (hover: none) {
  // This is to avoid having cronos alone on a line on these sizes
  .chain-selector__button {
    outline: none !important;
    border-color: transparent !important;
    .material-icons {
      display: none !important;
    }
  }
}

@media (min-width: 350px) {
  // This is to manage rows layout
  .chain-selector {
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (min-width: 470px) {
  // This is to manage rows layout
  .chain-selector {
    padding-left: 15px;
    padding-right: 15px;
  }
}

@media (min-width: 640px) {
  // This is to manage rows layout
  .chain-selector {
    padding-left: 65px;
    padding-right: 65px;
  }
}
</style>
