/* Personal study documents live in their own IndexedDB, never in the learning store. */
const Materials59 = (() => {
  let dbPromise;
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function db() { return dbPromise ||= new Promise((resolve,reject) => {
    const r=indexedDB.open('qh2027_personal_materials',1);
    r.onupgradeneeded=()=>{for(const s of ['documents','notes','pdfs'])r.result.createObjectStore(s,{keyPath:'id'});};
    r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);
  }); }
  async function read(store,id) { const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction(store).objectStore(store)[id===undefined?'getAll':'get'](id);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);}); }
  async function putMany(store,items) {const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction(store,'readwrite');t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||new Error('保存中断'));for(const item of items)t.objectStore(store).put(item);});}
  function validate(pack) {
    if(!pack||pack.format!=='qh-materials-v1'||!Array.isArray(pack.documents)||pack.documents.length>1000)throw new Error('请选择个人资料导入包，不是学习进度备份。');
    const ids=new Set();
    return pack.documents.map(d=>{if(!d||!/^gift-[a-f0-9]{20}$/.test(d.id)||ids.has(d.id)||typeof d.title!=='string'||!Array.isArray(d.pages)||d.pages.length>10000)throw new Error('资料结构不完整');ids.add(d.id);
      return {id:d.id,title:d.title.slice(0,500),file:String(d.file||'').slice(0,500),category:String(d.category||'其他').slice(0,50),source:String(d.source||'个人资料').slice(0,300),status:String(d.status||'待校对').slice(0,100),pageCount:d.pages.length,textPages:d.pages.filter(p=>typeof p.text==='string'&&p.text.replace(/\s/g,'').length>=30).length,pages:d.pages.map((p,i)=>{if(typeof p.text!=='string'||p.text.length>1000000)throw new Error('页面文字异常');return {page:i+1,text:p.text};})};});
  }
  async function importFile(file) {if(!file)return;try{
    if(file.size>60*1024*1024)throw new Error('导入包超过60MB，请使用分科导入包。');
    const pack=JSON.parse(await file.text());const docs=validate(pack);
    // Validate everything before opening the write transaction. Duplicate IDs replace source text only.
    await putMany('documents',docs);
    if(Array.isArray(pack.notes))await putMany('notes',pack.notes.filter(n=>n&&docs.some(d=>d.id===n.id)&&typeof n.note==='string').map(n=>({id:n.id,note:n.note.slice(0,50000),page:Math.max(1,Number(n.page)||1),due:Number(n.due)||0})));
    alert(`已导入 ${docs.length} 份资料，原学习记录保持不变。`);view();
  }catch(e){alert('导入未完成：'+e.message);}}
  function download(name,value){const u=URL.createObjectURL(new Blob([JSON.stringify(value)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),60000);}
  async function backup(){try{download('备考个人资料与笔记备份.json',{format:'qh-materials-v1',documents:await read('documents'),notes:await read('notes')});}catch(e){alert('备份失败：'+e.message);}}
  let filter='',category='全部',ticket=0,objectUrl;
  async function view(){const seq=++ticket;try{
    const docs=await read('documents'),notes=await read('notes');if(seq!==ticket||!location.hash.startsWith('#/materials'))return;
    const catalog=window.MATERIAL_CATALOG59||[];const rows=docs.length?docs:catalog;
    app.innerHTML=header('个人资料库','V59.0 · 搜索、逐页阅读、闭卷笔记',true)+`<main class="wrap"><section class="card"><b>已收录 ${docs.length} / ${catalog.length||108} 份 · 有可搜索文字 ${docs.filter(d=>d.textPages>0).length} 份</b><p>首次在本设备选择“资料赠礼-个人导入包.json”。资料保存在当前浏览器，电脑和手机需分别导入。</p><label class="btn">导入资料包<input id="material-file" type="file" accept=".json,application/json" style="display:block;max-width:100%;margin-top:8px"></label><button class="btn ghost block" id="material-backup">导出资料与笔记备份</button><p class="small">此备份与“数据保险箱”的学习进度备份分开；原PDF附件不包含在备份中。不要清除本站浏览器数据。</p></section><section class="card"><label>搜索标题或正文<input id="material-search" placeholder="例如：病例对照、置信区间" style="width:100%;padding:12px" value="${esc(filter)}"></label><select id="material-category" style="width:100%;padding:12px;margin-top:8px">${['全部',...new Set(rows.map(d=>d.category))].map(c=>`<option ${c===category?'selected':''}>${esc(c)}</option>`).join('')}</select><p class="small">往年政治资料标记为历史资料；清华题按提供文件收录，尚未经官方核验。扫描页不伪造文字或答案。</p><div id="material-results"></div></section></main>`+tabbar('/learn');
    document.getElementById('material-file').onchange=e=>importFile(e.target.files[0]);document.getElementById('material-backup').onclick=backup;
    const show=()=>{const q=filter.replace(/\s/g,'').toLowerCase();const chosen=rows.filter(d=>(category==='全部'||d.category===category)&&(!q||d.title.replace(/\s/g,'').toLowerCase().includes(q)||(d.pages||[]).some(p=>p.text.replace(/\s/g,'').toLowerCase().includes(q))));
      document.getElementById('material-results').innerHTML=`<p>找到 ${chosen.length} 份</p>`+chosen.map(d=>{const n=notes.find(n=>n.id===d.id);return `<button class="list-item" data-material="${esc(d.id)}"><div class="ttl">${esc(d.title)}</div><div class="small">${esc(d.category)} · ${d.pageCount||0}页 · ${docs.length?esc(d.status):'等待导入正文'}${n&&n.due&&n.due<=Date.now()?' · 今日复习':''}</div></button>`;}).join('');
      document.querySelectorAll('[data-material]').forEach(b=>b.onclick=()=>docs.length?go('/materials/'+b.dataset.material):alert('请先导入个人资料包，即可打开正文。'));};
    document.getElementById('material-search').oninput=e=>{filter=e.target.value;show();};document.getElementById('material-category').onchange=e=>{category=e.target.value;show();};show();
  }catch(e){app.innerHTML=header('个人资料库','无法读取本地资料',true)+`<main class="wrap"><p>${esc(e.message)}</p><p>请使用支持本地存储的普通浏览器窗口。</p></main>`;}}
  async function open(id,pageNumber){const seq=++ticket;try{const d=await read('documents',id);if(!d){return view();}const n=await read('notes',id)||{id,note:'',page:1,due:0};if(seq!==ticket)return;
    const p=Math.min(d.pages.length||1,Math.max(1,Number(pageNumber)||n.page||1));const page=d.pages[p-1]||{text:''};
    await putMany('notes',[{...n,page:p}]);if(seq!==ticket)return;
    if(objectUrl){URL.revokeObjectURL(objectUrl);objectUrl=null;}
    app.innerHTML=header(d.title,`${d.category} · 第${p}/${d.pages.length}页`,true)+`<main class="wrap"><section class="card"><p class="small">${esc(d.source)} · ${esc(d.status)} · 保留原始页码</p>${d.category==='政治'?'<p class="box warn">往年复习资料，不代表2027年度时政或最新考试范围。</p>':''}<div class="row"><button class="btn ghost" id="material-prev" ${p<=1?'disabled':''}>上一页</button><input id="material-page" type="number" min="1" max="${d.pages.length}" value="${p}" aria-label="页码" style="width:80px"><button class="btn ghost" id="material-next" ${p>=d.pages.length?'disabled':''}>下一页</button></div><button class="btn ghost block" id="material-hide">遮住原文，先回忆</button><div id="material-text" style="white-space:pre-wrap;line-height:1.9;overflow-wrap:anywhere;margin-top:16px">${page.text.trim()?esc(page.text):'本页为扫描图像，尚无可读文字。请关联原PDF查看；不能将空白视为已掌握。'}</div><label>关联本份原PDF（可选，仅存本设备）<input id="material-pdf" type="file" accept="application/pdf,.pdf"></label><div id="material-pdf-link"></div></section><section class="card"><label>闭卷写下重点／疑问<textarea id="material-note" style="width:100%;min-height:130px">${esc(n.note)}</textarea></label><button class="btn block" id="material-save">保存笔记与阅读位置</button><button class="btn ghost block" id="material-due">加入明日复习</button><p id="material-saved" role="status"></p></section><button class="btn ghost block" onclick="go('/materials')">返回资料库</button></main>`+tabbar('/learn');
    const save=async(due=n.due)=>{await putMany('notes',[{id,note:document.getElementById('material-note').value,page:p,due}]);n.due=due;document.getElementById('material-saved').textContent='已保存';};
    const move=async(next)=>{try{await save();await open(id,next);}catch(e){alert('保存失败，未翻页：'+e.message);}};
    document.getElementById('material-prev').onclick=()=>move(p-1);document.getElementById('material-next').onclick=()=>move(p+1);document.getElementById('material-page').onchange=e=>move(e.target.value);
    document.getElementById('material-save').onclick=()=>save().catch(e=>alert('保存失败：'+e.message));document.getElementById('material-due').onclick=()=>save(Date.now()+86400000).catch(e=>alert(e.message));
    document.getElementById('material-hide').onclick=e=>{const el=document.getElementById('material-text');el.hidden=!el.hidden;e.target.textContent=el.hidden?'显示原文，核对回忆':'遮住原文，先回忆';};
    const link=blob=>{objectUrl=URL.createObjectURL(blob);document.getElementById('material-pdf-link').innerHTML=`<a class="btn ghost" href="${objectUrl}#page=${p}" target="_blank" rel="noopener">打开原PDF第${p}页</a>`;};
    const savedPdf=await read('pdfs',id);if(seq!==ticket)return;if(savedPdf)link(savedPdf.blob);
    document.getElementById('material-pdf').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.name!==d.file)throw new Error('请选择对应文件：'+d.file);if(f.size>150*1024*1024)throw new Error('此PDF过大，请在电脑直接阅读原件。');await putMany('pdfs',[{id,blob:f}]);if(seq===ticket)link(f);}catch(e){alert('PDF未保存：'+e.message);}};
  }catch(e){alert('打开失败：'+e.message);}}
  return {view,open,importFile,backup,validate};
})();
