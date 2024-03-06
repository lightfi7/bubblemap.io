<template>
  <Dialog
    :defaultWidth="700"
    :fullHeight="true"
    :mobileFullScreen="true"
    ref="dialog"
    @closing="onClose()"
    @opened="onOpen()"
  >
    <div class="full-search__field-box">
      <TextField
        v-model="inputTerm"
        class="
          mdc-text-field--outlined mdc-text-field--with-trailing-icon
          full-search__field
        "
        hintText="Search by name, address, symbol"
        trailingIcon="search"
        notchedOutline
      />
    </div>
    <div class="full-search__facets" v-if="results.length > 0">
      <div
        v-for="facet in facets"
        :key="facet.value"
        class="full-search__facet"
      >
        <Tag :value="facet.value" />
        <span class="full-search__facet-count">{{ facet.count }}</span>
      </div>
    </div>
    <div class="mdc-dialog__content">
      <div v-if="error && results.length > 0" class="full-search__bottom-error">
        An unexpected error has occured, please verify your
        internet&nbsp;connection.
      </div>
      <div v-if="defaultLayout" class="full-search__results --default">
        <template v-if="defaultDataReady">
          <div class="full-search__section-title">
            Trending on {{ get_chain_full_name() }}
          </div>
          <div class="full-search__trending">
            <div
              v-for="token in trending_tokens"
              :key="token.address"
              class="full-search__trending-token"
              @click="go_to_token($route.params.chain, token.address)"
            >
              <img
                alt=""
                :src="`https://storage.googleapis.com/public-bubblemaps/app/tokens-images/${token.image}`"
              />
              <span>{{ token.full_name }}</span>
            </div>
          </div>
          <template v-if="recentlyViewed.length > 0">
            <div class="full-search__section-title">Recently Viewed</div>
            <MapResult
              v-for="result in recentlyViewed"
              :result="result"
              :key="`${result.chain}:${result.token_address}`"
              @click="go_to_token(result.chain, result.untouched_address)"
            />
            <div
              class="full-search__clean-history"
              @click="cleanRecentlyViewed()"
            >
              Clean local history
            </div>
          </template>
          <div v-else class="full-search__welcome">
            <div class="full-search__welcome-title">Welcome to Bubblemaps!</div>
            <div class="full-search__welcome-text">
              Choose a token or NFT collection and discover the power of our
              bubbles
            </div>
            <Button outlined link="https://bubblemaps.io" target="_blank">
              Learn More
            </Button>
          </div>
        </template>
      </div>
      <div v-else class="full-search__results">
        <div class="full-search__no-result" v-if="noResultMessage">
          <div class="full-search__no-result-line1">
            No maps found for this query
          </div>
          <div class="full-search__no-result-line2" v-if="!is_valid_token">
            Please try with the contract address
          </div>
        </div>
        <template v-if="loading">
          <div v-if="results.length == 0" class="full-search__main-loader">
            <Loader :size="70" />
          </div>
          <div v-else class="full-search__bottom-loader">
            <div class="full-search__bottom-loader-overlay">
              <Loader :size="40" />
            </div>
          </div>
        </template>
        <div
          v-if="error && results.length == 0"
          class="full-search__main-error"
        >
          <span
            >An unexpected error has occured, please verify your
            internet&nbsp;connection.</span
          ><br />
          <span
            >If the problem persists, please
            <a
              :href="`mailto:help@bubblemaps.io?subject=Search%20Error&body={inputTerm:${inputTerm}}`"
              target="_blank"
              >contact our help desk</a
            >.</span
          >
        </div>
        <MapResult
          v-for="result in results"
          :result="result"
          :key="`${result.chain}:${result.untouched_address}`"
          @click="go_to_token(result.chain, result.untouched_address)"
        />
        <div v-if="is_valid_token" class="address-search">
          <div class="address-search__line1">
            Don't find the map you are looking&nbsp;for?
          </div>
          <template
            v-if="
              $store.getters.is_logged_in &&
              $store.getters.get_is_premium == null
            "
          >
            <Loader :size="40" class="address-search__loader" />
          </template>
          <template v-else-if="$store.getters.get_is_premium">
            <div class="address-search__line2">Choose the chain!</div>
            <div class="address-search__line3">
              We will compute the new map on the&nbsp;fly.
            </div>
            <ChainSelector />
          </template>
          <template v-else>
            <div class="address-search__line2">
              Get premium to compute it on the fly.
            </div>
            <Button
              outlined
              link="https://bubblemaps.io/get-premium"
              target="_blank"
              >Read More</Button
            >
          </template>
        </div>
      </div>
    </div>
    <div class="mdc-dialog__actions">
      <Button data-mdc-dialog-action="discard">Close</Button>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "@/components/atoms/material/Dialog.vue";
