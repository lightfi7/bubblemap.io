<template>
  <div class="token-button-container">
    <router-link
      :to="
        `/${$route.params.chain}/token/${token_data.address}` +
        (token_data.forced_id ? `?id=${token_data.forced_id}` : '')
      "
      :class="
        'token-button' + (token_data.address ? '' : ' token-button--disabled')
      "
    >
      <span v-if="!!rank" :class="`token-button__rank --${rank}`">{{
        rank
      }}</span>
      <img
        alt=""
        :src="`https://storage.googleapis.com/public-bubblemaps/app/tokens-images/${token_data.image}`"
        class="token-button__image"
      />
      <span
        :class="
          'token-button__text' +
          (!!rank ? ' token-button__text--with-rank' : '') +
          (token_data.is_new && !hideNew
            ? ' token-button__text--with-new'
            : '') +
          (token_data.is_soon ? ' token-button__text--with-soon' : '') +
          (token_data.is_rugged ? ' token-button__text--with-rugged' : '') +
          (token_data.is_nft ? ' token-button__text--with-nft' : '')
        "
      >
        {{ token_data.full_name }}
      </span>
      <div
        v-if="token_data.is_new && !hideNew"
        class="token-button__label token-button__label--new"
      >
        New
      </div>
      <div
        v-if="token_data.is_soon"
        class="token-button__label token-button__label--soon"
      >
        {{
          token_data.soon_custom_label
            ? token_data.soon_custom_label
            : "Coming Soon"
        }}
      </div>
      <div
        v-if="token_data.is_rugged"
        class="token-button__label token-button__label--rugged"
      >
        Rugged
      </div>
      <div
        v-if="token_data.is_nft"
        class="token-button__label token-button__label--nft"
      >
        NFT
      </div>
    </router-link>
    <div class="token-button-links">
      <a
        :href="token_data.website"
        target="_blank"
        :rel="token_data.is_rugged ? 'nofollow' : ''"
      >
        <SvgWebsiteIcon />
      </a>
      <a
        :href="`${get_scanner_root()}token/${token_data.address}`"
        target="_blank"
        v-if="token_data.address"
      >
        <SvgScannerLogo />
      </a>
    </div>
  </div>
</template>

<script>
import chainUtils from "@/utils/chains.js";

export default {
  name: "TokenButton",
  props: {
    token_data: Object,
    hideNew: Boolean,
    rank: Number,
  },
  mixins: [chainUtils],
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.token-button-container {
  position: relative;
}

.token-button {
  background-color: rgba($theme-dark-grey, 0.5);
  display: flex;
  border-radius: 100px;
  align-items: center;
  padding: 8px;
  transition: background-color 0.2s linear;

  &:hover {
    background-color: rgba($theme-dark-pink, 0.7);
  }

  &.token-button--disabled {
    pointer-events: none;
  }

  .token-button__rank {
    font-weight: bolder;
    font-size: 1.3em;
    width: 12px;
    text-align: center;
    margin-right: 8px;
    color: #9c9c9c;

    &.--1 {
      color: #ffda27;
    }
    &.--2 {
      color: #c6af44;
    }
    &.--3 {
      color: #ad9f5d;
    }
    &.--4 {
      color: #a29c83;
    }
  }

  .token-button__image {
    height: 40px;
    width: 40px;
    border-radius: 100px;
    margin-right: 12px;
  }

  .token-button__text {
    margin-right: 12px;
    max-width: calc(100% - 125px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.token-button__text--with-rank {
      max-width: calc(100% - 147px);
    }

    &.token-button__text--with-new {
      max-width: calc(100% - 190px);
    }

    &.token-button__text--with-soon {
      max-width: calc(100% - 212px);
    }

    &.token-button__text--with-rugged {
      max-width: calc(100% - 206px);
    }

    &.token-button__text--with-nft {
      max-width: calc(100% - 184px);
    }
  }

  .token-button__label {
    font-weight: bolder;
    padding: 4px 8px;
    border-radius: 20px;

    &.token-button__label--new {
      background-color: $theme-pink;
    }
    &.token-button__label--soon {
      background-color: $theme-blue;
    }
    &.token-button__label--rugged {
      background-color: #b00020;
    }
    &.token-button__label--nft {
      background-color: $theme-purple;
    }
  }
}

.token-button-links {
  top: 0;
  right: 0;
  padding-right: 8px;
  position: absolute;
  display: flex;
  height: 100%;
  align-items: center;

  a {
    padding: 8px;
    height: 22px;
    width: 22px;
    border-radius: 100px;
    margin-left: -2px;

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
</style>
