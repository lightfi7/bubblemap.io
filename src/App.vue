<template>
  <div class="mdc-typography bubblemaps-mdc" :style="colorScheme">
    <div
      class="theme-background-overlay"
      :style="
        isIframe() &&
        !$store.getters.get_color_schemes &&
        $route.query.loading_color
          ? { 'background-color': `#${$route.query.loading_color}` }
          : {}
      "
    >
      <template v-if="!$store.getters.is_global_loading">
        <Navigation v-if="!isIframe()" />
        <router-view />
      </template>
      <Dialog ref="chromeDialog">
        <div class="mdc-dialog__content">
          <h2>Bubblemaps is optimized for Chrome.</h2>
          <p>We detected that you are not using Chrome.</p>
          <p>
            It should mostly be fine, but you may experience unexpected errors
            or laggy graphs.
          </p>
        </div>
        <div class="mdc-dialog__actions">
          <Button data-mdc-dialog-action="discard">Close</Button>
        </div>
      </Dialog>
      <FullSearch ref="fullSearch" />
      <!-- <div
        v-if="!isIframe() & $store.getters.get_is_premium"
        class="warning-banner"
      >
        We are experiencing network instabilities: refreshing maps or loading
        new bubble maps might fail. This should be back to normal shortly. We're
        sorry for the inconvenience.
      </div> -->
      <!-- Penser à un-comment le not-listed-warning sur HoldersGarph quand on enlèvera la bannière -->
      <!-- <div v-if="!isIframe()" class="fundraising-banner --mobile">
        🎉&nbsp;Bubblemaps has raised <b>3M€</b> <br />
        <a
          target="_blank"
          href="https://twitter.com/bubblemaps/status/1703755850106683468"
          >Read&nbsp;more <SvgTwitterLogo class="twitter_logo"
        /></a>
      </div>
      <div v-if="!isIframe()" class="fundraising-banner --desktop">
        🎉&nbsp;Bubblemaps has raised <b>3M€</b> to accelerate blockchain data
        <a
          target="_blank"
          href="https://twitter.com/bubblemaps/status/1703755850106683468"
          >Read&nbsp;more <SvgTwitterLogo class="twitter_logo"
        /></a>
      </div> -->
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/organisms/Navigation/Navigation.vue";
import FullSearch from "@/components/organisms/FullSearch/FullSearch.vue";
import Dialog from "@/components/atoms/material/Dialog.vue";
import Button from "@/components/atoms/material/Button.vue";

export default {
  components: {
    Navigation,
    FullSearch,
    Dialog,
    Button,
  },
  mounted: function () {
    // If there is a token we prevent the chrome warning from showing again
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (!window.chrome && !this.isIframe() && !token) {
      this.$refs.chromeDialog.open();
    }
  },
  methods: {
    openSearch() {
      this.$refs.fullSearch.open();
    },
  },
};
</script>

<style lang="scss">
@use "@material/theme" with (
  $primary: #de219a,
  $secondary: #8d26d8,
  $background: #100c17,
  $surface: #1d1921,
  $on-surface: #ffffff
);
@import "assets/variables";

// Import styles for MDC Web components
// These are needed for the layout template
@import "@material/layout-grid/mdc-layout-grid";
@import "@material/typography/mdc-typography";
@import "@material/ripple/mdc-ripple";
@import "@material/button/mdc-button";
@import "@material/drawer/mdc-drawer";
@import "@material/icon-button/mdc-icon-button";
@import "@material/list/mdc-list";
@import "@material/top-app-bar/mdc-top-app-bar";
@import "@material/menu/mdc-menu";
@import "@material/menu-surface/mdc-menu-surface";
@import "@material/dialog/mdc-dialog";
@import "@material/textfield/mdc-text-field";

body {
  margin: 0;
  font-family: "Montserrat", sans-serif;
}

/* Hide scrollbar for Chrome, Safari and Opera */
body::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
body {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

:root {
  color-scheme: dark;
}

::-webkit-scrollbar {
  height: 12px;
  width: 12px;
  background: black;
  background: var(--bg-color, black);
}

::-webkit-scrollbar-thumb {
  background: $theme-dark-pink;
  background: var(--button-color, $theme-dark-pink);
  -webkit-border-radius: 2ex;
  border: 2px solid black;
  border: 2px solid var(--bg-color, black);
}

.bubblemaps-mdc {
  min-height: 100vh;
  margin: 0;
  color: white;
  background: $theme-almost-black;
  background: linear-gradient(
    90deg,
    $theme-almost-black,
    #130a1f,
    $theme-almost-black
  );

  a {
    color: inherit;
    text-decoration: inherit;
  }

  p {
    a:not(button > a) {
      color: $theme-blue;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .mdc-layout-grid {
    width: 100%;
    padding-top: 56px;
    padding-bottom: 0;
  }

  /* Adjustements for top app bar display */
  @media (min-width: 600px) {
    .mdc-layout-grid {
      padding-top: 64px;
    }
  }

  @media (min-width: $mdc-layout-grid-max-width) {
    .mdc-layout-grid {
      width: $mdc-layout-grid-max-width;
    }
  }
}

.mdc-typography {
  color: white;
  color: var(--text-color, white);
}

.theme-background-overlay {
  min-width: 100%;
  min-height: 100%;
  background: var(--bg-color);
  display: flex;
  justify-content: center;
  margin: 0;
}

.mdc-layout-grid {
  padding-bottom: 16px;
}

.mdc-top-app-bar {
  white-space: nowrap;
}

.mdc-top-app-bar__custom-title-container:hover
  .mdc-top-app-bar__title--custom-subtitle {
  color: white;
}

.mdc-top-app-bar__title--custom-title {
  transition: color 0.2s ease;
}

.mdc-top-app-bar__custom-title-container:hover
  .mdc-top-app-bar__title--custom-title {
  color: $theme-pink;
}

.warning-banner {
  background-color: orange;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px;
  text-align: center;
}

.fundraising-banner {
  background: linear-gradient(90deg, #1581dd 0%, #de219a 50%, #8d26d8 100%);
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 10px;
  text-align: center;
  box-sizing: border-box;

  a {
    background-color: rgba(white, 0.85);
    padding: 4px 6px;
    border-radius: 4px;
    color: #1581dd;
    fill: #1581dd;
    display: inline-flex;
    align-items: center;
    margin-left: 4px;

    &:hover {
      background-color: white;
    }

    .twitter_logo {
      height: 20px;
      margin-left: 4px;
    }
  }

  &.--desktop {
    display: none;
  }

  &.--mobile {
    a {
      margin-top: 4px;
    }
  }
}

@media (min-width: 660px) {
  .fundraising-banner {
    &.--desktop {
      display: initial;
    }
    &.--mobile {
      display: none;
    }
  }
}

.page-container-with-footer {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: space-between;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
}
</style>
