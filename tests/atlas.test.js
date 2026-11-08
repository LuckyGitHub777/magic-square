'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {GRID,EXHIBITS,verify,generate,getExhibit}=require('../square');
test('all seven planetary tables are distinct normal magic squares and Solar source remains unchanged',()=>{
 const p=EXHIBITS.filter(e=>e.group==='planetary');assert.equal(p.length,7);
 assert.deepEqual(getExhibit('sun').grid,GRID);
 for(const [i,e] of p.entries()){const x=verify(e.grid,e),n=i+3;assert.equal(x.valid,true,e.id+': '+x.errors);assert.equal(x.size,n);assert.equal(x.magicConstant,n*(n*n+1)/2);assert.equal(x.complete,true);}
});
test('masterpiece variants are mathematically honest',()=>{
 const d=getExhibit('durer');assert.equal(verify(d.grid,d).valid,true);assert.deepEqual(d.grid[3],[4,15,14,1]);
 assert.equal(d.grid[0][0]+d.grid[0][3]+d.grid[3][0]+d.grid[3][3],34);
 assert.deepEqual(getExhibit('lo-shu').grid,getExhibit('saturn').grid);
 const f=getExhibit('franklin'),proof=verify(f.grid,f);
 assert.equal(proof.valid,true);assert.equal(proof.straightDiagonalsValid,false);assert.equal(verify(f.grid).valid,false);
 for(const r of f.grid){assert.equal(r.slice(0,4).reduce((a,b)=>a+b),130);assert.equal(r.slice(4).reduce((a,b)=>a+b),130);}
 const birthday=getExhibit('ramanujan');assert.equal(verify(birthday.grid,birthday).valid,true);assert.equal(verify(birthday.grid).valid,false);assert.equal(verify(birthday.grid,birthday).magicConstant,139);
});
test('constructors work for odd, doubly even and singly even orders 3–19',()=>{
 for(let n=3;n<=19;n++){const x=verify(generate(n));assert.equal(x.valid,true,n+':'+x.errors);}
 for(const bad of [0,1,2,20,3.5,'6'])assert.throws(()=>generate(bad));
 for(let n=3;n<=12;n++)assert.equal(verify(getExhibit('generated-'+n).grid).valid,true);
 for(const bad of ['generated-2','generated-13','generated-x','__proto__'])assert.equal(getExhibit(bad),null);
});
