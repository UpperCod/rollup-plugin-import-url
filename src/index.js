import path from "path";
import url from "url";
import { readFile } from "fs/promises";
import { init, parse } from "es-module-lexer";
import hash from "@uppercod/hash";
import createCache from "@uppercod/cache";
import { request } from "@uppercod/request";

const ALIAS = {};
const SPACE = "\0import-url-";
const cache = createCache();

const isUrl = (file) => /^(http(s){0,1}:){0,1}\/\//.test(file);

const cwd = process.cwd();
/**
 * @returns {import("rollup").Plugin}
 */
export default function importUrl({ importMaps }) {
    return {
        name: "plugin-import-url",
        async resolveId(id) {
            if (isUrl(id)) {
                const alias = SPACE + hash(id);
                ALIAS[alias] = id;
                return alias;
            }
        },
        async load(id) {
            if (id.startsWith(SPACE)) {
                return cache(resolve, ALIAS[id]);
            }
        },
    };
}

async function resolve(id) {
    await init;

    const [uri, code] = await cache(request, id);

    const [imports] = parse(code);

    let position = 0;

    return imports
        .map(({ s, e }) => {
            const str = code.slice(s, e);
            if (!isUrl(str)) {
                return { str, s, e };
            }
        })
        .filter((s) => s)
        .map((data) => {
            return {
                ...data,
                url: url.resolve(uri, data.str),
            };
        })
        .reduce((code, data) => {
            const s = data.s + position;
            const e = data.e + position;
            const str = data.url.split("");
            const before = code.slice(0, s);
            const middle = code.slice(s, e);
            const after = code.slice(e);
            const lMiddle = middle.length;
            const lStr = str.length;
            position += lStr - lMiddle;
            return [...before, ...str, ...after];
        }, code.split(""))
        .join("");
}
