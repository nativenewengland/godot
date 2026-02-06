      path: "tilesheet/Interior_Tileset.png",
    dwarfholdWalls: {
      key: "dwarfholdWalls",
      path: "tilesheet/Tiled_files/walls_floor.png",
      tileSize: 16,
      image: null
    },
    dwarfholdObjects: {
      key: "dwarfholdObjects",
      path: "tilesheet/Tiled_files/Objects.png",
      tileSize: 16,
      image: null
    },
    rock: [
      { sheet: "dwarfholdWalls", row: 4, col: 5, size: 16 },
      { sheet: "dwarfholdWalls", row: 4, col: 6, size: 16 },
      { sheet: "dwarfholdWalls", row: 4, col: 7, size: 16 },
      { sheet: "dwarfholdWalls", row: 1, col: 5, size: 16 },
      { sheet: "dwarfholdWalls", row: 1, col: 7, size: 16 },
      { sheet: "dwarfholdWalls", row: 1, col: 9, size: 16 },
      { sheet: "dwarfholdWalls", row: 3, col: 5, size: 16 },
      { sheet: "dwarfholdWalls", row: 3, col: 7, size: 16 }
    ],
    carvedFloor: [
      { sheet: "dwarfholdWalls", row: 7, col: 11, size: 16 },
      { sheet: "dwarfholdWalls", row: 6, col: 10, size: 16 },
      { sheet: "dwarfholdWalls", row: 6, col: 11, size: 16 },
      { sheet: "dwarfholdWalls", row: 7, col: 5, size: 16 },
      { sheet: "dwarfholdWalls", row: 7, col: 6, size: 16 },
      { sheet: "dwarfholdWalls", row: 7, col: 7, size: 16 },
      { sheet: "dwarfholdWalls", row: 9, col: 5, size: 16 },
      { sheet: "dwarfholdWalls", row: 9, col: 7, size: 16 }
    ],
    polishedFloor: [
      { sheet: "dwarfholdWalls", row: 10, col: 10, size: 16 },
      { sheet: "dwarfholdWalls", row: 10, col: 11, size: 16 },
      { sheet: "dwarfholdWalls", row: 11, col: 8, size: 16 },
      { sheet: "dwarfholdWalls", row: 11, col: 9, size: 16 },
      { sheet: "dwarfholdWalls", row: 13, col: 7, size: 16 },
      { sheet: "dwarfholdWalls", row: 13, col: 8, size: 16 },
      { sheet: "dwarfholdWalls", row: 14, col: 7, size: 16 },
      { sheet: "dwarfholdWalls", row: 14, col: 8, size: 16 }
    ],
    workFloor: [
      { sheet: "dwarfholdWalls", row: 15, col: 11, size: 16 },
      { sheet: "dwarfholdWalls", row: 15, col: 12, size: 16 },
      { sheet: "dwarfholdWalls", row: 15, col: 13, size: 16 },
      { sheet: "dwarfholdWalls", row: 15, col: 14, size: 16 }
    ],
    dampFloor: [
      { sheet: "dwarfholdWalls", row: 13, col: 10, size: 16 },
      { sheet: "dwarfholdWalls", row: 13, col: 11, size: 16 },
      { sheet: "dwarfholdWalls", row: 13, col: 13, size: 16 },
      { sheet: "dwarfholdWalls", row: 14, col: 9, size: 16 },
      { sheet: "dwarfholdWalls", row: 14, col: 10, size: 16 },
      { sheet: "dwarfholdWalls", row: 14, col: 11, size: 16 },
      { sheet: "dwarfholdWalls", row: 14, col: 12, size: 16 },
      { sheet: "dwarfholdWalls", row: 14, col: 13, size: 16 }
    ],
    water: [
      { sheet: "dwarfholdWalls", row: 8, col: 2, size: 16 },
      { sheet: "dwarfholdWalls", row: 7, col: 1, size: 16 }
    ],
    moss: [
      { sheet: "dwarfholdWalls", row: 13, col: 1, size: 16 },
      { sheet: "dwarfholdWalls", row: 13, col: 2, size: 16 },
      { sheet: "dwarfholdWalls", row: 13, col: 3, size: 16 },
      { sheet: "dwarfholdWalls", row: 13, col: 4, size: 16 }
    ],
    overlays: {
      entrance: [{ sheet: "dwarfholdObjects", row: 2, col: 2, size: 16, scale: 0.92 }],
      forge: [{ sheet: "dwarfholdObjects", row: 1, col: 15, size: 16, scale: 0.9 }],
      market: [{ sheet: "dwarfholdObjects", row: 3, col: 3, size: 16, scale: 0.9 }],
      dormitory: [{ sheet: "dwarfholdObjects", row: 2, col: 5, size: 16, scale: 0.9 }],
      brewery: [{ sheet: "dwarfholdObjects", row: 3, col: 6, size: 16, scale: 0.9 }],
      garden: [{ sheet: "dwarfholdObjects", row: 7, col: 6, size: 16, scale: 0.92 }],
      water: [{ sheet: "dwarfholdObjects", row: 7, col: 9, size: 16, scale: 0.88 }],
      shrine: [{ sheet: "dwarfholdObjects", row: 3, col: 1, size: 16, scale: 0.88 }],
      throne: [{ sheet: "dwarfholdObjects", row: 1, col: 13, size: 16, scale: 0.94 }],
      stairs: [{ sheet: "dwarfholdObjects", row: 3, col: 4, size: 16, scale: 0.9 }],
      storage: [{ sheet: "dwarfholdObjects", row: 3, col: 5, size: 16, scale: 0.9 }]
    }
  var tileVariantPools = {
    rock: { base: interiorTileSprites.rock },
    corridor: { base: interiorTileSprites.carvedFloor },
    entrance: { base: interiorTileSprites.carvedFloor, overlays: interiorTileSprites.overlays.entrance },
    hall: { base: interiorTileSprites.polishedFloor },
    forge: { base: interiorTileSprites.workFloor, overlays: interiorTileSprites.overlays.forge },
    market: { base: interiorTileSprites.polishedFloor, overlays: interiorTileSprites.overlays.market },
    dormitory: { base: interiorTileSprites.dampFloor, overlays: interiorTileSprites.overlays.dormitory },
    brewery: { base: interiorTileSprites.workFloor, overlays: interiorTileSprites.overlays.brewery },
    garden: { base: interiorTileSprites.moss, overlays: interiorTileSprites.overlays.garden },
    water: { base: interiorTileSprites.water, overlays: interiorTileSprites.overlays.water },
    shrine: { base: interiorTileSprites.polishedFloor, overlays: interiorTileSprites.overlays.shrine },
    throne: { base: interiorTileSprites.polishedFloor, overlays: interiorTileSprites.overlays.throne },
    stairs: { base: interiorTileSprites.carvedFloor, overlays: interiorTileSprites.overlays.stairs },
    storage: { base: interiorTileSprites.workFloor, overlays: interiorTileSprites.overlays.storage }
  };
  tileVariantPools.default = { base: interiorTileSprites.carvedFloor };
      description: "Unworked mountain rock surrounding the hold."
      accent: "rgba(17, 24, 39, 0.25)"
      borderColor: "#d1d5db"
      borderColor: "#f59e0b"
      borderColor: "#b45309"
      accent: "rgba(250, 204, 21, 0.24)"
      borderColor: "#2563eb"
      accent: "rgba(248, 250, 252, 0.16)"
      accent: "rgba(74, 222, 128, 0.35)"
      borderColor: "#1d4ed8"
      borderColor: "#cbd5f5"
      borderColor: "#f59e0b"
      borderColor: "#7c3aed"
      borderColor: "#a855f7"
  var dwarfGivenNamesMale = [
    "Baern",
    "Dimli",
    "Einkar",
    "Gimli",
    "Harbek",
    "Kargun",
    "Mardin",
    "Orsik",
    "Rurik",
    "Thorin",
    "Ulfgar",
    "Vondal"
  ];
  var dwarfGivenNamesFemale = [
    "Audhild",
    "Brynna",
    "Diesa",
    "Eldeth",
    "Finellen",
    "Gurdis",
    "Helja",
    "Kathra",
    "Liftrasa",
    "Sannl",
    "Torbera",
    "Vistra"
  ];
  var dwarfClanNames = [
    "Amberfist",
    "Barrelhelm",
    "Deepdelve",
    "Emberforge",
    "Graniteheart",
    "Ironroot",
    "Mithrilvein",
    "Runebeard",
    "Stoneward",
    "Trollbane",
    "Underbarrel",
    "Worldcarver"
  ];
  var dwarfPersonalityTraits = [
    "boisterous storyteller",
    "stoic oathkeeper",
    "meticulous ledger-scribe",
    "ember-eyed forge fanatic",
    "mirthful ale judge",
    "mushroom-garden visionary",
    "ancestral lorekeeper",
    "stalwart sentry",
    "stone-song minstrel",
    "clan diplomat"
  ];
  var dwarfRolesByDistrict = {
    hall: ["thane", "speaker", "skald", "banner-warden"],
    forge: ["runeforger", "steelwright", "smelter", "hammer adept"],
    market: ["factor", "gemcutter", "trader", "appraiser"],
    dormitory: ["shieldbearer", "miner", "tunnel guard", "porter"],
    brewery: ["brewmaster", "malt steward", "cooper", "spirit-keeper"],
    storage: ["quartermaster", "vault tallyman", "supply clerk"],
    garden: ["mycologist", "root tender", "lumensower"],
    water: ["sluice warden", "reservoir watch", "pump engineer"],
    shrine: ["stone seer", "ancestor cantor"],
    stairs: ["delver", "survey scout", "breaker"],
    entrance: ["gatewarden", "sentinel captain"]
  };
  var dwarfScheduleTemplates = {
    artisan: [
      { time: "dawn", activity: "home" },
      { time: "morning", activity: "work" },
      { time: "evening", activity: "leisure" },
      { time: "night", activity: "home" }
    ],
    guardian: [
      { time: "dawn", activity: "drill" },
      { time: "day", activity: "work" },
      { time: "dusk", activity: "patrol" },
      { time: "night", activity: "home" }
    ],
    caretaker: [
      { time: "morning", activity: "work" },
      { time: "afternoon", activity: "work" },
      { time: "evening", activity: "leisure" },
      { time: "late", activity: "home" }
    ]
  };
  var dwarfLeisurePreferences = {
    hall: ["hall", "market", "brewery"],
    forge: ["brewery", "hall"],
    market: ["market", "hall"],
    dormitory: ["hall", "brewery"],
    brewery: ["brewery", "hall"],
    storage: ["hall", "market"],
    garden: ["garden", "hall"],
    water: ["hall", "garden"],
    shrine: ["shrine", "hall"],
    stairs: ["hall", "brewery"],
    entrance: ["hall", "dormitory"]
  };
  var districtPlacementConfig = {
    hall: {
      label: "Grand Hall",
      mode: "gaps",
      marker: { color: "#fcd34d", stroke: "#78350f", radius: 0.38, shadowColor: "rgba(250, 204, 21, 0.45)" }
    },
    forge: {
      label: "Great Forge",
      mode: "dense",
      marker: { color: "#ea580c", stroke: "#7c2d12", radius: 0.32, shadowColor: "rgba(234, 88, 12, 0.4)" }
    },
    market: {
      label: "Deep Market",
      mode: "individual",
      marker: { color: "#f59e0b", stroke: "#92400e", radius: 0.3, shadowColor: "rgba(245, 158, 11, 0.38)" }
    },
    dormitory: {
      label: "Clan Dormitories",
      mode: "dense",
      marker: { color: "#60a5fa", stroke: "#1d4ed8", radius: 0.32, shadowColor: "rgba(96, 165, 250, 0.36)" }
    },
    brewery: {
      label: "Brewery Caverns",
      mode: "gaps",
      marker: { color: "#c08457", stroke: "#7f5539", radius: 0.3, shadowColor: "rgba(192, 132, 87, 0.35)" }
    },
    storage: {
      label: "Vaulted Stores",
      mode: "dense",
      marker: { color: "#d8b4fe", stroke: "#7c3aed", radius: 0.3, shadowColor: "rgba(216, 180, 254, 0.35)" }
    },
    garden: {
      label: "Mushroom Gardens",
      mode: "individual",
      marker: { color: "#4ade80", stroke: "#15803d", radius: 0.28, shadowColor: "rgba(74, 222, 128, 0.4)" }
    },
    water: {
      label: "Reservoir",
      mode: "gaps",
      marker: { color: "#2563eb", stroke: "#1d4ed8", radius: 0.28, shadowColor: "rgba(37, 99, 235, 0.4)" }
    },
    shrine: {
      label: "Ancestor Shrine",
      mode: "individual",
      marker: { color: "#e5e7eb", stroke: "#4b5563", radius: 0.28, shadowColor: "rgba(229, 231, 235, 0.35)" }
    },
    stairs: {
      label: "Deep Stairs",
      mode: "dense",
      marker: { color: "#a855f7", stroke: "#581c87", radius: 0.26, shadowColor: "rgba(168, 85, 247, 0.32)" }
    }
  };
  var CARDINAL_DIRECTIONS = [
    { key: "N", dx: 0, dy: -1 },
    { key: "E", dx: 1, dy: 0 },
    { key: "S", dx: 0, dy: 1 },
    { key: "W", dx: -1, dy: 0 }
  ];
  var directionLookup = CARDINAL_DIRECTIONS.reduce((map, dir) => {
    map[dir.key] = dir;
    return map;
  }, {});
  function rotateDirection(direction, turn) {
    if (!direction) {
      return CARDINAL_DIRECTIONS[0];
    }
    const order = ["N", "E", "S", "W"];
    const index = order.indexOf(direction.key);
    const nextIndex = (index + (turn || 0) + order.length) % order.length;
    return directionLookup[order[nextIndex]];
  }
  function isInsideBounds(width, height, x, y) {
    return x >= 0 && x < width && y >= 0 && y < height;
  }
  function manhattanDistance(ax, ay, bx, by) {
    return Math.abs(ax - bx) + Math.abs(ay - by);
  }
  function euclideanDistance(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function cellKey(x, y) {
    return `${x},${y}`;
  }
  function isValidRoadCell(width, height, x, y) {
    return x > 0 && y > 0 && x < width - 1 && y < height - 1;
  }
  function markRoadCell(tiles, roadGrid, usedTypes, x, y, corridorWidth, directionKey, roadType, stageIndex) {
    if (!tiles || !roadGrid || !Number.isFinite(x) || !Number.isFinite(y)) {
      return 0;
    }
    const height = tiles.length;
    const width = height > 0 ? tiles[0].length : 0;
    if (!isInsideBounds(width, height, x, y)) {
      return 0;
    }
    const normalizedWidth = Math.max(1, Math.floor(corridorWidth));
    const half = Math.max(0, Math.floor((normalizedWidth - 1) / 2));
    let added = 0;
    const applyCell = (cx, cy) => {
      if (!isInsideBounds(width, height, cx, cy)) {
        return;
      }
      const beforeType = tiles[cy][cx]?.type;
      const existing = roadGrid[cy][cx];
      if (!existing) {
        roadGrid[cy][cx] = { type: roadType, stageIndex, orientation: directionKey };
      } else {
        if (existing.type !== "main") {
          existing.type = roadType;
        }
        existing.stageIndex = Math.min(existing.stageIndex, stageIndex);
        if (existing.orientation && existing.orientation !== directionKey) {
          existing.orientation = "junction";
        } else if (!existing.orientation) {
          existing.orientation = directionKey;
        }
      }
      setCell(tiles, cx, cy, "corridor", usedTypes);
      if (beforeType !== "corridor") {
        added += 1;
      }
    };
    if (directionKey === "N" || directionKey === "S") {
      for (let offset = -half; offset <= half; offset += 1) {
        applyCell(x + offset, y);
      }
    } else if (directionKey === "E" || directionKey === "W") {
      for (let offset = -half; offset <= half; offset += 1) {
        applyCell(x, y + offset);
      }
    } else {
      applyCell(x, y);
    }
    return added;
  }
  function chooseNextDirection(road, stageConfig, context) {
    const { randomFn, width, height, center } = context;
    const currentDirection = road.direction || CARDINAL_DIRECTIONS[0];
    const turnChance = clamp(stageConfig.turnChance ?? 0.25, 0, 1);
    let nextDirection = currentDirection;
    if (randomFn() < turnChance) {
      let turn = randomFn() < 0.5 ? -1 : 1;
      if (stageConfig.curveAroundCenter) {
        const distanceX = road.x - center.x;
        const distanceY = road.y - center.y;
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
          turn = distanceX > 0 ? -1 : 1;
        } else {
          turn = distanceY > 0 ? 1 : -1;
        }
      }
      nextDirection = rotateDirection(currentDirection, turn);
    }
    if (stageConfig.avoidBacktrack !== false) {
      const opposite = rotateDirection(currentDirection, 2);
      if (nextDirection.key === opposite.key) {
        nextDirection = currentDirection;
      }
    }
    let nextX = road.x + nextDirection.dx;
    let nextY = road.y + nextDirection.dy;
    if (!isValidRoadCell(width, height, nextX, nextY)) {
      const left = rotateDirection(currentDirection, -1);
      const right = rotateDirection(currentDirection, 1);
      const leftValid = isValidRoadCell(width, height, road.x + left.dx, road.y + left.dy);
      const rightValid = isValidRoadCell(width, height, road.x + right.dx, road.y + right.dy);
      if (stageConfig.curveAroundCenter) {
        if (leftValid && !rightValid) {
          nextDirection = left;
        } else if (rightValid && !leftValid) {
          nextDirection = right;
        } else if (leftValid && rightValid) {
          nextDirection = randomFn() < 0.5 ? left : right;
        }
      } else if (leftValid || rightValid) {
        const choice = leftValid && rightValid ? randomFn() < 0.5 ? left : right : leftValid ? left : right;
        nextDirection = choice;
      } else {
        nextDirection = currentDirection;
      }
      nextX = road.x + nextDirection.dx;
      nextY = road.y + nextDirection.dy;
    }
    if (!isValidRoadCell(width, height, nextX, nextY)) {
      return currentDirection;
    }
    return nextDirection;
  }
  function createRoadSeed({ x, y, direction, type, stageIndex }) {
    const seedDirection = direction || CARDINAL_DIRECTIONS[0];
    return {
      x,
      y,
      direction: seedDirection,
      type,
      stageIndex,
      path: [],
      totalSegments: 0,
      stepsSinceBranch: 0,
      overlapSteps: 0
    };
  }
  function extendRoadSegment(road, stageConfig, context) {
    const { tiles, roadGrid, usedTypes, randomFn, width, height, center } = context;
    const corridorWidth = stageConfig.corridorWidth || 3;
    const minLength = Math.max(1, Math.floor(stageConfig.segmentLength?.[0] ?? 2));
    const maxLength = Math.max(minLength, Math.floor(stageConfig.segmentLength?.[1] ?? minLength + 3));
    const targetLength = randomInt2(randomFn, minLength, maxLength);
    let added = 0;
    let steps = 0;
    let blocked = false;
    const newBranches = [];
    for (let i = 0; i < targetLength; i += 1) {
      const direction = chooseNextDirection(road, stageConfig, { randomFn, width, height, center });
      const nextX = road.x + direction.dx;
      const nextY = road.y + direction.dy;
      if (!isValidRoadCell(width, height, nextX, nextY)) {
        blocked = true;
        break;
      }
      road.direction = direction;
      road.x = nextX;
      road.y = nextY;
      road.path.push({ x: nextX, y: nextY, direction: direction.key });
      const newlyAdded = markRoadCell(tiles, roadGrid, usedTypes, nextX, nextY, corridorWidth, direction.key, road.type, road.stageIndex);
      if (newlyAdded === 0) {
        road.overlapSteps += 1;
      } else {
        road.overlapSteps = 0;
      }
      added += newlyAdded;
      steps += 1;
      road.totalSegments += 1;
      if (stageConfig.branchAfter > 0) {
        road.stepsSinceBranch += 1;
        if (road.stepsSinceBranch >= stageConfig.branchAfter) {
          const branchChance = clamp(stageConfig.branchChance ?? 0.45, 0, 1);
          if (randomFn() < branchChance) {
            const leftDirection = rotateDirection(direction, -1);
            const branchSeed = createRoadSeed({
              x: nextX,
              y: nextY,
              direction: leftDirection,
              type: road.type,
              stageIndex: road.stageIndex
            });
            newBranches.push(branchSeed);
          }
          const dualChance = clamp(stageConfig.dualBranchChance ?? branchChance * 0.75, 0, 1);
          if (randomFn() < dualChance) {
            const rightDirection = rotateDirection(direction, 1);
            const branchSeed = createRoadSeed({
              x: nextX,
              y: nextY,
              direction: rightDirection,
              type: road.type,
              stageIndex: road.stageIndex
            });
            newBranches.push(branchSeed);
          }
          road.stepsSinceBranch = 0;
        }
      }
      if (stageConfig.maxSegments && road.totalSegments >= stageConfig.maxSegments) {
        blocked = true;
        break;
      }
      if (road.overlapSteps > Math.max(2, stageConfig.maxOverlapSteps || 4)) {
        blocked = true;
        break;
      }
    }
    return { added, steps, blocked, newBranches };
  }
  function collectBranchSeeds(roadGrid, tiles, fromTypes, stageIndex, randomFn, limit = 64) {
    const seeds = [];
    if (!roadGrid || roadGrid.length === 0) {
      return seeds;
    }
    const height = roadGrid.length;
    const width = roadGrid[0].length;
    const allowed = new Set(fromTypes);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const cell = roadGrid[y][x];
        if (!cell || !allowed.has(cell.type)) {
          continue;
        }
        const orientation = cell.orientation;
        const candidateDirections = [];
        if (orientation === "N" || orientation === "S") {
          candidateDirections.push(directionLookup.E, directionLookup.W);
        } else if (orientation === "E" || orientation === "W") {
          candidateDirections.push(directionLookup.N, directionLookup.S);
        } else {
          candidateDirections.push(directionLookup.N, directionLookup.E, directionLookup.S, directionLookup.W);
        }
        for (let i = 0; i < candidateDirections.length; i += 1) {
          const dir = candidateDirections[i];
          const nx = x + dir.dx;
          const ny = y + dir.dy;
          if (!isValidRoadCell(width, height, nx, ny)) {
            continue;
          }
          const tile = tiles?.[ny]?.[nx];
          if (!tile || tile.type !== "rock") {
            continue;
          }
          seeds.push(createRoadSeed({ x, y, direction: dir, type: "normal", stageIndex }));
        }
      }
    }
    if (seeds.length <= limit) {
      return shuffle(seeds, randomFn);
    }
    return shuffle(seeds, randomFn).slice(0, limit);
  }
  function pruneDanglingCorridors(tiles, roadGrid, usedTypes, allowedTypes, iterations = 2) {
    if (!roadGrid || roadGrid.length === 0) {
      return;
    }
    const height = roadGrid.length;
    const width = roadGrid[0].length;
    const allowed = new Set(allowedTypes);
    const offsets = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    for (let iter = 0; iter < iterations; iter += 1) {
      let removedAny = false;
      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          const cell = roadGrid[y][x];
          if (!cell || !allowed.has(cell.type)) {
            continue;
          }
          let neighborCount = 0;
          for (let i = 0; i < offsets.length; i += 1) {
            const nx = x + offsets[i][0];
            const ny = y + offsets[i][1];
            if (!isInsideBounds(width, height, nx, ny)) {
              continue;
            }
            if (roadGrid[ny][nx]) {
              neighborCount += 1;
            }
          }
          if (neighborCount <= 1) {
            roadGrid[y][x] = null;
            if (tiles?.[y]?.[x]) {
              tiles[y][x] = { type: "rock" };
            }
            removedAny = true;
          }
        }
      }
      if (!removedAny) {
        break;
      }
    }
    usedTypes.add("rock");
  }
  function growRoadNetwork(options) {
    const { tiles, usedTypes, randomFn, width, height, scaleFactor, features, featureSet, markers } = options;
    const roadGrid = Array.from({ length: height }, () => Array(width).fill(null));
    const centerX = Math.floor(width / 2);
    const centerY = clamp(Math.floor(height * 0.45), 4, height - 6);
    const center = { x: centerX, y: centerY };
    const entranceWidth = scaleFactor > 1.6 ? 5 : scaleFactor > 1.2 ? 4 : 3;
    const entranceHalf = Math.floor(entranceWidth / 2);
    for (let y = 0; y < Math.min(2, height); y += 1) {
      for (let dx = -entranceHalf; dx <= entranceHalf; dx += 1) {
        setCell(tiles, centerX + dx, y, "entrance", usedTypes);
      }
    }
    addFeatureNote("entrance", features, featureSet, randomFn);
    addMarker(markers, centerX, Math.min(1, height - 1), {
      color: "#f8fafc",
      stroke: "#1f2937",
      radius: 0.28,
      shadowColor: "rgba(148, 163, 184, 0.45)"
    });
    const approachDepth = clamp(Math.round(3 + scaleFactor * 4), 2, Math.max(2, centerY - 1));
    for (let y = 2; y <= approachDepth; y += 1) {
      markRoadCell(tiles, roadGrid, usedTypes, centerX, y, entranceWidth, "S", "main", 0);
    }
    markRoadCell(tiles, roadGrid, usedTypes, centerX, centerY, entranceWidth, "N", "main", 0);
    const stageConfigs = [
      {
        name: "coreSpine",
        type: "main",
        corridorWidth: entranceWidth,
        segmentLength: [Math.max(3, Math.round(3 + scaleFactor * 1.5)), Math.max(4, Math.round(6 + scaleFactor * 1.5))],
        branchAfter: 3,
        branchChance: 0.55,
        dualBranchChance: 0.35,
        turnChance: 0.22,
        areaRatio: clamp(0.08 + scaleFactor * 0.03, 0.08, 0.14),
        maxSegments: Math.round(48 * scaleFactor),
        maxOverlapSteps: 5
      },
      {
        name: "ringRoutes",
        type: "normal",
        corridorWidth: scaleFactor > 1.4 ? 3 : 2,
        segmentLength: [2, 4 + Math.round(scaleFactor)],
        branchAfter: 2,
        branchChance: 0.6,
        dualBranchChance: 0.4,
        turnChance: 0.55,
        curveAroundCenter: true,
        areaRatio: clamp(0.12 + scaleFactor * 0.04, 0.12, 0.18),
        maxSegments: Math.round(76 * scaleFactor),
        maxOverlapSteps: 6
      },
      {
        name: "lowerSpurs",
        type: "normal",
        corridorWidth: 2,
        segmentLength: [2, 4],
        branchAfter: 2,
        branchChance: 0.48,
        dualBranchChance: 0.32,
        turnChance: 0.35,
        curveAroundCenter: false,
        areaRatio: clamp(0.1 + scaleFactor * 0.03, 0.12, 0.2),
        maxSegments: Math.round(96 * scaleFactor),
        maxOverlapSteps: 7
      }
    ];
    const stageSummaries = [];
    let seeds = [
      createRoadSeed({ x: center.x, y: center.y, direction: directionLookup.E, type: "main", stageIndex: 0 }),
      createRoadSeed({ x: center.x, y: center.y, direction: directionLookup.W, type: "main", stageIndex: 0 }),
      createRoadSeed({ x: center.x, y: center.y, direction: directionLookup.S, type: "main", stageIndex: 0 })
    ];
    for (let stageIndex = 0; stageIndex < stageConfigs.length; stageIndex += 1) {
      const stage = stageConfigs[stageIndex];
      const areaTarget = Math.max(1, Math.round(width * height * stage.areaRatio));
      if (!Array.isArray(seeds) || seeds.length === 0) {
        break;
      }
      const queue = seeds.map((seed) => ({ ...createRoadSeed(seed), type: stage.type, stageIndex }));
      let stageArea = 0;
      const processedRoads = [];
      while (queue.length > 0 && stageArea < areaTarget) {
        const road = queue.shift();
        if (!road) {
          break;
        }
        const result = extendRoadSegment(road, stage, {
          tiles,
          roadGrid,
          usedTypes,
          randomFn,
          width,
          height,
          center
        });
        stageArea += result.added;
        processedRoads.push(road);
        if (Array.isArray(result.newBranches)) {
          for (let i = 0; i < result.newBranches.length; i += 1) {
            const branch = result.newBranches[i];
            if (branch && isValidRoadCell(width, height, branch.x + branch.direction.dx, branch.y + branch.direction.dy)) {
              branch.type = stage.type;
              branch.stageIndex = stageIndex;
              queue.push(branch);
            }
          }
        }
        if (!result.blocked && stageArea < areaTarget) {
          queue.push(road);
        }
      }
      stageSummaries.push({ stageIndex, type: stage.type, area: stageArea, name: stage.name });
      if (stage.type === "normal") {
        pruneDanglingCorridors(tiles, roadGrid, usedTypes, ["normal"], 2);
      }
      if (stageIndex < stageConfigs.length - 1) {
        const nextStageIndex = stageIndex + 1;
        const fromTypes = stageIndex === 0 ? ["main"] : ["main", "normal"];
        let nextSeeds = collectBranchSeeds(
          roadGrid,
          tiles,
          fromTypes,
          nextStageIndex,
          randomFn,
          Math.max(32, Math.round(48 * scaleFactor))
        );
        if (!nextSeeds || nextSeeds.length === 0) {
          nextSeeds = processedRoads.slice(0, 6).map(
            (road) => createRoadSeed({
              x: road.x,
              y: road.y,
              direction: rotateDirection(road.direction || directionLookup.N, randomFn() < 0.5 ? -1 : 1),
              type: stageConfigs[nextStageIndex].type,
              stageIndex: nextStageIndex
            })
          ).filter(Boolean);
        } else {
          nextSeeds = nextSeeds.map((seed) => ({ ...seed, type: stageConfigs[nextStageIndex].type, stageIndex: nextStageIndex }));
        }
        seeds = nextSeeds;
      }
    }
    addFeatureNote("corridor", features, featureSet, randomFn);
    return {
      roadGrid,
      entrance: { x: centerX, y: 0 },
      center,
      stageSummaries
    };
  }
  function extractDistrictLots(options) {
    const { tiles, roadNetwork, randomFn, minLotArea = 18 } = options;
    if (!tiles || tiles.length === 0) {
      return [];
    }
    const height = tiles.length;
    const width = tiles[0].length;
    const visited = Array.from({ length: height }, () => Array(width).fill(false));
    const districts = [];
    let idCounter = 1;
    const offsets = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        if (visited[y][x]) {
          continue;
        }
        const cell = tiles[y][x];
        if (!cell || cell.type !== "rock") {
          visited[y][x] = true;
          continue;
        }
        const queue = [{ x, y }];
        visited[y][x] = true;
        const cells = [];
        let sumX = 0;
        let sumY = 0;
        let minX = x;
        let maxX = x;
        let minY = y;
        let maxY = y;
        let touchesEdge = false;
        let adjacentCorridor = 0;
        while (queue.length > 0) {
          const current = queue.shift();
          cells.push(current);
          sumX += current.x;
          sumY += current.y;
          minX = Math.min(minX, current.x);
          maxX = Math.max(maxX, current.x);
          minY = Math.min(minY, current.y);
          maxY = Math.max(maxY, current.y);
          if (!isValidRoadCell(width, height, current.x, current.y)) {
            touchesEdge = true;
          }
          for (let i = 0; i < offsets.length; i += 1) {
            const nx = current.x + offsets[i][0];
            const ny = current.y + offsets[i][1];
            if (!isInsideBounds(width, height, nx, ny)) {
              touchesEdge = true;
              continue;
            }
            if (!visited[ny][nx] && tiles[ny][nx]?.type === "rock") {
              visited[ny][nx] = true;
              queue.push({ x: nx, y: ny });
            } else if (tiles[ny][nx] && tiles[ny][nx].type !== "rock") {
              adjacentCorridor += tiles[ny][nx].type === "corridor" || tiles[ny][nx].type === "entrance" ? 1 : 0;
            }
          }
        }
        if (cells.length === 0 || adjacentCorridor === 0) {
          continue;
        }
        const area = cells.length;
        const centroidX = sumX / area;
        const centroidY = sumY / area;
        const district = {
          id: `district-${idCounter}`,
          cells,
          area,
          sumX,
          sumY,
          centroid: { x: centroidX, y: centroidY },
          bounding: { minX, maxX, minY, maxY },
          touchesEdge,
          adjacentCorridor,
          stage: null,
          walled: false,
          type: null,
          label: null,
          primaryCells: [],
          walkwayCells: [],
          mode: null,
          distanceToCenter: euclideanDistance(centroidX, centroidY, roadNetwork.center.x, roadNetwork.center.y)
        };
        districts.push(district);
        idCounter += 1;
      }
    }
    return mergeSmallDistricts(districts, minLotArea, roadNetwork, randomFn);
  }
  function mergeSmallDistricts(districts, minArea, roadNetwork, randomFn) {
    if (!Array.isArray(districts) || districts.length === 0) {
      return [];
    }
    const large = [];
    const small = [];
    for (let i = 0; i < districts.length; i += 1) {
      const district = districts[i];
      if (district.area >= minArea) {
        large.push(district);
      } else {
        small.push(district);
      }
    }
    if (large.length === 0) {
      return districts;
    }
    for (let i = 0; i < small.length; i += 1) {
      const fragment = small[i];
      let best = null;
      let bestDistance = Infinity;
      for (let j = 0; j < large.length; j += 1) {
        const candidate = large[j];
        const distance = euclideanDistance(fragment.centroid.x, fragment.centroid.y, candidate.centroid.x, candidate.centroid.y);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = candidate;
        }
      }
      if (!best) {
        large.push(fragment);
        continue;
      }
      best.cells.push(...fragment.cells);
      best.area += fragment.area;
      best.sumX += fragment.sumX;
      best.sumY += fragment.sumY;
      best.bounding.minX = Math.min(best.bounding.minX, fragment.bounding.minX);
      best.bounding.maxX = Math.max(best.bounding.maxX, fragment.bounding.maxX);
      best.bounding.minY = Math.min(best.bounding.minY, fragment.bounding.minY);
      best.bounding.maxY = Math.max(best.bounding.maxY, fragment.bounding.maxY);
      best.touchesEdge = best.touchesEdge || fragment.touchesEdge;
      best.adjacentCorridor += fragment.adjacentCorridor;
    }
    for (let i = 0; i < large.length; i += 1) {
      const district = large[i];
      district.centroid = { x: district.sumX / district.area, y: district.sumY / district.area };
      district.distanceToCenter = euclideanDistance(
        district.centroid.x,
        district.centroid.y,
        roadNetwork.center.x,
        roadNetwork.center.y
      );
    }
    return large;
  }
  function assignDistrictStages(districts, center, randomFn) {
    if (!Array.isArray(districts) || districts.length === 0) {
      return;
    }
    const sorted = districts.slice().sort((a, b) => a.distanceToCenter - b.distanceToCenter);
    const stageOneCount = Math.max(1, Math.round(sorted.length * 0.35));
    const stageTwoCount = Math.max(stageOneCount + 1, Math.round(sorted.length * 0.7));
    for (let i = 0; i < sorted.length; i += 1) {
      const district = sorted[i];
      if (i < stageOneCount) {
        district.stage = 0;
        district.walled = true;
      } else if (i < stageTwoCount) {
        district.stage = 1;
        district.walled = randomFn() < 0.4;
      } else {
        district.stage = 2;
        district.walled = false;
      }
    }
  }
  function paintDistrict(district, type, mode, context) {
    const { tiles, usedTypes, randomFn } = context;
    if (!district || !Array.isArray(district.cells)) {
      return { placedCells: [], walkwayCells: [] };
    }
    const cellSet = new Set(district.cells.map((cell) => cellKey(cell.x, cell.y)));
    const placedCells = [];
    const walkwayCells = [];
    const assignCell = (x, y, assignedType) => {
      setCell(tiles, x, y, assignedType, usedTypes);
      if (assignedType === "corridor") {
        walkwayCells.push({ x, y });
      } else {
        placedCells.push({ x, y });
      }
    };
    if (mode === "dense") {
      for (let i = 0; i < district.cells.length; i += 1) {
        const cell = district.cells[i];
        assignCell(cell.x, cell.y, type);
      }
    } else if (mode === "gaps") {
      for (let i = 0; i < district.cells.length; i += 1) {
        const cell = district.cells[i];
        const neighbors = [
          [cell.x + 1, cell.y],
          [cell.x - 1, cell.y],
          [cell.x, cell.y + 1],
          [cell.x, cell.y - 1]
        ];
        const hasEdge = neighbors.some(([nx, ny]) => !cellSet.has(cellKey(nx, ny)));
        if (hasEdge && randomFn() < 0.35) {
          assignCell(cell.x, cell.y, "corridor");
        } else {
          assignCell(cell.x, cell.y, type);
        }
      }
    } else {
      const bounding = district.bounding;
      const width = bounding.maxX - bounding.minX + 1;
      const height = bounding.maxY - bounding.minY + 1;
      const assignedKeys = /* @__PURE__ */ new Set();
      const available = shuffle(district.cells.slice(), randomFn);
      const buildingCount = clamp(Math.round(district.area / 6), 2, Math.max(2, Math.round(district.area / 3)));
      for (let i = 0; i < buildingCount && available.length > 0; i += 1) {
        const anchor = available.pop();
        if (!anchor) {
          break;
        }
        const maxWidth = Math.max(2, Math.floor(width / 2));
        const maxHeight = Math.max(2, Math.floor(height / 2));
        const rectWidth = clamp(randomInt2(randomFn, 2, maxWidth), 2, width);
        const rectHeight = clamp(randomInt2(randomFn, 2, maxHeight), 2, height);
        const startX = clamp(anchor.x - Math.floor(rectWidth / 2), bounding.minX, bounding.maxX - rectWidth + 1);
        const startY = clamp(anchor.y - Math.floor(rectHeight / 2), bounding.minY, bounding.maxY - rectHeight + 1);
        for (let dy = 0; dy < rectHeight; dy += 1) {
          for (let dx = 0; dx < rectWidth; dx += 1) {
            const cx = startX + dx;
            const cy = startY + dy;
            const key = cellKey(cx, cy);
            if (!cellSet.has(key) || assignedKeys.has(key)) {
              continue;
            }
            assignCell(cx, cy, type);
            assignedKeys.add(key);
          }
        }
      }
      for (let i = 0; i < district.cells.length; i += 1) {
        const cell = district.cells[i];
        const key = cellKey(cell.x, cell.y);
        if (assignedKeys.has(key)) {
          continue;
        }
        assignCell(cell.x, cell.y, "corridor");
      }
    }
    district.primaryCells = placedCells;
    district.primaryCellSet = new Set(placedCells.map((cell) => cellKey(cell.x, cell.y)));
    district.walkwayCells = walkwayCells;
    district.mode = mode;
    return { placedCells, walkwayCells };
  }
  function carveThroneDais(district, roadNetwork, context, features, featureSet, randomFn, markers) {
    if (!district || !Array.isArray(district.primaryCells) || district.primaryCells.length === 0) {
      return;
    }
    const { tiles, usedTypes } = context;
    const entrance = roadNetwork?.entrance || { x: district.centroid.x, y: district.bounding.minY };
    let farthest = district.primaryCells[0];
    let maxDistance = -Infinity;
    for (let i = 0; i < district.primaryCells.length; i += 1) {
      const cell = district.primaryCells[i];
      const distance = manhattanDistance(cell.x, cell.y, entrance.x, entrance.y);
      if (distance > maxDistance) {
        maxDistance = distance;
        farthest = cell;
      }
    }
    const bounding = district.bounding;
    const daisWidth = clamp(Math.round((bounding.maxX - bounding.minX + 1) / 3), 3, 9);
    const daisHeight = clamp(Math.round((bounding.maxY - bounding.minY + 1) / 3), 3, 7);
    const startX = clamp(farthest.x - Math.floor(daisWidth / 2), bounding.minX, bounding.maxX - daisWidth + 1);
    const startY = clamp(farthest.y - Math.floor(daisHeight / 2), bounding.minY, bounding.maxY - daisHeight + 1);
    const daisCells = [];
    for (let y = startY; y < startY + daisHeight; y += 1) {
      for (let x = startX; x < startX + daisWidth; x += 1) {
        const key = cellKey(x, y);
        if (!district.primaryCellSet?.has(key)) {
          continue;
        }
        setCell(tiles, x, y, "throne", usedTypes);
        daisCells.push({ x, y });
      }
    }
    if (daisCells.length === 0) {
      return;
    }
    addFeatureNote("throne", features, featureSet, randomFn);
    const markerX = daisCells.reduce((sum, cell) => sum + cell.x, 0) / daisCells.length;
    const markerY = daisCells.reduce((sum, cell) => sum + cell.y, 0) / daisCells.length;
    addMarker(markers, markerX, markerY, {
      color: "#fde68a",
      stroke: "#b45309",
      radius: 0.36,
      shadowColor: "rgba(253, 230, 138, 0.45)"
    });
  }
  function placeDistrictStructures(options) {
    const { districts, roadNetwork, tiles, usedTypes, randomFn, features, featureSet, markers, scaleFactor } = options;
    if (!Array.isArray(districts) || districts.length === 0) {
      return;
    }
    const sortedByArea = districts.slice().sort((a, b) => b.area - a.area);
    const coreDistrict = sortedByArea.find((district) => district.stage === 0) || sortedByArea[0];
    const placementContext = { tiles, usedTypes, randomFn };
    const assignedCounts = /* @__PURE__ */ new Map();
    const ensureFeature = (note) => {
      if (note && !featureSet.has(note)) {
        featureSet.add(note);
        features.push(note);
      }
    };
    const assignDistrictType = (district, type) => {
      const config = districtPlacementConfig[type] || { label: type, mode: "dense" };
      const mode = config.mode || "dense";
      paintDistrict(district, type, mode, placementContext);
      district.type = type;
      district.label = config.label || type.charAt(0).toUpperCase() + type.slice(1);
      if (config.marker) {
        addMarker(markers, district.centroid.x, district.centroid.y, config.marker);
      }
      addFeatureNote(type, features, featureSet, randomFn);
      if (district.walled) {
        ensureFeature(`${district.label} Ward \u2014 rune-carved ramparts guard this district.`);
      }
      assignedCounts.set(type, (assignedCounts.get(type) || 0) + 1);
    };
    if (coreDistrict) {
      assignDistrictType(coreDistrict, "hall");
      carveThroneDais(coreDistrict, roadNetwork, placementContext, features, featureSet, randomFn, markers);
    }
    const districtsByStage = /* @__PURE__ */ new Map();
    for (let i = 0; i < districts.length; i += 1) {
      const district = districts[i];
      if (district === coreDistrict) {
        continue;
      }
      if (!districtsByStage.has(district.stage)) {
        districtsByStage.set(district.stage, []);
      }
      districtsByStage.get(district.stage).push(district);
    }
    districtsByStage.forEach((list) => list.sort((a, b) => b.area - a.area));
    const essentialPlans = {
      0: ["forge", "market", "shrine"],
      1: ["dormitory", "brewery", "storage"],
      2: ["garden", "water", "stairs"]
    };
    const fallbackPlans = {
      0: ["storage", "dormitory", "market"],
      1: ["dormitory", "storage", "brewery"],
      2: ["garden", "water", "storage", "dormitory"]
    };
    const stageKeys = [0, 1, 2];
    for (let index = 0; index < stageKeys.length; index += 1) {
      const stage = stageKeys[index];
      const stageList = districtsByStage.get(stage) || [];
      const essentials = essentialPlans[stage] || [];
      for (let i = 0; i < essentials.length && stageList.length > 0; i += 1) {
        const district = stageList.shift();
        assignDistrictType(district, essentials[i]);
      }
      const fallback = fallbackPlans[stage] || ["storage"];
      while (stageList.length > 0) {
        const district = stageList.shift();
        let chosenType = null;
        for (let i = 0; i < fallback.length; i += 1) {
          const candidate = fallback[i];
          if (candidate === "dormitory") {
            const dormTarget = Math.max(2, Math.round(scaleFactor * 2));
            if ((assignedCounts.get("dormitory") || 0) >= dormTarget) {
              continue;
            }
          }
          chosenType = candidate;
          break;
        }
        if (!chosenType) {
          chosenType = fallback[Math.floor(randomFn() * fallback.length)];
        }
        assignDistrictType(district, chosenType);
      }
    }
    for (let i = 0; i < districts.length; i += 1) {
      const district = districts[i];
      if (!district.type) {
        assignDistrictType(district, "storage");
      }
    }
  }
  function generateNpcRoster(options) {
    const { districts, randomFn, resolvedPopulation, scaleFactor } = options;
    if (!Array.isArray(districts) || districts.length === 0) {
      return [];
    }
    const populationEstimate = resolvedPopulation ?? Math.round(120 * clamp(scaleFactor, 0.85, 3));
    const npcCount = clamp(Math.round(populationEstimate * 0.35), 16, Math.max(24, Math.round(scaleFactor * 80)));
    const districtsByType = /* @__PURE__ */ new Map();
    districts.forEach((district) => {
      if (!district.type) {
        return;
      }
      if (!districtsByType.has(district.type)) {
        districtsByType.set(district.type, []);
      }
      districtsByType.get(district.type).push(district);
    });
    const livingTypes = ["dormitory", "hall", "garden"];
    const leisureFallback = ["hall", "brewery", "market"];
    const hallDistricts = districtsByType.get("hall") || [];
    const jobPool = [];
    districts.forEach((district) => {
      if (!district.type) {
        return;
      }
      const weight = Math.max(1, Math.round(district.area / 6));
      for (let i = 0; i < weight; i += 1) {
        jobPool.push(district.type);
      }
    });
    const usedNames = /* @__PURE__ */ new Set();
    const npcs = [];
    const pickDistrict = (typeList, fallbackList) => {
      for (let i = 0; i < typeList.length; i += 1) {
        const type = typeList[i];
        const pool = districtsByType.get(type);
        if (Array.isArray(pool) && pool.length > 0) {
          return pool[Math.floor(randomFn() * pool.length)];
        }
      }
      if (Array.isArray(fallbackList)) {
        return pickDistrict(fallbackList, []);
      }
      const allDistricts = districts.filter((district) => district.type);
      return allDistricts.length > 0 ? allDistricts[Math.floor(randomFn() * allDistricts.length)] : null;
    };
    const pickLocation = (district) => {
      if (!district) {
        return null;
      }
      const pool = Array.isArray(district.primaryCells) && district.primaryCells.length > 0 ? district.primaryCells : district.cells;
      if (!pool || pool.length === 0) {
        return null;
      }
      const cell = pool[Math.floor(randomFn() * pool.length)];
      return { x: cell.x, y: cell.y };
    };
    const generateIdentity = () => {
      const gender = randomFn() < 0.5 ? "female" : "male";
      const pool = gender === "female" ? dwarfGivenNamesFemale : dwarfGivenNamesMale;
      let firstName = pick(pool, randomFn) || "Durgan";
      let clan = pick(dwarfClanNames, randomFn) || "Stoneward";
      let fullName = `${firstName} ${clan}`;
      let attempts = 0;
      while (usedNames.has(fullName) && attempts < 6) {
        firstName = pick(pool, randomFn) || firstName;
        clan = pick(dwarfClanNames, randomFn) || clan;
        fullName = `${firstName} ${clan}`;
        attempts += 1;
      }
      usedNames.add(fullName);
      return { name: fullName, clan, gender };
    };
    for (let i = 0; i < npcCount; i += 1) {
      const identity = generateIdentity();
      const jobType = jobPool.length > 0 ? jobPool[Math.floor(randomFn() * jobPool.length)] : "hall";
      const workplaceDistrict = pickDistrict([jobType], leisureFallback) || pickDistrict(["hall"], leisureFallback);
      const homeDistrict = pickDistrict(livingTypes, ["hall"]) || workplaceDistrict;
      const leisureTypes = dwarfLeisurePreferences[jobType] || leisureFallback;
      const leisureDistrict = pickDistrict(leisureTypes, leisureFallback) || hallDistricts[0] || homeDistrict;
      const occupationPool = dwarfRolesByDistrict[jobType] || ["artisan"];
      const role = pick(occupationPool, randomFn) || "artisan";
      const personality = pick(dwarfPersonalityTraits, randomFn) || "steadfast dwarf";
      const scheduleKey = jobType === "dormitory" || jobType === "stairs" || jobType === "entrance" ? "guardian" : jobType === "storage" || jobType === "garden" || jobType === "water" ? "caretaker" : "artisan";
      const scheduleTemplate = dwarfScheduleTemplates[scheduleKey] || dwarfScheduleTemplates.artisan;
      const homeLocation = pickLocation(homeDistrict);
      const workplaceLocation = pickLocation(workplaceDistrict);
      const leisureLocation = pickLocation(leisureDistrict);
      const schedule = scheduleTemplate.map((entry) => {
        let targetDistrict = homeDistrict;
        if (entry.activity === "work" || entry.activity === "drill" || entry.activity === "patrol") {
          targetDistrict = workplaceDistrict || homeDistrict;
        } else if (entry.activity === "leisure") {
          targetDistrict = leisureDistrict || hallDistricts[0] || homeDistrict;
        }
        const coordinates = entry.activity === "work" || entry.activity === "drill" || entry.activity === "patrol" ? workplaceLocation : entry.activity === "leisure" ? leisureLocation : homeLocation;
        return {
          time: entry.time,
          activity: entry.activity,
          location: targetDistrict ? {
            districtId: targetDistrict.id,
            districtLabel: targetDistrict.label,
            coordinates
          } : null
        };
      });
      npcs.push({
        id: `npc-${i + 1}`,
        name: identity.name,
        clan: identity.clan,
        gender: identity.gender,
        role,
        assignment: jobType,
        personality,
        home: homeDistrict ? { districtId: homeDistrict.id, districtLabel: homeDistrict.label, coordinates: homeLocation } : null,
        workplace: workplaceDistrict ? { districtId: workplaceDistrict.id, districtLabel: workplaceDistrict.label, coordinates: workplaceLocation } : null,
        leisure: leisureDistrict ? { districtId: leisureDistrict.id, districtLabel: leisureDistrict.label, coordinates: leisureLocation } : null,
        schedule
      });
    }
    return npcs;
  }
  function cloneSpriteDefinition(sprite) {
    if (!sprite || typeof sprite !== "object") {
      return null;
    }
    const {
      sheet,
      row,
      col,
      size,
      sx,
      sy,
      sw,
      sh,
      scale,
      scaleY,
      offsetX,
      offsetY
    } = sprite;
    const copy = { sheet: sheet || null };
    if (Number.isFinite(row)) {
      copy.row = row;
    }
    if (Number.isFinite(col)) {
      copy.col = col;
    }
    if (Number.isFinite(size)) {
      copy.size = size;
    }
    if (Number.isFinite(sx)) {
      copy.sx = sx;
    }
    if (Number.isFinite(sy)) {
      copy.sy = sy;
    }
    if (Number.isFinite(sw)) {
      copy.sw = sw;
    }
    if (Number.isFinite(sh)) {
      copy.sh = sh;
    }
    if (Number.isFinite(scale)) {
      copy.scale = scale;
    }
    if (Number.isFinite(scaleY)) {
      copy.scaleY = scaleY;
    }
    if (Number.isFinite(offsetX)) {
      copy.offsetX = offsetX;
    }
    if (Number.isFinite(offsetY)) {
      copy.offsetY = offsetY;
    }
    return copy;
  }
  function pickVariantFromPool(variants, seedValue) {
    if (!Array.isArray(variants) || variants.length === 0) {
      return null;
    }
    const rng = createRng(seedValue);
    const index = variants.length === 1 ? 0 : clamp(Math.floor(rng() * variants.length), 0, variants.length - 1);
    const variant = variants[index] || variants[0];
    return cloneSpriteDefinition(variant);
  }
  function assignTileSpritesToGrid(tiles, baseSeed) {
    if (!Array.isArray(tiles)) {
      return;
    }
    for (let y = 0; y < tiles.length; y += 1) {
      const row = tiles[y];
      if (!Array.isArray(row)) {
        continue;
      }
      for (let x = 0; x < row.length; x += 1) {
        const cell = row[x];
        const type = typeof cell?.type === "string" && cell.type ? cell.type : typeof cell === "string" ? cell : "rock";
        const pool = tileVariantPools[type] || tileVariantPools.default;
        if (!pool) {
          continue;
        }
        const baseSeedValue = hashString(`${baseSeed}:${type}:${x},${y}:base`);
        const overlaySeedValue = hashString(`${baseSeed}:${type}:${x},${y}:overlay`);
        const nextCell = cell && typeof cell === "object" ? cell : { type };
        if (Array.isArray(pool.base) && pool.base.length > 0) {
          const sprite = pickVariantFromPool(pool.base, baseSeedValue);
          if (sprite) {
            nextCell.sprite = sprite;
          }
        }
        if (Array.isArray(pool.overlays) && pool.overlays.length > 0) {
          const overlaySprite = pickVariantFromPool(pool.overlays, overlaySeedValue);
          if (overlaySprite) {
            if (Array.isArray(nextCell.overlays)) {
              nextCell.overlays = [...nextCell.overlays, overlaySprite];
            } else if (nextCell.overlay && !Array.isArray(nextCell.overlay)) {
              nextCell.overlays = [nextCell.overlay, overlaySprite].filter(Boolean);
              delete nextCell.overlay;
            } else {
              nextCell.overlays = [overlaySprite];
            }
          }
        }
        row[x] = nextCell;
      }
    }
  }
    const resolvedPopulation = Number.isFinite(options.population) ? Math.max(0, Math.round(options.population)) : Number.isFinite(options.populationMax) ? Math.max(0, Math.round(options.populationMax)) : null;
    const baseCapacity = 100;
    const dwarvesToAccommodate = resolvedPopulation !== null ? Math.max(10, Math.round(resolvedPopulation / 10)) : null;
    const scaleFactorRaw = dwarvesToAccommodate !== null ? Math.sqrt(dwarvesToAccommodate / baseCapacity) : 1;
    const scaleFactor = clamp(scaleFactorRaw, 0.85, 3);
    const heightScaleFactor = clamp(scaleFactor * 1.05, 0.9, 3.4);
    const widthBase = Math.max(1, Math.round((32 + randomInt2(randomFn, 0, 6)) * scaleFactor));
    const heightBase = Math.max(1, Math.round((24 + randomInt2(randomFn, 0, 6)) * heightScaleFactor));
    const width = ensureOdd(widthBase, 29, 95);
    const height = ensureOdd(heightBase, 21, 75);
    const roadNetwork = growRoadNetwork({
      tiles,
      usedTypes,
      randomFn,
      width,
      height,
      scaleFactor,
      features,
      featureSet,
      markers
    const districts = extractDistrictLots({
      tiles,
      roadNetwork,
      randomFn,
      minLotArea: Math.max(14, Math.round(scaleFactor * 12))
    assignDistrictStages(districts, roadNetwork.center, randomFn);
    placeDistrictStructures({
      districts,
      roadNetwork,
      tiles,
      usedTypes,
      randomFn,
      features,
      featureSet,
      markers,
      scaleFactor
    });
    const npcs = generateNpcRoster({ districts, randomFn, resolvedPopulation, scaleFactor });
    if (npcs.length > 0) {
      const censusNote = `Census \u2014 ${npcs.length} named dwarves rotate through the hold's shifts.`;
      if (!featureSet.has(censusNote)) {
        featureSet.add(censusNote);
        features.push(censusNote);
      }
    const stageLabels = roadNetwork.stageSummaries.map((stage) => {
      switch (stage.name) {
        case "coreSpine":
          return "core arteries";
        case "ringRoutes":
          return "ring galleries";
        case "lowerSpurs":
          return "lower spurs";
        default:
          return stage.name;
    }).filter(Boolean);
    if (stageLabels.length > 0) {
      description += ` Wayfinding follows ${stageLabels.join(", ")} branching from the mountain heart.`;
    description += ` ${districts.length} districts host the forges, markets, vaults, and quarters of the hold.`;
    const walledCount = districts.filter((district) => district.walled).length;
    if (walledCount > 0) {
      description += ` ${walledCount} inner wards remain sealed behind rune-locked gates.`;
    }
    if (npcs.length > 0 && !isRuined) {
      description += ` Ledger stones record ${npcs.length} notable dwarves tending the hold across daily shifts.`;
    }
    assignTileSpritesToGrid(tiles, seedValue);
    Object.keys(legend).forEach((type) => {
      const pool = tileVariantPools[type];
      if (!pool) {
        return;
      }
      const spriteSource = pool.legendSprite || (Array.isArray(pool.base) ? pool.base[0] : null);
      if (spriteSource && !legend[type].sprite) {
        legend[type].sprite = cloneSpriteDefinition(spriteSource);
      }
    });
      markers,
      npcs
  function applyFormSettings() {
    const sliderInputHandlers = [
      {
        input: elements.forestFrequencyInput,
        valueElement: elements.forestFrequencyValue,
        defaultValue: defaultForestFrequency,
        key: "forestFrequency"
      },
      {
        input: elements.mountainFrequencyInput,
        valueElement: elements.mountainFrequencyValue,
        defaultValue: defaultMountainFrequency,
        key: "mountainFrequency"
      },
      {
        input: elements.riverFrequencyInput,
        valueElement: elements.riverFrequencyValue,
        defaultValue: 50,
        key: "riverFrequency"
      },
      {
        input: elements.humanSettlementFrequencyInput,
        valueElement: elements.humanSettlementFrequencyValue,
        defaultValue: 50,
        key: "humanSettlementFrequency"
      },
      {
        input: elements.dwarfSettlementFrequencyInput,
        valueElement: elements.dwarfSettlementFrequencyValue,
        defaultValue: 50,
        key: "dwarfSettlementFrequency"
      },
      {
        input: elements.woodElfSettlementFrequencyInput,
        valueElement: elements.woodElfSettlementFrequencyValue,
        defaultValue: 50,
        key: "woodElfSettlementFrequency"
      },
      {
        input: elements.lizardmenSettlementFrequencyInput,
        valueElement: elements.lizardmenSettlementFrequencyValue,
        defaultValue: 50,
        key: "lizardmenSettlementFrequency"
      }
    ];
    sliderInputHandlers.forEach(({ input, valueElement, defaultValue, key }) => {
      if (!input) {
        return;
      }
      const rawValue = Number.parseInt(input.value, 10);
      const sanitisedValue = sanitizeFrequencyValue(
        Number.isNaN(rawValue) ? state.settings[key] : rawValue,
        defaultValue
      );
      state.settings[key] = sanitisedValue;
      if (input.value !== sanitisedValue.toString()) {
        input.value = sanitisedValue.toString();
      }
      updateFrequencyDisplay(valueElement, sanitisedValue);
    });
    const selectedMapSizeKey = elements.mapSizeSelect ? elements.mapSizeSelect.value : state.settings.mapSize;
    const mapSizePreset = getMapSizePreset(selectedMapSizeKey);
    applyMapSizePresetToState(state, mapSizePreset);
    if (elements.mapSizeSelect) {
      elements.mapSizeSelect.value = state.settings.mapSize;
    }
    if (elements.worldMapSizeSelect) {
      elements.worldMapSizeSelect.value = state.settings.mapSize;
    }
    updateWorldInfoSizeDisplay();
    const selectedGenerationType = elements.worldGenerationTypeSelect ? elements.worldGenerationTypeSelect.value : state.settings.worldGenerationType;
    setWorldGenerationType(selectedGenerationType);
    const seedInputValue = elements.seedInput ? elements.seedInput.value.trim() : "";
    if (elements.seedInput && seedInputValue !== elements.seedInput.value) {
      elements.seedInput.value = seedInputValue;
    }
    state.settings.seedString = seedInputValue;
    let finalSeed = seedInputValue;
    if (!finalSeed) {
      finalSeed = ensureSeedString();
      if (elements.seedInput) {
        elements.seedInput.value = finalSeed;
      }
    }
    state.settings.lastSeedString = finalSeed;
    updateWorldInfoSeedDisplay(finalSeed);
    if (elements.worldSeedInput && elements.worldSeedInput !== elements.seedInput) {
      elements.worldSeedInput.value = finalSeed;
    }
    return {
      mapSize: state.settings.mapSize,
      worldGenerationType: state.settings.worldGenerationType,
      seed: finalSeed
    };
  }
      const drawInteriorSprite = (spriteDefinition, destX, destY, destSize) => {
        if (!spriteDefinition || typeof spriteDefinition !== "object") {
          return false;
        }
        const sheetKey = spriteDefinition.sheet;
        if (!sheetKey) {
          return false;
        }
        const sheet = state.tileSheets?.[sheetKey];
        const baseTileSize = Number.isFinite(spriteDefinition.size) ? spriteDefinition.size : Number.isFinite(sheet?.tileSize) ? sheet.tileSize : null;
        if (!sheet || !sheet.image || !Number.isFinite(baseTileSize) || baseTileSize <= 0) {
          return false;
        }
        const spriteCol = Number.isFinite(spriteDefinition.col) ? spriteDefinition.col : 0;
        const spriteRow = Number.isFinite(spriteDefinition.row) ? spriteDefinition.row : 0;
        const spriteSx = Number.isFinite(spriteDefinition.sx) ? spriteDefinition.sx : spriteCol * baseTileSize;
        const spriteSy = Number.isFinite(spriteDefinition.sy) ? spriteDefinition.sy : spriteRow * baseTileSize;
        const spriteSw = Number.isFinite(spriteDefinition.sw) ? spriteDefinition.sw : baseTileSize;
        const spriteSh = Number.isFinite(spriteDefinition.sh) ? spriteDefinition.sh : baseTileSize;
        const scale = Number.isFinite(spriteDefinition.scale) ? spriteDefinition.scale : 1;
        const scaleY = Number.isFinite(spriteDefinition.scaleY) ? spriteDefinition.scaleY : scale;
        const width = Math.max(1, destSize * (scale || 1));
        const height = Math.max(1, destSize * (scaleY || 1));
        const offsetX = Number.isFinite(spriteDefinition.offsetX) ? spriteDefinition.offsetX * destSize : (destSize - width) / 2;
        const offsetY = Number.isFinite(spriteDefinition.offsetY) ? spriteDefinition.offsetY * destSize : (destSize - height) / 2;
        context.drawImage(
          sheet.image,
          spriteSx,
          spriteSy,
          spriteSw,
          spriteSh,
          destX + offsetX,
          destY + offsetY,
          width,
          height
        );
        return true;
      };
          const cellSprite = cell && typeof cell === "object" && typeof cell.sprite === "object" ? cell.sprite : null;
          const definitionSprite = definition.sprite && typeof definition.sprite === "object" ? definition.sprite : null;
          const destX = x * tilePixelSize;
          const destY = y * tilePixelSize;
          if (cellSprite) {
            drewSprite = drawInteriorSprite(cellSprite, destX, destY, tilePixelSize);
          }
          if (!drewSprite && definitionSprite) {
            drewSprite = drawInteriorSprite(definitionSprite, destX, destY, tilePixelSize);
            context.fillRect(destX, destY, tilePixelSize, tilePixelSize);
                  context.fillRect(destX + offsetX - dot / 2, destY + offsetY - dot / 2, dot, dot);
                destX + context.lineWidth / 2,
                destY + context.lineWidth / 2,
              destX + context.lineWidth / 2,
              destY + context.lineWidth / 2,
          const overlaySprites = cell && typeof cell === "object" ? Array.isArray(cell.overlays) ? cell.overlays : cell.overlay && typeof cell.overlay === "object" ? [cell.overlay] : [] : [];
          overlaySprites.forEach((overlaySprite) => {
            drawInteriorSprite(overlaySprite, destX, destY, tilePixelSize);
          });
      const structurePopulation = Number.isFinite(tile?.structureDetails?.population) ? tile.structureDetails.population : null;
      const structurePopulationMax = Number.isFinite(tile?.structureDetails?.populationMax) ? tile.structureDetails.populationMax : null;
        worldSeed: resolvedSeed,
        population: structurePopulation,
        populationMax: structurePopulationMax
