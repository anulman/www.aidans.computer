---
title: hyde
description: a stateful, jekyll-friendly cms parser for javascript build pipelines. it's a beast!

tags:
  - jekyll
  - hyde
  - ember
  - ember-cli
  - broccoli
  - nodejs
---

## Intro
- This site _([https://anulman.com/www.aidans.computer](https://anulman.com/www.aidans.computer))_
- Auto-builds & deploys with Travis _([source](https://github.com/anulman/www.aidans.computer/blob/master/.travis.yml#L31-L41))_
- Compiling from a public GH project's `master` branch _([source](https://github.com/anulman/www.aidans.computer/tree/master))_
- With Jekyll-like content _([source](https://github.com/anulman/www.aidans.computer/tree/master/content))_
- To the repo's `gh-pages` branch _([source](https://github.com/anulman/www.aidans.computer/tree/gh-pages))_
- With a static "API" to site metadata + content _([source](https://github.com/anulman/www.aidans.computer/tree/gh-pages/hyde))_
- Using:
    - [`hyde`](https://github.com/anulman/hyde) (stateful, Jekyll-friendly CMS parser)
    - [`ember-cli-hyde`](https://github.com/anulman/ember-cli-hyde) (ember addon; funnels content dirs through the compiler, + exposes helpful models & components)
    - [`broccoli-hyde-compiler`](https://github.com/anulman/broccoli-hyde-compiler) (broccoli plugin; used by `ember-cli` to compile `hyde` directories)

## Build Pipeline + Config
- `ember-cli-hyde` passes configured root dirs to the `broccoli-hyde-compiler` _([source](https://github.com/anulman/ember-cli-hyde/blob/master/index.js#L19-L30))_
- Which parses Markdown files with `hyde` _([source](https://github.com/anulman/broccoli-hyde-compiler/blob/master/src/index.js#L26))_
- And emits `.json` metadata + `.md` content files based on the final state _([source](https://github.com/anulman/broccoli-hyde-compiler/blob/master/src/index.js#L39-L50))_
- Supports configuring single & multiple directories (default = `content`) _([source](https://github.com/anulman/ember-cli-hyde/blob/master/lib/config.js#L47-L55))_
- n.b. any non-parseable files are copied into final content as-is _([source](https://github.com/anulman/broccoli-hyde-compiler/blob/master/src/index.js#L26-L36))_
```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
let hyde = {};

// for multiple dirs:
hyde.directories = ['content', 'docs'];

// for single dirs:
hyde.directories = 'content'; // or
hyde.directory = 'docs';

module.exports = function(defaults) {
  let app = new EmberApp(defaults, { hyde });

  return app.toTree();
}
```

## Content "API"
- Your app can then look up generic `hyde/item` or `hyde/collection` models _([source](https://github.com/anulman/www.aidans.computer/blob/master/app/pods/content/item/route.js#L8))_
- These are exposed by `ember-cli-hyde`, and offer a basic (+ extendable) interface for your generated content _([source](https://github.com/anulman/ember-cli-hyde/blob/master/addon/models/hyde/item.js))_
- The models have adapters, which look up metadata + content at predictable (+ configurable) routes—your "database" _([source](https://github.com/anulman/ember-cli-hyde/blob/master/addon/adapters/hyde.js))_

## `{{markdown-section}}` Component
- Your app can use `ember-cli-hyde`'s `{{markdown-section}}` component to render an item's content _([source](https://github.com/anulman/www.aidans.computer/blob/master/app/pods/content/item/template.hbs#L7))_
- It loads generated Markdown from the expected URL _([source](https://github.com/anulman/ember-cli-hyde/blob/master/addon/components/markdown-section.js#L36))_
    - Fetching logic lives in a globally-accessible service _([source](https://github.com/anulman/ember-cli-hyde/blob/master/addon/services/hyde.js) :)_
- And can be configured to cache content (default = false) _([source](https://github.com/anulman/ember-cli-hyde/blob/master/addon/components/markdown-section.js#L30-L32))_
- The component parses your markdown with `ember-cli-showdown`'s `{{markdown-to-html}}` component, configured w/ a highlightjs extension for syntax highlighting _([source](https://github.com/anulman/ember-cli-hyde/blob/master/addon/templates/components/markdown-section.hbs#L2))_
- And exposes promise state, allowing for more advanced UI patterns, eg skeleton UI _([source](https://github.com/anulman/ember-cli-hyde/blob/master/addon/templates/components/markdown-section.hbs#L1-L5))_

## Pre-rendering
- If your project is Fastboot-friendly & pre-renders HTML in build output with `prember`, `ember-cli-hyde` will register generated urls for pre-rendering _([source](https://github.com/anulman/ember-cli-hyde/blob/master/index.js#L16))_
- Each content dir may configure its urls' default `prefix`, `itemPrefix`, and `collectionPrefix` _([source](https://github.com/anulman/ember-cli-hyde/blob/master/lib/prember.js#L16-L39))_
- The `{{markdown-section}}` component will defer pre-rendering until Markdown is loaded, parsed, & painted _([source](https://github.com/anulman/ember-cli-hyde/blob/master/addon/components/markdown-section.js#L24-L26))_
```javascript
// ember-cli-build.js
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
let hyde = {};

// builder objects define a name, and one or many prefixes:
let builder = {
  name: 'content', // required. string. use same name as configured directory name
  prefix: true, // optional. bool|string. default = null. `true` aliases to the builder's name.
  itemPrefix: 'items', // optional. string. default = null. does not accept `true` as alias
  collectionPrefix: 'collections' // optional. string. default = 'collections'. `true` aliases to default
};

// the builder above will pre-render these url patterns for all items + collections compiled from the `content` dir:
// - items: `/content/items/${itemId}`
// - collections: `/content/collections/${collectionId}`

// you may pass a single builder, or an array of builders:
hyde.prember = builder; // or
hyde.prember = [builder];

// if you do not configure prember's builders, e-cli-hyde will use the default prefixes for all compiled directories.
// to disable this behavior, set to false:
hyde.prember = false;

module.exports = function(defaults) {
  let app = new EmberApp(defaults, { hyde });

  return app.toTree();
}
```

## Todos
- Further tidy documentation
- Add support for ordering content by priority / timestamp
- Publish webpack pipeline, + helpers for react / vua / angular ecosystems
- Make markdown-section a contextual component
- Dynamically look up markdown-section layout?
- Extract routes as ember engines?
- Add tests for e-cli-hyde models, adapters, component
- Add tests for broccoli-hyde-compiler
