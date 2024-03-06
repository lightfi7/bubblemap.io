import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import globals from "./utils/globals";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { clipboard } from "./plugins/clipboard";
import { SearchClient as TypesenseSearchClient } from "typesense";
// SVGS
import BubblemapsLogo from "./components/svgs/BubblemapsLogo.vue";
import BubblemapsText from "./components/svgs/BubblemapsText.vue";
// ICONS
import WebsiteIcon from "./components/svgs/icons/Website.vue";
import OutwardsIcon from "./components/svgs/icons/Outwards.vue";
import WarningIcon from "./components/svgs/icons/Warning.vue";
// LOGOS
import TwitterLogo from "./components/svgs/logos/Twitter.vue";
import InstagramLogo from "./components/svgs/logos/Instagram.vue";
import DiscordLogo from "./components/svgs/logos/Discord.vue";
import TelegramLogo from "./components/svgs/logos/Telegram.vue";
import YoutubeLogo from "./components/svgs/logos/Youtube.vue";
import TiktokLogo from "./components/svgs/logos/Tiktok.vue";
import ApeswapLogo from "./components/svgs/logos/Apeswap.vue";
import PancakeswapLogo from "./components/svgs/logos/Pancakeswap.vue";
import ScannerLogo from "./components/svgs/logos/Scanner.vue";
import MoonscanLogo from "./components/svgs/logos/Moonscan.vue";
import VulkaniaLogo from "./components/svgs/logos/Vulkania.vue";
import ChainLogo from "./components/svgs/logos/Chain.vue";
import GeckoterminalLogo from "./components/svgs/logos/Geckoterminal.vue";
import AvengerDaoLogo from "./components/svgs/logos/AvengerDao.vue";
const inline_svgs = [
  BubblemapsLogo,
  BubblemapsText,
  // ICONS
  WebsiteIcon,
  OutwardsIcon,
  WarningIcon,
  // LOGOS
  TwitterLogo,
  InstagramLogo,
  DiscordLogo,
  TelegramLogo,
  YoutubeLogo,
  TiktokLogo,
  ApeswapLogo,
  PancakeswapLogo,
  ScannerLogo,
  MoonscanLogo,
  VulkaniaLogo,
  ChainLogo,
  GeckoterminalLogo,
  AvengerDaoLogo,
];

initializeApp({
  apiKey: "AIzaSyBc-Gns-Nf0c47NIk02WVVe1xc66HQukXU",
  authDomain: "cryptos-tools.firebaseapp.com",
  projectId: "cryptos-tools",
  storageBucket: "cryptos-tools.appspot.com",
  messagingSenderId: "752909939035",
  appId: "1:752909939035:web:597eca510e45ce58622a7e",
});

getAuth().onAuthStateChanged(function (user) {
  store.dispatch("updateUser", user);
});

const db = getFirestore();
store.dispatch("init_metadata", db);

const app = createApp(App).mixin(globals);
app.config.globalProperties.$clipboard = clipboard;
app.config.globalProperties.window = window;

const client = new TypesenseSearchClient({
  nearest_node: {
    host: "ybxie16t2wdqg045p.a1.typesense.net",
    port: "443",
    protocol: "https",
  },
  nodes: [
    {
      host: "ybxie16t2wdqg045p-1.a1.typesense.net",
      port: "443",
      protocol: "https",
    },
    {
      host: "ybxie16t2wdqg045p-2.a1.typesense.net",
      port: "443",
      protocol: "https",
    },
    {
      host: "ybxie16t2wdqg045p-3.a1.typesense.net",
      port: "443",
      protocol: "https",
    },
  ],
  apiKey: "sPSsrQprrdJUe9wy6dXZedFw96lg0VyJ",
  connectionTimeoutSeconds: 2,
});
app.config.globalProperties.$typesense = client;

inline_svgs.forEach((item) => {
  app.component(`Svg${item.name}`, item);
});

app.use(store).use(router).mount("#app");
