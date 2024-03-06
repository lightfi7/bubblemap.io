<template>
  <div class="map-result">
    <div class="map-result__left">
      <img
        class="map-result__image"
        v-if="result.listed"
        :src="`https://storage.googleapis.com/public-bubblemaps/app/tokens-images/${result.img}`"
      />
      <div class="map-result__body">
        <div class="map-result__name">
          <span v-html="result.full_name"></span>
          -
          <span class="map-result__symbol" v-html="result.symbol"></span>
        </div>
        <div class="map-result__address" v-html="result.token_address"></div>
      </div>
    </div>
    <div class="map-result__right">
      <Tag value="nft" v-if="result.is_X721" />
      <Tag :value="result.chain" />
    </div>
  </div>
</template>

<script>
import Tag from "@/components/atoms/Tag.vue";

export default {
  name: "MapResult",
  props: {
    result: Object,
  },
  components: {
    Tag,
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.map-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px;
  border-bottom: 1px solid rgba(white, 0.1);
  cursor: pointer;

  &:hover {
    background-color: rgba(white, 0.1);
  }
}

.map-result__left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.map-result__body {
  white-space: nowrap;
  overflow: hidden;
}

.map-result__image {
  height: 35px;
  width: 35px;
  border-radius: 30px;
  margin-right: 10px;
}

.map-result__name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.map-result__symbol {
  font-style: italic;
  font-weight: 100;
}

.map-result__address {
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: monospace;
  color: rgba(white, 0.5);
}

.map-result__right {
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    margin-left: 8px;
  }
}
</style>

<style lang="scss">
@import "assets/variables";

.map-result {
  mark {
    background-color: rgba($theme-pink, 0.2);
    color: white;
  }
}
</style>
