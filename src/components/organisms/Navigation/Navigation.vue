<template>
  <aside ref="mdcDrawer" class="mdc-drawer mdc-drawer--modal">
    <div class="mdc-drawer__content" @click="closeDrawer">
      <List>
        <a
          v-if="!this.$store.getters.is_logged_in"
          class="mdc-list-item mdc-list-item--gradient"
          :href="`https://accounts.bubblemaps.io/authenticate/?callback=${callbackUrl}`"
          tabindex="0"
        >
          <span class="mdc-list-item__ripple"></span>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
            login
          </i>
          <span class="mdc-list-item__text">LOG IN</span>
        </a>
        <a
          v-if="this.$store.getters.is_logged_in"
          class="mdc-list-item mdc-list-item--gradient"
          href="https://accounts.bubblemaps.io/"
          target="_blank"
          tabindex="0"
        >
          <span class="mdc-list-item__ripple"></span>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
            account_circle
          </i>
          <span class="mdc-list-item__text">ACCOUNT</span>
        </a>
        <a
          v-if="this.$store.getters.is_logged_in"
          class="mdc-list-item"
          @click="this.$store.dispatch('logout')"
        >
          <span class="mdc-list-item__ripple"></span>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
            logout
          </i>
          <span class="mdc-list-item__text">Log Out</span>
        </a>
        <hr class="mdc-list-divider" />
        <router-link
          class="mdc-list-item"
          :to="`/${$route.params.chain}/listed-tokens`"
          active-class="mdc-list-item--activated"
        >
          <span class="mdc-list-item__ripple"></span>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
            verified
          </i>
          <span class="mdc-list-item__text">Listed Tokens</span>
        </router-link>
      </List>
    </div>
  </aside>
  <div class="mdc-drawer-scrim"></div>
  <header class="mdc-top-app-bar mdc-top-app-bar--fixed" ref="mdcTopAppBar">
    <div class="mdc-top-app-bar__row">
      <section
        class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start"
      >
        <router-link
          class="mdc-top-app-bar__logo-container"
          :to="`/${$route.params.chain}/`"
        >
          <img
            src="@/assets/logos/bubblemaps.svg"
            alt="Bubblemaps Logo"
            class="mdc-top-app-bar__logo"
          />
        </router-link>
        <ChainSelector />
      </section>
      <section
        class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
        role="toolbar"
      >
        <router-link
          class="mdc-top-app-bar__custom-menu"
          active-class="mdc-top-app-bar__custom-menu--active"
          :to="`/${$route.params.chain}/listed-tokens`"
          :style="menuStyle"
        >
          <span class="material-icons">verified</span>
          <span>Listed Tokens</span>
        </router-link>
        <a
          class="mdc-top-app-bar__custom-menu --search"
          :style="menuStyle"
          @click="$parent.openSearch()"
        >
          <span>Search</span>
          <span class="material-icons">search</span>
        </a>
        <a
          class="mdc-icon-button mdc-top-app-bar__action-item --mobile-toggle"
          aria-label="Search"
          alt="Search"
          @click="$parent.openSearch()"
        >
          <span class="material-icons">search</span>
        </a>
        <Button
          v-if="!this.$store.getters.is_logged_in"
          raised
          :link="`https://accounts.bubblemaps.io/authenticate/?callback=${callbackUrl}`"
        >
          Log In
        </Button>
        <div
          v-show="this.$store.getters.is_logged_in"
          dir="rtl"
          class="mdc-menu-surface--anchor"
        >
          <span ref="mdcMenuButton">
            <Button @click="toggleMenu" class="mdc-button mdc-button--outlined">
              <div class="mdc-button__ripple"></div>
              <i class="material-icons mdc-button__icon" aria-hidden="true">
                expand_more
              </i>
              Account
            </Button>
          </span>
          <div class="mdc-menu mdc-menu-surface" ref="mdcMenu">
            <!-- the menu-surface max-width is capped by its anchor by default (here the account menu button) -->
            <!-- you'll have to manually define its width if you need more space -->
            <ul
              class="mdc-list"
              role="menu"
              aria-hidden="true"
              aria-orientation="vertical"
              tabindex="-1"
            >
              <a href="https://accounts.bubblemaps.io/" target="_blank">
                <li class="mdc-list-item" role="menuitem">
                  <span class="mdc-list-item__ripple"></span>
                  <i
                    class="material-icons mdc-list-item__graphic"
                    aria-hidden="true"
                  >
                    account_circle
                  </i>
                  <span class="mdc-list-item__text">Manage</span>
                </li>
              </a>
              <li
                class="mdc-list-item"
                role="menuitem"
                @click="this.$store.dispatch('logout')"
              >
                <span class="mdc-list-item__ripple"></span>
                <i
                  class="material-icons mdc-list-item__graphic"
                  aria-hidden="true"
                >
                  logout
                </i>
                <span class="mdc-list-item__text">Log Out</span>
              </li>
            </ul>
          </div>
        </div>
        <a
          class="mdc-icon-button mdc-top-app-bar__action-item --mobile-toggle"
          aria-label="Toggle Menu"
          alt="Toggle Menu"
          @click="openDrawer"
        >
          <span class="material-icons">menu</span>
        </a>
      </section>
    </div>
  </header>
