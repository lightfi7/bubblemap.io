<template>
  <div class="footer">
    <div class="mdc-layout-grid">
      <footer class="mdc-layout-grid__inner">
        <div
          class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-8-tablet
            mdc-layout-grid__cell--span-4-desktop
          "
        >
          <a
            target="_blank"
            href="https://bubblemaps.io"
            class="footer__logo-container"
          >
            <SvgBubblemapsLogo class="footer__logo" />
            <SvgBubblemapsText class="footer__logotext" />
            <SvgOutwardsIcon class="footer__outward-icon" />
          </a>
          <div class="footer__subtitle">
            Innovative visuals for Blockchain data
          </div>
          <div class="footer__socials">
            <a target="_blank" href="https://twitter.com/bubblemaps">
              <SvgTwitterLogo class="footer__social" />
            </a>
            <a target="_blank" href="https://t.me/bubblemaps">
              <SvgTelegramLogo class="footer__social" />
            </a>
            <a target="_blank" href="https://discord.gg/6DexjezHzV">
              <SvgDiscordLogo class="footer__social footer__social--discord" />
            </a>
            <a target="_blank" href="https://www.instagram.com/bubblemaps.io/">
              <SvgInstagramLogo
                class="footer__social footer__social--instagram"
              />
            </a>
            <a target="_blank" href="https://www.youtube.com/c/Bubblemaps/">
              <SvgYoutubeLogo class="footer__social footer__social--youtube" />
            </a>
            <a target="_blank" href="https://www.tiktok.com/@bubblemaps.io">
              <SvgTiktokLogo class="footer__social" />
            </a>
          </div>
          <div class="footer__policies --left">
            <a
              target="_blank"
              href="https://storage.googleapis.com/public-bubblemaps/legal/Terms%20%26%20Conditions%20-%20Bubblemaps.io.pdf"
            >
              Terms & Conditions
            </a>
            -
            <a
              target="_blank"
              href="https://storage.googleapis.com/public-bubblemaps/legal/Cookies%20-%20Bubblemaps.io.pdf"
            >
              Cookies
            </a>
            -
            <a
              target="_blank"
              href="https://storage.googleapis.com/public-bubblemaps/legal/Privacy%20Policy%20-%20%20Bubblemaps.io.pdf"
            >
              Privacy
            </a>
          </div>
        </div>
        <div
          class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-2
            mdc-layout-grid__cell--span-2-desktop
          "
        >
          <h5>About</h5>
          <a target="_blank" href="https://bubblemaps.io/">Main Website</a>
          <a target="_blank" href="https://bubblemaps.io/case-studies"
            >Case Studies</a
          >
          <a target="_blank" href="https://bubblemaps.io/get-premium"
            >Get Premium</a
          >
          <a
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdj9s9DhslOWlgv1xaJRlOAAv-3lYOzR7W9IWpnv0v0b2EFog/viewform"
          >
            Get Listed
          </a>
        </div>
        <div
          class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-2
            mdc-layout-grid__cell--span-2-desktop
          "
        >
          <h5>
            Supported<br />
            Chains
          </h5>
          <router-link to="/eth">Ethereum</router-link>
          <router-link to="/bsc">BNB Chain</router-link>
          <router-link to="/ftm">Fantom</router-link>
          <router-link to="/avax">Avalanche</router-link>
          <router-link to="/cro">Cronos</router-link>
          <router-link to="/arbi">Arbitrum</router-link>
          <router-link to="/poly">Polygon</router-link>
        </div>
        <div
          class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-2
            mdc-layout-grid__cell--span-2-desktop
          "
        >
          <h5>Integrations</h5>
          <a target="_blank" href="https://www.gem.xyz/">Gem.xyz</a>
          <a target="_blank" href="https://dexscreener.com/">DEX Screener</a>
          <a target="_blank" href="https://app.traitsniper.com/">
            Trait Sniper
          </a>
          <a target="_blank" href="https://nftkey.app/">NFTKey</a>
          <a target="_blank" href="https://moonscan.com/">MoonScan</a>
          <a target="_blank" href="https://www.geckoterminal.com/"
            >GeckoTerminal</a
          >
        </div>
        <div
          class="
            mdc-layout-grid__cell
            mdc-layout-grid__cell--span-2
            mdc-layout-grid__cell--span-2-desktop
          "
        >
          <h5>Contact</h5>
          <a target="_blank" href="https://bubblemaps.io/work-with-us">
            Work with Us
          </a>
          <a target="_blank" href="https://t.me/Bubblemaps_BD">Telegram</a>
          <a target="_blank" href="mailto:contact@bubblemaps.io">Email</a>
          <a target="_blank" href="mailto:help@bubblemaps.io">Support</a>
        </div>
        <div
          class="
            mdc-layout-grid__cell mdc-layout-grid__cell--span-12
            footer__policies
            --bottom
          "
        >
          <div>
            <a
              target="_blank"
              href="https://storage.googleapis.com/public-bubblemaps/legal/Terms%20%26%20Conditions%20-%20Bubblemaps.io.pdf"
            >
              Terms & Conditions
            </a>
            -
            <a
              target="_blank"
              href="https://storage.googleapis.com/public-bubblemaps/legal/Cookies%20-%20Bubblemaps.io.pdf"
            >
              Cookies
            </a>
            -
            <a
              target="_blank"
              href="https://storage.googleapis.com/public-bubblemaps/legal/Privacy%20Policy%20-%20%20Bubblemaps.io.pdf"
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.footer {
  width: 100vw;
  background-color: $theme-dark-grey;
  color: $theme-light-grey;
  font-size: 0.8rem;
  padding-top: 60px;
  padding-bottom: 40px;
  a {
    margin-bottom: 8px;

    &:hover {
      color: $theme-pink;
    }
  }

  .mdc-layout-grid {
    padding-top: 0;
  }

  .mdc-layout-grid__cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  h5 {
    margin-top: 0;
    color: white;
    margin-bottom: 10px;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.1em;
  }
}

