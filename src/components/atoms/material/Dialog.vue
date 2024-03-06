<template>
  <div
    :class="
      'mdc-dialog' +
      (defaultWidth ? ' mdc-dialog--custom-width' : '') +
      (mobileFullScreen ? ' mdc-dialog--mobile-full-screen' : '') +
      (fullHeight ? ' mdc-dialog--full-height' : '')
    "
  >
    <div class="mdc-dialog__container">
      <div
        class="mdc-dialog__surface"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="my-dialog-title"
        aria-describedby="my-dialog-content"
        :style="defaultWidth ? `width:${defaultWidth}px;` : ''"
      >
        <slot></slot>
      </div>
    </div>
    <div class="mdc-dialog__scrim"></div>
  </div>
</template>

<script>
import { MDCDialog } from "@material/dialog";

export default {
  name: "Dialog",
  props: {
    defaultWidth: Number,
    fullHeight: {
      type: Boolean,
      default: false,
    },
    mobileFullScreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mdcComponent: undefined,
    };
  },
  mounted: function () {
    this.mdcComponent = new MDCDialog(this.$el);
    this.mdcComponent.listen("MDCDialog:closing", () => {
      this.$emit("closing");
    });
    this.mdcComponent.listen("MDCDialog:opened", () => {
      this.$emit("opened");
    });
  },
  unmounted: function () {
    this.mdcComponent.destroy();
  },
  methods: {
    open() {
      this.mdcComponent.open();
    },
    close() {
      this.mdcComponent.close();
    },
  },
};
</script>

<style lang="scss">
@use "@material/dialog";
@import "assets/variables";

.bubblemaps-mdc {
  .mdc-dialog {
    a:not(button > a) {
      color: $theme-pink;
      color: var(--primary-color, $theme-pink);
      &:hover {
        text-decoration: underline;
      }
      &:focus-visible {
        outline: none;
        background-color: rgba(white, 0.15);
        border-radius: 4px;
      }
    }
    .mdc-dialog__content {
      color: rgba(255, 255, 255, 0.7);
      color: var(--text-color, rgba(255, 255, 255, 0.7));
      font-size: 1em;
      line-height: 1.5em;
    }
    .mdc-dialog__surface {
      background-color: $theme-dark-grey;
      background-color: var(--surface-color, $theme-dark-grey);
    }
    .mdc-dialog__scrim {
      background-color: rgba(0, 0, 0, 0.7);
      background-color: var(--scrim-color, rgba(0, 0, 0, 0.7));
    }
  }
  .mdc-dialog__actions {
    min-height: initial;
  }

  .mdc-dialog--custom-width {
    // When using custom width we just set max-width really high so that it
    // doesn't interfere.
    @include dialog.max-width(3000px, 16px);
  }

  .mdc-dialog--full-height {
    .mdc-dialog__surface {
      height: calc(100% - 32px);
    }
  }

  @media (max-width: 600px) {
    .mdc-dialog--mobile-full-screen {
      .mdc-dialog__surface {
        height: 100%;
        max-height: 100vh;
        max-width: 100vw;
        border-radius: 0;
      }
    }
  }
}
</style>
