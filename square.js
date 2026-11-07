/* SOL 111 — source-grid data and deterministic verification. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SolarSquare = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Exact left-to-right orientation of the supplied image.
  const GRID = Object.freeze([
    Object.freeze([ 1, 35, 34,  3, 32,  6]),
    Object.freeze([30,  8, 28, 27, 11,  7]),
    Object.freeze([24, 23, 15, 16, 14, 19]),
    Object.freeze([13, 17, 21, 22, 20, 18]),
    Object.freeze([12, 26,  9, 10, 29, 25]),
    Object.freeze([31,  2,  4, 33,  5, 36]),
  ]);
  const SIZE = 6;
  const MAGIC_CONSTANT = 111;
  const TOTAL = 666;

  function sum(list) { return list.reduce((acc, n) => acc + n, 0); }
  function findNumber(number, grid = GRID) {
    for (let r = 0; r < grid.length; r++) {
      const c = grid[r].indexOf(number);
      if (c !== -1) return { row: r, col: c };
    }
    return null;
  }
  function analyze(grid = GRID) {
    const size = grid.length;
    const validShape = size > 0 && grid.every(r => Array.isArray(r) && r.length === size);
    if (!validShape) return { valid: false, errors: ['Not a square grid'] };
    const values = grid.flat();
    const range = Array.from({ length: size * size }, (_, i) => i + 1);
    const uniqueAndComplete = values.length === range.length &&
      values.slice().sort((a, b) => a - b).every((n, i) => n === range[i]);
    const magicConstant = size * (size * size + 1) / 2;
    const rows = grid.map(sum);
    const columns = Array.from({ length: size }, (_, c) => sum(grid.map(row => row[c])));
    const diagonals = [
      sum(grid.map((row, r) => row[r])),
      sum(grid.map((row, r) => row[size - 1 - r])),
    ];
    const total = sum(values);
    const errors = [];
    if (!uniqueAndComplete) errors.push('Numbers are not exactly 1 to n² once each');
    if (![...rows, ...columns, ...diagonals].every(n => n === magicConstant))
      errors.push('A row, column, or main diagonal has the wrong sum');
    if (total !== size * size * (size * size + 1) / 2) errors.push('Incorrect total');
    return { valid: errors.length === 0, size, magicConstant, total, rows, columns, diagonals,
      uniqueAndComplete, errors };
  }
  return Object.freeze({ GRID, SIZE, MAGIC_CONSTANT, TOTAL, sum, findNumber, analyze });
});