.footer__subtitle {
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  font-size: 0.75rem;
}

.footer__socials {
  margin-top: 12px;
  display: flex;
  align-items: center;

  a {
    background-color: rgba($theme-pink, 0.3);
    transition: background-color 150ms linear;
    width: 35px;
    height: 35px;
    margin-right: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    .footer__social {
      height: 24px;
      fill: white;

      &.footer__social--instagram {
        height: 20px;
      }

      &.footer__social--youtube {
        height: 19px;
      }

      &.footer__social--discord {
        height: 18px;
        position: relative;
        top: -1px;
      }

      &.footer__social--email {
        height: 22px;
      }
    }

    &:hover {
      background-color: $theme-pink;
    }
  }
}

.footer__policies {
  margin-top: 10px;
  opacity: 0.7;
  font-size: 0.9em;

  &.--left {
    display: none;
  }
}

a.footer__logo-container {
  display: flex;
  align-items: center;
  padding: 15px;
  margin: -15px -15px 0 -15px;

  .footer__logo {
    height: 20px;
  }
  .footer__logotext {
    height: 20px;
    margin-left: 10px;
    position: relative;
    top: 1px;
    fill: white;
  }
  .footer__outward-icon {
    fill: rgba($theme-light-grey, 0.5);
    height: 15px;
    margin-left: 8px;
    transition: fill 200ms ease-in-out;
  }

  &:hover {
    .footer__outward-icon {
      fill: $theme-pink;
    }
  }
}

@media (min-width: $mdc-grid-desktop) {
  .footer {
    .mdc-layout-grid__cell {
      align-items: flex-start;
      text-align: left;
    }
  }
  .footer__policies {
    &.--left {
      display: initial;
    }

    &.--bottom {
      display: none;
    }
  }
}

@media (min-width: $mdc-desktop) {
  .footer {
    font-size: 0.9rem;
  }
}
</style>
