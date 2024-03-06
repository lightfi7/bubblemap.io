<template>
  <div @click="toggle()" @mouseleave="close()" class="chain-selector">
    <div
      class="chain-selector__button"
      :style="`background-color: ${get_chain_color()}`"
    >
      <SvgChainLogo :chain="$route.params.chain" />{{ get_chain_display_name()
      }}<span class="material-icons">arrow_drop_down</span>
    </div>
    <div v-if="isOpen" class="chain-selector__list-container">
      <div class="chain-selector__list">
        <router-link
          v-for="(chainRef, chain) in all_chains_ref"
          :key="chain"
          :class="
            'mdc-top-app-bar__chain' +
            ($route.params.chain == chain
              ? ' mdc-top-app-bar__chain--active'
              : '')
          "
          :to="`/${chain}/`"
        >
          <SvgChainLogo :chain="chain" />
          {{ chainRef["display_name"] }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import chainUtils from "@/utils/chains.js";

export default {
  name: "ChainSelector",
  mixins: [chainUtils],
  data: function () {
    return {
      isOpen: false,
    };
  },
  methods: {
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.chain-selector {
  position: relative;
  padding: 10px;
  // Text not selectable
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

.chain-selector__button {
  border-radius: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 110px;
  font-weight: bolder;
  z-index: 2;
  position: relative;
  cursor: pointer;

  svg {
    fill: white;
    height: 20px;
    margin-right: 6px;
  }

  .material-icons {
    margin-right: -6px;
  }
}

.chain-selector__list-container {
  position: absolute;
  top: 17px;
  padding: 10px;
  left: 0;
}

.chain-selector__list {
  background-color: #262626;
  border: 1px solid #4e4e4e;
  padding: 20px 4px 3px 4px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 110px;
  border-radius: 0 0 17px 17px;
  box-sizing: border-box;
}

.mdc-top-app-bar__chain {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  border-radius: 100px;

  &:not(:last-child) {
    margin-bottom: 3px;
  }

  svg {
    fill: white;
    height: 16px;
    margin-right: 4px;
    margin-left: -2px;
  }

  &:hover {
    background-color: #333333;
  }

  &.mdc-top-app-bar__chain--active {
    background-color: #555555;
  }
}
</style>
