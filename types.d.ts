import { Plugin } from "rollup";

declare module "rollup-plugin-import-url" {
    export default function importUrl(): Plugin;
}
