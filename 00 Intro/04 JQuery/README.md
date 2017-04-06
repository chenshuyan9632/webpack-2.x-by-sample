# 04 JQuery

So far we have made good progress on our journey... but we are lacking one of the
basic pillars of web development, consuming third party libraries.

In this demo we will install a legacy library (jquery) via npm, define it as global, and use it. Finally we will end up creating a separate bundle for libraries.

We will start from sample _00 Intro/03 Output_.

Summary steps:
 - Install jquery via npm.
 - Setup a global alias ($).
 - Create some sample code using this library.
 - Break into two bundles `app.js` and `vendor.js`.  

# Steps to build it

## Prerequisites

Prerequisites, you will need to have nodejs installed on your computer. If you want to follow this guide steps you will need to take as starting point sample _03 Output_.

## steps

- `npm install` to install previous sample packages:

```
npm install
```

- Let's start by downloading the jquery library via npm. In this case we will execute the following command on the command prompt ```npm install jquery --save```.
**note down**: this time we are not adding the `-dev` suffix to the parameter, this time the jquery package is a dependency of the web app not of the build process.

```
npm install jquery --save
```

### ./package.json
```diff
{
  ...
  "devDependencies": {
    "babel-core": "^6.23.1",
    "babel-loader": "^6.3.2",
    "babel-preset-env": "^1.1.11",
    "html-webpack-plugin": "^2.28.0",
    "webpack": "^2.2.1",
    "webpack-dev-server": "^2.4.1"
  },
+ "dependencies": {
+   "jquery": "^3.1.1"
+ }
}

```

- Since this is a legacy library it expects to have a global variable available.
Instead of assigning this manually let's define it in the `webpack.config.js`. file.

- First we will require an import "webpack" at the top of the file:

### ./webpack.config.js
```diff
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
+ var webpack = require('webpack');

var basePath = __dirname;
...
};

```

- Then we will use a plugin from webpack to define jQuery and $ as global variables.

### ./webpack.config.js
```diff
...

module.exports = {
  ...
  plugins: [
    //Generate index.html in /dist => https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html', //Name of file in ./dist/
      template: 'index.html', //Name of template in ./src
			hash: true,
    }),
+   new webpack.ProvidePlugin({
+     $: "jquery",
+     jQuery: "jquery"
+   }),
  ],
};

```

- what is webpack.ProvidePlugin: Automatically loads modules. Whenever the identifier is encountered as free variable in a module, the module is loaded automatically and the identifier is filled with the exports of the loaded module.

> 自动加载模块,每当在模块中遇到标识符为自由变量的时候,模块将自动加载,标识符会被加载的模块出口所填充

- Now it's ready to be used. Just to test it, let's change the background color of the page body to blue. Let's change the background of the body element using jquery:

### ./students.js
```diff
import {getAvg} from "./averageService";

+ $('body').css('background-color', 'lightSkyBlue');

const scores = [90, 75, 60, 99, 94, 30];
const averageScore = getAvg(scores);

const messageToDisplay = `average score ${averageScore}`;

document.write(messageToDisplay);

```

- Now we can just execute the app (```npm start```) and check how the background of the page has changed from white to blue.

![blue background](../../99%20Readme%20Resources/00%20Intro/04%20JQuery/blue%20background.png)

- To finish with this demo, let's face the following case: we want to split the bundle into two, a main one (application level) and a second one that will hold all the third party libraries. To do that we can use the `CommonChunkPlugin`  分解bundle为两个
(already included in webpack). In this plugin we specify the libraries that are going to be placed in the separate library js under the 'vendor' category.

- First let's start by adding a new entry point called 'vendor', and there we define an array including all the libraries that we want to include under that bundle (note down, entry is not an array any more, it's an object).

### ./webpack.config.js
```diff
...

module.exports = {
- entry: ['./students.js'],//如果只有一个入口文件,就不需要指定key
+ entry: {
+   app: './students.js',
+   vendor: [
+     'jquery',
+   ],
+ },
  output: {
    path: path.join(basePath, 'dist'),
-   filename: 'bundle.js',
+   filename: '[name].js',
  },
  ...
};

```

- Then we define the plugin and the output file:

### ./webpack.config.js
```diff
...

module.exports = {
  ...
  plugins: [
    ...
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
+   new webpack.optimize.CommonsChunkPlugin({
+     name: 'vendor',
+   }),
  ],
};

```

Now if we run `webpack` and take a look to the dist folder we can check that the two bundles have been created.

![split into app and vendor](../../99%20Readme%20Resources/00%20Intro/04%20JQuery/split%20into%20app%20and%20vendor.png)


Finally in the generated `index.html` (under dist) we can check that both scripts have been successfully referenced:

### ./dist/index.html
```diff
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Webpack 1.x by sample</title>
  </head>
  <body>
    Hello webpack !
+ <script type="text/JavaScript" src="vendor.js?320a16e25cb5421c9f10"></script>
+ <script type="text/JavaScript" src="bundle.js?320a16e25cb5421c9f10"></script></body>
</html>
```

- Next step can be to add `[chunkhash]` tag to output file name, to see how webpack is dealing with builds when we don't change content of the files.

### ./webpack.config.js
```diff
...

module.exports = {
...
  output: {
    path: path.join(basePath, 'dist'),
-   filename: '[name].js',
+   filename: '[chunkhash].[name].js',
  },
  ...
};

```

- Now we run `npm start`. As we see, output files appear with hash:

![bundle with chunkhash](../../99%20Readme%20Resources/00%20Intro/04%20JQuery/bundle%20with%20chunkhash.png)

- If we update our code, for example:

### ./averageService.js

```diff
...

function getTotalScore(scores) {
  return scores.reduce((score, count) => {
-   return score + count;
+   return score + count + 1;
  });
}

```

- `chunkhash` changes again, for app and vendor. That means that we still don't reap the benefits of browser caching because the hash for vendor file changes on every build and the browser will have to reload the file.

> chunkhash再次更改，适用于应用和供应商。这意味着我们仍然无法获得浏览器缓存的好处，因为每个构建和浏览器上供应商文件更改的哈希值都必须重新加载
>
> Refers:[分离Library-webpack文档](https://doc.webpack-china.org/guides/code-splitting-libraries/)

![bundle after change code](../../99%20Readme%20Resources/00%20Intro/04%20JQuery/bundle%20after%20change%20code.png)

- To prevent this, we need to add [manifest configuration](https://webpack.js.org/guides/code-splitting-libraries/#manifest-file):

> 为了避免没有修改到的文件发生chunkhash值的改变,我们需要添加manifest 配置

### ./webpack.config.js
```diff
...

module.exports = {
  ...
  plugins: [
    ...
    new webpack.optimize.CommonsChunkPlugin({
-     name: 'vendor',
+     names: ['vendor', 'manifest'],
    }),
  ],
};

```

- Now if we restore the previous code and run `npm start` again, `manifest.js` appears with `chunkhash` too:

![bundle with manifest](../../99%20Readme%20Resources/00%20Intro/04%20JQuery/bundle%20with%20manifest.png)

- Updating our code again:

### ./averageService.js

```diff
...

function getTotalScore(scores) {
  return scores.reduce((score, count) => {
-   return score + count;
+   return score + count + 1;
  });
}

```

- But this time, vendor doesn't change its hash, so it isn't compiled again and it reduces the time to build solution:

![bundle manifest after change code](../../99%20Readme%20Resources/00%20Intro/04%20JQuery/bundle%20manifest%20after%20change%20code.png)
