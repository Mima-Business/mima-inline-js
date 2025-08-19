import replace from "@rollup/plugin-replace";
import { defineConfig } from "rollup";

export default defineConfig({
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "MimaCheckout",
  },
  plugins: [
    replace({
      preventAssignment: true,
      "process.env.STRIPE_PUBLIC_KEY": JSON.stringify(
        process.env.STRIPE_PUBLIC_KEY
      ),
      "process.env.PAYSTACK_PUBLIC_KEY": JSON.stringify(
        process.env.PAYSTACK_PUBLIC_KEY
      ),
      "process.env.BASE_API_URL": JSON.stringify(process.env.BASE_API_URL),
      "process.env.TEST_STRIPE_PUBLIC_KEY": JSON.stringify(
        process.env.TEST_STRIPE_PUBLIC_KEY
      ),
      "process.env.TEST_PAYSTACK_PUBLIC_KEY": JSON.stringify(
        process.env.TEST_PAYSTACK_PUBLIC_KEY
      ),
      "process.env.TEST_BASE_API_URL": JSON.stringify(
        process.env.TEST_BASE_API_URL
      ),
    }),
  ],
});
