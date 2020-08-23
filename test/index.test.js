import path from "path";
import { rollup } from "rollup";
import test from "ava";
import importUrl from "../esm";

test("simple replace", async (t) => {
    const bundle = await rollup({
        input: path.join(__dirname, "./script.js"),
        plugins: [importUrl()],
    });
    await bundle.generate({
        format: "esm",
    });
});
