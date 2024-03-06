<template>
  <span>
    {{ text }}
  </span>
</template>

<script>
export default {
  name: "RotatingText",
  props: {
    variations: Array,
  },
  data() {
    return {
      text: false,
      currentIndex: 0,
      shuffledVariations: null,
      // This is to prevent the growing text bug when tab not focused
      inTransition: false,
    };
  },
  methods: {
    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    shuffleArray(inputArray) {
      let array = [...inputArray];
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    intervalUpdate() {
      if (!this.inTransition) {
        this.currentIndex =
          (this.currentIndex + 1) % this.shuffledVariations.length;
        this.changeToText(this.shuffledVariations[this.currentIndex]);
      }
    },
    async changeToText(newText) {
      this.inTransition = true;
      while (this.text.length > 1) {
        this.text = this.text.substring(0, this.text.length - 1);
        await this.sleep(8);
      }
      // First character is changed in place to avoid empty strings which can
      // affect the layout
      this.text = newText[0];
      await this.sleep(15);
      for (let letter of newText.substring(1)) {
        this.text += letter;
        await this.sleep(15);
      }
      this.inTransition = false;
    },
  },
  mounted: function () {
    this.shuffledVariations = [this.variations[0]].concat(
      this.shuffleArray(this.variations.slice(1))
    );
    this.text = this.shuffledVariations[0];
    this.interval = setInterval(() => {
      this.intervalUpdate();
    }, 7000);
  },
  unmounted() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped lang="scss"></style>
