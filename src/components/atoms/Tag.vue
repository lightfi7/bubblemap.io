<template>
  <div
    :class="'chain-tag' + (value in all_chains_ref ? '' : ' --colorless')"
    :style="colorStyle"
  >
    {{ value == "avax" ? "avx" : value }}
  </div>
</template>

<script>
import chainUtils from "@/utils/chains.js";

export default {
  name: "Tag",
  props: {
    value: String,
  },
  mixins: [chainUtils],
  computed: {
    colorStyle() {
      var that = this;
      return that.value in that.all_chains_ref
        ? `
        background-color: ${that.all_chains_ref[that.value]["color"]};
      `
        : "";
    },
  },
};
</script>

<style scoped lang="scss">
.chain-tag {
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 0.7em;
  padding: 0 7px;
  text-transform: uppercase;
  line-height: 24px;

  &.--colorless {
    color: rgba(white, 0.7);
    box-shadow: inset 0px 0px 0px 1px rgba(white, 0.5);
  }
}
</style>
