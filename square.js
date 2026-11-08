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

  // Curated artifacts. Solar remains untouched and stays the mathematical baseline.
  const EXHIBITS = [
  {
    "id": "saturn",
    "name": "Saturn",
    "symbol": "♄",
    "group": "planetary",
    "tagline": "Structure and time",
    "grid": [
      [
        4,
        9,
        2
      ],
      [
        3,
        5,
        7
      ],
      [
        8,
        1,
        6
      ]
    ],
    "normal": true,
    "semimagic": false,
    "sourceUrl": "https://esotericnotebook.com/correspondences/squares",
    "description": "Saturn's 3×3 kamea in the Renaissance planetary tradition. It shares its numbers with the earlier Chinese Lo Shu but not the same cultural history."
  },
  {
    "id": "jupiter",
    "name": "Jupiter",
    "symbol": "♃",
    "group": "planetary",
    "tagline": "Harmony and expansion",
    "grid": [
      [
        4,
        14,
        15,
        1
      ],
      [
        9,
        7,
        6,
        12
      ],
      [
        5,
        11,
        10,
        8
      ],
      [
        16,
        2,
        3,
        13
      ]
    ],
    "normal": true,
    "semimagic": false,
    "sourceUrl": "https://esotericnotebook.com/correspondences/squares",
    "description": "Agrippa's Jupiter arrangement totals 34 on every ordinary line. Dürer's 1514 square is a distinct 4×4 arrangement."
  },
  {
    "id": "mars",
    "name": "Mars",
    "symbol": "♂",
    "group": "planetary",
    "tagline": "Action and resolve",
    "grid": [
      [
        11,
        24,
        7,
        20,
        3
      ],
      [
        4,
        12,
        25,
        8,
        16
      ],
      [
        17,
        5,
        13,
        21,
        9
      ],
      [
        10,
        18,
        1,
        14,
        22
      ],
      [
        23,
        6,
        19,
        2,
        15
      ]
    ],
    "normal": true,
    "semimagic": false,
    "sourceUrl": "https://esotericnotebook.com/correspondences/squares",
    "description": "The Mars kamea is a 5×5 normal magic square with 25 entries and an invariant of 65."
  },
  {
    "id": "sun",
    "name": "Sun",
    "symbol": "☉",
    "group": "planetary",
    "tagline": "Light and constancy",
    "grid": [
      [
        1,
        35,
        34,
        3,
        32,
        6
      ],
      [
        30,
        8,
        28,
        27,
        11,
        7
      ],
      [
        24,
        23,
        15,
        16,
        14,
        19
      ],
      [
        13,
        17,
        21,
        22,
        20,
        18
      ],
      [
        12,
        26,
        9,
        10,
        29,
        25
      ],
      [
        31,
        2,
        4,
        33,
        5,
        36
      ]
    ],
    "normal": true,
    "semimagic": false,
    "sourceUrl": "https://esotericnotebook.com/planetary-magic/planets/sun",
    "description": "This is the site's original horizontally reflected solar arrangement, preserved exactly. Its 36 entries sum to 666 and each of its 14 lines sums to 111."
  },
  {
    "id": "venus",
    "name": "Venus",
    "symbol": "♀",
    "group": "planetary",
    "tagline": "Beauty and proportion",
    "grid": [
      [
        22,
        47,
        16,
        41,
        10,
        35,
        4
      ],
      [
        5,
        23,
        48,
        17,
        42,
        11,
        29
      ],
      [
        30,
        6,
        24,
        49,
        18,
        36,
        12
      ],
      [
        13,
        31,
        7,
        25,
        43,
        19,
        37
      ],
      [
        38,
        14,
        32,
        1,
        26,
        44,
        20
      ],
      [
        21,
        39,
        8,
        33,
        2,
        27,
        45
      ],
      [
        46,
        15,
        40,
        9,
        34,
        3,
        28
      ]
    ],
    "normal": true,
    "semimagic": false,
    "sourceUrl": "https://esotericnotebook.com/correspondences/squares",
    "description": "This 7×7 Venus kamea totals 175 along every row, column and main diagonal. The planetary name is a historical symbolic association."
  },
  {
    "id": "mercury",
    "name": "Mercury",
    "symbol": "☿",
    "group": "planetary",
    "tagline": "Learning and precision",
    "grid": [
      [
        8,
        58,
        59,
        5,
        4,
        62,
        63,
        1
      ],
      [
        49,
        15,
        14,
        52,
        53,
        11,
        10,
        56
      ],
      [
        41,
        23,
        22,
        44,
        45,
        19,
        18,
        48
      ],
      [
        32,
        34,
        35,
        29,
        28,
        38,
        39,
        25
      ],
      [
        40,
        26,
        27,
        37,
        36,
        30,
        31,
        33
      ],
      [
        17,
        47,
        46,
        20,
        21,
        43,
        42,
        24
      ],
      [
        9,
        55,
        54,
        12,
        13,
        51,
        50,
        16
      ],
      [
        64,
        2,
        3,
        61,
        60,
        6,
        7,
        57
      ]
    ],
    "normal": true,
    "semimagic": false,
    "sourceUrl": "https://esotericnotebook.com/correspondences/squares",
    "description": "A classical 8×8 Mercury kamea; each row, column and main diagonal totals 260."
  },
  {
    "id": "moon",
    "name": "Moon",
    "symbol": "☽",
    "group": "planetary",
    "tagline": "Cycles and reflection",
    "grid": [
      [
        37,
        78,
        29,
        70,
        21,
        62,
        13,
        54,
        5
      ],
      [
        6,
        38,
        79,
        30,
        71,
        22,
        63,
        14,
        46
      ],
      [
        47,
        7,
        39,
        80,
        31,
        72,
        23,
        55,
        15
      ],
      [
        16,
        48,
        8,
        40,
        81,
        32,
        64,
        24,
        56
      ],
      [
        57,
        17,
        49,
        9,
        41,
        73,
        33,
        65,
        25
      ],
      [
        26,
        58,
        18,
        50,
        1,
        42,
        74,
        34,
        66
      ],
      [
        67,
        27,
        59,
        10,
        51,
        2,
        43,
        75,
        35
      ],
      [
        36,
        68,
        19,
        60,
        11,
        52,
        3,
        44,
        76
      ],
      [
        77,
        28,
        69,
        20,
        61,
        12,
        53,
        4,
        45
      ]
    ],
    "normal": true,
    "semimagic": false,
    "sourceUrl": "https://esotericnotebook.com/correspondences/squares",
    "description": "The classical 9×9 lunar kamea; each line totals 369. The values 54 and 36 are corrections of known errors in a later printed plate."
  },
  {
    "id": "lo-shu",
    "name": "Lo Shu",
    "symbol": "◇",
    "group": "masterpiece",
    "tagline": "A Chinese numerical classic",
    "grid": [
      [
        4,
        9,
        2
      ],
      [
        3,
        5,
        7
      ],
      [
        8,
        1,
        6
      ]
    ],
    "normal": true,
    "semimagic": false,
    "sourceUrl": "https://old.maa.org/press/periodicals/convergence/the-magic-squares-of-manuel-moschopoulos-magic-squares-before-moschopoulos",
    "description": "The Lo Shu is a central Chinese example of a 3×3 magic square. Its history is distinct from the later Saturn correspondence; claims of very ancient dates are legendary."
  },
  {
    "id": "durer",
    "name": "Dürer · 1514",
    "symbol": "✦",
    "group": "masterpiece",
    "tagline": "Art, time and geometry",
    "grid": [
      [
        16,
        3,
        2,
        13
      ],
      [
        5,
        10,
        11,
        8
      ],
      [
        9,
        6,
        7,
        12
      ],
      [
        4,
        15,
        14,
        1
      ]
    ],
    "normal": true,
    "semimagic": false,
    "sourceUrl": "https://www.nga.gov/artworks/35101-melencolia-i",
    "description": "Albrecht Dürer's 1514 Melencolia I square encodes the date with 15 and 14 in its bottom row. Four corners and the central four entries also sum to 34."
  },
  {
    "id": "franklin",
    "name": "Franklin · 8×8",
    "symbol": "⌁",
    "group": "masterpiece",
    "tagline": "Semimagic and bent diagonals",
    "grid": [
      [
        52,
        61,
        4,
        13,
        20,
        29,
        36,
        45
      ],
      [
        14,
        3,
        62,
        51,
        46,
        35,
        30,
        19
      ],
      [
        53,
        60,
        5,
        12,
        21,
        28,
        37,
        44
      ],
      [
        11,
        6,
        59,
        54,
        43,
        38,
        27,
        22
      ],
      [
        55,
        58,
        7,
        10,
        23,
        26,
        39,
        42
      ],
      [
        9,
        8,
        57,
        56,
        41,
        40,
        25,
        24
      ],
      [
        50,
        63,
        2,
        15,
        18,
        31,
        34,
        47
      ],
      [
        16,
        1,
        64,
        49,
        48,
        33,
        32,
        17
      ]
    ],
    "normal": true,
    "semimagic": true,
    "sourceUrl": "https://mathshistory.st-andrews.ac.uk/Biographies/Franklin_Benjamin/",
    "description": "Benjamin Franklin's 8×8 arrangement is SEMIMAGIC: its rows and columns equal 260 and its bent diagonals have special properties, but its straight diagonals do not both equal 260."
  },
  {
    "id": "ramanujan",
    "name": "Birthday · 139",
    "symbol": "✧",
    "group": "masterpiece",
    "tagline": "22 December 1887 encoded",
    "grid": [
      [
        22,
        12,
        18,
        87
      ],
      [
        88,
        17,
        9,
        25
      ],
      [
        10,
        24,
        89,
        16
      ],
      [
        19,
        86,
        23,
        11
      ]
    ],
    "normal": false,
    "semimagic": false,
    "sourceUrl": "https://apfstatic.s3.ap-south-1.amazonaws.com/s3fs-public/ramanujans_honour_magic_square.pdf",
    "description": "A birthday square widely attributed to Ramanujan, encoding 22 December 1887 in the first row; all ordinary lines sum to 139. Attribution is discussed in mathematical literature."
  }
];
  for (const item of EXHIBITS) { item.grid.forEach(Object.freeze); Object.freeze(item.grid); Object.freeze(item); }
  Object.freeze(EXHIBITS);
  function verify(grid, options = {}) {
    const n = Array.isArray(grid) ? grid.length : 0;
    if (!n || !grid.every(row => Array.isArray(row) && row.length === n))
      return { valid:false, errors:['Not a square grid'] };
    const values=grid.flat();
    const rows=grid.map(sum);
    const columns=Array.from({length:n},(_,c)=>sum(grid.map(row=>row[c])));
    const diagonals=[sum(grid.map((row,r)=>row[r])),sum(grid.map((row,r)=>row[n-1-r]))];
    const normal=options.normal!==false, semimagic=options.semimagic===true;
    const magicConstant=normal?n*(n*n+1)/2:rows[0];
    const total=sum(values);
    const unique=values.every(Number.isSafeInteger)&&new Set(values).size===n*n;
    const complete=unique&&values.slice().sort((a,b)=>a-b).every((v,i)=>v===i+1);
    const straightDiagonalsValid=diagonals.every(v=>v===magicConstant);
    const errors=[];
    if (!unique) errors.push('Non-integer or repeated entry');
    if (normal && !complete) errors.push('Not exactly 1 through n²');
    if ([...rows,...columns].some(v=>v!==magicConstant)) errors.push('Unequal row or column');
    if (!semimagic&&!straightDiagonalsValid) errors.push('Unequal main diagonal');
    if (total!==n*magicConstant) errors.push('Incorrect total');
    return { valid:errors.length===0,errors,size:n,rows,columns,diagonals,magicConstant,total,normal,semimagic,complete,straightDiagonalsValid };
  }
  function generateOdd(n) {
    const a=Array.from({length:n},()=>Array(n).fill(0));let r=0,c=Math.floor(n/2);
    for(let v=1;v<=n*n;v++){a[r][c]=v;const nr=(r-1+n)%n,nc=(c+1)%n;if(a[nr][nc])r=(r+1)%n;else{r=nr;c=nc;}}
    return a;
  }
  function generate(n) {
    if(!Number.isInteger(n)||n<3||n>19)throw new RangeError('Order 3–19 required');
    if(n%2)return generateOdd(n);
    if(n%4===0){const a=Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=>r*n+c+1));
      for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(!((r%4===c%4)||(r%4+c%4===3)))a[r][c]=n*n+1-a[r][c];return a;}
    const h=n/2,m=h*h,k=(h-1)/2,b=generateOdd(h),a=Array.from({length:n},()=>Array(n));
    for(let r=0;r<h;r++)for(let c=0;c<h;c++){a[r][c]=b[r][c];a[r][c+h]=b[r][c]+2*m;a[r+h][c]=b[r][c]+3*m;a[r+h][c+h]=b[r][c]+m;}
    function swap(r,c){[a[r][c],a[r+h][c]]=[a[r+h][c],a[r][c]];}
    for(let c=0;c<k;c++)for(let r=0;r<h;r++)swap(r,c);
    for(let c=n-(k-1);c<n;c++)for(let r=0;r<h;r++)swap(r,c);
    swap(k,0);swap(k,k);return a;
  }
  function getExhibit(id) {
    const named=EXHIBITS.find(e=>e.id===id);if(named)return named;
    const match=/^generated-(\d+)$/.exec(String(id));if(!match)return null;
    const n=Number(match[1]);if(!Number.isInteger(n)||n<3||n>12)return null;
    return {id:'generated-'+n,name:'Constructed · '+n+'×'+n,symbol:'□',group:'laboratory',tagline:'Mathematical construction',
      grid:generate(n),normal:true,semimagic:false,sourceUrl:'https://mathworld.wolfram.com/MagicSquare.html',
      description:'A generated normal magic square: odd orders use the Siamese method, doubly even orders use complements, and singly even orders use quadrant exchanges. This is not a historical planetary transcription.'};
  }
  return Object.freeze({ GRID, SIZE, MAGIC_CONSTANT, TOTAL, sum, findNumber, analyze, EXHIBITS, verify, generate, getExhibit });

});

