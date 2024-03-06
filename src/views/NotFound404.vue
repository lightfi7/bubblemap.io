<template>
  <iFrameBlock v-if="isIframe()" />
  <div v-else class="not-found">
    <h1>404</h1>
    <h3>This likely was a broken link</h3>
    <Button raised :route="`/${$route.params.chain}/`"> Go Back Home </Button>
  </div>
</template>

<script>
import Button from "@/components/atoms/material/Button.vue";
import iFrameBlock from "@/components/molecules/iFrameBlock.vue";

export default {
  name: "NotFound404",
  components: {
    Button,
    iFrameBlock,
  },
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 100vh;
  padding-top: 56px;
  box-sizing: border-box;

  h1 {
    font-size: 5em;
    margin: 0;
  }
}
</style>
