'use strict';const fs=require('fs'),p=require('path'),D=__dirname,root=p.resolve(D,'..'),branch='candidate/2026-11-16-issue10-q0-content-fix';
const cfg={repository:'wangxueqing0427-oss/qinghua-medphysics-2027',workflowPath:'.github/workflows/2028-issue10-examloop.yml',verifyJobName:'Verify ISSUE10 exam loop and mobile WebKit',previewBranches:[branch],project:'qh2028-core47-preview',productionAllowed:false};fs.writeFileSync(p.join(D,'preview-config.json'),JSON.stringify(cfg,null,2));
fs.copyFileSync(p.join(root,'product-2028-issue10-integration/ci-gate.cjs'),p.join(D,'ci-gate.cjs'));let pages=fs.readFileSync(p.join(root,'product-2028-issue10-integration/pages-build.cjs'),'utf8').replace("require('./build-receipt.json')","require('./build-receipt.json')").replace('https://558d5bb3.qh2028-core47-preview.pages.dev/','https://403b3769.qh2028-core47-preview.pages.dev/');fs.writeFileSync(p.join(D,'pages-build.cjs'),pages);
const route=p.join(root,'product-2028-integration-47-upgraded/build.cjs');let routeText=fs.readFileSync(route,'utf8');routeText=routeText.replace("require('../product-2028-issue10-integration/pages-build.cjs');","require('../product-2028-issue10-next/pages-build.cjs');");fs.writeFileSync(route,routeText);
fs.writeFileSync(p.join(root,'.github/workflows/2028-issue10-examloop.yml'),`name: ISSUE10 exam learning loop candidate
on:
  push:
    branches: [${branch}]
    paths: [product-2028-issue10-next/**, product-2028-integration-47-upgraded/build.cjs, .github/workflows/2028-issue10-examloop.yml]
permissions:
  contents: read
jobs:
  verify:
    name: Verify ISSUE10 exam loop and mobile WebKit
    runs-on: ubuntu-latest
    timeout-minutes: 15
    container:
      image: mcr.microsoft.com/playwright:v1.64.0-noble@sha256:06a9939e57531807f8d5fd76ce44b53165ffb7d7501d87ab10e285c20b1e971f
      options: --init --shm-size=1g
    env:
      PLAYWRIGHT_BROWSERS_PATH: /ms-playwright
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1'
      PW_MODULE: ../product-2028-ci/node_modules/playwright
      BROWSER: webkit
    steps:
      - uses: actions/checkout@v4
        with: {persist-credentials: false}
      - uses: actions/setup-node@v4
        with: {node-version: '22'}
      - working-directory: product-2028-ci
        run: npm install --ignore-scripts --no-audit --no-fund
      - name: Frozen assets, old800 compatibility and new course structure
        run: node product-2028-issue10-next/verify.cjs
      - name: Exam self-review and actual evidence scheduling
        run: node --test product-2028-issue10-next/test.cjs
      - name: Actual mobile WebKit course/exam/backup/real TCP outage
        run: node product-2028-issue10-next/browser.cjs
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: issue10-examloop-\${{ github.sha }}
          path: |
            product-2028-issue10-next/browser-webkit-*.json
            product-2028-issue10-next/failure-webkit-*.png
            product-2028-issue10-next/verify-result.json
            product-2028-issue10-next/build-receipt.json
          retention-days: 7
`);
console.log('Prepared CI-gated route for only the authorized branch');
