<template>
  <div>
    <!-- Selected Node Window -->
    <div
      v-if="selected_node"
      :class="'node-box' + (smallText ? ' --small-text' : '')"
    >
      <div class="node-box__title">
        <span>
          Selected Wallet
          <span
            class="node-box__hide"
            @click="$parent.hideWallet(selected_node)"
          >
            <span class="material-icons">visibility_off</span>
          </span>
        </span>
        <span
          class="material-icons node-box__close"
          aria-label="Close"
          alt="Close"
          @click="$parent.deselect()"
          >close</span
        >
      </div>
      <div class="node-box__holder-link">
        <a
          target="_blank"
          :href="
            $route.params.chain != 'avax'
              ? `${get_scanner_root()}token/${
                  $route.params.token
                }?a=${selected_node}`
              : `${get_scanner_root()}address/${selected_node}`
          "
        >
          <span
            v-if="getNodeProperty(selected_node, 'is_contract')"
            class="material-icons node-box__special-icon"
          >
            description </span
          ><span
            v-if="getNodeProperty(selected_node, 'is_exchange')"
            class="material-icons node-box__special-icon"
          >
            wifi_protected_setup </span
          ><span
            v-if="getNodeProperty(selected_node, 'is_dead')"
            class="material-icons node-box__special-icon"
          >
            dangerous </span
          >{{ getFormatedName(selected_node) }}
        </a>
        <CopyText :text="selected_node" id="selected-wallet-copy" />
      </div>
      <a
        v-if="
          !!get_delegated_to && $route.params.token == get_delegated_contract
        "
        class="node-box__delegated_to"
        :href="`${get_delegated_link}`"
        target="_blank"
      >
        <span class="material-icons"> how_to_vote </span>
        <div>
          Vote delegated to<br /><span class="node-box__delegated_to_name">{{
            get_delegated_to
          }}</span>
        </div>
      </a>
      <div>
        Wallet Rank: <b>#{{ getAddressRank(selected_node) }}</b>
      </div>
      <template v-if="!graph_data.is_X721">
        <div>
          Percentage:
          <b
            >{{
              getDetailedFormattedPercent(getPercentAddress(selected_node))
            }}%</b
          >
        </div>
        <div v-if="selected_group != -1">
          Cluster Percentage:
          <b :style="`color:${getGroupColor(selected_group)}`">
            {{ getDetailedFormattedPercent(getPercentGroup(selected_group)) }}%
          </b>
        </div>
      </template>
      <template v-else>
        <div>
          Amount:
          <b>{{ getFormattedAmount(getAmountAddress(selected_node)) }}</b>
        </div>
        <div v-if="selected_group != -1">
          Cluster Amount:
          <b :style="`color:${getGroupColor(selected_group)}`">
            {{ getFormattedAmount(getAmountGroup(selected_group)) }}
          </b>
        </div>
      </template>
      <a
        v-if="isHighVolume"
        class="node-box__warning"
        @click="$parent.$refs.walletTransactions.openWarning()"
      >
        High Transfer Volume
      </a>
      <Button
        v-if="selected_group != -1"
        @click="$parent.$refs.walletTransactions.openLinks()"
        outlined
      >
        Show Transfers
      </Button>
      <div v-if="secretBubbleData" class="node-box__secret">
        <img alt="" width="80" :src="secretBubbleData.img_link" />
        <div class="node-box__secret-line-1">
          {{ secretBubbleData.text }}
        </div>
        <div>
          <a :href="secretBubbleData.contact_link" target="_blank">
            {{ secretBubbleData.link_text }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Button from "@/components/atoms/material/Button.vue";
import CopyText from "@/components/atoms/CopyText.vue";
import chainUtils from "@/utils/chains.js";
import graphUtils from "@/utils/graph.js";
import formatUtils from "@/utils/format.js";

export default {
  name: "WalletDetails",
  props: {
    selected_node: String,
    selected_group: Number,
    graph_data: Object,
    graph: Object,
    tokenIndex: Number,
  },
  components: {
    Button,
    CopyText,
  },
  mixins: [chainUtils, graphUtils, formatUtils],
  computed: {
    secretBubbleData() {
      return this.$store.getters.getSecretBubbleData(
        this.selected_node,
        this.$route.params.token,
        this.$route.params.chain,
        this.graph_data.id
      );
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
    get_delegated_to() {
      return this.getNodeProperty(this.selected_node, "delegated_to");
    },
    get_delegated_contract() {
      return this.getNodeProperty(this.selected_node, "delegated_contract");
    },
    get_delegated_link() {
      return this.getNodeProperty(this.selected_node, "delegated_link");
    },
  },
  methods: {
    getAmountGroup(group) {
      return this.graph.nodes
        .map((el) => (el.group == group ? el.amount : 0))
        .reduce((a, b) => a + b, 0);
    },
    getFormatedName(address) {
      const name = this.getNodeProperty(address, "name");
      return name ? name : this.getFormatedAddress(address);
    },
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.node-box {
  background: rgba($theme-dark-grey, 0.8);
  background: var(--blending-button-color, rgba($theme-dark-grey, 0.8));
  margin: 4px;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;

  a {
    cursor: pointer;
    color: $theme-pink;
    color: var(--primary-color, $theme-pink);
    &:hover {
      text-decoration: underline;
    }
  }

  .node-box__title {
    font-weight: bolder;
    font-size: 1.2em;
    display: flex;
    justify-content: space-between;
    width: 100%;

    .material-icons {
      cursor: pointer;
      color: $theme-dark-pink;
      color: var(--greyed-color, $theme-dark-pink);
      margin-left: 12px;
      &:hover {
        color: white;
        color: var(--text-color, white);
      }
    }
  }

  .node-box__holder-link {
    margin-bottom: 8px;
    display: flex;
    align-items: center;

    :nth-child(2) {
      margin-bottom: -2px;
    }
  }

  .node-box__special-icon {
    font-size: 1em;
    position: relative;
    top: 1px;
    margin-right: 2px;
  }

  .node-box__warning {
    color: $theme-pink;
    color: var(--warning-color, $theme-pink);
    font-style: italic;
  }

  .mdc-button {
    margin-top: 8px;
    width: 100%;
  }

  .node-box__hide {
    cursor: pointer;
    .material-icons {
      margin-left: 2px;
      position: relative;
      top: 3px;
      font-size: 20px;
      line-height: 0;
    }
  }

  .node-box__secret {
    text-align: center;
    margin-top: 10px;
  }

  .node-box__secret-line-1 {
    font-weight: bold;
    color: $theme-pink;
    color: var(--warning-color, $theme-pink);
  }
}

.node-box.--small-text {
  .node-box__hide {
    .material-icons {
      top: 4px;
    }
  }
  .node-box__close {
    position: relative;
    top: -2px;
  }
}

a.node-box__delegated_to {
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid rgba(white, 0.3);
  padding: 4px 8px 4px 6px;
  margin-bottom: 8px;
  color: inherit;

  &:hover {
    text-decoration: none;
    border-color: $theme-pink;
  }

  .material-icons {
    margin-right: 8px;
  }

  .node-box__delegated_to_name {
    color: $theme-pink;
  }
}
</style>
