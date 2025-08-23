import replace from "@rollup/plugin-replace";
import dotenv from "dotenv";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";

dotenv.config();

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/v1/inline.js",
      format: "umd",
      name: "MimaCheckout", // exposes window.MimaCheckout
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
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
    terser(),
  ],
};
