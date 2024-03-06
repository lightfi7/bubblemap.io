import { createStore } from "vuex";
import { allChains } from "../utils/chains.js";
import seedrandom from "seedrandom";
import _ from "lodash";
import { getAuth } from "firebase/auth";
import { collection, getDoc, doc } from "firebase/firestore";

export default createStore({
  state: {
    user: null,
    is_premium: null,
    is_partner: null,
    home_elements: allChains.reduce((o, key) => ({ ...o, [key]: null }), {}),
    listed_tokens: allChains.reduce((o, key) => ({ ...o, [key]: [] }), {}),
    custom_tags: [],
    color_schemes: null,
    vulkania_tokens: [],
    db: null,
    transfer_direction:
      window.location === window.parent.location // is not iframe
        ? window.localStorage.getItem("transfer_direction") || "SELECTED"
        : "SELECTED",
    percent_exclude:
      window.location === window.parent.location // is not iframe
        ? window.localStorage.getItem("percent_exclude") || "OFF"
        : "OFF",
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_IS_PREMIUM(state, is_premium) {
      state.is_premium = is_premium;
    },
    SET_IS_PARTNER(state, is_partner) {
      state.is_partner = is_partner;
    },
    SET_TOKENS_ELEMENTS(state, payload) {
      const chain = payload.chain;
      const data = payload.data;
      const { tokens, ...home_elements } = data;
      state.listed_tokens = {
        ...state.listed_tokens,
        [chain]: tokens.map((token) => {
          const difference = Date.now() - token.dt_added.toDate().getTime();
          return {
            ...token,
            is_new: difference / (1000 * 3600 * 24) < 14,
          };
        }),
      };
      state.home_elements = {
        ...state.home_elements,
        [chain]: home_elements,
      };
    },
    SET_CUSTOM_TAGS(state, custom_tags) {
      state.custom_tags = custom_tags;
    },
    SET_SECRET_BUBBLES(state, secret_bubbles) {
      state.secret_bubbles = secret_bubbles;
    },
    SET_COLOR_SCHEMES(state, color_schemes) {
      state.color_schemes = color_schemes;
    },
    SET_VULKANIA_TOKENS(state, vulkania_tokens) {
      state.vulkania_tokens = vulkania_tokens;
    },
    SET_DB(state, db) {
      state.db = db;
    },
    SET_TRANSFER_DIRECTION(state, transfer_direction) {
      state.transfer_direction = transfer_direction;
    },
    SET_PERCENT_EXCLUDE(state, percent_exclude) {
      state.percent_exclude = percent_exclude;
    },
  },
  actions: {
    init_metadata({ commit }, db) {
      commit("SET_DB", db);
      const colorSchemesRef = doc(
        collection(db, import.meta.env.VITE_VUE_APP_METADATA_COLLECTION),
        "color_themes"
      );
      getDoc(colorSchemesRef).then((response) =>
        commit("SET_COLOR_SCHEMES", response.data())
      );
      allChains.forEach(function (chain) {
        const tokensRef = doc(
          collection(db, import.meta.env.VITE_VUE_APP_METADATA_COLLECTION),
          `tokens_${chain}`
        );
        getDoc(tokensRef).then((response) =>
          commit("SET_TOKENS_ELEMENTS", {
            data: response.data(),
            chain: chain,
          })
        );
      });
      const customTagsRef = doc(
        collection(db, import.meta.env.VITE_VUE_APP_METADATA_COLLECTION),
        "custom_tags"
      );
      getDoc(customTagsRef).then((response) =>
        commit("SET_CUSTOM_TAGS", response.data()["tags"])
      );
      const secretBubblesRef = doc(
        collection(db, import.meta.env.VITE_VUE_APP_METADATA_COLLECTION),
        "secret_bubbles"
      );
      getDoc(secretBubblesRef).then((response) =>
        commit("SET_SECRET_BUBBLES", response.data()["bubbles"])
      );
      const vulkaniaTokensRef = doc(
        collection(db, import.meta.env.VITE_VUE_APP_METADATA_COLLECTION),
        "vulkania_tokens"
      );
      getDoc(vulkaniaTokensRef).then((response) =>
        commit("SET_VULKANIA_TOKENS", response.data()["list"])
      );
    },
    updateUser({ commit, dispatch }, user) {
      if (user) {
        // The user is already logged in
        commit("SET_USER", user);
        dispatch("check_premium");
      } else {
        // The user is not logged in
        // Check if the is user is being redirected from the Moonlight auth
        // server with an identity Token
        const url = new URL(window.location.href);
        const token = url.searchParams.get("token");
        if (token) {
          // If so we can authenticate the user
          getAuth().signInWithCustomToken(token);
          // Remove the token to clean the url aspect and to avoid to re-login
          // the user if he manually logs out.
          url.searchParams.delete("token");
          history.replaceState({}, document.title, url);
        } else {
          commit("SET_USER", false);
        }
      }
    },
    logout() {
      getAuth().signOut();
    },
    check_premium({ commit, getters }) {
      fetch(
        "https://europe-west1-cryptos-tools.cloudfunctions.net/get-account-data?uid=" +
          getters.get_user_id
      )
        .then((response) => response.json())
        .then((json) => {
          commit("SET_IS_PREMIUM", json["is_moonlight_premium"]);
          commit("SET_IS_PARTNER", json["whitelist_status"]["is_partner"]);
        })
        .catch(() => {
          commit("SET_IS_PREMIUM", false);
          commit("SET_IS_PARTNER", false);
        });
    },
    set_transfer_direction({ commit }, transfer_direction) {
      commit("SET_TRANSFER_DIRECTION", transfer_direction);
      window.localStorage.setItem("transfer_direction", transfer_direction);
    },
    set_percent_exclude({ commit }, percent_exclude) {
      commit("SET_PERCENT_EXCLUDE", percent_exclude);
      window.localStorage.setItem("percent_exclude", percent_exclude);
    },
  },
  modules: {},
  getters: {
    is_global_loading(state) {
      return (
        state.user == null ||
        allChains.some((chain) => state.home_elements[chain] == null) ||
        allChains.some((chain) => state.listed_tokens[chain].length == 0)
      );
    },
    is_logged_in(state) {
      return !!state.user;
    },
    get_user_id(state) {
      return state.user ? state.user.uid : null;
    },
    get_is_premium(state) {
      return state.is_premium;
    },
    get_is_partner(state) {
      return state.is_partner;
    },
    get_user(state) {
      return state.user;
    },
    get_db(state) {
      return state.db;
    },
    get_color_schemes(state) {
      return state.color_schemes;
    },
    get_transfer_direction(state) {
      return state.transfer_direction;
    },
    get_percent_exclude(state) {
      return state.percent_exclude;
    },
    get_home_tokens: (state, getters) => (section, chain) => {
      return state.home_elements[chain][section].map((id) =>
        getters.get_token_data(id, chain)
      );
    },
    get_trending_tokens: (state, getters) => (chain) => {
      const day_seed = new Date().toUTCString().substring(0, 16) + chain;
      const hours = new Date().getUTCHours();
      var dayNumber = Math.abs(seedrandom(day_seed).int32());
      var hoursNumber = Math.abs(
        seedrandom(day_seed + Math.floor(hours / 6)).int32()
      );
      var hourNumber = Math.abs(seedrandom(day_seed + hours).int32());
      let candidates = _.union(
        state.home_elements[chain]["featured"],
        state.home_elements[chain]["most_visited"],
        state.home_elements[chain]["recently_listed"]
      );
      const id1 = candidates[dayNumber % candidates.length];
      candidates.splice(candidates.indexOf(id1), 1);
      const id2 = candidates[hoursNumber % candidates.length];
      candidates.splice(candidates.indexOf(id2), 1);
      const id3 = candidates[hourNumber % candidates.length];
      return [id1, id2, id3].map((id) => getters.get_token_data(id, chain));
    },
    get_listed_tokens(state) {
      return state.listed_tokens;
    },
    get_token_data: (state) => (id, chain) => {
      return state.listed_tokens[chain].find((token) => token.id === id);
    },
    get_listed_token: (state) => (address, chain) => {
      return state.listed_tokens[chain].find(
        (token) => token.address === address.toLowerCase()
      );
    },
    is_public_token: (state) => (address, chain) => {
      return !!state.listed_tokens[chain].find(
        (token) => token.address === address.toLowerCase()
      );
    },
    is_moonscan_token: (state) => (address, chain) => {
      return state.listed_tokens[chain].find(
        (token) => token.address === address.toLowerCase()
      )?.is_moonscan;
    },
    get_token_website: (state) => (address, chain) => {
      return state.listed_tokens[chain].find(
        (token) => token.address === address.toLowerCase()
      )?.website;
    },
    get_token_img: (state) => (address, chain) => {
      return state.listed_tokens[chain].find(
        (token) => token.address === address.toLowerCase()
      )?.image;
    },
    get_token_youtube: (state) => (address, chain) => {
      return state.listed_tokens[chain].find(
        (token) => token.address === address.toLowerCase()
      )?.youtube;
    },
    get_custom_tag: (state) => (address) => {
      const searched = state.custom_tags.find((el) => el.address == address);
      return searched ? searched : null;
    },
    getSecretBubbleData: (state) => (address, token_address, chain, id) => {
      let now = new Date();
      let cetDay = now
        .toLocaleString("fr-FR", { timeZone: "CET" })
        .slice(0, 10);
      return state.secret_bubbles.find(
        (el) =>
          el.wallet_address == address &&
          el.token_address == token_address &&
          el.chain == chain &&
          ("id" in el ? el.id == id : true) &&
          (el.active_date ? el.active_date == cetDay : true)
      );
    },
    is_rugged_token: (state) => (address, chain) => {
      return state.listed_tokens[chain].find(
        (token) => token.address === address
      )?.is_rugged;
    },
    get_vulkania_url: (state) => (address, chain) => {
      const searched = state.vulkania_tokens.find(
        (el) => el.address == address && el.chain == chain
      );
      return searched ? searched.url : null;
    },
  },
});
