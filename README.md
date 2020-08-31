# rollup-plugin-import-url

Import ESM modules from URL for local use and be processed by rollup, allowing to apply tree-shaking on non-local resources.

**If the module to be imported has local dependencies, these dependencies will be used**.

## Example

```js
export { h } from "https://unpkg.com/atomico";
```

```js
import { h } from "https://unpkg.com/atomico";

console.log(h);
```

## Install

```
npm install rollup-plugin-import-url
```

## Usage

```js
import importUrl from "rollup-plugin-import-url";

export default {
    input: "http://localhost:8080",
    plugins: [importUrl()],
};
```
