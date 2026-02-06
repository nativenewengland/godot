const DEFAULT_BRUSH_CONFIG = { min: 1, max: 9 };
const noop = () => {};

function normalizeTileKey(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toUpperCase();
}

function normalizeStructureKey(value) {
  const normalized = normalizeTileKey(value);
  if (!normalized || normalized === 'NONE' || normalized === 'NULL') {
    return '';
  }
  return normalized;
}

function normalizeMapSize(size = {}) {
  if (!size || typeof size !== 'object') {
    return { key: '', width: 0, height: 0 };
  }
  const width = Number.isFinite(size.width) ? size.width : 0;
  const height = Number.isFinite(size.height) ? size.height : 0;
  const key = typeof size.key === 'string' ? size.key : '';
  return { key, width, height };
}

function buildMapEditorTerrainSuggestionKeys(baseTileCoords = {}) {
  const coords = baseTileCoords && typeof baseTileCoords === 'object' ? baseTileCoords : {};
  const normalized = Object.keys(coords)
    .map((key) => (typeof key === 'string' ? key.trim().toUpperCase() : ''))
    .filter(Boolean);
  const unique = Array.from(new Set(normalized));
  unique.sort();
  return unique;
}

function buildMapEditorStructureSuggestionKeys(structureHighlightGroups = {}, structureHighlightTypeKeys = []) {
  const typeKeys = Array.isArray(structureHighlightTypeKeys) ? structureHighlightTypeKeys : [];
  const suggestions = new Set();
  typeKeys.forEach((typeKey) => {
    const group = structureHighlightGroups[typeKey];
    if (!group || !Array.isArray(group.keys)) {
      return;
    }
    group.keys.forEach((key) => {
      if (typeof key === 'string' && key.trim()) {
        suggestions.add(key.trim().toUpperCase());
      }
    });
  });
  const ordered = Array.from(suggestions);
  ordered.sort();
  if (!ordered.includes('NONE')) {
    ordered.unshift('NONE');
  }
  return ordered;
}

