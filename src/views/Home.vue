<template>
  <iFrameBlock v-if="isIframe()" />
  <div v-else class="page-container-with-footer">
    <div class="mdc-layout-grid">
      <div class="mdc-layout-grid__inner">
        <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div class="home-header">
            <span class="home-search" @click="$parent.$parent.openSearch()">
              Search by name, address, symbol
              <i class="material-icons mdc-button__icon" aria-hidden="true">
                search
              </i>
            </span>
            <Button
              outlined
              chainColor
              link="https://bubblemaps.io"
              target="_blank"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div
          :class="
            'mdc-layout-grid__cell mdc-layout-grid__cell--span-2-phone mdc-layout-grid__cell--span-4-tablet mdc-layout-grid__cell--span-3-desktop token-box' +
            (index == 3 ? ' --last' : '')
          "
          v-for="(featured_token, index) in $store.getters.get_home_tokens(
            'featured',
            $route.params.chain
          )"
          :key="featured_token.address"
          :style="`
          box-shadow: ${get_chain_color()}33 0px 0px 24px;
          border: 1px solid ${get_chain_color()}33;`"
        >
          <div
            v-if="featured_token.is_new"
            class="token-box__label"
            :style="`background-color: ${get_chain_color()}`"
          >
            New
          </div>
          <div
            v-if="featured_token.is_soon"
            class="token-box__label"
            :style="`background-color: ${get_chain_color()}`"
          >
            {{
              featured_token.soon_custom_label
                ? featured_token.soon_custom_label
                : "Soon"
            }}
          </div>
          <div
            v-if="featured_token.is_rugged"
            class="token-box__label"
            :style="`background-color: ${get_chain_color()}`"
          >
            Rugged
          </div>
          <router-link
            :to="
              `/${$route.params.chain}/token/${featured_token.address}` +
              (featured_token.forced_id
                ? `?id=${featured_token.forced_id}`
                : '')
            "
            :class="
              'token-box__router' +
              (featured_token.address ? '' : ' token-box__router--disabled')
            "
          >
            <img
              alt=""
              :src="`https://storage.googleapis.com/public-bubblemaps/app/tokens-images/${featured_token.image}`"
              class="token-box__image"
            />
            <span class="token-box__text">{{ featured_token.full_name }}</span>
          </router-link>
          <div class="token-box__links">
            <a :href="featured_token.website" target="_blank">
              <SvgWebsiteIcon />
            </a>
            <a
              :href="`${get_scanner_root()}token/${featured_token.address}`"
              target="_blank"
              v-if="featured_token.address"
            >
              <SvgScannerLogo />
            </a>
          </div>
        </div>

        <div
          class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-4-phone
            mdc-layout-grid__cell--span-4-tablet
            mdc-layout-grid__cell--span-6-desktop
            home-section
          "
        >
          <div class="home-section__title">
            <span class="material-icons">emoji_events</span>
            Most Visited
          </div>
          <TokenButton
            v-for="(token, index) in $store.getters.get_home_tokens(
              'most_visited',
              $route.params.chain
            )"
            :key="token.address"
            class="home-section__list-token"
            :token_data="token"
            hideNew
            :rank="index + 1"
          >
          </TokenButton>
        </div>

        <div
          class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-4-phone
            mdc-layout-grid__cell--span-4-tablet
            mdc-layout-grid__cell--span-6-desktop
            home-section
          "
        >
          <div class="home-section__title">
            <span class="material-icons">watch_later</span>
            Recently Listed
          </div>
          <TokenButton
            v-for="token in $store.getters.get_home_tokens(
              'recently_listed',
              $route.params.chain
            )"
            :key="token.address"
            class="home-section__list-token"
            :token_data="token"
            hideNew
          >
          </TokenButton>
        </div>

        <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <Button outlined :route="`/${$route.params.chain}/listed-tokens`">
            View all Listed Tokens
          </Button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Button from "@/components/atoms/material/Button.vue";
import TokenButton from "@/components/molecules/TokenButton.vue";
import iFrameBlock from "@/components/molecules/iFrameBlock.vue";
import Footer from "@/components/organisms/Footer/Footer.vue";
import chainUtils from "@/utils/chains.js";

