# DRML

## Quick Start

#### 1. Run `install.sh`

This will install both run-time project dependencies and developer tools listed
in [package.json](package.json) file.

You need to do this only the first time you run the application.

#### 2. Start the sandbox

```
1_sandbox_start.sh
```

#### 3. Start the JSON API
```
2_json_start.sh
```

#### 4. Start yarn by running `3_yarn_start.sh`

Runs the app in the development mode.

Open http://localhost:3000 to view it in the browser. Whenever you modify any of the source files inside the `/src` folder,
the module bundler ([Webpack](http://webpack.github.io/)) will recompile the app on the fly and refresh all the connected browsers.

## Production build

Run `yarn build` to build the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

## License

MIT
