import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  // Theme and other customizations can be added here
  theme: {
    colors: {
      // You can define custom colors here
    },
  },
  // Custom shortcuts for frequently used utility combinations
  shortcuts: {
    // Example: 'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md'
  },
  // Custom rules
  rules: [
    // You can define custom rules here
  ],
})