export default {
  name: "Home",
  components: {
    Button,
    TokenButton,
    iFrameBlock,
    Footer,
  },
  mixins: [chainUtils],
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.home-header {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  button,
  .home-search {
    margin: 5px 5px 10px 5px;
  }

  button {
    flex-shrink: 0;
  }
}

.home-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  background-color: rgba(white, 0.2);
  color: rgba(white, 0.8);
  font-size: 0.9em;
  width: 400px;
  height: 38px;
  box-sizing: border-box;
  padding: 8px 10px 8px 13px;
  border-radius: 100px;
  transition: background-color 100ms ease-in-out;
  flex-shrink: 1;

  &:hover {
    background-color: rgba(white, 0.3);
  }

  .material-icons {
    font-size: 18px;
  }
}

.token-box {
  width: 100%;
  display: flex;
  height: 190px;
  border-radius: 20px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  background: url(https://storage.googleapis.com/public-moonlight/token-background.svg)
    center center;
  background-repeat: no-repeat;
  background-position: center;

  &.--last {
    margin-bottom: 16px;
  }

  .token-box__router {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    transition: transform 250ms;

    &:hover:not(.token-box__router--disabled) {
      transform: translateY(-4px);
    }

    &.token-box__router--disabled {
      pointer-events: none;
    }
  }

  .token-box__text {
    padding: 8px;
    font-size: 1.3em;
    font-weight: bolder;
  }

  .token-box__image {
    height: 70px;
    width: 70px;
    margin-top: 8px;
    border-radius: 100px;
  }

  .token-box__label {
    top: 8px;
    right: 8px;
    position: absolute;
    font-weight: bolder;
    padding: 4px 8px;
    border-radius: 20px;
  }

  .token-box__links {
    display: flex;
    align-items: center;

    a {
      padding: 8px;
      height: 22px;
      width: 22px;
      border-radius: 100px;
      margin-left: -2px;
      transition: background-color 250ms;

      svg {
        height: 100%;
        fill: white;
        opacity: 0.9;
      }

      &:hover {
        background-color: rgba($theme-dark-pink, 0.7);
        svg {
          opacity: 1;
        }
      }
    }
  }
}

.mdc-layout-grid__cell--span-12 {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.mdc-layout-grid__inner {
  margin-bottom: 40px;
}

.home-section {
  padding: 12px;
  background-color: rgba($theme-dark-grey, 0.5);
  border-radius: 20px;

  .home-section__title {
    font-size: 1.3em;
    font-weight: bolder;
    text-align: center;
    margin: 4px 8px 12px 8px;
    color: $theme-light-pink;
    display: flex;
    align-items: center;
    justify-content: center;

    .material-icons {
      margin-right: 8px;
    }
  }

  .home-section__list-token {
    width: 100%;
    margin-bottom: 8px;
  }
}

.home-section__logos {
  text-align: center;
  margin-bottom: 12px;
}

.home-section__list-logo {
  img {
    border-radius: 50%;
    height: 40px;
    margin: 4px;
    cursor: pointer;
    border: 3px solid transparent;

    &:hover {
      border-color: $theme-pink;
    }
  }
  &.home-section__list-logo--disabled {
    pointer-events: none;
  }
}

@media (max-width: 500px) {
  .token-box {
    height: 160px;

    .token-box__text {
      font-size: 1.1em;
    }

    .token-box__image {
      height: 55px;
      width: 55px;
      margin-top: 5px;
    }

    .token-box__label {
      padding: 3px 6px;
      font-size: 0.8em;
    }

    .token-box__links {
      a {
        padding: 5px 7px;
        height: 20px;
        width: 20px;
      }
    }
  }
}

@media (max-width: 839px) {
  .home-header {
    margin-top: 30px;
  }
}

@media (max-width: 520px) {
  .home-header {
    flex-direction: column;
    margin-top: 20px;
  }

  .home-search {
    max-width: calc(95%);
  }
}

@media (max-width: 340px) {
  .home-search {
    font-size: 0.8em;
  }
}
</style>
