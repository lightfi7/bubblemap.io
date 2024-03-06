<template>
  <svg
    viewBox="0 0 444 263"
    xml:space="preserve"
    fill-rule="evenodd"
    clip-rule="evenodd"
    stroke-linejoin="round"
    stroke-miterlimit="2"
  >
    <path
      d="M5074.5 13845.5s62.5 34.4 62.5 79c0 34.5-28.01 62.5-62.5 62.5-34.49 0-62.5-28-62.5-62.5 0-44.6 62.5-79 62.5-79Z"
      :fill="colored ? 'url(#bubblemapslogo-a)' : null"
      transform="rotate(-135 -226.34916682 6935.97539078) scale(.85393)"
    />
    <path
      d="M4796.35 13671.2c0-43 60.29-76.2 60.29-76.2s60.3 33.2 60.3 76.2v196.1c0 33.3-27.02 60.3-60.3 60.3s-60.29-27-60.29-60.3v-196.1Z"
      :fill="colored ? 'url(#bubblemapslogo-b)' : null"
      transform="matrix(.76656 -.44258 .44258 .76656 -9638.51 -8272)"
    />
    <path
      d="M4796.35 13671.2c0-43 60.29-76.2 60.29-76.2s60.3 33.2 60.3 76.2v196.1c0 33.3-27.02 60.3-60.3 60.3s-60.29-27-60.29-60.3v-196.1Z"
      :fill="colored ? 'url(#bubblemapslogo-c)' : null"
      transform="matrix(.76656 -.44258 .44258 .76656 -9469.69 -8272)"
    />
    <defs>
      <linearGradient
        id="bubblemapslogo-a"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 -141.487 160.148 0 5074.5 13987)"
      >
        <stop offset="0" stop-color="#6f17ba" />
        <stop offset="1" stop-color="#b038fa" />
      </linearGradient>
      <linearGradient
        id="bubblemapslogo-b"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 -332.592 917.287 0 4856.64 13927.6)"
      >
        <stop offset="0" stop-color="#c41baf" />
        <stop offset="1" stop-color="#f52586" />
      </linearGradient>
      <linearGradient
        id="bubblemapslogo-c"
        x1="0"
        y1="0"
        x2="1"
        y2="0"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0 -332.592 917.287 0 4856.64 13927.6)"
      >
        <stop offset="0" stop-color="#3054b6" />
        <stop offset="1" stop-color="#00a4fc" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script>
export default {
  name: "BubblemapsLogo",
  props: { colored: { default: true, type: Boolean } },
};
</script>
