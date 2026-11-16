'use strict';const fs=require('fs'),p=require('path'),D=__dirname,root=p.resolve(D,'..'),old=p.join(root,'product-2028-issue10-next'),branch='candidate/2026-11-16-issue10-q0-content-fix';const cfg={repository:'wangxueqing0427-oss/qinghua-medphysics-2027',workflowPath:'.github/workflows/2028-issue10-papers.yml',verifyJobName:'Verify PAPER candidate',previewBranches:[branch],project:'qh2028-core47-preview',productionAllowed:false};fs.writeFileSync(p.join(D,'preview-config.json'),JSON.stringify(cfg,null,2));fs.copyFileSync(p.join(old,'ci-gate.cjs'),p.join(D,'ci-gate.cjs'));let pages=fs.readFileSync(p.join(old,'pages-build.cjs'),'utf8').replace("branch:process.env.CF_PAGES_BRANCH}","branch:process.env.CF_PAGES_BRANCH,timeoutMs:1080000}").replace('https://403b3769.qh2028-core47-preview.pages.dev/','https://ddb5c5f1.qh2028-core47-preview.pages.dev/');fs.writeFileSync(p.join(D,'pages-build.cjs'),pages);const route=p.join(root,'product-2028-integration-47-upgraded/build.cjs');fs.writeFileSync(route,fs.readFileSync(route,'utf8').replace("require('../product-2028-issue10-next/pages-build.cjs');","require('../product-2028-issue10-papers/pages-build.cjs');"));
const container=`    container:
      image: mcr.microsoft.com/playwright:v1.64.0-noble@sha256:06a9939e57531807f8d5fd76ce44b53165ffb7d7501d87ab10e285c20b1e971f
      options: --init --shm-size=1g
    env:
      PLAYWRIGHT_BROWSERS_PATH: /ms-playwright
      PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD: '1'
      PW_MODULE: ../product-2028-ci/node_modules/playwright
`;
const steps=`      - uses: actions/checkout@v4
        with: {persist-credentials: false}
      - uses: actions/setup-node@v4
        with: {node-version: '22'}
      - working-directory: product-2028-ci
        run: npm install --ignore-scripts --no-audit --no-fund
`;
fs.writeFileSync(p.join(root,'.github/workflows/2028-issue10-papers.yml'),`name: Independent original composite papers
on:
  push:
    branches: [${branch}]
    paths: [product-2028-issue10-papers/**, product-2028-integration-47-upgraded/build.cjs, .github/workflows/2028-issue10-papers.yml]
permissions:
  contents: read
jobs:
  functional:
    name: Actual papers functional tests
    runs-on: ubuntu-latest
    timeout-minutes: 15
${container}    steps:
${steps}      - run: node product-2028-issue10-papers/verify.cjs
      - run: node --test product-2028-issue10-papers/test.cjs
      - name: Chromium all125items, new lessons and backup/offline
        run: BROWSER=chromium node product-2028-issue10-papers/browser.cjs
      - name: Mobile WebKit all125items, new lessons and backup/offline
        run: BROWSER=webkit node product-2028-issue10-papers/browser.cjs
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: papers-functional-\${{ github.sha }}
          path: |
            product-2028-issue10-papers/browser-*.json
            product-2028-issue10-papers/failure-*.png
            product-2028-issue10-papers/build-receipt.json
          retention-days: 7
  real_soak:
    name: Real ten minute wall clock session
    needs: functional
    runs-on: ubuntu-latest
    timeout-minutes: 15
${container}    steps:
${steps}      - name: No clock acceleration, autosave and repeated tab-close recovery
        run: SOAK_MINUTES=10 node product-2028-issue10-papers/soak.cjs
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: papers-real-soak-\${{ github.sha }}
          path: product-2028-issue10-papers/soak-*.json
          retention-days: 7
  verify:
    name: Verify PAPER candidate
    needs: [functional, real_soak]
    runs-on: ubuntu-latest
    steps:
      - run: echo 'Functional and actual wall-clock gates passed; not physical iPhone or180minute endurance acceptance.'
`);console.log('Prepared exact-SHA gated preview including actual ten-minute wall-clock gate');
