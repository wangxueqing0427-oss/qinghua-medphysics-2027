'use strict';
const MigrationBridge=Object.freeze({inspect:async()=>{throw Error('批次C草稿暂不启用跨版导入，旧数据保留');},prepare:async()=>{throw Error('批次C草稿暂不启用跨版导入，旧数据保留');}});
if(typeof module!=='undefined')module.exports=MigrationBridge;else window.MigrationBridge=MigrationBridge;
