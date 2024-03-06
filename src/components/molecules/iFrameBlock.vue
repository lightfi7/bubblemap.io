<template>
  <div class="i-frame-block">
    <h3>iFrame integration is only allowed for the graph view.</h3>
    <p>
      If you do not understand this error, please verify that you are browsing
      the original Bubble Map website (the address in you browser navbar should
      start with <b>https://app.bubblemaps.io</b>)<br />
      Either case, please
      <a
        href="mailto:help@bubblemaps.io?subject=iFrame%20Error"
        target="_blank"
      >
        contact our help desk.
      </a>
    </p>
  </div>
</template>

<script>
export default {
  name: "iFrameBlock",
};
</script>

<style scoped lang="scss">
@import "assets/variables";

.i-frame-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 20px;
  max-width: 700px;
  min-height: 100vh;

  h3 {
    color: $theme-pink;
    margin-top: 0;
  }

  a {
    color: $theme-pink;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
