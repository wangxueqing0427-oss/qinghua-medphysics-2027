// Isolated batch composition only; never writes the phone catalog or prior registry.
const fs=require('fs'),path=require('path'),E=require('../course-engine.cjs');
function loadBatch(){const m=require('./batch-manifest.json');if(m.formalReleaseApproved!==false||m.mode!=='isolated-engineering-only')throw Error('Unapproved manifest');return m.folders.flatMap(id=>{if(!/^[a-z0-9-]+$/.test(id))throw Error('Invalid path');const p=JSON.parse(fs.readFileSync(path.join(__dirname,'../course-drafts',id,'unit.json'),'utf8'));if(p.units.some(u=>u.distribution!=='held-pending-review'||u.reviewRecord.expertApproved!==false))throw Error('Unreviewed publication');return p.units;});}
function combined(){const p=require('../course-drafts/load-drafts.cjs').withExisting(),pack={...p,units:[...p.units,...loadBatch()]},errors=E.validate(pack);if(errors.length)throw Error(errors.join(','));return pack;}
module.exports={loadBatch,combined};