</template>

<script>
import Button from "@/components/atoms/material/Button.vue";
import List from "@/components/atoms/material/List.vue";
import { MDCDrawer } from "@material/drawer";
import { MDCTopAppBar } from "@material/top-app-bar";
import { MDCMenu, Corner } from "@material/menu";
import ChainSelector from "@/components/organisms/Navigation/parts/ChainSelector.vue";
import chainUtils from "@/utils/chains.js";

export default {
  name: "Navigation",
  components: {
    Button,
    List,
    ChainSelector,
  },
  mixins: [chainUtils],
  data() {
    return {
      callbackUrl: window.location.href,
      drawerComponent: null,
      topAppBarComponent: null,
      menuComponent: null,
    };
  },
  watch: {
    $route() {
      this.callbackUrl = window.location.href;
    },
  },
  computed: {
    menuStyle() {
      return {
        "--chainColor": this.get_chain_color(),
        "--chainDarkColor": this.get_chain_darker_color(),
      };
    },
  },
  methods: {
    openDrawer: function () {
      this.drawerComponent.open = true;
    },
    closeDrawer: function () {
      this.drawerComponent.open = false;
    },
    toggleMenu: function () {
      this.menuComponent.open = !this.menuComponent.open;
      // prevent menu from re-openning when closing it by clicking on the button
      document.body.addEventListener(
        "click",
        (e) => {
          if (this.$refs["mdcMenuButton"].contains(e.target)) {
            e.stopPropagation();
          }
        },
        { capture: true, once: true }
      );
    },
  },
  mounted: function () {
    this.drawerComponent = MDCDrawer.attachTo(this.$refs["mdcDrawer"]);
    this.topAppBarComponent = MDCTopAppBar.attachTo(this.$refs["mdcTopAppBar"]);
    this.menuComponent = new MDCMenu(this.$refs["mdcMenu"]);
    this.menuComponent.open = false;
    this.menuComponent.setAnchorCorner(Corner.BOTTOM_START);
    this.menuComponent.setAnchorMargin({ bottom: 8 });
  },
  unmounted: function () {
    this.drawerComponent.destroy();
    this.topAppBarComponent.destroy();
    this.menuComponent.destroy();
  },
};
</script>

<style lang="scss">
@use "sass:map";
@import "assets/variables";

