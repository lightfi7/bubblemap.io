export default {
  computed: {
    colorScheme() {
      const colorSchemes = this.$store.getters.get_color_schemes;
      const theme = this.$route.query.theme;
      return this.isIframe() && theme && colorSchemes
        ? theme in colorSchemes
          ? colorSchemes[theme]
          : {}
        : {};
    },
    smallText() {
      return (
        this.isIframe() && typeof this.$route.query.small_text != "undefined"
      );
    },
  },
  methods: {
    isIframe() {
      return window.location !== window.parent.location;
    },
    updateMetaTitle(title) {
      document.title = title;
      document.querySelectorAll("meta").forEach((tag) => {
        if (
          ["og:title", "twitter:title"].includes(tag.getAttribute("property"))
        ) {
          tag.setAttribute("content", title);
        }
      });
    },
    updateMetaDescription(description) {
      document.querySelectorAll("meta").forEach((tag) => {
        if (
          ["og:description", "twitter:description"].includes(
            tag.getAttribute("property")
          ) ||
          tag.getAttribute("name") == "description"
        ) {
          tag.setAttribute("content", description);
        }
      });
    },
  },
};
