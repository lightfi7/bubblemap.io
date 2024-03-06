<template>
  <div>
    <!-- Already Fresh Dialog -->
    <Dialog ref="alreadyFreshDialog">
      <div class="mdc-dialog__content">
        <h4>Already Fresh!</h4>
        <p>This map has been refreshed less than an hour ago.</p>
      </div>
      <div class="mdc-dialog__actions">
        <Button data-mdc-dialog-action="discard">Close</Button>
      </div>
    </Dialog>
    <!-- Not Premium Dialog -->
    <Dialog ref="notPremiumDialog">
      <div class="mdc-dialog__content">
        <h4>Get Premium to Refresh</h4>
        <p>
          History Mode is available to all users for listed tokens, but you
          still have to get premium to manually refresh them.
        </p>
        <div class="mdc-dialog__centered-button-container">
          <Button
            outlined
            link="https://bubblemaps.io/get-premium"
            target="_blank"
            >Read More</Button
          >
        </div>
      </div>
      <div class="mdc-dialog__actions">
        <Button data-mdc-dialog-action="discard">Close</Button>
      </div>
    </Dialog>
    <!-- Content -->
    <h3>Map History</h3>
    <span
      class="material-icons close-button"
      aria-label="Close"
      alt="Close"
      @click="$parent.closeTable()"
    >
      close
    </span>
    <template v-if="historicalMaps.length == 0">
      <div class="history-error" v-if="typesenseError">
        <span
          >An unexpected error has occured, please verify your internet
          connection.</span
        ><br />
        <span
          >If the problem persists, please
          <a
            :href="`mailto:help@bubblemaps.io?subject=History%20Error&body={chain:${$route.params.chain}, token:${$route.params.token}, uid:${$store.getters.get_user_id}}`"
            target="_blank"
            >contact our help desk</a
          >.</span
        >
      </div>
      <div class="history-loading" v-else><Loader :size="60" /></div>
    </template>
    <template v-else>
      <!-- this div around buttons-row is needed on safari -->
      <div class="buttons-row-container">
        <div class="buttons-row noselect">
          <!-- left arrow -->
          <div
            :class="
              'buttons-row__button' +
              (current == historicalMaps.length - 1 || refreshLoading
                ? ' --disabled'
                : '')
            "
            @click="goToPrevious()"
          >
            <span class="material-icons buttons-row__solo-icon"
              >skip_previous</span
            >
          </div>
          <!-- middle part -->
          <div
            v-if="refreshLoading"
            class="buttons-row__button --wide --disabled"
          >
            <Loader :size="16" />
          </div>
          <template v-else-if="current <= 0 || placeholderMode">
            <div
              v-if="!$store.getters.get_is_partner"
              class="buttons-row__button --wide"
              @click="tryRefresh()"
            >
              <span>Refresh</span>
              <span class="material-icons" aria-label="refresh" alt="refresh"
                >refresh</span
              >
            </div>
            <template v-else>
              <div
                class="buttons-row__button --semi-wide"
                @click="tryRefresh()"
              >
                <span class="material-icons" aria-label="refresh" alt="refresh"
                  >refresh</span
                >
              </div>
              <div class="buttons-row__button --semi-wide" @click="getTop500()">
                <span class="material-icons" aria-label="refresh" alt="refresh"
                  >keyboard_double_arrow_up</span
                >
              </div>
            </template>
          </template>
          <div
            v-else
            class="buttons-row__button --wide"
            @click="goToMostRecent()"
          >
            <span> Most Recent </span>
          </div>
          <!-- right arrow -->
          <div
            :class="
              'buttons-row__button' +
              (current == 0 || refreshLoading ? ' --disabled' : '')
            "
            @click="goToNext()"
          >
            <span class="material-icons buttons-row__solo-icon">skip_next</span>
          </div>
        </div>
      </div>
      <div class="history-list" ref="historyList">
        <ul>
          <li
            v-for="(map, i) in historicalMaps"
            :key="map.id"
            :class="
              'history-list__element' +
              (current == i ? ' --selected' : '') +
              (versionIsLoading(i, map.id) ? ' --loading' : '') +
              (refreshLoading ? ' --disabled' : '')
            "
            @click="goToIndex(i)"
          >
            <div class="history-list__element-left">
              <b>{{ formatDate(map.dt_update) }}</b>
              <template v-if="map.top_500">
                <Tooltip
                  text="Shows up to 500 holders"
                  id="historytable_top500_tooltip"
                />
                <span
                  class="material-icons history-list__tag"
                  aria-describedby="historytable_top500_tooltip"
                >
                  keyboard_double_arrow_up
                </span>
              </template>
            </div>
            <Loader v-if="versionIsLoading(i, map.id)" :size="19" /><span
              v-else
              >{{ getDateAge(map.dt_update) }}</span
            >
          </li>
        </ul>
      </div>
      <div v-if="placeholderMode" class="placeholder-overlay">
        <span class="material-icons">lock</span>
        <div class="placeholder-overlay__text">
          This map is
          {{ getDateAgeOld(new Date(graph_data.dt_update)) }},<br />get premium
          to refresh it<br />and access its history!
        </div>
        <Button raised link="https://bubblemaps.io/get-premium" target="_blank">
          Get Premium
        </Button>
      </div>
    </template>
  </div>
