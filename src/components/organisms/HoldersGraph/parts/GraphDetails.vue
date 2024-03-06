<template>
  <Dialog v-if="graph" ref="dialog">
    <div class="mdc-dialog__content details-dialog">
      <h2>{{ graph_data.full_name }}</h2>
      <h3>
        {{ graph_data.symbol }}
        <div
          v-if="graph_data.is_fake_symbol"
          class="details-dialog__fake-symbol-warning"
        >
          Symbol wasn't available for this token,<br />this is an auto-generated
          placeholder.
        </div>
      </h3>
      <div class="details-dialog__links">
        <a
          :href="`${get_scanner_root()}token/${$route.params.token}`"
          target="_blank"
        >
          <SvgScannerLogo />
        </a>
        <a v-if="is_geckoterminal" :href="geckoterminalUrl" target="_blank">
          <SvgGeckoterminalLogo class="--geckoterminal" />
        </a>
        <a
          v-if="website"
          :href="website"
          target="_blank"
          :rel="is_rugged ? 'nofollow' : ''"
        >
          <SvgWebsiteIcon />
        </a>
        <a
          v-if="is_moonscan"
          :href="`https://moonscan.net/token/${$route.params.token}`"
          target="_blank"
        >
          <SvgMoonscanLogo />
        </a>
        <a v-if="vulkania_url" :href="vulkania_url" target="_blank">
          <SvgVulkaniaLogo />
        </a>
      </div>
      <div
        v-if="$route.params.chain == 'bsc'"
        class="details-dialog__avengerdao"
      >
        <template v-if="avengerDaoScore"
          ><AvengerDaoGauge
            v-if="avengerDaoScore != -1"
            :score="avengerDaoScore"
            :trustLevel="avengerDaoTrustLevel"
            class="details-dialog__avengerdao_gauge"
          />
          <a
            class="details-dialog__avengerdao_link"
            target="_blank"
            href="https://www.avengerdao.org/riskScanner"
          >
            <SvgAvengerDaoLogo class="details-dialog__avengerdao_logo" /><span
              class="material-icons"
              >help</span
            >
          </a>
        </template>
        <Loader v-else :size="30" class="details-dialog__loader" />
      </div>
      <h4>Date of current snapshot</h4>
      {{ graph_data.dt_update }}
      <div
        v-if="data_age_hours() > 30 * 24"
        class="details-dialog__old-warning"
      >
        <div v-if="isIframe()" class="details-dialog__old-warning__dot"></div>
        Data is more than 30 days old
      </div>
      <div v-if="graph_data.top_500" class="details-dialog__top500">
        <span class="material-icons"> keyboard_double_arrow_up </span>
        This map shows up to 500 holders
      </div>
      <h4>Displayed links</h4>
      <div class="details-dialog__total_links">{{ graph.links.length }}</div>
      <div v-if="selected_group != null && selected_group != -1">
        <h4>Selected Cluster Stats</h4>
        <div>
          Displayed wallets:
          <b :style="`color: ${getGroupColor(selected_group)};`">{{
            group_addresses.length
          }}</b>
        </div>
        <div>
          Displayed links:
          <b :style="`color: ${getGroupColor(selected_group)};`">{{
            graph.links.filter(function (el) {
              return group_addresses.includes(el.source.address);
            }).length
          }}</b>
        </div>
        <div>
          Cluster percentage:
          <b :style="`color: ${getGroupColor(selected_group)};`"
            >{{
              getDetailedFormattedPercent(getPercentGroup(selected_group))
            }}%</b
          >
        </div>
      </div>
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
import Loader from "@/components/atoms/Loader.vue";
import AvengerDaoGauge from "@/components/atoms/AvengerDaoGauge.vue";
import chainUtils from "@/utils/chains.js";
import graphUtils from "@/utils/graph.js";
import formatUtils from "@/utils/format.js";

