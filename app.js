(function () {
  'use strict';
  const { GRID, SIZE, MAGIC_CONSTANT, findNumber, analyze, sum } = window.SolarSquare;
  const square = document.getElementById('square');
  const kicker = document.getElementById('inspector-kicker');
  const headline = document.getElementById('inspector-headline');
  const body = document.getElementById('inspector-body');
  const result = document.getElementById('inspector-sum');
  const traceActions = document.getElementById('trace-actions');
  const modes = Array.from(document.querySelectorAll('[data-mode]'));
  const state = { mode: 'focus', number: null, traceCount: 1 };

  const cells = [];
  GRID.forEach((row, r) => row.forEach((number, c) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'cell';
    cell.textContent = number;
    cell.dataset.row = r;
    cell.dataset.col = c;
    cell.dataset.number = number;
    cell.setAttribute('aria-label', `Number ${number}, row ${r + 1}, column ${c + 1}`);
    cell.addEventListener('click', () => {
      if (state.mode === 'trace') state.traceCount = number;
      else state.number = number;
      render();
    });
    cell.addEventListener('keydown', event => {
      const moves = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] };
      const move = moves[event.key];
      if (!move) return;
      event.preventDefault();
      const nextRow = Math.max(0, Math.min(SIZE - 1, r + move[0]));
      const nextCol = Math.max(0, Math.min(SIZE - 1, c + move[1]));
      cells[nextRow * SIZE + nextCol].focus();
    });
    square.appendChild(cell);
    cells.push(cell);
  }));

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.classList.add('trace-svg');
  svg.setAttribute('aria-hidden', 'true');
  square.appendChild(svg);

  function setInspector(label, title, description, summation) {
    kicker.textContent = label;
    headline.textContent = title;
    body.textContent = description;
    result.textContent = summation;
  }

  function drawTrace() {
    svg.replaceChildren();
    if (state.mode !== 'trace') return;
    svg.setAttribute('viewBox', `0 0 ${square.clientWidth} ${square.clientHeight}`);
    const points = Array.from({ length: state.traceCount }, (_, i) => {
      const { row, col } = findNumber(i + 1);
      const cell = cells[row * SIZE + col];
      return { x: cell.offsetLeft + cell.offsetWidth / 2, y: cell.offsetTop + cell.offsetHeight / 2 };
    });
    const shape = document.createElementNS(svgNS, 'polyline');
    shape.setAttribute('points', points.map(p => `${p.x},${p.y}`).join(' '));
    shape.setAttribute('fill', 'none');
    shape.setAttribute('stroke', '#f3cd7f');
    shape.setAttribute('stroke-opacity', '.82');
    shape.setAttribute('stroke-width', '2');
    shape.setAttribute('stroke-linejoin', 'round');
    shape.setAttribute('stroke-linecap', 'round');
    svg.appendChild(shape);
    const last = points[points.length - 1];
    const dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('cx', last.x); dot.setAttribute('cy', last.y);
    dot.setAttribute('r', '5'); dot.setAttribute('fill', '#ffe1a1');
    svg.appendChild(dot);
  }

  function render() {
    const { mode, number } = state;
    modes.forEach(b => {
      const active = b.dataset.mode === mode;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    const selected = number === null ? null : findNumber(number);
    const complement = number === null ? null : 37 - number;
    cells.forEach(cell => {
      const r = +cell.dataset.row, c = +cell.dataset.col, n = +cell.dataset.number;
      let active = false, secondary = false;
      if (mode === 'focus' && selected) {
        active = selected.row === r || selected.col === c;
      } else if (mode === 'rows') {
        active = r === (selected?.row ?? 0);
      } else if (mode === 'columns') {
        active = c === (selected?.col ?? 0);
      } else if (mode === 'diagonals') {
        active = r === c || r + c === SIZE - 1;
      } else if (mode === 'pairs' && number !== null) {
        active = n === number || n === complement;
      } else if (mode === 'trace') {
        secondary = n <= state.traceCount;
      }
      cell.classList.toggle('active', active);
      cell.classList.toggle('secondary', secondary);
      cell.classList.toggle('selected', number !== null && n === number && mode !== 'trace');
      cell.setAttribute('aria-pressed', String(number !== null && n === number && mode !== 'trace'));
    });
    traceActions.hidden = mode !== 'trace';
    if (mode === 'trace') {
      document.getElementById('trace-prev').disabled = state.traceCount <= 1;
      document.getElementById('trace-next').disabled = state.traceCount >= 36;
      setInspector('IV / PATH THROUGH THE GRID', `1 → ${state.traceCount}`,
        'Use Previous and Next, or select any numbered cell to trace directly to it. The path shows placement, not a supernatural mechanism.',
        `${state.traceCount} of 36 positions traced`);
    } else if (mode === 'rows') {
      const r = selected?.row ?? 0;
      setInspector('I / ROW STRUCTURE', `Row ${r + 1} = 111`,
        `Row ${r + 1}: ${GRID[r].join(' + ')}. Select any cell to inspect another row.`,
        `${GRID[r].join(' + ')} = ${sum(GRID[r])}`);
    } else if (mode === 'columns') {
      const c = selected?.col ?? 0, items = GRID.map(row => row[c]);
      setInspector('II / COLUMN STRUCTURE', `Column ${c + 1} = 111`,
        `Column ${c + 1}: ${items.join(' + ')}. Select any cell to inspect another column.`,
        `${items.join(' + ')} = ${sum(items)}`);
    } else if (mode === 'diagonals') {
      const d1 = GRID.map((row, r) => row[r]), d2 = GRID.map((row, r) => row[SIZE - 1 - r]);
      setInspector('III / THE DIAGONALS', 'Two directions. One sum.',
        `Primary diagonal: ${d1.join(' + ')}. Opposite diagonal: ${d2.join(' + ')}.`,
        `${sum(d1)} = ${sum(d2)} = ${MAGIC_CONSTANT}`);
    } else if (mode === 'pairs') {
      if (number === null) {
        setInspector('IV / COMPLEMENTARY PAIRS', 'Every number has a partner.',
          'Choose any number to illuminate its complement, calculated as 37 minus the selected number.',
          'Examples: 1 + 36 = 37 · 2 + 35 = 37');
      } else {
        setInspector('IV / COMPLEMENTARY PAIRS', `${number} + ${complement} = 37`,
          'The complement is based on arithmetic, not necessarily a geometrically opposite cell.',
          `37 − ${number} = ${complement}`);
      }
    } else if (number !== null) {
      const { row, col } = selected;
      setInspector('SELECTED NUMBER', `${number} · Row ${row + 1}, Column ${col + 1}`,
        `The row containing ${number} and the column containing ${number} both equal the same invariant.`,
        `Row = ${sum(GRID[row])}  ·  Column = ${sum(GRID.map(r => r[col]))}`);
    } else {
      setInspector('THE INVARIANT', 'Every line returns to 111.',
        'Select a number to illuminate its row and column. Explore every line, complementary pair, or the full numerical journey.',
        '6 rows + 6 columns + 2 main diagonals = 14 verified lines.');
    }
    drawTrace();
  }
  modes.forEach(button => button.addEventListener('click', () => {
    state.mode = button.dataset.mode;
    if (state.mode === 'trace') { state.traceCount = 1; state.number = null; }
    render();
  }));
  document.getElementById('trace-prev').addEventListener('click', () => {
    state.traceCount = Math.max(1, state.traceCount - 1); render();
  });
  document.getElementById('trace-next').addEventListener('click', () => {
    state.traceCount = Math.min(36, state.traceCount + 1); render();
  });
  window.addEventListener('resize', drawTrace);
  const check = analyze();
  const status = document.getElementById('check-status');
  if (!check.valid || check.magicConstant !== MAGIC_CONSTANT || check.total !== 666) {
    status.textContent = 'Verification failure: please inspect source data';
    status.style.color = '#ffad91';
    document.querySelector('.status').textContent = 'CHECK FAILED';
  }
  render();
})();

