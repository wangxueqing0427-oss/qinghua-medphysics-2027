// Use the existing local test dependency or the exact CI-installed package.
// This is synthetic test storage, never a connection to a user's browser DB.
const {createRequire}=require('module'),path=require('path');
const local=path.join(__dirname,'test-dependencies/package/build/cjs/index.js');
if(require('fs').existsSync(local))module.exports=require(local);
else module.exports=createRequire(path.join(__dirname,'../product-2028-ci/package.json'))('fake-indexeddb');
