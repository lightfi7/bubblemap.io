<template>
  <div class="token-list">
    <TextField
      v-model="search_text"
      class="
        mdc-text-field--outlined mdc-text-field--with-trailing-icon
        token-list__text-field
      "
      hintText="Search Listed Tokens"
      trailingIcon="search"
      notchedOutline
    />
    <TokenButton
      v-for="token in filteredTokens"
      :key="token.full_name"
      class="token-list__button"
      :token_data="token"
    />
    <div v-if="filteredTokens.length == 0" class="token-list__no-results">
      No results found.
    </div>
    <div
      v-if="search_text != ''"
      @click="search_text = ''"
      class="token-list__action"
    >
      Reset Search
    </div>
  </div>
</template>

<script>
import TokenButton from "@/components/molecules/TokenButton.vue";
import TextField from "@/components/atoms/material/TextField.vue";

export default {
  name: "TokenList",
  props: {
    tokens: Array,
  },
  components: {
    TokenButton,
    TextField,
  },
  data: function () {
    return {
      search_text: "",
    };
  },
  computed: {
    filteredTokens() {
      if (this.search_text == "") {
        return this.tokens;
      } else {
        return this.tokens.filter(
          (el) =>
            el.full_name
              .toLowerCase()
              .includes(this.search_text.toLowerCase()) ||
            ("address" in el
              ? el.address.includes(this.search_text.toLowerCase())
              : false)
        );
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.token-list__button {
  width: 100%;
  margin-bottom: 8px;
}

.token-list__action {
  text-align: center;
  margin: 14px;
  color: $theme-pink;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.token-list__no-results {
  text-align: center;
  margin: 14px;
  color: $theme-dark-pink;
  font-style: italic;
}
</style>

<style lang="scss">
@import "assets/variables";
@import "@material/textfield";

.token-list__text-field {
  @include outlined-height(44px);
  @include label-color($theme-dark-pink);
  @include outline-color($theme-dark-pink);
  @include hover-outline-color($theme-pink);
  @include outline-shape-radius(16px);
  margin: 14px;
  width: calc(100% - 28px);

  &.mdc-text-field:not(.mdc-text-field--disabled)
    .mdc-text-field__icon--trailing {
    color: $theme-pink;
  }

  .mdc-text-field__icon {
    padding-right: 8px;
  }
}
</style>