.bubblemaps-mdc {
  .mdc-top-app-bar {
    align-items: center;
  }

  .mdc-top-app-bar__row {
    max-width: $mdc-layout-grid-max-width;
    padding: 0 map.get($mdc-layout-grid-default-margin, "phone");
  }

  @media (min-width: $mdc-grid-tablet) {
    .mdc-top-app-bar__row {
      padding: 0 map.get($mdc-layout-grid-default-margin, "tablet");
    }
  }

  @media (min-width: $mdc-grid-desktop) {
    .mdc-top-app-bar__row {
      padding: 0 map.get($mdc-layout-grid-default-margin, "desktop");
    }
  }

  .mdc-top-app-bar__section {
    padding: 8px 0;
  }

  .mdc-top-app-bar__logo-container {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .mdc-top-app-bar__action-item.--mobile-toggle {
    padding: 12px 10px;
    width: 44px;

    .material-icons {
      background-color: rgba(white, 0.1);
      padding: 6px;
      margin: -6px;
      border-radius: 100px;
    }
  }

  /* Drawer Button and titles conditionnal display */

  .mdc-top-app-bar__custom-menu {
    display: none;
  }
  .mdc-top-app-bar .mdc-button {
    display: none;
  }

  @media (min-width: $theme-drawer-width-threshold) {
    .mdc-top-app-bar__action-item.--mobile-toggle {
      display: none;
    }

    .mdc-top-app-bar .mdc-button {
      display: initial;
      margin-left: 20px;
    }

    .mdc-top-app-bar__custom-menu {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-left: 20px;

      .material-icons {
        font-size: 18px;
        margin-right: 5px;
      }

      &.--search {
        background-color: rgba(white, 0.2);
        font-size: 0.9em;
        width: 150px;
        justify-content: space-between;
        padding: 8px 10px 8px 13px;
        border-radius: 100px;
        margin-right: -6px;
        transition: background-color 100ms ease-in-out;

        &:hover {
          background-color: rgba(white, 0.3);
        }

        .material-icons {
          margin-right: 0;
        }
      }
    }
  }

  .mdc-top-app-bar__logo {
    height: 25px;
    margin-right: 4px;
  }

  @media (min-width: $mdc-tablet) {
    .mdc-top-app-bar__logo {
      height: 30px;
    }
  }

  @media (max-width: 890px) {
    .mdc-top-app-bar {
      font-size: 0.9rem;
    }
  }

  .mdc-drawer--modal + .mdc-drawer-scrim {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .mdc-drawer {
    border: none;
    background-color: $theme-almost-black;

    .mdc-list-item--gradient {
      @include theme-pink-gradient(45deg);
    }

    .mdc-list-item {
      margin: 8px;
      height: 36px;
      border-radius: 18px;
      display: flex;
      align-items: center;
    }

    .mdc-list-item__graphic {
      margin-right: 12px;
    }
  }

  .mdc-top-app-bar {
    white-space: nowrap;
    background-color: transparent;
    transition: box-shadow 200ms linear;
    background-color: $theme-dark-grey;
  }

  .mdc-top-app-bar__new-label {
    background-color: $theme-pink;
    font-weight: bolder;
    padding: 2px 4px;
    border-radius: 20px;
    font-size: 0.7em;
    margin-left: 8px;
    margin-bottom: -1px;

    &.mdc-top-app-bar__new-label--drawer {
      line-height: 20px;
      margin-bottom: 0;
    }
  }

  @media (max-width: 390px) {
    .mdc-top-app-bar__row {
      padding-right: 5px !important;
    }
  }

  a.mdc-top-app-bar__custom-menu:not(.--search) {
    position: relative;
    &:before {
      content: "";
      position: absolute;
      bottom: -7px;
      left: 0;
      width: 100%;
      -webkit-transform-origin: right center;
      -ms-transform-origin: right center;
      transform-origin: right center;
      height: 2px;
      -webkit-transform: scale(0, 1);
      -ms-transform: scale(0, 1);
      transform: scale(0, 1);
      -webkit-transition: -webkit-transform 0.2s ease;
      transition: -webkit-transform 0.2s ease;
      transition: transform 0.2s ease;
      transition: transform 0.2s ease, -webkit-transform 0.2s ease;
      background: var(--chainColor);
      background: -webkit-linear-gradient(
        0deg,
        var(--chainDarkColor),
        var(--chainColor)
      ) !important;
      background: linear-gradient(
        0deg,
        var(--chainDarkColor),
        var(--chainColor)
      ) !important;
    }

    &:hover {
      &:before {
        -webkit-transform-origin: left center;
        -ms-transform-origin: left center;
        transform-origin: left center;
        -webkit-transform: scale(1, 1);
        -ms-transform: scale(1, 1);
        transform: scale(1, 1);
      }
    }
  }

  .mdc-top-app-bar__custom-menu.mdc-top-app-bar__custom-menu--active:not(.--search) {
    &:before {
      -webkit-transform-origin: left center;
      -ms-transform-origin: left center;
      transform-origin: left center;
      -webkit-transform: scale(1, 1);
      -ms-transform: scale(1, 1);
      transform: scale(1, 1);
      @include theme-pink-gradient(90deg);
    }
  }

  :not(.mdc-list-item--disabled).mdc-list-item.mdc-list-item--gradient.mdc-ripple-upgraded--background-focused
    .mdc-list-item__ripple::before,
  :not(.mdc-list-item--disabled).mdc-list-item.mdc-list-item--gradient:not(.mdc-ripple-upgraded):focus
    .mdc-list-item__ripple::before {
    opacity: 0;
  }
}

.mdc-menu {
  .mdc-list-item {
    height: 32px;
    align-items: center;
  }
  .mdc-list-item__text {
    margin: 0 12px;
  }
  .mdc-list-item__graphic {
    font-size: 20px;
  }
}
</style>
