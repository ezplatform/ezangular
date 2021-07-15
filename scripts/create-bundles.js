// @ts-check
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const https = require('https');
const colors = require('colors');
const argv = require('yargs-parser')(process.argv.slice(2));
const { exec } = require('child_process');
const { hash } = require('./sha1-binary');

//#region SINGLE-SPA TEMPLATES
const browserList = {
  file: '.browserslistrc',
  template: `# This file is used by the build system to adjust CSS and JS output to support the specified browsers below.
# For additional information regarding the format and rule options, please see:
# https://github.com/browserslist/browserslist#queries

# For the full list of supported browsers by the Angular framework, please see:
# https://angular.io/guide/browser-support

# You can see what browsers were selected by your queries by running:
#   npx browserslist

last 1 Chrome version
last 1 Firefox version
last 2 Edge major versions
last 2 Safari major versions
last 2 iOS major versions
Firefox ESR
not IE 11 # Angular supports IE 11 only as an opt-in. To opt-in, remove the 'not' prefix on this line.
`
};
const packageJson = {
  file: 'package.json',
  template: `{
  "name": "{packageName}",
  "version": "{version}",
  "description": "Single SPA UMD-bundle for {name}",
  "license": "MIT",
  "publishConfig": {
    "registry": "https://registry.npmjs.org"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/rwxrwx-rwx/npm_budles.git"
  },
  "homepage": "https://github.com/rwxrwx-rwx/npm_budles/blob/master/README.md",
  "author": "Kay - Khanh Bùi <khanhbui.lab@gmail.com>",
  "dependencies": {},
  "bugs": {
    "url": "https://github.com/rwxrwx-rwx/npm_budles/issues"
  }
}
`
};
const webpackConfig = {
  file: 'webpack.config.js',
  template: `const singleSpaAngularWebpack = require('single-spa-angular/lib/webpack').default;

module.exports = (config, options) => {
  const custom = singleSpaAngularWebpack(config, options);
  custom.entry = {
    '{name}': '{name}'
  };
  custom.output.filename = '{output}';
  custom.externals.push(...require('../../mf.json').externals.filter(e => e !== '{name}'));
  return custom;
};
`
};
const angularJsonTemplate = `{
  "projectType": "application",
  "root": "bundles/{normalizedName}",
  "sourceRoot": "bundles/{normalizedName}",
  "architect": {
    "build": {
      "builder": "@angular-builders/custom-webpack:browser",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/bundles/{normalizedName}",
        "index": "bundles/index.html",
        "main": "bundles/main.ts",
        "tsConfig": "bundles/tsconfig.json",
        "assets": ["bundles/{normalizedName}/package.json"],
        "customWebpackConfig": {
          "path": "bundles/{normalizedName}/webpack.config.js",
          "libraryName": "{name}",
          "libraryTarget": "umd"
        }
      },
      "configurations": {
        "production": {
          "budgets": [
            {
              "type": "initial",
              "maximumWarning": "500kb",
              "maximumError": "1mb"
            },
            {
              "type": "anyComponentStyle",
              "maximumWarning": "2kb",
              "maximumError": "4kb"
            }
          ],
          "outputHashing": "none"
        },
        "development": {
          "buildOptimizer": false,
          "optimization": false,
          "vendorChunk": true,
          "extractLicenses": false,
          "sourceMap": true,
          "namedChunks": true
        }
      },
      "defaultConfiguration": "production"
    }
  }
}
`;
//#endregion

//#region ENVIRONMENTS
const version = argv.version || '0.0.1';
const env = argv.env || 'dev';
const build = argv.build;
const publish = argv.publish;
//#endregion

//#region HELPERS
async function run(command, options = {}) {
  return new Promise((rs, rj) => {
    const e = exec(command, options);

    e.stdout.on('data', console.log);
    e.stderr.on('data', console.error);
    e.on('close', code => {
      if (code === 0) {
        rs();
      } else {
        rj('Error occurs with code ' + code);
      }
    });
  });
}
function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
async function getRemoteFileHash(url) {
  return new Promise((rs, rj) => {
    const output = 'tmp/cdn-hash';
    if (!fs.existsSync('tmp')) {
      fs.mkdirSync('tmp');
    }
    const file = fs.createWriteStream(output);

    https.get(url, response => {
      var stream = response.pipe(file);

      stream.on('finish', function () {
        const h = hash(output);
        fs.rmSync(output);
        rs(h);
      });
    });
  });
}
function getEnvFilename() {
  return env == 'dev' ? '' : '.min';
}
function stringify(obj) {
  if (env === 'dev') {
    return JSON.stringify(obj, null, 2);
  }

  return JSON.stringify(obj);
}
//#endregion

