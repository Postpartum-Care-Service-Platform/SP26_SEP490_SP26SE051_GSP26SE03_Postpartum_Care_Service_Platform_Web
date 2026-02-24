import nextPlugin from "@next/eslint-plugin-next";
import nextConfig from "eslint-config-next";
import storybook from "eslint-plugin-storybook";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config} */
export default [
  ...nextConfig(),
  {
    files: ["**/*.stories.@(ts|tsx)"],
    ...storybook.configs["flat/recommended"],
  },
  {
    plugins: {
      next: nextPlugin,
    },
    rules: {
      ...prettierConfig.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  prettierConfig,
];
