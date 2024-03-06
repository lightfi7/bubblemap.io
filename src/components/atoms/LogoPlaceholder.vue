<template>
  <div class="logo-placeholder" :style="style">
    {{ letters }}
  </div>
</template>

<script>
export default {
  name: "LogoPlaceholder",
  props: {
    letters: String,
    size: Number,
  },
  computed: {
    style() {
      var that = this;
      return `
        height: ${that.size + "px"};
        width: ${that.size + "px"};
        min-width: ${that.size + "px"};
        font-size: ${that.size * 0.45 + "px"};
      `;
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.logo-placeholder {
  background-color: $theme-dark-pink;
  background-color: var(--logo-placeholder-color, $theme-dark-pink);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
</style>
