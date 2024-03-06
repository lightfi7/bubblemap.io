<template>
  <label class="mdc-text-field">
    <span class="mdc-text-field__ripple"></span>
    <span v-if="notchedOutline" class="mdc-notched-outline">
      <span class="mdc-notched-outline__leading"></span>
      <span class="mdc-notched-outline__notch">
        <span class="mdc-floating-label">{{ hintText }}</span>
      </span>
      <span class="mdc-notched-outline__trailing"></span>
    </span>
    <span v-else class="mdc-floating-label">{{ hintText }}</span>
    <input
      class="mdc-text-field__input"
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <i
      v-if="trailingIcon"
      class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing"
      >{{ trailingIcon }}</i
    >
    <span v-if="ripple" class="mdc-line-ripple"></span>
  </label>
</template>

<script>
import { MDCTextField } from "@material/textfield";

export default {
  name: "TextField",
  props: {
    modelValue: String,
    hintText: String,
    trailingIcon: String,
    notchedOutline: Boolean,
    ripple: Boolean,
  },
  data() {
    return {
      mdcComponent: undefined,
    };
  },
  mounted: function () {
    this.mdcComponent = new MDCTextField(this.$el);
  },
  unmounted: function () {
    this.mdcComponent.destroy();
  },
};
</script>

<style lang="scss">
@use '@material/textfield';
@import "assets/variables";

.mdc-text-field--filled.mdc-ripple-upgraded--background-focused
  .mdc-text-field__ripple::before,
.mdc-text-field--filled:not(.mdc-ripple-upgraded):focus
  .mdc-text-field__ripple::before {
  opacity: 0.05;
}

.mdc-text-field--outlined-discrete {
  @include textfield.outlined-height(40px);
  @include textfield.label-color($theme-dark-pink);
  @include textfield.outline-color($theme-dark-pink);
  @include textfield.hover-outline-color($theme-pink);
  @include textfield.outline-shape-radius(10px);
  &.mdc-text-field:not(.mdc-text-field--disabled)
    .mdc-text-field__icon--trailing {
    color: $theme-pink;
  }
}
</style>