export function createStateModule(options = {}) {
  const {
    tileSheets = {},
    defaultMapSize = {},
    defaultForestFrequency = 50,
    defaultMountainFrequency = 50,
    defaultWorldGenerationType = 'normal',
    localViewConfig = {},
    clamp,
    elements = {},
    hideStructureContextMenu = noop,
    hideMapTooltip = noop,
    drawWorld = null,
    structureHighlightGroups = {},
    structureHighlightTypeKeys = [],
    baseTileCoords = {},
    documentRef = typeof document !== 'undefined' ? document : null
  } = options;

  if (typeof clamp !== 'function') {
    throw new Error('createStateModule requires a clamp function');
  }

  const mapEditorBrushConfig = { ...DEFAULT_BRUSH_CONFIG };
  const terrainSuggestionKeys = buildMapEditorTerrainSuggestionKeys(baseTileCoords);
  const structureSuggestionKeys = buildMapEditorStructureSuggestionKeys(
    structureHighlightGroups,
    structureHighlightTypeKeys
  );
  const { key: mapSizeKey, width: mapWidth, height: mapHeight } = normalizeMapSize(defaultMapSize);
  const defaultLocalZoom = Number.isFinite(localViewConfig?.defaultZoom)
    ? localViewConfig.defaultZoom
    : 1;

  const doc = documentRef && typeof documentRef.createElement === 'function' ? documentRef : null;
  const uiElements = elements || {};
  const hideContextMenu = typeof hideStructureContextMenu === 'function' ? hideStructureContextMenu : noop;
  const hideTooltip = typeof hideMapTooltip === 'function' ? hideMapTooltip : noop;
  const redrawWorld = typeof drawWorld === 'function' ? drawWorld : null;
  const highlightKeys = Array.isArray(structureHighlightTypeKeys) ? structureHighlightTypeKeys : [];

  function createDefaultStructureHighlightState() {
    const baseState = { menuOpen: false };
    highlightKeys.forEach((key) => {
      baseState[key] = false;
    });
    return baseState;
  }

  function getDefaultMapEditorTerrainKey() {
    if (terrainSuggestionKeys.length === 0) {
      return '';
    }
    if (terrainSuggestionKeys.includes('GRASS')) {
      return 'GRASS';
    }
    return terrainSuggestionKeys[0];
  }

  function createDefaultMapEditorState() {
    return {
      enabled: false,
      applyTerrain: true,
      applyStructure: false,
      terrainKey: getDefaultMapEditorTerrainKey(),
      structureKey: '',
      brushSize: mapEditorBrushConfig.min
    };
  }

  const state = {
    settings: {
      mapSize: mapSizeKey,
      width: mapWidth,
      height: mapHeight,
      seedString: '',
      lastSeedString: '',
      forestFrequency: Number.isFinite(defaultForestFrequency) ? defaultForestFrequency : 50,
      mountainFrequency: Number.isFinite(defaultMountainFrequency) ? defaultMountainFrequency : 50,
      riverFrequency: 50,
      humanSettlementFrequency: 50,
      dwarfSettlementFrequency: 50,
      woodElfSettlementFrequency: 50,
      lizardmenSettlementFrequency: 50,
      worldGenerationType: defaultWorldGenerationType
    },
    tileSheets: tileSheets || {},
    landMask: null,
    ready: false,
    worldName: '',
    worldChronology: null,
    dwarfParty: {
      dwarves: [],
      activeIndex: 0
    },
    ui: {
      showPoliticalBorders: false,
      showPoliticalInfluence: false,
      showElevation: false,
      showBiomes: false,
      showTemperature: false,
      showLocationLabels: false,
      structureHighlights: createDefaultStructureHighlightState(),
      mapEditor: createDefaultMapEditorState()
    },
    currentWorld: null,
    localView: {
      active: false,
      centerX: null,
      centerY: null,
      bounds: null,
      mode: 'world',
      customMap: null,
      structure: null,
      highResolution: null,
      zoom: defaultLocalZoom || 1
    },
    dwarfholdView: {
      active: false,
      map: null,
      tileX: null,
      tileY: null,
      structure: null
    }
  };

  let lastTerrainSignature = '';
  let lastStructureSignature = '';

  function ensureStructureHighlightState() {
    if (!state.ui.structureHighlights || typeof state.ui.structureHighlights !== 'object') {
      state.ui.structureHighlights = createDefaultStructureHighlightState();
      return state.ui.structureHighlights;
    }
    const highlightState = state.ui.structureHighlights;
    if (typeof highlightState.menuOpen !== 'boolean') {
      highlightState.menuOpen = false;
    }
    highlightKeys.forEach((key) => {
      if (typeof highlightState[key] !== 'boolean') {
        highlightState[key] = false;
      }
    });
    return highlightState;
  }

  function ensureMapEditorState() {
    if (!state.ui || typeof state.ui !== 'object') {
      state.ui = {};
    }
    if (!state.ui.mapEditor || typeof state.ui.mapEditor !== 'object') {
      state.ui.mapEditor = createDefaultMapEditorState();
    }
    const mapEditor = state.ui.mapEditor;
    mapEditor.enabled = Boolean(mapEditor.enabled);
    mapEditor.applyTerrain = mapEditor.applyTerrain !== false;
    mapEditor.applyStructure = Boolean(mapEditor.applyStructure);
    mapEditor.terrainKey = typeof mapEditor.terrainKey === 'string'
      ? mapEditor.terrainKey.trim().toUpperCase()
      : getDefaultMapEditorTerrainKey();
    mapEditor.structureKey = typeof mapEditor.structureKey === 'string'
      ? normalizeStructureKey(mapEditor.structureKey)
      : '';
    const numericBrush = Number.isFinite(mapEditor.brushSize)
      ? Math.round(mapEditor.brushSize)
      : mapEditorBrushConfig.min;
    mapEditor.brushSize = clamp(numericBrush, mapEditorBrushConfig.min, mapEditorBrushConfig.max);
    return mapEditor;
  }

  function isMapEditorActive() {
    const mapEditor = ensureMapEditorState();
    return Boolean(mapEditor.enabled);
  }

  function refreshMapEditorUI() {
    const mapEditor = ensureMapEditorState();
    const {
      mapEditorToggle,
      mapEditorPanel,
      mapEditorTerrainInput,
      mapEditorStructureInput,
      mapEditorApplyTerrain,
      mapEditorApplyStructure,
      mapEditorBrushSizeInput,
      mapEditorClearStructure,
      mapEditorTerrainOptions,
      mapEditorStructureOptions
    } = uiElements;

    if (mapEditorToggle) {
      const activeLabel = 'Exit Edit Mode';
      const inactiveLabel = 'Edit Map';
      mapEditorToggle.textContent = mapEditor.enabled ? activeLabel : inactiveLabel;
      mapEditorToggle.classList.toggle('active', mapEditor.enabled);
      mapEditorToggle.setAttribute('aria-pressed', mapEditor.enabled ? 'true' : 'false');
      mapEditorToggle.setAttribute('aria-expanded', mapEditor.enabled ? 'true' : 'false');
    }

    if (mapEditorPanel) {
      mapEditorPanel.classList.toggle('hidden', !mapEditor.enabled);
      mapEditorPanel.setAttribute('aria-hidden', mapEditor.enabled ? 'false' : 'true');
    }

    if (mapEditorApplyTerrain) {
      mapEditorApplyTerrain.checked = Boolean(mapEditor.applyTerrain);
    }

    if (mapEditorApplyStructure) {
      mapEditorApplyStructure.checked = Boolean(mapEditor.applyStructure);
    }

    if (mapEditorTerrainInput) {
      mapEditorTerrainInput.value = mapEditor.terrainKey || '';
      mapEditorTerrainInput.disabled = !mapEditor.applyTerrain;
    }

    if (mapEditorStructureInput) {
      mapEditorStructureInput.value = mapEditor.structureKey || '';
      mapEditorStructureInput.disabled = !mapEditor.applyStructure;
      if (!mapEditor.structureKey) {
        mapEditorStructureInput.placeholder = 'None';
      }
    }

    if (mapEditorBrushSizeInput) {
      mapEditorBrushSizeInput.value = mapEditor.brushSize.toString();
    }

    if (mapEditorClearStructure) {
      mapEditorClearStructure.disabled = !mapEditor.applyStructure || !mapEditor.structureKey;
    }

    const ensureOption = (datalist, value) => {
      if (!doc || !datalist || !value) {
        return;
      }
      const existingOptions = datalist.querySelectorAll('option');
      for (let i = 0; i < existingOptions.length; i += 1) {
        if (existingOptions[i].value === value) {
          return;
        }
      }
      const option = doc.createElement('option');
      option.value = value;
      datalist.appendChild(option);
    };

    if (mapEditorTerrainOptions) {
      const signature = terrainSuggestionKeys.join('|');
      if (signature !== lastTerrainSignature) {
        lastTerrainSignature = signature;
        if (doc) {
          mapEditorTerrainOptions.innerHTML = '';
          terrainSuggestionKeys.forEach((key) => {
            const option = doc.createElement('option');
            option.value = key;
            mapEditorTerrainOptions.appendChild(option);
          });
        }
      }
      if (mapEditor.terrainKey) {
        ensureOption(mapEditorTerrainOptions, mapEditor.terrainKey);
      }
    }

    if (mapEditorStructureOptions) {
      const signature = structureSuggestionKeys.join('|');
      if (signature !== lastStructureSignature) {
        lastStructureSignature = signature;
        if (doc) {
          mapEditorStructureOptions.innerHTML = '';
          structureSuggestionKeys.forEach((key) => {
            const option = doc.createElement('option');
            option.value = key;
            mapEditorStructureOptions.appendChild(option);
          });
        }
      }
      if (mapEditor.structureKey) {
        ensureOption(mapEditorStructureOptions, mapEditor.structureKey);
      }
    }
  }

  function toggleMapEditor(forceState) {
    const mapEditor = ensureMapEditorState();
    const nextState = typeof forceState === 'boolean' ? forceState : !mapEditor.enabled;
    if (mapEditor.enabled === nextState) {
      refreshMapEditorUI();
      return mapEditor.enabled;
    }
    mapEditor.enabled = nextState;
    if (mapEditor.enabled) {
      hideContextMenu();
      hideTooltip();
    }
    if (mapEditor.enabled && !mapEditor.applyTerrain && !mapEditor.applyStructure) {
      mapEditor.applyTerrain = true;
    }
    refreshMapEditorUI();
    return mapEditor.enabled;
  }

  function closeMapEditor(options = {}) {
    const { returnFocus = false } = options;
    const wasActive = isMapEditorActive();
    toggleMapEditor(false);
    if (returnFocus && uiElements.mapEditorToggle && typeof uiElements.mapEditorToggle.focus === 'function') {
      uiElements.mapEditorToggle.focus({ preventScroll: true });
    }
    return wasActive;
  }

  function setMapEditorTerrainKey(value) {
    const mapEditor = ensureMapEditorState();
    mapEditor.terrainKey = normalizeTileKey(value);
    refreshMapEditorUI();
    return mapEditor.terrainKey;
  }

  function setMapEditorStructureKey(value) {
    const mapEditor = ensureMapEditorState();
    mapEditor.structureKey = normalizeStructureKey(value);
    refreshMapEditorUI();
    return mapEditor.structureKey;
  }

  function setMapEditorApplyTerrain(enabled) {
    const mapEditor = ensureMapEditorState();
    mapEditor.applyTerrain = Boolean(enabled);
    refreshMapEditorUI();
    return mapEditor.applyTerrain;
  }

  function setMapEditorApplyStructure(enabled) {
    const mapEditor = ensureMapEditorState();
    mapEditor.applyStructure = Boolean(enabled);
    refreshMapEditorUI();
    return mapEditor.applyStructure;
  }

  function setMapEditorBrushSize(value) {
    const mapEditor = ensureMapEditorState();
    const parsed = Number.parseInt(value, 10);
    const fallback = Number.isFinite(mapEditor.brushSize) ? mapEditor.brushSize : mapEditorBrushConfig.min;
    const normalized = Number.isFinite(parsed) ? parsed : fallback;
    const clampedBrush = clamp(normalized, mapEditorBrushConfig.min, mapEditorBrushConfig.max);
    mapEditor.brushSize = clampedBrush;
    refreshMapEditorUI();
    return mapEditor.brushSize;
  }

  function clearMapEditorStructure() {
    const mapEditor = ensureMapEditorState();
    mapEditor.structureKey = '';
    mapEditor.applyStructure = true;
    refreshMapEditorUI();
    return mapEditor.structureKey;
  }

  function applyMapEditorPaint(tileX, tileY) {
    const world = state.currentWorld;
    if (!world || !Array.isArray(world.tiles)) {
      return false;
    }
    if (!Number.isInteger(tileX) || !Number.isInteger(tileY)) {
      return false;
    }
    const tiles = world.tiles;
    if (tileY < 0 || tileY >= tiles.length) {
      return false;
    }
    const mapEditor = ensureMapEditorState();
    if (!mapEditor.enabled) {
      return false;
    }
    const applyTerrain = mapEditor.applyTerrain && Boolean(mapEditor.terrainKey);
    const applyStructure = Boolean(mapEditor.applyStructure);
    if (!applyTerrain && !applyStructure) {
      return false;
    }
    const brushBase = Number.isFinite(mapEditor.brushSize) ? Math.round(mapEditor.brushSize) : mapEditorBrushConfig.min;
    const brushSize = clamp(brushBase, mapEditorBrushConfig.min, mapEditorBrushConfig.max);
    const radius = Math.max(0, Math.floor((brushSize - 1) / 2));
    let changed = false;

    for (let y = tileY - radius; y <= tileY + radius; y += 1) {
      if (y < 0 || y >= tiles.length) {
        continue;
      }
      const row = tiles[y];
      if (!Array.isArray(row)) {
        continue;
      }
      for (let x = tileX - radius; x <= tileX + radius; x += 1) {
        if (x < 0 || x >= row.length) {
          continue;
        }
        const tile = row[x];
        if (!tile) {
          continue;
        }

        if (applyTerrain && mapEditor.terrainKey) {
          const targetBase = mapEditor.terrainKey;
          if (tile.base !== targetBase) {
            tile.base = targetBase;
            if (tile.overlay) {
              tile.overlay = null;
            }
            if (tile.hillOverlay) {
              tile.hillOverlay = null;
            }
            changed = true;
          }
        }

        if (applyStructure) {
          const targetStructure = mapEditor.structureKey ? mapEditor.structureKey : null;
          if (tile.structure !== targetStructure) {
            tile.structure = targetStructure;
            tile.structureDetails = null;
            tile.structureName = null;
            changed = true;
          } else if (!targetStructure && (tile.structureDetails || tile.structureName)) {
            tile.structureDetails = null;
            tile.structureName = null;
            changed = true;
          }
        }
      }
    }

    if (changed && redrawWorld) {
      redrawWorld(world, { preserveView: true });
    }
    return changed;
  }

  return {
    state,
    ensureMapEditorState,
    isMapEditorActive,
    refreshMapEditorUI,
    toggleMapEditor,
    closeMapEditor,
    setMapEditorTerrainKey,
    setMapEditorStructureKey,
    setMapEditorApplyTerrain,
    setMapEditorApplyStructure,
    setMapEditorBrushSize,
    clearMapEditorStructure,
    applyMapEditorPaint,
    ensureStructureHighlightState
  };
}