export default {
  name: "GraphDetails",
  props: {
    graph: Object,
    graph_data: Object,
    avengerDaoScore: Number,
    avengerDaoTrustLevel: String,
    selected_group: Number,
  },
  data: function () {
    return {
      is_geckoterminal: false,
    };
  },
  components: {
    Dialog,
    Button,
    Loader,
    AvengerDaoGauge,
  },
  mixins: [chainUtils, graphUtils, formatUtils],
  computed: {
    website() {
      return this.$store.getters.get_token_website(
        this.$route.params.token,
        this.$route.params.chain
      );
    },
    is_moonscan() {
      return this.$store.getters.is_moonscan_token(
        this.$route.params.token,
        this.$route.params.chain
      );
    },
    vulkania_url() {
      return this.$store.getters.get_vulkania_url(
        this.$route.params.token,
        this.$route.params.chain
      );
    },
    is_rugged() {
      return this.$store.getters.is_rugged_token(
        this.$route.params.token,
        this.$route.params.chain
      );
    },
    geckoterminalUrl() {
      let gecko_chain;
      switch (this.$route.params.chain) {
        case "arbi":
          gecko_chain = "arbitrum";
          break;
        case "poly":
          gecko_chain = "polygon_pos";
          break;
        default:
          gecko_chain = this.$route.params.chain;
      }
      return `https://www.geckoterminal.com/${gecko_chain}/tokens/${this.$route.params.token}`;
    },
    group_addresses() {
      return this.getGroupAddresses(this.selected_group);
    },
  },
  methods: {
    open() {
      this.$refs.dialog.open();
    },
    close() {
      this.$refs.dialog.close();
    },
    async checkGeckoterminal() {
      fetch(this.geckoterminalUrl).then((response) => {
        if (response.ok) {
          this.is_geckoterminal = true;
        }
      });
    },
  },
  mounted: function () {
    this.checkGeckoterminal();
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.details-dialog {
  text-align: center;

  h2 {
    color: $theme-pink;
    color: var(--secondary-color, $theme-pink);
    margin-bottom: 8px;
  }

  h3 {
    color: white;
    color: var(--text-color, white);
    font-weight: 300;
    margin-top: 0;

    .details-dialog__fake-symbol-warning {
      font-size: 0.7em;
      font-style: italic;
      opacity: 0.6;
      line-height: 1.4em;
    }
  }

  .details-dialog__links {
    display: flex;
    justify-content: center;
    align-items: center;

    a {
      margin: 0 6px;
      svg {
        height: 25px;
        fill: white;
        fill: var(--text-color, white);
        opacity: 0.8;

        &.--geckoterminal {
          height: 30px;
        }
      }
      &:hover {
        svg {
          opacity: 1;
        }
      }
    }
  }

  .details-dialog__old-warning {
    color: $theme-pink;
    color: var(--warning-color, $theme-pink);
    display: flex;
    align-items: center;
    justify-content: center;

    .details-dialog__old-warning__dot {
      background-color: $theme-pink;
      background-color: var(--warning-color, $theme-pink);
      height: 12px;
      width: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
  }

  .details-dialog__top500 {
    color: $theme-blue;
    .material-icons {
      color: white;
      background-color: $theme-blue;
      background-color: var(--warning-color, $theme-blue);
      padding: 2px 2px;
      border-radius: 100px;
      font-size: 0.9em;
      margin-top: 8px;
    }
  }

  .details-dialog__refresh-button {
    display: block;
    margin: auto;
    margin-top: 8px;
  }

  .details-dialog__total_links {
    font-size: 2em;
    font-weight: bolder;
  }

  h4 {
    color: $theme-light-pink;
    color: var(--primary-color, $theme-light-pink);
    margin-bottom: 12px;
  }

  h4 + h5 {
    margin-top: -12px;
  }

  h5 {
    margin: 0;
    color: $theme-dark-pink;
    color: var(--greyed-color, $theme-dark-pink);
    font-weight: lighter;
  }

  ul {
    list-style: none;
    padding: 0;

    a {
      color: rgba(white, 0.6);

      &:hover {
        text-decoration: underline;
        color: white;
      }
    }
  }

  .details-dialog__avengerdao {
    margin-top: 16px;

    .details-dialog__loader {
      margin: auto;
    }

    .details-dialog__avengerdao_gauge {
      margin: auto;
      width: 150px;
      font-size: 24px;
      margin-bottom: 10px;
    }

    .details-dialog__avengerdao_link {
      .details-dialog__avengerdao_logo {
        width: 130px;
      }

      .material-icons {
        font-size: 18px;
        opacity: 0.4;
        margin-left: 4px;
        color: white;
      }

      &:hover {
        .material-icons {
          opacity: 1;
        }
      }
    }
  }
}
</style>
