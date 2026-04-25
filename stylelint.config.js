export default {
  extends: ["stylelint-config-standard"],
  plugins: ["stylelint-order", "stylelint-use-logical"],
  rules: {
    "order/properties-alphabetical-order": true,
    "csstools/use-logical": "always",
    "declaration-no-important": true,
    "no-duplicate-selectors": true,
    "property-no-vendor-prefix": true,
    "value-no-vendor-prefix": true,
    "selector-no-vendor-prefix": true,
    "media-feature-name-no-vendor-prefix": true,
    "color-named": "never",
    "shorthand-property-no-redundant-values": true,
  },
};
