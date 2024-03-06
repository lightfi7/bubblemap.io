import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Graph from "../views/Graph.vue";
import NotFound404 from "../views/NotFound404.vue";
import Listed from "../views/Listed.vue";
import { allChains } from "../utils/chains.js";

var meta = {
  home: {
    title: "Bubblemaps | Home",
    description:
      "Explore wallets, reveal connections, and see through the noise of blockchain data.",
  },
  listed: {
    title: "Bubblemaps | Listed Tokens",
    description:
      "Those tokens have chosen Bubblemaps to showcase transparency to the community. Check them out!",
  },
  graph: {
    title: "Bubblemaps | Uncover Hidden Links Between Holders",
    description:
      "A bubble map gives you a breakdown of clusters between top holders of a token.",
  },
  notfound: {
    title: "Bubblemaps | 404",
    description: "Page not found.",
  },
};

// (Dynamic metadata is setup in utils/globals.js)

for (var page in meta) {
  meta[page].metaTags = [
    {
      property: "og:title",
      content: meta[page].title,
    },
    {
      property: "twitter:title",
      content: meta[page].title,
    },
    {
      name: "description",
      content: meta[page].description,
    },
    {
      property: "og:description",
      content: meta[page].description,
    },
    {
      property: "twitter:description",
      content: meta[page].description,
    },
  ];
}

const chainPrefix = `/:chain(${allChains.join("|")})`;

const routes = [
  {
    path: "/",
    redirect: "/eth/",
  },
  {
    path: chainPrefix,
    name: "Home",
    component: Home,
    meta: meta.home,
  },
  {
    path: chainPrefix + "/listed-tokens",
    name: "Listed",
    component: Listed,
    meta: meta.listed,
  },
  {
    path: chainPrefix + "/token/:token",
    name: "Graph",
    component: Graph,
    meta: meta.graph,
  },
  {
    path: chainPrefix + "/not-found",
    name: "NotFound",
    component: NotFound404,
    meta: meta.notfound,
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: (to) => {
      const chain = allChains.includes(to.params.pathMatch[0])
        ? to.params.pathMatch[0]
        : "bsc";
      return {
        name: "NotFound",
        params: { chain: chain },
      };
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
});

router.beforeEach((to) => {
  document.title = to.meta.title;
  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    (el) => el.parentNode.removeChild(el)
  );

  // Turn the meta tag definitions into actual elements in the head.
  to.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement("meta");
      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });
      // We use this to track which meta tags we create so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");
      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));
});

export default router;
