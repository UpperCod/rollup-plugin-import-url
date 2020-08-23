import { rollup } from "rollup";
import test from "ava";
import importUrl from "../esm";
import { server } from "./server";

test("simple replace", async (t) => {
    const request = [];
    const net = await server((req, res) => {
        res.setHeader("content-type", "application/javascript");
        res.writeHead(200);
        request.push(req.url);
        if (req.url == "/") {
            res.end(`export * from "./sub.js";`);
        } else {
            res.end(`export const message = "hi!"`);
        }
    }, 8080);

    const bundle = await rollup({
        input: "http://localhost:8080",
        plugins: [importUrl()],
    });

    const { output } = await bundle.generate({
        format: "esm",
    });

    t.is(output[0].code, `const message = "hi!";\n\nexport { message };\n`);

    t.deepEqual(request, ["/", "/sub.js"]);

    net.close();
});
