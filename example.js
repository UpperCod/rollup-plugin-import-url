import path from "path";
import { rollup } from "rollup";
import importUrl from "./esm";

(async () => {
    const bundle = await rollup({
        input: path.join(__dirname, "./test/script.js"),
        plugins: [
            importUrl({
                importMaps: "import-maps.json",
            }),
        ],
    });
    const output = await bundle.generate({
        format: "esm",
    });
    console.log(output);
})();
