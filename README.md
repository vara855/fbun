# fbun

Tests how bun is fast

* time spent with reading file

```sh
❯ node index.js
node: 34.462ms
 
❯ bun index.ts
[19.18ms] bun
```

* time spent without reading file

```sh
❯ node index.js
node: 30.788ms

❯ bun index.ts
[17.95ms] bun
```