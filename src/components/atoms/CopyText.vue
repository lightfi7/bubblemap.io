<template>
  <Tooltip :text="copyText" :id="id" />
  <div :aria-describedby="id" class="copy-text__icon" @click.stop="copy">
    <svg viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
      />
    </svg>
  </div>
</template>

<script>
import Tooltip from "@/components/atoms/material/Tooltip.vue";
export default {
  name: "CopyText",
  components: { Tooltip },
  props: {
    text: {
      required: true,
      type: String,
    },
    id: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      copied: false,
    };
  },
  watch: {
    text: function () {
      this.copied = false;
    },
  },
  computed: {
    copyText() {
      return this.copied ? "Copied" : "Copy";
    },
  },
  methods: {
    copy() {
      this.$clipboard(this.text);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 5000);
    },
  },
};
</script>

<style scoped lang="scss">
.copy-text__icon {
  margin-left: 5px;
  cursor: pointer;
  width: 1em;
  height: 1em;

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
