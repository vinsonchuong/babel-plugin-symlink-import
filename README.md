# babel-plugin-symlink-import
[![Build Status](https://travis-ci.org/vinsonchuong/babel-plugin-symlink-import.svg?branch=master)](https://travis-ci.org/vinsonchuong/babel-plugin-symlink-import)

Import and compile local npm packages.

By default with `babel-register` and by convention with other Babel workflows,
JavaScript files within `node_modules` will not be compiled, even if their
containing directories are symlinks to directories outside of `node_modules`.
This plugin aims to enable that usecase.

## Installing
Install it locally to your project by running:

```bash
yarn add --dev babel-plugin-symlink-import
```

Add the plugin to your Babel configuration:

```json
{
  "plugins": ["symlink-import"]
}
```

## Usage
Given that your `package.json` contains:
```json
{
  "name": "project",
  "dependencies": {
    "local-package": "v0.1.0"
  }
}
```

and you have a `.myLinks` file in the same folder as your `package.json` containing:
```json
{
  "links": {
    "local-package": "link:./lib/local-package"
  } 
}
``` 

You can import files from the local library:

```javascript
import localPackage from 'local-package'
```

and Babel will compile them instead of ignoring them because they are in the
`node_modules` directory.

As a side-note, when you commit, you can ommit including the `.myLinks` file and everything will still work for your teammates.
