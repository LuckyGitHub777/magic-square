'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { GRID, SIZE, MAGIC_CONSTANT, TOTAL, findNumber, analyze } = require('../square');

test('grid preserves the supplied image exactly', () => {
  assert.deepEqual(GRID, [
    [1,35,34,3,32,6], [30,8,28,27,11,7], [24,23,15,16,14,19],
    [13,17,21,22,20,18], [12,26,9,10,29,25], [31,2,4,33,5,36],
  ]);
});
test('complete, non-duplicated sequence 1 through 36', () => {
  assert.deepEqual(GRID.flat().slice().sort((a,b) => a-b), Array.from({length:36},(_,i)=>i+1));
});
test('all rows, columns and two diagonals have magic constant 111', () => {
  const proof = analyze();
  assert.equal(proof.valid, true);
  assert.equal(proof.size, SIZE);
  assert.equal(proof.magicConstant, MAGIC_CONSTANT);
  assert.equal(proof.total, TOTAL);
  assert.deepEqual(proof.rows, Array(6).fill(111));
  assert.deepEqual(proof.columns, Array(6).fill(111));
  assert.deepEqual(proof.diagonals, [111,111]);
});
test('every complement pair sums to 37', () => {
  for (let n = 1; n <= 36; n++) assert.equal(n+(37-n),37);
});
test('each number has one coordinate in the 6×6 grid', () => {
  for (let n = 1; n <= 36; n++) {
    const p = findNumber(n);
    assert.equal(GRID[p.row][p.col],n);
  }
  assert.equal(findNumber(99),null);
});
test('a mutated square is rejected', () => {
  const changed = GRID.map(row => row.slice());
  changed[0][0]=36;
  assert.equal(analyze(changed).valid,false);
});