import Button from "@/components/atoms/material/Button.vue";
import TextField from "@/components/atoms/material/TextField.vue";
import Loader from "@/components/atoms/Loader.vue";
import Tag from "@/components/atoms/Tag.vue";
import MapResult from "@/components/organisms/FullSearch/parts/MapResult.vue";
import ChainSelector from "@/components/organisms/FullSearch/parts/ChainSelector.vue";
import chainUtils from "@/utils/chains.js";
import _ from "lodash";

export default {
  name: "FullSearch",
  components: {
    Dialog,
    Button,
    TextField,
    Loader,
    Tag,
    MapResult,
    ChainSelector,
  },
  mixins: [chainUtils],
  data() {
    return {
      inputTerm: "",
      loading: false,
      error: false,
      defaultLayout: true,
      noResultMessage: false,
      results: [],
      facets: [],
      recentlyViewed: null,
      trending_tokens: null,
    };
  },
  methods: {
    open() {
      this.$refs.dialog.open();
    },
    close() {
      this.$refs.dialog.close();
    },
    doCommand(e) {
      if (e.keyCode == 13) {
        // enter was pressed
        if (this.is_valid_token) {
          // this.go_to_token(this.$route.params.chain, this.inputTerm);
          // this.close();
        }
      }
    },
    onClose() {
      this.inputTerm = "";
      this.recentlyViewed = null;
      this.trending_tokens = null;
    },
    onOpen() {
      this.getrecentlyViewed();
      this.getTrendingTokens();
    },
    getrecentlyViewed() {
      this.recentlyViewed = localStorage.getItem("recently_viewed")
        ? JSON.parse(localStorage.getItem("recently_viewed"))
        : [];
    },
    cleanRecentlyViewed() {
      localStorage.setItem("recently_viewed", JSON.stringify([]));
      this.recentlyViewed = [];
    },
    getTrendingTokens() {
      this.trending_tokens = this.$store.getters.get_trending_tokens(
        this.$route.params.chain
      );
    },
    fetchData: _.debounce(function () {
      this.error = false;
      if (this.inputTerm == "") {
        this.results = [];
        this.facets = [];
        this.defaultLayout = true;
      } else {
        this.loading = true;
        this.defaultLayout = false;
        this.noResultMessage = false;
        const searchParameters = {
          q: this.inputTerm,
          query_by: "full_name, symbol, token_address",
          num_typos: "2, 1, 0",
          group_by: "chain, token_address",
          facet_by: "chain",
          filter_by: `chain:=[${this.all_chains.join()}]`,
          exhaustive_search: true,
          sort_by: "_text_match:desc, dt_update:desc",
          group_limit: 1,
          per_page: 30,
        };
        const typesenseData = this.$typesense
          .collections("maps")
          .documents()
          .search(searchParameters);
        typesenseData
          .then((response) => {
            const typesenseResults = response.grouped_hits.map((el) => {
              return {
                ...el.hits[0].document,
                ...el.hits[0].highlights.reduce(
                  (acc, cur) => ({ ...acc, [cur["field"]]: cur["snippet"] }),
                  {}
                ),
                untouched_address: el.hits[0].document["token_address"],
              };
            });
            this.results = this.getEnrichedResults(typesenseResults);
            this.facets = response.facet_counts[0].counts;
            this.loading = false;
            this.noResultMessage = this.results.length == 0;
          })
          .catch(() => {
            this.error = true;
            this.loading = false;
          });
      }
    }, 150),
    go_to_token(chain, token) {
      this.inputTerm = "";
      const listed_data = this.$store.getters.get_listed_token(token, chain);
      this.$router.push(
        `/${chain}/token/${token}` +
          (listed_data && listed_data.forced_id
            ? `?id=${listed_data.forced_id}`
            : "")
      );
      this.close();
    },
    go_to_input(chain) {
      this.go_to_token(chain, this.inputTerm.toLowerCase());
    },
    getEnrichedResults(typesenseResults) {
      return typesenseResults
        .map((el, index) => {
          const data = this.$store.getters.get_listed_token(
            el.token_address,
            el.chain
          );
          return data
            ? {
                ...el,
                index,
                listed: true,
                img: data.image,
              }
            : { ...el, index, listed: false };
        })
        .sort(function (x, y) {
          return y.listed - x.listed || x.index - y.index;
        });
    },
  },
  computed: {
    is_valid_token() {
      return /^(0x[a-fA-F0-9]{40})$/.test(this.inputTerm);
    },
    defaultDataReady() {
      return this.trending_tokens !== null && this.recentlyViewed !== null;
    },
  },
  watch: {
    inputTerm: "fetchData",
  },
  mounted() {
    window.addEventListener("keypress", this.doCommand);
  },
  unmounted() {
    window.removeEventListener("keypress", this.doCommand);
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.full-search__field-box {
  padding: 20px;
  border-bottom: 1px solid rgba(white, 0.1);
}

.full-search__field {
  width: 100%;
  .mdc-text-field__icon {
    padding-right: 8px;
  }
}

.full-search__facets {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(white, 0.1);
}

.full-search__facet {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.full-search__facet-count {
  margin-left: 8px;
  font-size: 0.9em;
}

.full-search__default-message {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.full-search__main-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 100%;
}

.full-search__bottom-error {
  color: white;
  position: absolute;
  bottom: 44px;
  left: 18px;
  text-align: center;
  width: calc(100% - 36px);
  background-color: rgba($mdc-theme-error, 0.9);
  border-radius: 4px;
  padding: 4px;
  box-sizing: border-box;
  font-size: 0.95em;
  z-index: 1;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.full-search__results {
  margin: -5px;
  color: white;
  height: 100%;
  position: relative;

  &.--default {
    animation: 0.6s ease-in-out 0s 1 fadeIn;
  }
}

.full-search__trending {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  margin: 15px 0 30px 0;
}

.full-search__trending-token {
  background-color: rgba(white, 0.1);
  width: calc(33% - 1px);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 200ms ease-in-out;
  padding: 14px 8px;
  box-sizing: border-box;
  text-align: center;

  &:hover {
    background-color: rgba(white, 0.2);
  }

  img {
    width: 50px;
    height: 50px;
    border-radius: 50px;
    margin-bottom: 5px;
  }
}

@media (max-width: 510px) {
  .full-search__trending-token {
    width: calc(50% - 2px);
    font-size: 0.9em;
    padding: 10px 6px;

    &:nth-child(3) {
      display: none;
    }

    img {
      width: 40px;
      height: 40px;
    }
  }
}

.full-search__section-title {
  text-align: center;
  margin-bottom: 6px;
  font-size: 1.2em;
  font-weight: 700;
}

.full-search__clean-history {
  padding: 6px;
  text-align: center;
  font-size: 0.9em;
  color: $theme-pink;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.full-search__welcome {
  text-align: center;
  padding: 30px 10px 10px 10px;
}

.full-search__welcome-title {
  font-size: 1.4em;
  font-weight: 800;
}

.full-search__welcome-text {
  margin: 10px 0;
}

@media (max-width: 450px) {
  .full-search__facets {
    display: none;
  }
}

.full-search__main-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.full-search__bottom-loader {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.full-search__bottom-loader-overlay {
  background-color: rgba(white, 0.1);
  padding: 8px;
  border-radius: 100px;
}

.full-search__no-result {
  padding-top: 8px;
  text-align: center;
}

.full-search__no-result-line1 {
  color: $theme-pink;
}

.full-search__no-result-line2 {
  font-weight: 600;
}

.address-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  text-align: center;
}

.address-search__line2 {
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 20px;
}

.address-search__line3 {
  font-style: italic;
  margin: -5px 0 10px 0;
}

.address-search__loader {
  margin-top: 20px;
}

.mdc-dialog__actions {
  border-top: 1px solid rgba(white, 0.03);
}
</style>

<style lang="scss">
@import "@material/textfield";

.mdc-text-field--outlined.full-search__field {
  @include outline-shape-radius(30px);
  .mdc-text-field__icon {
    padding-right: 15px;
    font-size: 30px;
  }
}
</style>
