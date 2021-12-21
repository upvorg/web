module.exports = {
  mode: 'jit',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  daisyui: {
    styled: true,
    themes: ['light' /** 'dark' */],
    rtl: false,
  },
  plugins: [require('daisyui')],
}
