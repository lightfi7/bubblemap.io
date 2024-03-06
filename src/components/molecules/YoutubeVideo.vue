<template>
  <div class="video-container">
    <iframe
      :src="full_src"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      ref="ytiframe"
    ></iframe>
  </div>
</template>

<script>
export default {
  name: "YoutubeVideo",
  props: {
    src: String,
  },
  computed: {
    full_src() {
      let url = new URL(
        this.src.replace("youtube.com", "youtube-nocookie.com")
      );
      url.searchParams.set("enablejsapi", 1);
      url.searchParams.set("version", 3);
      url.searchParams.set("playerapiid", "ytplayer");
      return url;
    },
  },
  methods: {
    pause() {
      this.$refs.ytiframe.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*"
      );
    },
    play() {
      this.$refs.ytiframe.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*"
      );
    },
  },
};
</script>

<style scoped lang="scss">
.video-container {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 30px;
  height: 0;
  overflow: hidden;
  flex: 1;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
