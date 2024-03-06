<template>
  <div
    @mouseleave="close()"
    :class="'view-selector' + (smallText ? ' --small-text' : '')"
  >
    <Tooltip
      v-for="option in allOptions"
      :key="option.index"
      :text="`Links represent ${option.symbol} transfers`"
      :id="`view-selector_${option.index.toString()}`"
    />
    <!-- Little display trick : We iterate over all options, and hide the
    wrong ones, instead of just displaying the good ones, so that the box is
    correctly sized for all possibilities. Good one has to be first though -->
    <div
      @click="allOptions.length > 1 ? toggle() : $parent.openOldMapDialog()"
      v-for="option in [
        ...allOptions.filter((a) => a.index == tokenIndex),
        ...allOptions.filter((a) => a.index != tokenIndex),
      ]"
      :key="option.index"
      :class="
        'view-selector__button' +
        (option.index == tokenIndex ? '' : ' view-selector__button--hidden')
      "
      :aria-describedby="`view-selector_${option.index.toString()}`"
    >
      <img
        alt=""
        v-if="getImageUrl(option)"
        class="view-selector__image"
        :src="getImageUrl(option)"
      />
      <LogoPlaceholder
        v-else
        :letters="option.symbol.substring(0, 2)"
        :size="smallText ? 22 : 24"
        class="view-selector__image"
      />
      <span class="view-selector__text">{{ option.symbol }} </span
      ><span class="material-icons view-selector__arrow">arrow_drop_down</span>
    </div>
    <div v-if="isOpen" class="view-selector__list-container">
      <div class="view-selector__list">
        <div
          v-for="option in allOptions"
          :key="option.index"
          :class="
            'view-selector__option' +
            (option.index == tokenIndex ? ' view-selector__option--active' : '')
          "
          @click="
            if (option.index != tokenIndex) {
              changeIndex(option.index);
            }
          "
        >
          <img
            alt=""
            v-if="getImageUrl(option)"
            class="view-selector__image"
            :src="getImageUrl(option)"
          />
          <LogoPlaceholder
            v-else
            :letters="option.symbol.substring(0, 2)"
            class="view-selector__image"
            :size="24"
          />
          <span class="view-selector__text">{{ option.symbol }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import chainUtils from "@/utils/chains.js";
import LogoPlaceholder from "@/components/atoms/LogoPlaceholder.vue";
import Tooltip from "@/components/atoms/material/Tooltip.vue";

export default {
  name: "ViewSelector",
  mixins: [chainUtils],
  props: {
    tokenIndex: Number,
    token_links: Object,
  },
  components: { LogoPlaceholder, Tooltip },
  data: function () {
    return {
      isOpen: false,
    };
  },
  computed: {
    allOptions() {
      const defaultOption = {
        index: -1,
        symbol: this.get_native_token(),
        is_analysed: false,
      };
      return this.token_links
        ? [
            defaultOption,
            ...this.token_links
              .map((token, index, self) => {
                return {
                  index: index,
                  symbol: token.symbol,
                  address: token.address,
                  is_analysed: index == self.length - 1,
                };
              })
              // We filter out WBNB and WETH that are not needed for now
              .filter((option) => option.index != 0)
              // We filter out duplicates based on token address
              .filter(function (option, pos, self) {
                return (
                  self.findIndex((el) => el.address == option.address) == pos
                );
              }),
          ]
        : [defaultOption];
    },
    currentSymbol() {
      return this.tokenIndex == -1
        ? this.get_native_token()
        : this.token_links[this.tokenIndex].symbol;
    },
    img_name() {
      return this.$store.getters.get_token_img(
        this.$route.params.token,
        this.$route.params.chain
      );
    },
  },
  methods: {
    getImageUrl(option) {
      if (option.is_analysed) {
        return this.img_name
          ? `https://storage.googleapis.com/public-bubblemaps/app/tokens-images/${this.img_name}`
          : null;
      } else {
        return `https://storage.googleapis.com/public-bubblemaps/app/modes-logos/${option.symbol.toLowerCase()}.png`;
      }
    },
    open() {
      this.isOpen = true;
    },
    close() {
      this.isOpen = false;
    },
    toggle() {
      this.isOpen = !this.isOpen;
    },
    changeIndex(index) {
      this.$parent.change_links(index);
      let query = Object.assign({}, this.$route.query);
      if (index == -1) {
        delete query.mode;
      } else {
        query.mode = index;
      }
      this.$router.replace({ query });
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.view-selector {
  position: relative;
  padding: 10px;
  margin: -6px;
  // Text not selectable
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

.view-selector__button {
  background: $theme-dark-grey;
  background: var(--button-color, $theme-dark-grey);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-weight: bolder;
  z-index: 2;
  position: relative;
  cursor: pointer;
  min-width: 0;
  padding: 0 7px;
  box-sizing: border-box;

  .material-icons {
    margin-right: -6px;
  }

  &.view-selector__button--hidden {
    visibility: hidden;
  }

  &:not(.view-selector__button--hidden) {
    pointer-events: auto;
  }
}

.view-selector__list-container {
  position: absolute;
  top: 20px;
  padding: 10px;
  left: 0;
  width: calc(100% - 20px);
  pointer-events: auto;
}

.view-selector__list {
  background-color: $theme-almost-black;
  background-color: var(--bg-color, $theme-almost-black);
  border: 2px solid #211a30;
  border: 2px solid var(--button-color, #211a30);
  padding: 20px 0px 0px 0px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0 0 12px 12px;
  box-sizing: border-box;
}

.view-selector__option {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  cursor: pointer;
  min-width: 0;
  padding: 0 7px;

  &:hover,
  &.view-selector__option--active {
    background-color: $theme-dark-grey;
    background-color: var(--button-color, $theme-dark-grey);
  }

  &:last-child {
    border-radius: 0 0 10px 10px;
  }
}

.view-selector__image {
  height: 24px;
  width: 24px;
  margin-right: 8px;
  border-radius: 12px;
  flex-shrink: 0;
}

// Top App Bar height change
@media (max-width: 420px) {
  .view-selector__text,
  .view-selector__arrow {
    display: none;
  }
  .view-selector__image {
    margin: 0 2px;
  }
}

.view-selector__text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.view-selector.--small-text {
  .view-selector__button {
    height: 35px;
  }
  .view-selector__list-container {
    position: absolute;
    top: 15px;
  }
  .view-selector__option {
    height: 35px;
  }
  .view-selector__image {
    height: 22px;
    width: 22px;
  }
}
</style>
