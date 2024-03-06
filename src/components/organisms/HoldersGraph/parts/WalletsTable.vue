<template>
  <div :class="'wallets-table' + (smallText ? ' --small-text' : '')">
    <h3>Wallets List</h3>
    <span
      class="material-icons close-button"
      aria-label="Close"
      alt="Close"
      @click="$parent.closeTable()"
    >
      close
    </span>
    <div class="search-box">
      <TextField
        v-model="search_text"
        class="
          mdc-text-field--outlined mdc-text-field--with-trailing-icon
          search-box__text-field
        "
        hintText="Search Wallets"
        trailingIcon="search"
        notchedOutline
      />
    </div>
    <!-- this div around buttons-row is needed on safari -->
    <div class="buttons-row-container">
      <div class="buttons-row noselect">
        <Tooltip text="Show All" id="wallets_table_show_all" />
        <div
          aria-describedby="wallets_table_show_all"
          :class="
            'buttons-row__button' + ($parent.is_all_shown ? ' --disabled' : '')
          "
          @click="$parent.revealAll()"
        >
          <span class="material-icons buttons-row__solo-icon">visibility</span>
        </div>
        <Tooltip text="Show Contracts" id="wallets_table_show_contracts" />
        <div
          aria-describedby="wallets_table_show_contracts"
          :class="
            'buttons-row__button' +
            ($parent.is_contracts_shown ? ' --disabled' : '')
          "
          @click="$parent.revealContracts()"
        >
          <span class="material-icons buttons-row__duo-icon --1">
            description
          </span>
          <span class="material-icons buttons-row__duo-icon --2"
            >visibility</span
          >
        </div>
        <Tooltip text="Hide Contracts" id="wallets_table_hide_contracts" />
        <div
          aria-describedby="wallets_table_hide_contracts"
          :class="
            'buttons-row__button' +
            ($parent.is_contracts_hidden ? ' --disabled' : '')
          "
          @click="$parent.hideContracts()"
        >
          <span class="material-icons buttons-row__duo-icon --1">
            description
          </span>
          <span class="material-icons buttons-row__duo-icon --2"
            >visibility_off</span
          >
        </div>
        <Tooltip text="Show Exchanges" id="wallets_table_show_exchanges" />
        <div
          aria-describedby="wallets_table_show_exchanges"
          :class="
            'buttons-row__button' +
            ($parent.is_exchanges_shown ? ' --disabled' : '')
          "
          @click="$parent.revealExchanges()"
        >
          <span class="material-icons buttons-row__duo-icon --1">
            wifi_protected_setup
          </span>
          <span class="material-icons buttons-row__duo-icon --2"
            >visibility</span
          >
        </div>
        <Tooltip text="Hide Exchanges" id="wallets_table_hide_exchanges" />
        <div
          aria-describedby="wallets_table_hide_exchanges"
          :class="
            'buttons-row__button' +
            ($parent.is_exchanges_hidden ? ' --disabled' : '')
          "
          @click="$parent.hideExchanges()"
        >
          <span class="material-icons buttons-row__duo-icon --1">
            wifi_protected_setup
          </span>
          <span class="material-icons buttons-row__duo-icon --2"
            >visibility_off</span
          >
        </div>
      </div>
    </div>
    <div class="wallets-list">
      <ul>
        <li
          v-for="node in filteredAddresses"
          :key="node.address"
          :class="
            isHidden(node)
              ? '--disabled'
              : (selected_node == node.address ? '--selected' : '') +
                (selected_group == node.group && selected_group != -1
                  ? ' --selected-group'
                  : '')
          "
          @click="
            () => {
              if (!isHidden(node)) {
                $parent.selectNode(node.address);
                $parent.selectGroup(node.group);
              }
            }
          "
        >
          <span class="wallets-list__name">
            <b>#{{ getAddressRank(node.address) }}</b> -
            <span
              class="wallets-list__bubble"
              v-if="!isHidden(node)"
              :style="`background-color: ${getGroupColor(
                node.group,
                '44'
              )}; border-color: ${getGroupColor(node.group)}`"
            ></span>
            <span
              v-if="node.is_contract"
              class="material-icons wallets-list__special-icon"
            >
              description
            </span>
            <span
              v-if="node.is_exchange"
              class="material-icons wallets-list__special-icon"
            >
              wifi_protected_setup
            </span>
            <span
              v-if="
                !!node.delegated_to &&
                $route.params.token == node.delegated_contract
              "
              class="material-icons wallets-list__special-icon"
            >
              how_to_vote
            </span>
            <span
              v-if="node.is_dead"
              class="material-icons wallets-list__special-icon"
            >
              dangerous
            </span>
            <span v-if="!node.name">{{
              getFormatedAddress(node.address)
            }}</span>
            <span v-else>{{ node.name }}</span>
          </span>
          <div class="wallets-list__end-container">
            <template
              v-if="
                !(
                  isHidden(node) &&
                  ($store.getters.get_percent_exclude == 'ON' ||
                    ($store.getters.get_percent_exclude == 'DEAD' &&
                      node.is_dead))
                )
              "
            >
              <b v-if="!graph_data.is_X721" class="wallets-list__percent">
                {{ getFormattedPercent(getPercentAddress(node.address)) }}%
              </b>
              <b v-else class="wallets-list__percent">
                {{ getFormattedAmount(getAmountAddress(node.address)) }}
              </b>
            </template>
            <div
              v-if="isHidden(node)"
              class="wallets-list__visibility"
              @click="$parent.revealWallet(node.address)"
            >
              <span class="material-icons">visibility</span>
            </div>
            <div
              v-else
              class="wallets-list__visibility"
              @click="$parent.hideWallet(node.address)"
            >
              <span class="material-icons">visibility_off</span>
            </div>
          </div>
        </li>

        <template v-if="filteredAddresses.length == 0">
          <template v-if="/^(0x[a-fA-F0-9]{40})$/.test(search_text)">
            <li class="wallets-list__no-results">
              <a
                :href="`${get_scanner_root()}token/${
                  $route.params.token
                }?a=${search_text}`"
                target="_blank"
              >
                <span>Not in top {{ graph_data.top_500 ? "500" : "150" }}</span
                ><br />
                <b>Show wallet on {{ get_scanner_name() }}</b>
              </a>
            </li>
            <template v-if="$store.getters.get_is_partner">
              <li
                class="wallets-list__no-results"
                v-if="!$parent.loading"
                @click="$parent.addAddress(search_text.toLowerCase())"
              >
                <a>
                  <b>Add wallet</b>
                </a>
              </li>
              <li class="wallets-list__no-results" v-else>
                <i>Loading...</i>
              </li>
            </template>
          </template>
          <template
            v-else-if="
              parsedAddresses.length != 0 && $store.getters.get_is_partner
            "
          >
            <li
              class="wallets-list__no-results"
              v-if="!$parent.loading"
              @click="addAddresses(parsedAddresses)"
            >
              <a>
                <b>Add {{ parsedAddresses.length }} wallets</b>
              </a>
            </li>
            <li class="wallets-list__no-results" v-else>
              <i>Loading...</i>
            </li>
          </template>
          <li v-else class="wallets-list__no-results --disabled">No results</li>
        </template>

        <li
          v-if="search_text != ''"
          @click="search_text = ''"
          class="wallets-list__reset-button"
        >
          Reset Filter
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import TextField from "@/components/atoms/material/TextField.vue";
import Tooltip from "@/components/atoms/material/Tooltip.vue";
import graphUtils from "@/utils/graph.js";
import chainUtils from "@/utils/chains.js";
import formatUtils from "@/utils/format.js";

export default {
  name: "WalletsTable",
  props: {
    selected_node: String,
    selected_group: Number,
    graph_data: Object,
    graph: Object,
    all_is_shown: Boolean,
  },
  components: {
    TextField,
    Tooltip,
  },
  mixins: [graphUtils, formatUtils, chainUtils],
  data: function () {
    return {
      search_text: "",
    };
  },
  computed: {
    filteredAddresses() {
      if (this.search_text == "") {
        return this.allAddresses;
      } else {
        return this.allAddresses.filter(
          (el) =>
            el["address"].includes(this.search_text.toLowerCase()) ||
            ("name" in el
              ? el["name"]
                  .toLowerCase()
                  .includes(this.search_text.toLowerCase())
              : false)
        );
      }
    },
    parsedAddresses() {
      const regex = new RegExp(/(0x[a-fA-F0-9]{40})/, "g");
      const addresses = this.search_text.toLowerCase().match(regex) || [];
      const unique = [...new Set(addresses)];
      return unique.filter(
        (el) => !this.allAddresses.map((a) => a["address"]).includes(el)
      );
    },
  },
  methods: {
    addAddresses(addresses) {
      this.$parent.addAddresses(addresses);
      this.search_text = "";
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
  border-color: var(--greyed-color, rgba($theme-dark-pink, 0.5));
}

.buttons-row__button {
  width: calc(100% / 5);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  cursor: pointer;

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

.buttons-row__duo-icon {
  font-size: 18px;
  position: relative;

  &.--1 {
    left: 3px;
    top: -2px;
    color: $theme-pink;
    color: var(--primary-color, $theme-pink);
  }

  &.--2 {
    right: 3px;
    top: 3px;
  }
}

.wallets-list {
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

      &.--selected-group {
        background-color: rgba($theme-pink, 0.2);
        background-color: var(--highlight-color, rgba($theme-pink, 0.2));
      }

      &:not(.--disabled) {
        cursor: pointer;

        &:hover {
          background-color: $theme-dark-pink;
          background-color: var(--greyed-color, $theme-dark-pink);
        }
      }

      &.--selected {
        background-color: $theme-pink !important;
        background-color: var(--primary-color, $theme-pink) !important;
        color: white;
        color: var(--on-primary-color, --text-color, white);
      }

      &.--disabled {
        opacity: 0.5;
      }

      .wallets-list__name {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        padding-right: 8px;
        font-size: 0.95em;
      }

      &.wallets-list__reset-button {
        color: $theme-pink;
        color: var(--primary-color, $theme-pink);
        font-style: italic;
        display: flex;
        justify-content: center;
      }

      &.wallets-list__no-results {
        font-style: italic;
        display: flex;
        justify-content: center;
        text-align: center;

        &:hover {
          b {
            color: $theme-pink;
            color: var(--primary-color, $theme-pink);
            text-decoration: underline;
          }
        }
      }

      .wallets-list__bubble {
        width: 10px;
        height: 10px;
        display: inline-block;
        border-radius: 50%;
        border-width: 1px;
        border-style: solid;
        margin: 0 5px 0 2px;
      }

      .wallets-list__special-icon {
        font-size: 1em;
        position: relative;
        top: 2px;
        margin-right: 1px;
      }

      .wallets-list__end-container {
        display: flex;
      }

      .wallets-list__visibility {
        cursor: pointer;
        margin: -4px -4px -4px 5px;
        padding: 4px;
        border-radius: 3px;

        .material-icons {
          font-size: 22px;
          line-height: 0;
          position: relative;
          top: 6px;
        }

        &:hover {
          background-color: white;
          background-color: var(--text-color, white);
          color: black;
          color: var(--bg-color, black);
        }
      }
    }
  }
}

.wallets-table.--small-text {
  h3 {
    padding: 8px;
    font-size: 16px;
  }
  .close-button {
    top: 6px;
    right: 6px;
  }
  ul li .wallets-list__visibility .material-icons {
    font-size: 18px;
    top: 4px;
  }
}
</style>

<style lang="scss">
@import "assets/variables";
@import "@material/textfield";

.search-box {
  background-color: $theme-dark-grey;
  background-color: var(--surface-color, $theme-dark-grey);
  width: 100%;
  border-bottom: 1px rgba($theme-dark-pink, 0.5) solid;
  border-color: var(--greyed-color, rgba($theme-dark-pink, 0.5));
}

.search-box__text-field {
  @include outlined-height(35px);
  @include label-color(var(--greyed-color, $theme-dark-pink));
  @include outline-color(var(--greyed-color, $theme-dark-pink));
  @include hover-outline-color(var(--primary-color, $theme-pink));
  @include focused-outline-color(var(--primary-color, $theme-pink));
  @include caret-color(var(--primary-color, $theme-pink));
  @include ink-color(var(--text-color, white));
  @include outline-shape-radius(10px);
  margin: 8px;
  width: calc(100% - 16px);

  &.mdc-text-field:not(.mdc-text-field--disabled)
    .mdc-text-field__icon--trailing {
    color: $theme-pink;
    color: var(--primary-color, $theme-pink);
  }

  .mdc-text-field__icon {
    padding-right: 8px;
  }
}

.wallets-table.--small-text {
  .search-box__text-field {
    @include outlined-height(30px);
  }
  .mdc-text-field__icon {
    padding-right: 6px;
  }
}
</style>
