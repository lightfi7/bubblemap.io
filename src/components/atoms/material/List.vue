<template>
  <div class="mdc-list">
    <slot></slot>
  </div>
</template>

<script>
import { MDCRipple } from "@material/ripple/index";
import { MDCList } from "@material/list";

export default {
  name: "List",
  data() {
    return {
      mdcComponent: undefined,
      mdcListItems: [],
    };
  },
  mounted: function () {
    this.mdcComponent = new MDCList(this.$el);
    this.mdcComponent.listElements.forEach((listItemEl) =>
      this.mdcListItems.push(new MDCRipple(listItemEl))
    );
    this.mdcComponent.singleSelection = true;
  },
  unmounted: function () {
    this.mdcListItems.forEach((mdcListItem) => mdcListItem.destroy());
    this.mdcComponent.destroy();
  },
};
</script>

<style lang="scss">
.mdc-list-divider {
  border: none;
}
</style>
