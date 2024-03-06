<template>
  <Dialog ref="dialog">
    <div class="mdc-dialog__content">
      <h2>Settings</h2>
      <div class="graph-setting__description">Show transfers directions:</div>
      <InlineRadioButtons
        :options="[
          { text: 'Off', value: 'OFF' },
          { text: 'Only Selected', value: 'SELECTED' },
          { text: 'On', value: 'ON' },
        ]"
        :selected="$store.getters.get_transfer_direction"
        :setSelected="set_transfer_direction"
        class="graph-setting__buttons"
      />
      <div class="graph-setting__description">
        Exclude hidden wallets from the percentage calculation:
      </div>
      <InlineRadioButtons
        :options="[
          { text: 'Off', value: 'OFF' },
          { text: 'Only Dead Address', value: 'DEAD' },
          { text: 'On', value: 'ON' },
        ]"
        :selected="$store.getters.get_percent_exclude"
        :setSelected="set_percent_exclude"
        class="graph-setting__buttons"
      />
    </div>
    <div class="mdc-dialog__actions">
      <Button data-mdc-dialog-action="discard" data-mdc-dialog-initial-focus>
        Close
      </Button>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "@/components/atoms/material/Dialog.vue";
import Button from "@/components/atoms/material/Button.vue";
import InlineRadioButtons from "@/components/atoms/InlineRadioButtons.vue";

export default {
  name: "GraphSettings",
  components: {
    Dialog,
    Button,
    InlineRadioButtons,
  },
  methods: {
    open() {
      this.$refs.dialog.open();
    },
    close() {
      this.$refs.dialog.close();
    },
    set_transfer_direction(direction) {
      this.$store.dispatch("set_transfer_direction", direction);
      this.$parent.d3ForceSimulation.tick().restart();
    },
    set_percent_exclude(percent) {
      this.$store.dispatch("set_percent_exclude", percent);
      this.$parent.updateD3SvgElements();
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.graph-setting__description {
  margin-top: 20px;
  margin-bottom: 2px;
}

.graph-setting__buttons {
  width: fit-content;
}
</style>