//#region FUNCTIONS
function getProjectBundles() {
  console.log(colors.cyan(`Getting project bundles...`));

  // Get repository dependencies
  const dependencies = require('../package.json').dependencies;

  // Ignore bundling for libs
  // tslib: https://cdn.jsdelivr.net/npm/tslib@2.3.0/tslib.min.js
  // zone.js: https://cdn.jsdelivr.net/npm/zone.js@0.11.4/dist/zone.min.js
  const ignoredDependencies = {
    tslib: { ignoredBundling: true, version: dependencies['tslib'] },
    'zone.js': { ignoredBundling: true, version: dependencies['zone.js'] },
    'single-spa': { ignoredBundling: true, version: dependencies['single-spa'] },
    // Still need to bundle rxjs
    rxjs: { ignoredScanning: true }
  };
  const bundles = Object.assign({}, ignoredDependencies, {
    rxjs: {
      packageJson: 'node_modules/rxjs/package.json',
      version: dependencies['rxjs'],
      normalizedName: 'rxjs',
      output: `rxjs.${dependencies['rxjs']}.umd${getEnvFilename()}.js`
    },
    'rxjs/operators': {
      packageJson: 'node_modules/rxjs/operators/package.json',
      version: dependencies['rxjs'],
      normalizedName: 'rxjs-operators',
      output: `rxjs-operators.${dependencies['rxjs']}.umd${getEnvFilename()}.js`
    }
  });

  Object.assign(dependencies, ignoredDependencies, {
    // ng-zorro-ant/graph peer dependencies
    'dagre-compound': { ignoredScanning: true },
    d3: { ignoredScanning: true }
  });

  // Get children dependencies
  Object.keys(dependencies)
    .filter(d => dependencies[d].ignoredBundling !== true && dependencies[d].ignoredScanning !== true)
    .forEach(d => {
      glob
        .sync(`node_modules/${d}/**/package.json`, {
          ignore: [
            `node_modules/${d}/**/+(node_modules|testing|upgrade|internals)/**/package.json`,
            'node_modules/ng-zorro-antd/core/types/package.json',
            'node_modules/@angular/common/locales/package.json'
          ]
        })
        .forEach(file => {
          const name = require(`../${file}`).name;
          const normalizedName = name.replace(/@/g, '').replace(/\//g, '-');
          bundles[name] = {
            packageJson: file,
            version: dependencies[d],
            normalizedName,
            output: `${normalizedName}.${dependencies[d]}.umd${getEnvFilename()}.js`
          };
        });
    });

  return bundles;
}
function writeMicroFrontendConfig(bundles) {
  console.log(colors.cyan(`Writing micro-frontend config - mf.json...`));
  fs.writeFileSync(
    'mf.json',
    stringify({
      version,
      bundles
    })
  );
}
function createNxProjects(bundles) {
  console.log(colors.cyan(`Creating Nx projects...`));
  const angular = require('../angular.json');

  Object.keys(bundles)
    .filter(d => bundles[d].ignoredBundling !== true)
    .forEach(key => {
      // Write files
      const bundle = bundles[key];
      const dir = `bundles/${bundle.normalizedName}/`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(`${dir}${browserList.file}`, browserList.template);
      fs.writeFileSync(
        `${dir}${packageJson.file}`,
        packageJson.template
          .replace(/{packageName}/g, `@ezfinhub${env === 'dev' ? '-dev' : ''}/${bundle.normalizedName}`)
          .replace(/{name}/g, key)
          .replace(/{version}/g, version)
      );
      fs.writeFileSync(`${dir}${webpackConfig.file}`, webpackConfig.template.replace(/{name}/g, key).replace(/{output}/g, bundle.output));

      // Update angular.json
      const project = JSON.parse(angularJsonTemplate.replace(/{normalizedName}/g, bundle.normalizedName).replace(/{name}/g, key));
      angular.projects[bundle.normalizedName] = project;
      // console.log(colors.green(`Project ${key} is created.`));
    });
  fs.writeFileSync('angular.json', stringify(angular));
}
function createImportMapJson(bundles) {
  console.log(colors.cyan(`Creating import-map.json...`));
  const importMap = { imports: {} };
  Object.keys(bundles)
    .filter(d => bundles[d].ignoredBundling !== true)
    .forEach(key => {
      const bundle = bundles[key];
      importMap.imports[key] = `https://cdn.jsdelivr.net/npm/@ezfinhub${env === 'dev' ? '-dev' : ''}/${bundle.normalizedName}/${
        bundle.output
      }`;
    });
  const dir = `dist/bundles/import-map/`;
  const importMapPackageName = `@ezfinhub${env === 'dev' ? '-dev' : ''}/import-map`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    `${dir}${packageJson.file}`,
    packageJson.template
      .replace(/{packageName}/g, importMapPackageName)
      .replace(/{name}/g, importMapPackageName)
      .replace(/{version}/g, version)
  );
  fs.writeFileSync(`${dir}import-map.json`, stringify(importMap));
}
async function buildBundles() {
  if (!build) {
    console.log(colors.yellow(`Ignore building bundles - env: ${env === 'dev' ? 'development' : 'production'}..`));
    return;
  }
  console.log(colors.cyan(`Building bundles - env: ${env === 'dev' ? 'development' : 'production'}..`));
  const command = `yarn build:all -c ${env === 'dev' ? 'development' : 'production'}`;
  await run(command);
}
async function publishBundles(bundles) {
  if (!publish) {
    console.log(colors.yellow(`Ignore publishing to @ezfinhub${env === 'dev' ? '-dev' : ''}..`));
    return;
  }
  console.log(colors.cyan(`Publishing bundles to @ezfinhub${env === 'dev' ? '-dev' : ''} ...`));
  const keys = Object.keys(bundles).filter(d => bundles[d].ignoredBundling !== true);
  for (let i = 0; i < keys.length; i++) {
    console.log(colors.green(`[${i + 1}/${keys.length}] Publishing ${keys[i]} ...`));
    const bundle = bundles[keys[i]];
    const cwd = path.resolve(`dist/bundles/${bundle.normalizedName}`);
    await run('npm publish --access public', { cwd });
    await sleep(1000);
  }
  console.log(colors.green(`[Final] Publishing import-map ...`));
  await run('npm publish --access public', { cwd: path.resolve('dist/bundles/import-map') });
}
async function createNgswJson(bundles) {
  console.log(colors.cyan(`Updating ngsw.json...`));
  const cdnFiles =
    env === 'dev'
      ? [
          'https://cdn.jsdelivr.net/npm/@ezfinhub-dev/import-map/import-map.json',
          'https://cdn.jsdelivr.net/npm/ng-zorro-antd@12.0.1/ng-zorro-antd.css',
          'https://cdn.jsdelivr.net/npm/zone.js@0.11.4/dist/zone.js',
          'https://cdn.jsdelivr.net/npm/systemjs@6.10.2/dist/system.js',
          'https://cdn.jsdelivr.net/npm/systemjs@6.10.2/dist/extras/amd.js',
          'https://cdn.jsdelivr.net/npm/systemjs@6.10.2/dist/extras/named-exports.js',
          'https://cdn.jsdelivr.net/npm/tslib@2.3.0/tslib.js',
          'https://cdn.jsdelivr.net/npm/single-spa@5.9.3/lib/system/single-spa.dev.js'
        ]
      : [
          'https://cdn.jsdelivr.net/npm/@ezfinhub-dev/import-map/import-map.json',
          'https://cdn.jsdelivr.net/npm/ng-zorro-antd@12.0.1/ng-zorro-antd.min.css',
          'https://cdn.jsdelivr.net/npm/zone.js@0.11.4/dist/zone.min.js',
          'https://cdn.jsdelivr.net/npm/systemjs@6.10.2/dist/system.min.js',
          'https://cdn.jsdelivr.net/npm/systemjs@6.10.2/dist/extras/amd.min.js',
          'https://cdn.jsdelivr.net/npm/systemjs@6.10.2/dist/extras/named-exports.min.js',
          'https://cdn.jsdelivr.net/npm/tslib@2.3.0/tslib.min.js',
          'https://cdn.jsdelivr.net/npm/single-spa@5.9.3/lib/system/single-spa.min.js'
        ];
  const ngsw = {
    assetGroup: {
      name: 'cdn',
      installMode: 'lazy',
      updateMode: 'prefetch',
      cacheQueryOptions: {
        ignoreVary: true
      },
      urls: [...cdnFiles],
      patterns: []
    },
    hashTable: {}
  };

  for (let i = 0; i < cdnFiles.length; i++) {
    const url = cdnFiles[i];
    ngsw.hashTable[url] = await getRemoteFileHash(url);
  }

  const keys = Object.keys(bundles).filter(d => bundles[d].ignoredBundling !== true);

  for (let i = 0; i < keys.length; i++) {
    const bundle = bundles[keys[i]];
    const url = `https://cdn.jsdelivr.net/npm/@ezfinhub${env === 'dev' ? '-dev' : ''}/${bundle.normalizedName}/${bundle.output}`;

    ngsw.assetGroup.urls.push(url);
    ngsw.hashTable[url] = await hash(`dist/bundles/${bundle.normalizedName}/${bundle.output}`);
  }
  fs.writeFileSync(`dist/bundles/import-map/ngsw.json`, stringify(ngsw));
}
function createReleaseTag() {
  console.log(colors.cyan(`Creating release tag...`));
  // TODO
}
function createChangelog() {
  console.log(colors.cyan(`Creating bundles changelog...`));
  // TODO
}
//#endregion

(async () => {
  const bundles = getProjectBundles();
  writeMicroFrontendConfig(bundles);
  createNxProjects(bundles);
  createImportMapJson(bundles);
  await buildBundles();
  await publishBundles(bundles);
  await createNgswJson(bundles);
  createReleaseTag();
  createChangelog();
  console.log(colors.cyan(`DONE!!!`));
})();
