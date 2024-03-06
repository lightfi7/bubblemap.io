<template>
  <Dialog :defaultWidth="620" ref="dialog">
    <div class="mdc-dialog__content">
      <h2>Welcome to Bubblemaps!</h2>
      <p>
        The first supply auditing tool for DeFi tokens & NFTs. Identify wash
        trading, DAO, scam tokens, and more.
      </p>
      <h3>How it works</h3>
      <ul>
        <li>Each bubble represents a wallet from the top 150.</li>
        <li>
          The bigger the bubble, the larger its share of the total supply.
        </li>
        <li>Links between bubbles represent blockchain transfers.</li>
        <li>Click on a bubble, and start exploring!</li>
      </ul>
      <div class="help__button-container">
        <Button raised link="https://bubblemaps.io/" target="_blank">
          Learn More
        </Button>
      </div>
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

export default {
  name: "GraphHelp",
  components: {
    Dialog,
    Button,
  },
  methods: {
    open() {
      this.$refs.dialog.open();
    },
    close() {
      this.$refs.dialog.close();
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.help__button-container {
  display: flex;
  justify-content: center;
}
</style>
