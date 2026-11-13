(function(root){
 'use strict';
 const finite=(x)=>typeof x==='number'&&Number.isFinite(x);
 function number(x,name,min=0,max=Infinity){if(!finite(x)||x<min||x>max)throw new Error(name+' is outside its allowed range');return x;}
 function optional(x,name,min=0,max=Infinity){return x===null?null:number(x,name,min,max);}
 function validateScenario(s,base){
  if(!s||s.schema_version!==1||!Array.isArray(s.inventory)||s.inventory.length!==base.inventory.length)throw new Error('Expected a version 1 architecture scenario with all inventory rows');
  if(typeof s.name!=='string'||s.name.length>200||typeof s.basis!=='string'||s.basis.length>2000)throw new Error('Invalid scenario identity');
  if(typeof s.failed_task!=='string'||(s.failed_task&&!base.tasks.some(t=>t.id===s.failed_task)))throw new Error('Invalid failed task');
  if(!s.controls||typeof s.controls!=='object')throw new Error('Missing scenario controls');
  const ids=new Set();
  s.inventory.forEach(r=>{if(!r||typeof r.id!=='string'||ids.has(r.id)||!base.inventory.some(b=>b.id===r.id))throw new Error('Unknown or duplicate inventory ID');ids.add(r.id);number(r.quantity,'quantity',0,10000);if(!Number.isInteger(r.quantity))throw new Error('Quantity must be an integer');['unit_mass_kg','operating_demand_kw','deployment_hours','volume_m3'].forEach(k=>optional(r[k],k));if(!['Unallocated','0','1','2','3','4'].includes(r.phase))throw new Error('Invalid phase');});
  const c=s.controls;number(c.load_kw,'load',0,1000000);number(c.availability,'availability',0,1);number(c.derate,'derate',0,1);number(c.dod,'depth of discharge',0.001,1);number(c.discharge_eff,'discharge efficiency',0.001,1);number(c.distribution_eff,'distribution efficiency',.001,1);number(c.outage_h,'outage',0,1000000);optional(c.vector_kw,'VECTOR power');if(typeof c.vector_enabled!=='boolean')throw new Error('Invalid VECTOR flag');if(!['allocation','inventory'].includes(c.demand_mode))throw new Error('Invalid demand mode');
  number(c.trench_depth_m,'depth',0,1);number(c.trench_length_m,'length',0,1000000);number(c.trench_width_m,'width',0,1000000);number(c.swell,'swell',1,10);optional(c.excavation_kwh_per_kg,'excavation energy');
  if(!Array.isArray(s.parameter_inputs)||s.parameter_inputs.length!==base.parameters.length)throw new Error('Missing parameter records');
  s.parameter_inputs.forEach((p,i)=>{if(p.parameter!==base.parameters[i].parameter||typeof p.raw_value!=='string'||p.raw_value.length>200||typeof p.note!=='string'||p.note.length>1000||typeof p.source_id!=='string'||(!base.sources.some(x=>x.id===p.source_id)&&p.source_id!=='DESIGN'&&p.source_id!==''))throw new Error('Invalid parameter input');});
  return s;
 }
 function makeScenario(data){return {schema_version:1,name:'GER supply versus Space 4 All nominal load',basis:'Historical supply cross-compared with project load allocation; not the same mission',failed_task:'',inventory:data.inventory.map(r=>({id:r.id,quantity:r.quantity,unit_mass_kg:null,operating_demand_kw:null,deployment_hours:null,volume_m3:null,phase:'Unallocated'})),controls:{demand_mode:'allocation',load_kw:data.power_baseline.nominal_load_kw,availability:1,derate:1,dod:.8,discharge_eff:.9,distribution_eff:1,outage_h:24,vector_enabled:false,vector_kw:null,trench_depth_m:.3,trench_length_m:100,trench_width_m:.3,swell:1.2,excavation_kwh_per_kg:null},parameter_inputs:data.parameters.map(p=>({parameter:p.parameter,raw_value:'',source_id:'',note:''}))};}
 function budget(rows,field){const active=rows.filter(r=>r.quantity>0);const missing=active.filter(r=>r[field]===null).map(r=>r.id);const known=active.reduce((a,r)=>a+(r[field]===null?0:r.quantity*r[field]),0);return {known,total:missing.length?null:known,missing};}
 function calculate(data,s){
  validateScenario(s,data);const c=s.controls;const rows=s.inventory;
  const qty=id=>rows.find(r=>r.id===id).quantity;
  const stationary=qty('PUP')*100;const mobile=qty('SEV')*200;
  const generation=qty('PUP')*2*c.availability*c.derate;
  const itemDemand=budget(rows,'operating_demand_kw');const vector=c.vector_enabled?c.vector_kw:0;
  const baseDemand=c.demand_mode==='allocation'?c.load_kw:itemDemand.total;
  const load=baseDemand===null||vector===null?null:baseDemand+vector;
  const bus=load===null?null:load/c.distribution_eff;
  const usable=stationary*c.dod*c.discharge_eff;
  const deficit=bus===null?null:Math.max(0,bus-generation);
  const allocated=rows.filter(r=>r.quantity>0&&r.phase!=='Unallocated');
  const phases=[0,1,2,3,4].map(p=>{const r=allocated.filter(r=>Number(r.phase)<=p);return {phase:p,items:r.reduce((a,x)=>a+x.quantity,0),mass:budget(r,'unit_mass_kg')};});
  return {items:rows.reduce((a,r)=>a+r.quantity,0),types:rows.filter(r=>r.quantity>0).length,mass:budget(rows,'unit_mass_kg'),deployment:budget(rows,'deployment_hours'),volume:budget(rows,'volume_m3'),itemDemand,stationary,mobile,generation,usable,load,bus,deficit,zeroGenerationHours:bus>0?usable/bus:null,deficitHours:deficit>0?usable/deficit:null,requiredBattery:bus===null?null:bus*c.outage_h/(c.dod*c.discharge_eff),phases,unallocated:rows.filter(r=>r.phase==='Unallocated').reduce((a,r)=>a+r.quantity,0),complexityIndex:null};
 }
 function density(depthM){number(depthM,'density depth',0,1);return 1920*(depthM+.122)/(depthM+.18);}
 function excavation(c){number(c.trench_depth_m,'depth',0,1);const d=c.trench_depth_m;const volume=c.trench_width_m*c.trench_length_m*d;const kgPerArea=1920*(d-.058*Math.log((d+.18)/.18));const mass=c.trench_width_m*c.trench_length_m*kgPerArea;return {volume,looseVolume:volume*c.swell,mass,bottomDensity:density(d),energy:c.excavation_kwh_per_kg===null?null:mass*c.excavation_kwh_per_kg};}
 function blockedTasks(tasks,failed){
  const ids=new Set(tasks.map(t=>t.id));if(failed&&!ids.has(failed))throw new Error('Unknown task');
  const todo=new Map(tasks.map(t=>[t.id,new Set(t.depends_on)]));for(const deps of todo.values())for(const d of deps)if(!ids.has(d))throw new Error('Unknown dependency');
  const order=[];while(todo.size){const ready=[...todo].filter(([,ds])=>!ds.size).map(([id])=>id);if(!ready.length)throw new Error('Dependency cycle');for(const id of ready){order.push(id);todo.delete(id);}for(const ds of todo.values())for(const id of ready)ds.delete(id);}
  const blocked=new Set(failed?[failed]:[]);for(const id of order){const t=tasks.find(t=>t.id===id);if(t.depends_on.some(x=>blocked.has(x)))blocked.add(id);}return {order,blocked:[...blocked],descendants:[...blocked].filter(id=>id!==failed)};
 }
 const api={validateScenario,makeScenario,budget,calculate,density,excavation,blockedTasks};
 if(typeof module!=='undefined'&&module.exports)module.exports=api;root.LunarModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);