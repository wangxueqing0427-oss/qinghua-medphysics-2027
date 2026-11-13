
// This snippet is inserted inside home() only in the isolated V11 build.
document.getElementById('migrate-v10').onchange=e=>act(async()=>{
  stagedMigration=null;
  const file=e.target.files?.[0];if(!file)return;
  if(file.size>20*1024*1024)throw Error('备份超过20MB试验限制');
  const input=JSON.parse(await file.text());
  const check=MigrationBridge.inspect(input,pack);
  stagedMigration=input;
  const pane=document.getElementById('migration-preview');
  pane.innerHTML='<p>已核验：V10学习事件'+check.events+'条、会话'+check.sessions+
    '条，其中已回答'+check.answered+'题次。仅允许复制到新的V11本机档案。</p>'+
    '<p>注意：原V10学习记录不会同步更新；在新版本继续学习前请自行保存原备份。</p>'+
    '<button class="btn block" id="confirm-migration">我确认：创建V11新档案并保留V10原始记录</button>';
  bind('confirm-migration',async()=>{
    if(!stagedMigration)throw Error('请先选择并校验V10备份');
    const prepared=MigrationBridge.prepare(stagedMigration,pack);
    const created=await repository.restoreAsNewProfile(crypto.randomUUID(),prepared);
    stagedMigration=null;
    profile=created;
    await enter();
  });
});
