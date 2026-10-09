/* Read-only recovery exporter. Never imports, clears, or normalizes live records. */
const Backup60=(()=>{
  const DB='qh2028_test_personal_materials';
  function readDatabase(){return new Promise((resolve,reject)=>{
    const request=indexedDB.open(DB);
    let absent=false;
    request.onupgradeneeded=()=>{absent=true;request.transaction.abort();};
    request.onerror=()=>absent?resolve({present:false,documents:[],notes:[],pdfs:[]}):reject(request.error);
    request.onblocked=()=>reject(new Error('资料库正被其他页面使用，请稍后导出；不会重置数据。'));
    request.onsuccess=()=>{
      const db=request.result,names=['documents','notes','pdfs'];
      if(names.some(n=>!db.objectStoreNames.contains(n))){db.close();return reject(new Error('资料库结构与V59不一致，已停止操作。'));}
      const transaction=db.transaction(names,'readonly'),result={present:true};
      transaction.oncomplete=()=>{db.close();resolve(result);};
      transaction.onabort=transaction.onerror=()=>{db.close();reject(transaction.error||new Error('只读备份未完成'));};
      names.forEach(n=>{const r=transaction.objectStore(n).getAll();r.onsuccess=()=>result[n]=r.result;});
    };
  });}
  async function digest(value){const bytes=new TextEncoder().encode(JSON.stringify(value));return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');}
  async function snapshot(){
    const records={};for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&key.startsWith('qh2028_test_'))records[key]=localStorage.getItem(key);}
    const db=await readDatabase();
    const data={records,databasePresent:db.present,documents:db.documents,notes:db.notes,pdfAttachments:db.pdfs.map(p=>({id:p.id,name:p.blob?.name||p.id+'.pdf',size:p.blob?.size||0,type:p.blob?.type||'application/pdf'}))};
    return {format:'qh-test-readonly-recovery-v1',exportedAt:new Date().toISOString(),data,sha256:await digest(data),notice:'原始学习档案、资料文字及笔记；PDF附件须单独保存。此文件请保留，不能直接当作V59常规恢复文件。'};
  }
  async function validate(pack){
    if(!pack||pack.format!=='qh-test-readonly-recovery-v1'||!pack.data||!Array.isArray(pack.data.documents)||!Array.isArray(pack.data.notes)||!Array.isArray(pack.data.pdfAttachments)||typeof pack.sha256!=='string')throw new Error('不是原始记录备份');
    if(await digest(pack.data)!==pack.sha256)throw new Error('文件校验不一致，请保留原文件并重新导出');
    const raw=pack.data.records?.qh2028_test_os_v1;let state=null,parseError=false;try{state=raw?JSON.parse(raw):null;}catch(error){parseError=true;}
    return {valid:true,rawStatePresent:typeof raw==='string',parseError,chapters:Object.keys(state?.knowledge||{}).length,wrong:Object.keys(state?.wrong||{}).length,documents:pack.data.documents.length,notes:pack.data.notes.length,pdfAttachments:pack.data.pdfAttachments.length};
  }
  function download(name,blob){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  async function exportSnapshot(){try{const pack=await snapshot();download('清华备考-原始记录备份-'+new Date().toISOString().slice(0,10)+'.json',new Blob([JSON.stringify(pack)],{type:'application/json'}));return pack;}catch(error){alert('备份未完成，原数据没有修改：'+error.message);throw error;}}
  async function pdfs(){return (await readDatabase()).pdfs;}
  function exportPdf(row){if(!(row?.blob instanceof Blob))throw new Error('PDF附件不可读取');download(row.blob.name||row.id+'.pdf',row.blob);}
  return {snapshot,validate,exportSnapshot,pdfs,exportPdf};
})();
