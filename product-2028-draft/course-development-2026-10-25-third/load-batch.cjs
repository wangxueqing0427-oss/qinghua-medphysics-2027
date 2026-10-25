// Only isolated drafts; existing 29-course catalog and browser preview remain unchanged.
const fs=require('fs'),path=require('path'),E=require('../course-engine.cjs');
function loadBatch(){const m=require('./batch-manifest.json');if(m.mode!=='isolated-engineering-only'||m.formalReleaseApproved!==false)throw Error('Unapproved manifest');return m.folders.flatMap(id=>{if(!/^[a-z0-9-]+$/.test(id))throw Error('Invalid path');const p=JSON.parse(fs.readFileSync(path.join(__dirname,'../course-drafts',id,'unit.json'),'utf8'));if(p.units.some(u=>u.reviewStatus!=='draft-internal-check'||u.distribution!=='held-pending-review'||u.reviewRecord.expertApproved!==false))throw Error('Draft status violation');return p.units;});}
function combined(){const old=require('../course-development-2026-10-25/load-batch.cjs').combined(),pack={...old,units:[...old.units,...loadBatch()]};const errors=E.validate(pack);if(errors.length)throw Error(errors.join(','));return pack;}
module.exports={loadBatch,combined};

