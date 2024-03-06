const chains_ref = {
  eth: {
    display_name: "ETH",
    full_name: "Ethereum",
    scanner_name: "Etherscan",
    scanner_root: "https://etherscan.io/",
    native_token: "ETH",
    color: "#607ae3",
    darker_color: "#425bbf",
    standard_prefix: "ERC",
  },
  bsc: {
    display_name: "BSC",
    full_name: "BNB Chain",
    scanner_name: "Bscscan",
    scanner_root: "https://bscscan.com/",
    native_token: "BNB",
    color: "#e8b30b",
    darker_color: "#e79806",
    standard_prefix: "BEP",
  },
  ftm: {
    display_name: "FTM",
    full_name: "Fantom",
    scanner_name: "Ftmscan",
    scanner_root: "https://ftmscan.com/",
    native_token: "FTM",
    color: "#1a69ff",
    darker_color: "#0713f9",
    standard_prefix: "ERC",
  },
  avax: {
    display_name: "AVAX",
    full_name: "Avalanche",
    scanner_name: "Snowtrace",
    scanner_root: "https://snowtrace.io/",
    native_token: "AVAX",
    color: "#e84142",
    darker_color: "#d12600",
    standard_prefix: "ERC",
  },
  cro: {
    display_name: "CRO",
    full_name: "Cronos",
    scanner_name: "Cronoscan",
    scanner_root: "https://cronoscan.com/",
    native_token: "CRO",
    color: "#215784",
    darker_color: "#10395b",
    standard_prefix: "CRC",
  },
  arbi: {
    display_name: "ARBI",
    full_name: "Arbitrum",
    scanner_name: "Arbiscan",
    scanner_root: "https://arbiscan.io/",
    native_token: "ETH",
    color: "#2a9fef",
    darker_color: "#0981d2",
    standard_prefix: "ERC",
  },
  poly: {
    display_name: "POLY",
    full_name: "Polygon",
    scanner_name: "Polygonscan",
    scanner_root: "https://polygonscan.com/",
    native_token: "MATIC",
    color: "#8247e5",
    darker_color: "#6a21e4",
    standard_prefix: "ERC",
  },
};

export const allChains = Object.keys(chains_ref);

export default {
  computed: {
    all_chains_ref() {
      return chains_ref;
    },
    all_chains() {
      return allChains;
    },
  },
  methods: {
    get_chain_display_name() {
      return chains_ref[this.$route.params.chain]["display_name"];
    },
    get_chain_full_name() {
      return chains_ref[this.$route.params.chain]["full_name"];
    },
    get_scanner_name() {
      return chains_ref[this.$route.params.chain]["scanner_name"];
    },
    get_scanner_root() {
      return chains_ref[this.$route.params.chain]["scanner_root"];
    },
    get_native_token() {
      return chains_ref[this.$route.params.chain]["native_token"];
    },
    get_chain_color() {
      return chains_ref[this.$route.params.chain]["color"];
    },
    get_chain_darker_color() {
      return chains_ref[this.$route.params.chain]["darker_color"];
    },
    get_chain_standard_prefix() {
      return chains_ref[this.$route.params.chain]["standard_prefix"];
    },
  },
};
