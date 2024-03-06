<template>
  <!-- High Transaction Volume Dialog -->
  <Dialog ref="highVolumeDialog">
    <div class="mdc-dialog__content">
      <h4>High Transfer Volume</h4>
      <p>
        We detected that this wallet has a high volume of
        <b>{{ transferTypeFullName }}</b
        >. Multiple interpretations might apply: untagged exchange wallet,
        unlabeled contract, trading bot, etc. Please, make your own due
        diligence. <br /><br />
        Also remember that we only considered its most recent
        {{ transferTypeFullName }} at the date of this snapshot to compute its
        bubble map links.
      </p>
    </div>
    <div class="mdc-dialog__actions">
      <Button data-mdc-dialog-action="discard">Close</Button>
    </div>
  </Dialog>
  <!-- Links Dialog -->
  <Dialog ref="linksDialog" :defaultWidth="600">
    <div class="mdc-dialog__content links-dialog" v-if="selected_node">
      <h2>
        <img
          alt=""
          v-if="trackedImageUrl"
          class="links-dialog__image"
          :src="trackedImageUrl"
        />
        <LogoPlaceholder
          v-else
          :letters="get_tracked_token_symbol.substring(0, 2)"
          class="links-dialog__image"
          :size="24"
        />
        {{ get_tracked_token_symbol }}
        Transfers Details
      </h2>
      <template v-if="$route.params.chain != 'avax'">
        <i v-if="tokenIndex == -1">
          Click on the amounts to show the
          {{ get_scanner_name() }} explorer.
        </i>
        <a
          v-else
          :href="`${get_scanner_root()}token/${
            graph_data.token_links[tokenIndex].address
          }?a=${selected_node}`"
          target="_blank"
          class="links-dialog__top-link"
        >
          Show on {{ get_scanner_name() }}
          <span class="material-icons">outbound</span>
        </a>
      </template>
      <h3>
        #{{ getAddressRank(selected_node) }} -
        {{ getFormatedName(selected_node) }}
      </h3>

      <ul>
        <li v-for="elt in linkedWallets" :key="elt['address']">
          <b>#{{ elt["rank"] }} - </b>
          <span
            ><span
              v-if="getNodeProperty(elt.address, 'is_contract')"
              class="material-icons links-dialog__special-icon"
            >
              description </span
            ><span
              v-if="getNodeProperty(elt.address, 'is_exchange')"
              class="material-icons links-dialog__special-icon"
            >
              wifi_protected_setup </span
            ><span
              v-if="getNodeProperty(elt.address, 'is_dead')"
              class="material-icons links-dialog__special-icon"
            >
              dangerous </span
            >{{ getFormatedName(elt.address) }}</span
          >
          <template v-if="graph.version == 1">
            <a
              v-if="elt['direction'] == 'from' || elt['direction'] == 'both'"
              :href="`${addressLink}?fromaddress=${elt['address']}`"
              target="_blank"
              class="links-dialog__link --from"
              >from
              <svg viewBox="0 0 512.171 512.171">
                <path
                  d="M35.448 295.532l213.418 213.525c2.006 2.006 4.715 3.115 7.552 3.115 2.837 0 5.547-1.131 7.552-3.136l212.779-213.504c3.051-3.051 3.947-7.637 2.304-11.627-1.664-3.989-5.547-6.571-9.856-6.571H351.864V10.667C351.864 4.779 347.085 0 341.197 0H170.53c-5.888 0-10.667 4.779-10.667 10.667v266.668H42.978c-4.309 0-8.192 2.603-9.856 6.592-1.664 3.989-.725 8.554 2.326 11.605z"
                />
              </svg>
            </a>
            <a
              v-if="elt['direction'] == 'to' || elt['direction'] == 'both'"
              :href="`${addressLink}?toaddress=${elt['address']}`"
              target="_blank"
              class="links-dialog__link --to"
              >to
              <svg viewBox="0 0 513 513">
                <path
                  d="M476.723 216.64L263.305 3.115C261.299 1.109 258.59 0 255.753 0c-2.837 0-5.547 1.131-7.552 3.136L35.422 216.64c-3.051 3.051-3.947 7.637-2.304 11.627 1.664 3.989 5.547 6.571 9.856 6.571h117.333v266.667c0 5.888 4.779 10.667 10.667 10.667h170.667c5.888 0 10.667-4.779 10.667-10.667V234.837h116.885c4.309 0 8.192-2.603 9.856-6.592 1.664-3.989.725-8.554-2.326-11.605z"
                />
              </svg>
            </a>
          </template>
          <template v-else>
            <a
              v-if="elt['amounts']['from'] != 0"
              :href="`${addressLink}?fromaddress=${elt['address']}`"
              target="_blank"
              class="links-dialog__link --from"
              :disabled="
                tokenIndex == -1 && $route.params.chain != 'avax' ? null : true
              "
              >{{ getFormattedAmount(elt["amounts"]["from"]) }}
              <svg viewBox="0 0 512.171 512.171">
                <path
                  d="M35.448 295.532l213.418 213.525c2.006 2.006 4.715 3.115 7.552 3.115 2.837 0 5.547-1.131 7.552-3.136l212.779-213.504c3.051-3.051 3.947-7.637 2.304-11.627-1.664-3.989-5.547-6.571-9.856-6.571H351.864V10.667C351.864 4.779 347.085 0 341.197 0H170.53c-5.888 0-10.667 4.779-10.667 10.667v266.668H42.978c-4.309 0-8.192 2.603-9.856 6.592-1.664 3.989-.725 8.554 2.326 11.605z"
                />
              </svg>
            </a>
            <a
              v-if="elt['amounts']['to'] != 0"
              :href="`${addressLink}?toaddress=${elt['address']}`"
              target="_blank"
              class="links-dialog__link --to"
              :disabled="
                tokenIndex == -1 && $route.params.chain != 'avax' ? null : true
              "
              >{{ getFormattedAmount(elt["amounts"]["to"]) }}
              <svg viewBox="0 0 513 513">
                <path
                  d="M476.723 216.64L263.305 3.115C261.299 1.109 258.59 0 255.753 0c-2.837 0-5.547 1.131-7.552 3.136L35.422 216.64c-3.051 3.051-3.947 7.637-2.304 11.627 1.664 3.989 5.547 6.571 9.856 6.571h117.333v266.667c0 5.888 4.779 10.667 10.667 10.667h170.667c5.888 0 10.667-4.779 10.667-10.667V234.837h116.885c4.309 0 8.192-2.603 9.856-6.592 1.664-3.989.725-8.554-2.326-11.605z"
                />
              </svg>
            </a>
          </template>
        </li>
      </ul>
      <div v-if="graph.version >= 2" class="links-dialog__caption">
        <span class="links-dialog__link --from">
          <svg viewBox="0 0 512.171 512.171">
            <path
              d="M35.448 295.532l213.418 213.525c2.006 2.006 4.715 3.115 7.552 3.115 2.837 0 5.547-1.131 7.552-3.136l212.779-213.504c3.051-3.051 3.947-7.637 2.304-11.627-1.664-3.989-5.547-6.571-9.856-6.571H351.864V10.667C351.864 4.779 347.085 0 341.197 0H170.53c-5.888 0-10.667 4.779-10.667 10.667v266.668H42.978c-4.309 0-8.192 2.603-9.856 6.592-1.664 3.989-.725 8.554 2.326 11.605z"
            />
          </svg>
        </span>
        <span class="links-dialog_caption-text">
          {{ get_tracked_token_symbol }} received by wallet #{{
            getAddressRank(selected_node)
          }}
        </span>
        <span class="links-dialog__link --to">
          <svg viewBox="0 0 513 513">
            <path
              d="M476.723 216.64L263.305 3.115C261.299 1.109 258.59 0 255.753 0c-2.837 0-5.547 1.131-7.552 3.136L35.422 216.64c-3.051 3.051-3.947 7.637-2.304 11.627 1.664 3.989 5.547 6.571 9.856 6.571h117.333v266.667c0 5.888 4.779 10.667 10.667 10.667h170.667c5.888 0 10.667-4.779 10.667-10.667V234.837h116.885c4.309 0 8.192-2.603 9.856-6.592 1.664-3.989.725-8.554-2.326-11.605z"
            />
          </svg>
        </span>
        <span class="links-dialog_caption-text">
          {{ get_tracked_token_symbol }} sent by wallet #{{
            getAddressRank(selected_node)
          }}
        </span>
      </div>
      <i v-if="isHighVolume" class="links-dialog_warning">
        This wallet has a high volume of {{ transferTypeFullName }}, only the
        most recent at the date of the snapshot are considered here.
      </i>
      <i v-if="graph.version == 1" class="links-dialog_warning">
        Total amounts of transfered
        {{ get_native_token() }} are now available on fresher bubble maps.
        <a
          @click="
            () => {
              $refs.linksDialog.close();
              $parent.tryGraphRefresh();
            }
          "
        >
          Refresh this one
        </a>
        if you want to enjoy this feature.
      </i>
    </div>
    <div class="mdc-dialog__actions">
      <Button data-mdc-dialog-action="discard" data-mdc-dialog-initial-focus>
        Close
      </Button>
    </div>
  </Dialog>
</template>

<script>
import Dialog from "@/components/atoms/material/Dialog.vue";
import Button from "@/components/atoms/material/Button.vue";
import LogoPlaceholder from "@/components/atoms/LogoPlaceholder.vue";
import chainUtils from "@/utils/chains.js";
import graphUtils from "@/utils/graph.js";
import formatUtils from "@/utils/format.js";

export default {
  name: "WalletTransactions",
  props: {
    selected_node: String,
    graph_data: Object,
    graph: Object,
    tokenIndex: Number,
  },
  components: {
    Dialog,
    Button,
    LogoPlaceholder,
  },
  mixins: [chainUtils, graphUtils, formatUtils],
  computed: {
    addressLink() {
      return `${this.get_scanner_root()}address/${this.selected_node}`;
    },
    isHighVolume() {
      return this.graph_data.source_id == 1 || this.tokenIndex == -1
        ? this.isHighVolumeTransactions
        : this.graph_data.is_X721 && this.is_analysed
        ? this.isHighVolumeNFT
        : this.isHighVolumeTransfers;
    },
    isHighVolumeTransactions() {
      return (
        this.getNodeProperty(this.selected_node, "transaction_count") >= 2000
      );
    },
    isHighVolumeTransfers() {
      return this.getNodeProperty(this.selected_node, "transfer_count") >= 2000;
    },
    isHighVolumeNFT() {
      return (
        this.getNodeProperty(this.selected_node, "transfer_X721_count") >= 2000
      );
    },
    is_analysed() {
      return this.graph_data.version < 3
        ? false
        : this.tokenIndex == this.graph_data.token_links.length - 1;
    },
    trackedImageUrl() {
      if (this.is_analysed) {
        return this.img_name
          ? `https://storage.googleapis.com/public-bubblemaps/app/tokens-images/${this.img_name}`
          : null;
      } else {
        return `https://storage.googleapis.com/public-bubblemaps/app/modes-logos/${this.get_tracked_token_symbol.toLowerCase()}.png`;
      }
    },
    transferTypeFullName() {
      return this.graph_data.source_id == 1
        ? "transfers"
        : this.tokenIndex == -1
        ? `${this.get_native_token()} transfers`
        : "token transfers";
    },
    get_tracked_token_symbol() {
      return this.tokenIndex == -1
        ? this.get_native_token()
        : this.graph_data.token_links[this.tokenIndex].symbol;
    },
    linkedWallets() {
      var rep = {};
      if (this.graph_data.version == 1) {
        this.graph.links.forEach((link) => {
          if (link.source.address == this.selected_node) {
            let other = link.target.address;
            if (other != this.selected_node) {
              rep[other] =
                link.direction == "<->"
                  ? "both"
                  : link.direction == "->"
                  ? "to"
                  : "from";
            }
          } else if (link.target.address == this.selected_node) {
            let other = link.source.address;
            if (other != this.selected_node) {
              rep[other] =
                link.direction == "<->"
                  ? "both"
                  : link.direction == "<-"
                  ? "to"
                  : "from";
            }
          }
        });
        return Object.keys(rep)
          .map((key) => {
            return {
              address: key,
              direction: rep[key],
              rank: this.getAddressRank(key),
            };
          })
          .sort((a, b) => {
            return a["rank"] - b["rank"];
          });
      } else {
        this.graph.links.forEach((link) => {
          if (link.source.address == this.selected_node) {
            let other = link.target.address;
            if (other != this.selected_node) {
              rep[other] = { to: link.forward, from: link.backward };
            }
          } else if (link.target.address == this.selected_node) {
            let other = link.source.address;
            if (other != this.selected_node) {
              rep[other] = { to: link.backward, from: link.forward };
            }
          }
        });
        return Object.keys(rep)
          .map((key) => {
            return {
              address: key,
              amounts: rep[key],
              rank: this.getAddressRank(key),
            };
          })
          .sort((a, b) => {
            return a["rank"] - b["rank"];
          });
      }
    },
  },
  methods: {
    openLinks() {
      this.$refs.linksDialog.open();
    },
    openWarning() {
      this.$refs.highVolumeDialog.open();
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.links-dialog {
  h2 {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .links-dialog__image {
    height: 24px;
    width: 24px;
    margin-right: 8px;
    border-radius: 12px;
  }
  h3 {
    color: $theme-pink;
    color: var(--secondary-color, $theme-pink);
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      margin: 2px;
    }
  }
  .links-dialog__top-link {
    color: $theme-blue;
    .material-icons {
      font-size: 18px;
      position: relative;
      top: 4px;
      color: $theme-blue;
    }
  }

  .links-dialog__link {
    border-radius: 3px;
    padding: 2px 4px;
    margin-left: 4px;
    font-size: 0.9em;

    &.--from {
      background-color: rgba(green, 0.2);
      color: green;
      fill: green;
    }

    &.--to {
      background-color: rgba(red, 0.2);
      color: red;
      fill: red;
    }

    svg {
      height: 10px;
    }
  }
  a.links-dialog__link:hover {
    text-decoration: none;

    &:not([disabled]) {
      color: white;
      fill: white;
    }
  }

  a.links-dialog__link[disabled] {
    cursor: default;
    pointer-events: none;
    background-color: transparent;
  }

  .links-dialog__caption {
    padding-top: 8px;

    .links-dialog__link {
      margin-left: 0;
      margin-right: 4px;
    }
    .links-dialog_caption-text {
      margin-right: 8px;
    }
  }

  .links-dialog_warning {
    display: inline-block;
    margin-top: 16px;
    color: $theme-pink;
    color: var(--warning-color, $theme-pink);
  }

  .links-dialog__special-icon {
    font-size: 1em;
    position: relative;
    top: 2px;
    margin-right: 2px;
  }
}
</style>