</template>

<script>
import formatUtils from "@/utils/format.js";
import graphUtils from "@/utils/graph.js";
import Loader from "@/components/atoms/Loader.vue";
import Button from "@/components/atoms/material/Button.vue";
import Dialog from "@/components/atoms/material/Dialog.vue";
import Tooltip from "@/components/atoms/material/Tooltip.vue";

export default {
  name: "GraphHistory",
  components: {
    Loader,
    Button,
    Dialog,
    Tooltip,
  },
  props: {
    graph_data: Object,
    refreshLoading: Boolean,
    historicalMaps: Object,
  },
  data: function () {
    return {
      current: 0,
      loading: false,
      targetId: null,
      interval: null,
      typesenseError: false,
    };
  },
  mixins: [formatUtils, graphUtils],
  computed: {
    placeholderMode() {
      return (
        this.historicalMaps.length > 0 &&
        this.historicalMaps.some((x) => x.id == "placeholder")
      );
    },
  },
  methods: {
    initData() {
      if (this.historicalMaps.length == 0 || this.placeholderMode) {
        if (
          this.$store.getters.get_is_premium ||
          this.$store.getters.is_public_token(
            this.$route.params.token,
            this.$route.params.chain
          )
        ) {
          this.getTypesenseData();
        } else if (
          !(
            this.$store.getters.is_logged_in &&
            this.$store.getters.get_is_premium == null
          )
        ) {
          this.initPlaceholderData();
        }
      }
      this.update_current();
      this.update_target_id();
    },
    tryRefresh() {
      if (this.data_age_hours() < 1) {
        this.$refs.alreadyFreshDialog.open();
      } else if (!this.$store.getters.get_is_premium) {
        this.$refs.notPremiumDialog.open();
      } else {
        let query = Object.assign({}, this.$route.query);
        delete query.id;
        this.$router.push({ query: { ...query, refresh: true } });
      }
    },
    getTop500() {
      let query = Object.assign({}, this.$route.query);
      delete query.id;
      this.$router.push({ query: { ...query, refresh: true, top500: true } });
    },
    goToId(id) {
      this.$router.push({ query: { ...this.$route.query, id: id } });
    },
    goToMostRecent() {
      let query = Object.assign({}, this.$route.query);
      delete query.id;
      this.$router.push({ query });
      this.$refs.historyList.scrollTop = 0;
    },
    goToIndex(index) {
      if (index == 0) {
        this.goToMostRecent();
      } else {
        this.goToId(this.historicalMaps[index].id);
      }
    },
    goToNext() {
      this.goToIndex(this.current - 1);
    },
    goToPrevious() {
      this.goToIndex(this.current + 1);
    },
    versionIsLoading(index, id) {
      if (this.placeholderMode) {
        return false;
      }
      if (index == 0) {
        return this.targetId == null && this.graph_data.id != id;
      } else {
        return this.targetId == id && this.graph_data.id != id;
      }
    },
    getTypesenseData() {
      this.typesenseError = false;
      const searchParameters = {
        q: "*",
        filter_by: `token_address:=${this.$route.params.token} && chain:=${this.$route.params.chain}`,
        sort_by: "dt_update:desc",
        per_page: 250,
      };
      const typesenseData = this.$typesense
        .collections("maps")
        .documents()
        .search(searchParameters);
      typesenseData
        .then((response) => {
          this.$parent.historicalMaps = response.hits.map((el) => {
            return {
              id: el.document.id,
              dt_update: new Date(el.document.dt_update * 1000),
              top_500: el.document.top_500 || false,
            };
          });
        })
        .catch(() => {
          this.typesenseError = true;
        });
    },
    update_current() {
      this.current = this.historicalMaps.findIndex(
        (map) => map.id == this.graph_data.id
      );
    },
    update_target_id() {
      if ("id" in this.$route.query) {
        this.targetId = this.$route.query.id;
      } else {
        this.targetId = null;
      }
    },
    intervalUpdate() {
      // Update the 'ago' times
      this.$forceUpdate();
    },
    initPlaceholderData() {
      this.$parent.historicalMaps = [...Array(30).keys()].map((i) => {
        let d = new Date();
        d.setDate(d.getDate() - (7 * i + 2));
        return { id: "placeholder", dt_update: d };
      });
    },
  },
  mounted: function () {
    this.initData();
    this.interval = setInterval(() => {
      this.intervalUpdate();
    }, 20000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
  watch: {
    $route: {
      handler: function () {
        this.update_target_id();
      },
    },
    graph_data: {
      handler: function () {
        this.update_current();
      },
    },
    historicalMaps: {
      handler: function () {
        this.update_current();
      },
    },
    "$store.state.is_premium": function () {
      this.initData();
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

h3 {
  padding: 10px;
  margin: 0;
  background-color: rgba(black, 0.4);
  background-color: var(--dark-surface-color, rgba(black, 0.4));
  width: 100%;
  font-size: 20px;
  box-sizing: border-box;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
}

.buttons-row {
  display: flex;
  border-bottom: 1px rgba($theme-dark-pink, 0.5) solid;
  border-top: 1px rgba($theme-dark-pink, 0.5) solid;
  border-color: var(--greyed-color, rgba($theme-dark-pink, 0.5));
}

.buttons-row__button {
  // 100% / 5
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  cursor: pointer;

  &.--wide {
    // (100% / 5) * 3
    width: 60%;

    .material-icons {
      font-size: 20px;
      margin-left: 2px;
    }
  }

  &.--semi-wide {
    // 60% / 2
    width: 30%;

    .material-icons {
      font-size: 20px;
    }
  }

  &.--disabled {
    cursor: default;
    pointer-events: none;

    span {
      opacity: 0.3;
    }
  }

  &:not(:last-child) {
    border-right: 1px rgba($theme-dark-pink, 0.5) solid;
    border-color: var(--greyed-color, rgba($theme-dark-pink, 0.5));
  }

  &:hover:not(.--disabled) {
    background-color: rgba($theme-dark-pink, 0.5);
    background-color: var(--greyed-color, rgba($theme-dark-pink, 0.5));
  }
}

.history-list {
  width: 100%;
  overflow-y: scroll;

  /* Hide scrollbar for Chrome, Safari and Opera */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 10px;
      display: flex;
      justify-content: space-between;
      text-align: center;
      cursor: pointer;

      &:hover {
        background-color: $theme-dark-pink;
        background-color: var(--greyed-color, $theme-dark-pink);
      }

      &.--disabled {
        pointer-events: none;
        opacity: 0.4;
      }

      &.--loading {
        background-color: rgba($theme-pink, 0.3);
        background-color: var(--highlight-color, rgba($theme-pink, 0.3));
      }

      &.--selected {
        background-color: $theme-pink !important;
        background-color: var(--primary-color, $theme-pink) !important;
        color: white;
        color: var(--on-primary-color, --text-color, white);
      }
    }
  }
}

.history-list__element-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.history-list__tag {
  padding: 1px;
  border-radius: 100px;
  background-color: $theme-blue;
  font-size: 1.2em;
  margin: -4px 0 -4px 8px;
}

.history-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
  padding: 15px;
  text-align: center;

  a {
    color: $theme-pink;

    &:hover {
      text-decoration: underline;
    }
  }
}

.history-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  // Hide for the first 1 second
  visibility: hidden;
  -moz-animation: cssAnimation 0s ease-in 1s forwards;
  -webkit-animation: cssAnimation 0s ease-in 1s forwards;
  -o-animation: cssAnimation 0s ease-in 1s forwards;
  animation: cssAnimation 0s ease-in 1s forwards;
  -webkit-animation-fill-mode: forwards;
  animation-fill-mode: forwards;
}

@keyframes cssAnimation {
  to {
    visibility: visible;
  }
}

.placeholder-overlay {
  background-color: rgba(black, 0.8);
  position: absolute;
  top: 44px;
  width: 100%;
  height: calc(100% - 44px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 20px 0px;
  box-sizing: border-box;

  .material-icons {
    font-size: 60px;
    background-color: $theme-pink;
    width: 75px;
    height: 75px;
    border-radius: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .placeholder-overlay__text {
    margin: 20px 10px;
    font-weight: 600;
  }
}

.mdc-dialog__centered-button-container {
  text-align: center;
}
</style>
