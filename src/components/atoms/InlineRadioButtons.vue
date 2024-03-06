<template>
  <div class="inline-radio-buttons">
    <div
      v-for="option in options"
      :key="option.value"
      @click="setSelected(option.value)"
      :class="
        'inline-radio-buttons__button' +
        (option.value == selected ? ' --selected' : '')
      "
    >
      {{ option.text }}
    </div>
  </div>
</template>

<script>
export default {
  name: "InlineRadioButtons",
  props: {
    options: [Object],
    selected: String,
    setSelected: Function,
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.inline-radio-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(white, 0.1);
  border-radius: 1000px;
  padding: 4px;

  .inline-radio-buttons__button {
    cursor: pointer;
    border-radius: 1000px;
    background-color: rgba(white, 0.1);
    padding: 4px 8px;
    transition: background-color 200ms ease-in-out;
    text-align: center;

    &:not(:last-child) {
      margin-right: 4px;
    }

    &:hover {
      background-color: rgba(white, 0.3);
    }

    &.--selected {
      background-color: rgba($theme-pink, 0.8);
      color: white;
    }
  }
}
</style>
