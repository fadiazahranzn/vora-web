import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom Rules
  {
    rules: {
      // Add custom rules if needed based on project standards
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "react/no-unescaped-entities": "off",
    },
  },

  // Prettier Config - Must be last to override other configs
  ...compat.extends("prettier"),
];

export default eslintConfig;
