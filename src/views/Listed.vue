<template>
  <iFrameBlock v-if="isIframe()" />
  <div v-else class="page-container-with-footer">
    <div class="mdc-layout-grid">
      <div class="mdc-layout-grid__inner">
        <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-12">
          <div class="home-header">
            <h2>Listed Tokens</h2>
            <h3>
              Collectively, we can improve transparency in the space. Get listed
              to make your bubble map publicly available!
            </h3>
            <Button
              outlined
              chainColor
              link="https://docs.google.com/forms/d/e/1FAIpQLSdj9s9DhslOWlgv1xaJRlOAAv-3lYOzR7W9IWpnv0v0b2EFog/viewform"
              target="_blank"
            >
              Get Listed
            </Button>
          </div>
          <TokenList
            :tokens="$store.getters.get_listed_tokens[$route.params.chain]"
            class="token-list"
          />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Button from "@/components/atoms/material/Button.vue";
import iFrameBlock from "@/components/molecules/iFrameBlock.vue";
import Footer from "@/components/organisms/Footer/Footer.vue";
import TokenList from "@/components/organisms/TokenList/TokenList.vue";
import chainUtils from "@/utils/chains.js";

export default {
  name: "Listed",
  components: {
    Button,
    TokenList,
    iFrameBlock,
    Footer,
  },
  mixins: [chainUtils],
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.home-header {
  max-width: 600px;

  h3 {
    font-weight: 300;
  }
}

.token-list {
  width: 100%;
  max-width: 600px;
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

.mdc-button {
  margin-bottom: 16px;

  &.mdc-button--outlined {
    margin-left: 8px;
  }
}

.home-header {
  text-align: center;
  margin-bottom: 12px;
}
</style>
