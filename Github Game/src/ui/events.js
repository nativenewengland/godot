export function attachEvents(elements, deps) {
  const {
    structureContextMenuState,
    hideStructureContextMenu,
    openOptionsScreen,
    closeOptionsScreen,
    hideStructureDetails,
    showLocalViewAt,
    showDwarfholdInterior,
    showStructureDetails,
    hideLocalView,
    adjustLocalMapZoom,
    resetLocalMapZoom,
    closeDwarfholdInterior,
    state,
    refreshOverlayToggleButtons,
    refreshStructureHighlightControls,
    ensureStructureHighlightState,
    drawWorld,
    updateFrequencyDisplay,
    sanitizeFrequencyValue,
    defaultForestFrequency,
    defaultMountainFrequency,
    ensureSeedString,
    getRandomWorldName,
    getSanitisedChronologyFromInputs,
    generateRandomChronology,
    updateChronologyDisplay,
    openDwarfCustomizer,
      closeWorldInfoModal,
      applyMapSizePresetToState,
      getMapSizePreset,
      handleRegenerate,
      changeActiveDwarf,
      randomiseActiveDwarf,
      playSoundEffect,
      soundEffects,
      ensureMusicStarted,
      beginGame,
      updateDwarfTrait,
      setupTraitSliderControl,
      isDwarfCustomizerVisible,
      closeDwarfCustomizer,
    structureDetailsState,
    setActiveStructureDetailsTab,
    isOptionsVisible,
    updateWorldInfoSeedDisplay,
    updateWorldInfoSizeDisplay,
    updateWorldInfoGenerationTypeDisplay,
    setWorldGenerationType,
    toggleMapEditor,
    closeMapEditor,
    setMapEditorTerrainKey,
    setMapEditorStructureKey,
    setMapEditorApplyTerrain,
    setMapEditorApplyStructure,
    setMapEditorBrushSize,
    clearMapEditorStructure,
    runWithLoadingScreen,
    generateAndRender
  } = deps;

  const dismissContextMenuOnPointerDown = (event) => {
    if (!structureContextMenuState.visible) {
      return;
    }
    if (event.button !== undefined && event.button !== 0) {
      return;
    }
    const menu = elements.structureContextMenu;
    if (menu && menu.contains(event.target)) {
      return;
    }
    hideStructureContextMenu();
  };

  const dismissContextMenuOnKeyDown = (event) => {
    if (!structureContextMenuState.visible) {
      return;
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      hideStructureContextMenu();
    }
  };

  function closeStructureHighlightMenu({ returnFocus = false } = {}) {
    const highlightState = ensureStructureHighlightState();
    if (!highlightState.menuOpen) {
      return;
    }
    highlightState.menuOpen = false;
    refreshStructureHighlightControls();
    if (returnFocus && elements.structureHighlightToggle) {
      const toggle = elements.structureHighlightToggle;
      if (typeof toggle.focus === 'function') {
        toggle.focus();
      }
    }
  }

  const dismissContextMenuOnScroll = () => {
    if (structureContextMenuState.visible) {
      hideStructureContextMenu();
    }
    closeStructureHighlightMenu();
  };

  const handleStructureHighlightPointerDown = (event) => {
    const highlightState = ensureStructureHighlightState();
    if (!highlightState.menuOpen) {
      return;
    }
    const toggle = elements.structureHighlightToggle;
    const menu = elements.structureHighlightMenu;
    if ((toggle && toggle.contains(event.target)) || (menu && menu.contains(event.target))) {
      return;
    }
    closeStructureHighlightMenu();
  };

  const handleStructureHighlightKeyDown = (event) => {
    if (event.key !== 'Escape' && event.key !== 'Esc') {
      return;
    }
    const highlightState = ensureStructureHighlightState();
    if (!highlightState.menuOpen) {
      return;
    }
    closeStructureHighlightMenu({ returnFocus: true });
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('pointerdown', dismissContextMenuOnPointerDown, true);
    document.addEventListener('pointerdown', handleStructureHighlightPointerDown, true);
    document.addEventListener('keydown', dismissContextMenuOnKeyDown, true);
    document.addEventListener('keydown', handleStructureHighlightKeyDown, true);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        hideStructureContextMenu();
        closeStructureHighlightMenu();
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', dismissContextMenuOnScroll, true);
    window.addEventListener('blur', dismissContextMenuOnScroll);
  }

  if (elements.canvasWrapper) {
    elements.canvasWrapper.addEventListener('focusout', () => {
      if (structureContextMenuState.visible) {
        hideStructureContextMenu();
      }
    });
  }

  if (elements.startButton) {
    elements.startButton.addEventListener('click', () => {
      deps.openWorldInfoModal();
    });
  }

  if (elements.optionsButton) {
    elements.optionsButton.addEventListener('click', () => {
      openOptionsScreen('title');
    });
  }

  if (elements.inGameOptions) {
    elements.inGameOptions.addEventListener('click', () => {
      openOptionsScreen('game');
    });
  }

  if (elements.closeOptions) {
    elements.closeOptions.addEventListener('click', () => {
      closeOptionsScreen();
    });
  }

  if (elements.structureDetailsClose) {
    elements.structureDetailsClose.addEventListener('click', () => {
      hideStructureDetails({ returnFocus: true });
    });
  }

  if (Array.isArray(elements.structureDetailsTabs) && elements.structureDetailsTabs.length > 0) {
    elements.structureDetailsTabs.forEach((tab) => {
      if (!tab) {
        return;
      }
      tab.addEventListener('click', () => {
        if (!structureDetailsState.visible) {
          return;
        }
        setActiveStructureDetailsTab(tab.getAttribute('data-tab-id'));
      });
    });
  }

  if (elements.structureHighlightToggle) {
    elements.structureHighlightToggle.addEventListener('click', () => {
      const highlightState = ensureStructureHighlightState();
      highlightState.menuOpen = !highlightState.menuOpen;
      refreshStructureHighlightControls();
      if (
        highlightState.menuOpen &&
        elements.structureHighlightMenu &&
        typeof elements.structureHighlightMenu.focus === 'function'
      ) {
        elements.structureHighlightMenu.focus({ preventScroll: true });
      }
    });
  }

  if (elements.structureHighlightMenu) {
    elements.structureHighlightMenu.addEventListener('change', (event) => {
      const target = event.target;
      if (!target || !target.matches("input[type='checkbox'][data-highlight-type]")) {
        return;
      }
      const type = target.getAttribute('data-highlight-type');
      if (!type) {
        return;
      }
      const highlightState = ensureStructureHighlightState();
      if (!Object.prototype.hasOwnProperty.call(highlightState, type)) {
        return;
      }
      highlightState[type] = target.checked;
      refreshStructureHighlightControls();
      if (state.currentWorld) {
        drawWorld(state.currentWorld, { preserveView: true });
      }
    });
  }

  if (elements.mapEditorToggle) {
    elements.mapEditorToggle.addEventListener('click', () => {
      const enabled = toggleMapEditor();
      if (enabled && elements.mapEditorTerrainInput && typeof elements.mapEditorTerrainInput.focus === 'function') {
        elements.mapEditorTerrainInput.focus({ preventScroll: true });
        elements.mapEditorTerrainInput.select?.();
      }
    });
  }

  if (elements.mapEditorClose) {
    elements.mapEditorClose.addEventListener('click', () => {
      closeMapEditor({ returnFocus: true });
    });
  }

  const handleMapEditorTerrainChange = (event) => {
    setMapEditorTerrainKey(event.target.value);
  };

  if (elements.mapEditorTerrainInput) {
    elements.mapEditorTerrainInput.addEventListener('change', handleMapEditorTerrainChange);
    elements.mapEditorTerrainInput.addEventListener('blur', handleMapEditorTerrainChange);
    elements.mapEditorTerrainInput.addEventListener('input', () => {
      setMapEditorTerrainKey(elements.mapEditorTerrainInput.value);
    });
  }

  const handleMapEditorStructureChange = (event) => {
    setMapEditorStructureKey(event.target.value);
  };

  if (elements.mapEditorStructureInput) {
    elements.mapEditorStructureInput.addEventListener('change', handleMapEditorStructureChange);
    elements.mapEditorStructureInput.addEventListener('blur', handleMapEditorStructureChange);
    elements.mapEditorStructureInput.addEventListener('input', () => {
      setMapEditorStructureKey(elements.mapEditorStructureInput.value);
    });
  }

  if (elements.mapEditorApplyTerrain) {
    elements.mapEditorApplyTerrain.addEventListener('change', (event) => {
      setMapEditorApplyTerrain(event.target.checked);
    });
  }

  if (elements.mapEditorApplyStructure) {
    elements.mapEditorApplyStructure.addEventListener('change', (event) => {
      setMapEditorApplyStructure(event.target.checked);
    });
  }

  if (elements.mapEditorBrushSizeInput) {
    elements.mapEditorBrushSizeInput.addEventListener('input', (event) => {
      setMapEditorBrushSize(event.target.value);
    });
    elements.mapEditorBrushSizeInput.addEventListener('change', (event) => {
      setMapEditorBrushSize(event.target.value);
    });
  }

  if (elements.mapEditorClearStructure) {
    elements.mapEditorClearStructure.addEventListener('click', () => {
      clearMapEditorStructure();
    });
  }

  const normalizeDwarfholdKey = (value) => {
    if (typeof value !== 'string') {
      return '';
    }
    return value
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '');
  };
  const dwarfholdStructureKeys = new Set(
    [
      'DWARFHOLD',
      'GREAT_DWARFHOLD',
      'GREATDWARFHOLD',
      'ABANDONED_DWARFHOLD',
      'DARK_DWARFHOLD',
      'DARKDWARFHOLD',
      'HILLHOLD'
    ].map((key) => normalizeDwarfholdKey(key))
  );
  const isDwarfholdStructureTile = (tile) => {
    if (!tile) {
      return false;
    }
    const normalizedStructureKey = normalizeDwarfholdKey(tile.structure);
    if (normalizedStructureKey && dwarfholdStructureKeys.has(normalizedStructureKey)) {
      return true;
    }
    const rawType = tile.structureDetails?.type;
    const normalizedStructureType = normalizeDwarfholdKey(rawType);
    if (normalizedStructureType && dwarfholdStructureKeys.has(normalizedStructureType)) {
      return true;
    }
    if (typeof tile.structureName === 'string') {
      const normalizedName = normalizeDwarfholdKey(tile.structureName);
      for (const key of dwarfholdStructureKeys) {
        if (normalizedName.includes(key)) {
          return true;
        }
      }
    }
    return false;
  };

  const getWorldTileAt = (x, y) => {
    const world = state.currentWorld;
    if (!world || !Array.isArray(world.tiles)) {
      return null;
    }
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      return null;
    }
    const row = world.tiles[y];
    if (!Array.isArray(row)) {
      return null;
    }
    return row[x] || null;
  };

  const enrichWithDwarfholdDetails = (tile, x, y) => {
    if (!tile) {
      return null;
    }
    if (tile.structureDetails && Object.keys(tile.structureDetails).length > 0) {
      return tile;
    }

    if (!isDwarfholdStructureTile(tile)) {
      return tile;
    }

    const world = state.currentWorld;
    if (!world || !Array.isArray(world.dwarfholds)) {
      return tile;
    }

    const match = world.dwarfholds.find((hold) => hold && hold.x === x && hold.y === y);
    if (!match) {
      return tile;
    }

    const { x: holdX, y: holdY, ...details } = match;
    const mergedDetails = { ...(tile.structureDetails || {}), ...details };
    const resolvedName = mergedDetails.name || tile.structureName || tile.areaName;

    tile.structureDetails = mergedDetails;
    if (resolvedName) {
      tile.structureName = resolvedName;
    }

    return tile;
  };

  const resolveTileForDetails = (tile, tileX, tileY) => {
    const worldTile = getWorldTileAt(tileX, tileY);
    const baseTile = worldTile || tile || null;
    if (!baseTile) {
      return null;
    }

    const enrichedTile = enrichWithDwarfholdDetails(baseTile, tileX, tileY);
    if (enrichedTile && typeof enrichedTile.structureName === 'string' && enrichedTile.structureName) {
      return enrichedTile;
    }

    if (enrichedTile && enrichedTile.structureDetails && typeof enrichedTile.structureDetails.name === 'string') {
      return { ...enrichedTile, structureName: enrichedTile.structureDetails.name };
    }

    if (tile && typeof tile.structureName === 'string' && tile.structureName) {
      return tile;
    }

    if (tile && tile.structureDetails && typeof tile.structureDetails.name === 'string') {
      return { ...tile, structureName: tile.structureDetails.name };
    }

    return enrichedTile || tile || null;
  };

  // Handle double-click on world canvas to open structure details for dwarfholds and similar
  if (elements.canvas) {
    elements.canvas.addEventListener('dblclick', (event) => {
      try {
        if (!state.currentWorld || !state.currentWorld.tileSize) {
          return;
        }
        const rect = elements.canvas.getBoundingClientRect();
        const cssX = event.clientX - rect.left;
        const cssY = event.clientY - rect.top;
        const tileSize = state.currentWorld.tileSize;
        // Account for CSS scaling of the canvas (devicePixelRatio and layout scaling)
        const scaleX = elements.canvas.width / rect.width;
        const scaleY = elements.canvas.height / rect.height;
        const pixelX = Math.floor(cssX * scaleX);
        const pixelY = Math.floor(cssY * scaleY);
        const tileX = Math.max(0, Math.min(state.currentWorld.width - 1, Math.floor(pixelX / tileSize)));
        const tileY = Math.max(0, Math.min(state.currentWorld.height - 1, Math.floor(pixelY / tileSize)));
        const tile = getWorldTileAt(tileX, tileY);
        const resolvedTile = resolveTileForDetails(tile, tileX, tileY);
        if (!resolvedTile) {
          return;
        }
        // Open settlement details for dwarfholds/hillholds etc.; otherwise show general details if name is available
        if (isDwarfholdStructureTile(resolvedTile)) {
          showStructureDetails(resolvedTile, { tileX, tileY });
          event.stopPropagation();
          event.preventDefault();
          return;
        }
        const resolvedName =
          typeof resolvedTile.structureName === 'string' && resolvedTile.structureName
            ? resolvedTile.structureName
            : resolvedTile.structureDetails && typeof resolvedTile.structureDetails.name === 'string'
            ? resolvedTile.structureDetails.name
            : null;
        if (resolvedName) {
          const finalTile =
            resolvedName === resolvedTile.structureName
              ? resolvedTile
              : { ...resolvedTile, structureName: resolvedName };
          showStructureDetails(finalTile, { tileX, tileY });
          event.stopPropagation();
          event.preventDefault();
        }
      } catch (_err) {
        // ignore
      }
    });
  }

  if (elements.structureContextMenuBegin) {
    elements.structureContextMenuBegin.addEventListener('click', () => {
      const { tile, tileX, tileY } = structureContextMenuState;
      hideStructureContextMenu();
      if (!Number.isInteger(tileX) || !Number.isInteger(tileY)) {
        return;
      }
      const resolvedTile = resolveTileForDetails(tile, tileX, tileY);
      if (isDwarfholdStructureTile(resolvedTile)) {
        showDwarfholdInterior(resolvedTile, tileX, tileY);
      } else {
        showLocalViewAt(tileX, tileY);
      }
    });
  }

  if (elements.structureContextMenuMoreInfo) {
    elements.structureContextMenuMoreInfo.addEventListener('click', () => {
      const { tile, tileX, tileY } = structureContextMenuState;
      const resolvedTile = resolveTileForDetails(tile, tileX, tileY);
      hideStructureContextMenu();
      if (!resolvedTile) {
        return;
      }

      if (isDwarfholdStructureTile(resolvedTile)) {
        showStructureDetails(resolvedTile, { tileX, tileY });
        return;
      }

      const resolvedName =
        typeof resolvedTile.structureName === 'string' && resolvedTile.structureName
          ? resolvedTile.structureName
          : resolvedTile.structureDetails && typeof resolvedTile.structureDetails.name === 'string'
          ? resolvedTile.structureDetails.name
          : null;

      if (resolvedName) {
        const finalTile =
          resolvedName === resolvedTile.structureName
            ? resolvedTile
            : { ...resolvedTile, structureName: resolvedName };
        showStructureDetails(finalTile, { tileX, tileY });
      }
    });
  }

  if (elements.localMapClose) {
    elements.localMapClose.addEventListener('click', () => {
      hideLocalView({ returnFocus: true });
    });
  }

  if (elements.localMapZoomIn) {
    elements.localMapZoomIn.addEventListener('click', () => {
      adjustLocalMapZoom('in');
    });
  }

  if (elements.localMapZoomOut) {
    elements.localMapZoomOut.addEventListener('click', () => {
      adjustLocalMapZoom('out');
    });
  }

  if (elements.localMapZoomReset) {
    elements.localMapZoomReset.addEventListener('click', () => {
      resetLocalMapZoom();
    });
  }

  if (elements.localMapCanvas) {
    elements.localMapCanvas.addEventListener(
      'wheel',
      (event) => {
        if (!state.localView || !state.localView.active) {
          return;
        }
        if (event.ctrlKey || event.metaKey) {
          return;
        }
        event.preventDefault();
        if (event.deltaY < 0) {
          adjustLocalMapZoom('in');
        } else if (event.deltaY > 0) {
          adjustLocalMapZoom('out');
        }
      },
      { passive: false }
    );
  }

  if (elements.dwarfholdExit) {
    elements.dwarfholdExit.addEventListener('click', () => {
      closeDwarfholdInterior({ returnFocus: true });
    });
  }

  if (elements.politicalBordersToggle) {
    elements.politicalBordersToggle.addEventListener('click', () => {
      state.ui.showPoliticalBorders = !state.ui.showPoliticalBorders;
      refreshOverlayToggleButtons();
      if (state.currentWorld) {
        drawWorld(state.currentWorld);
      }
    });
  }

  if (elements.politicalInfluenceToggle) {
    elements.politicalInfluenceToggle.addEventListener('click', () => {
      state.ui.showPoliticalInfluence = !state.ui.showPoliticalInfluence;
      refreshOverlayToggleButtons();
      if (state.currentWorld) {
        drawWorld(state.currentWorld);
      }
    });
  }

  if (elements.elevationToggle) {
    elements.elevationToggle.addEventListener('click', () => {
      state.ui.showElevation = !state.ui.showElevation;
      refreshOverlayToggleButtons();
      if (state.currentWorld) {
        drawWorld(state.currentWorld);
      }
    });
  }

  if (elements.biomeToggle) {
    elements.biomeToggle.addEventListener('click', () => {
      state.ui.showBiomes = !state.ui.showBiomes;
      refreshOverlayToggleButtons();
      if (state.currentWorld) {
        drawWorld(state.currentWorld);
      }
    });
  }

  if (elements.temperatureToggle) {
    elements.temperatureToggle.addEventListener('click', () => {
      state.ui.showTemperature = !state.ui.showTemperature;
      refreshOverlayToggleButtons();
      if (state.currentWorld) {
        drawWorld(state.currentWorld);
      }
    });
  }

  if (elements.locationLabelToggle) {
    elements.locationLabelToggle.addEventListener('click', () => {
      state.ui.showLocationLabels = !state.ui.showLocationLabels;
      refreshOverlayToggleButtons();
      if (state.currentWorld) {
        drawWorld(state.currentWorld);
      }
    });
  }

  if (elements.mapSizeSelect) {
    elements.mapSizeSelect.addEventListener('change', (event) => {
      const preset = getMapSizePreset(event.target.value);
      applyMapSizePresetToState(state, preset);
      updateWorldInfoSizeDisplay();
      if (elements.worldMapSizeSelect) {
        elements.worldMapSizeSelect.value = state.settings.mapSize;
      }
    });
  }

  if (elements.worldGenerationTypeSelect) {
    elements.worldGenerationTypeSelect.addEventListener('change', (event) => {
      setWorldGenerationType(event.target.value);
      updateWorldInfoGenerationTypeDisplay();
      if (elements.worldInfoGenerationTypeSelect) {
        elements.worldInfoGenerationTypeSelect.value = state.settings.worldGenerationType;
      }
    });
  }

  const sliderInputHandlers = [
    {
      input: elements.forestFrequencyInput,
      valueElement: elements.forestFrequencyValue,
      defaultValue: defaultForestFrequency,
      key: 'forestFrequency'
    },
    {
      input: elements.mountainFrequencyInput,
      valueElement: elements.mountainFrequencyValue,
      defaultValue: defaultMountainFrequency,
      key: 'mountainFrequency'
    },
    {
      input: elements.riverFrequencyInput,
      valueElement: elements.riverFrequencyValue,
      defaultValue: 50,
      key: 'riverFrequency'
    },
    {
      input: elements.humanSettlementFrequencyInput,
      valueElement: elements.humanSettlementFrequencyValue,
      defaultValue: 50,
      key: 'humanSettlementFrequency'
    },
    {
      input: elements.dwarfSettlementFrequencyInput,
      valueElement: elements.dwarfSettlementFrequencyValue,
      defaultValue: 50,
      key: 'dwarfSettlementFrequency'
    },
    {
      input: elements.woodElfSettlementFrequencyInput,
      valueElement: elements.woodElfSettlementFrequencyValue,
      defaultValue: 50,
      key: 'woodElfSettlementFrequency'
    },
    {
      input: elements.lizardmenSettlementFrequencyInput,
      valueElement: elements.lizardmenSettlementFrequencyValue,
      defaultValue: 50,
      key: 'lizardmenSettlementFrequency'
    }
  ];

  sliderInputHandlers.forEach(({ input, valueElement, defaultValue, key }) => {
    if (!input) {
      return;
    }
    input.addEventListener('input', (event) => {
      const rawValue = Number.parseInt(event.target.value, 10);
      const sanitisedValue = sanitizeFrequencyValue(
        Number.isNaN(rawValue) ? state.settings[key] : rawValue,
        defaultValue
      );
      state.settings[key] = sanitisedValue;
      if (event.target.value !== sanitisedValue.toString()) {
        event.target.value = sanitisedValue.toString();
      }
      updateFrequencyDisplay(valueElement, sanitisedValue);
    });
  });

  if (elements.optionsForm) {
    elements.optionsForm.addEventListener('submit', (event) => {
      event.preventDefault();
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

      const mapSizeKey = elements.mapSizeSelect ? elements.mapSizeSelect.value : state.settings.mapSize;
      const mapSizePreset = getMapSizePreset(mapSizeKey);
      applyMapSizePresetToState(state, mapSizePreset);
      updateWorldInfoSizeDisplay();
      if (elements.worldMapSizeSelect) {
        elements.worldMapSizeSelect.value = state.settings.mapSize;
      }

      const selectedGenerationType = elements.worldGenerationTypeSelect
        ? elements.worldGenerationTypeSelect.value
        : state.settings.worldGenerationType;
      setWorldGenerationType(selectedGenerationType);
      updateWorldInfoGenerationTypeDisplay();

      const seedInputValue = elements.seedInput ? elements.seedInput.value.trim() : '';
      state.settings.seedString = seedInputValue;
      state.settings.lastSeedString = seedInputValue;
      updateWorldInfoSeedDisplay(seedInputValue);
      if (elements.worldSeedInput && elements.worldSeedInput !== elements.seedInput) {
        elements.worldSeedInput.value = seedInputValue;
      }

      const previousSource = closeOptionsScreen();
      if (previousSource === 'game' && elements.gameContainer) {
        runWithLoadingScreen(() => generateAndRender(), { statusText: 'Updating the realm…' }).catch((error) => {
          console.error('Failed to apply new world settings.', error);
        });
      }
    });
  }

  if (elements.worldInfoForm) {
    elements.worldInfoForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const selectedPreset = getMapSizePreset(elements.worldMapSizeSelect?.value || state.settings.mapSize);
      applyMapSizePresetToState(state, selectedPreset);
      if (elements.mapSizeSelect) {
        elements.mapSizeSelect.value = state.settings.mapSize;
      }
      updateWorldInfoSizeDisplay();
      const selectedGenerationType = elements.worldInfoGenerationTypeSelect
        ? elements.worldInfoGenerationTypeSelect.value
        : state.settings.worldGenerationType;
      setWorldGenerationType(selectedGenerationType);
      if (elements.worldSeedInput) {
        state.settings.seedString = elements.worldSeedInput.value.trim();
      }
      let finalSeed = state.settings.seedString;
      if (!finalSeed) {
        finalSeed = ensureSeedString();
        if (elements.worldSeedInput) {
          elements.worldSeedInput.value = finalSeed;
        }
      }
      state.settings.lastSeedString = finalSeed;
      if (elements.seedInput) {
        elements.seedInput.value = finalSeed;
      }
      updateWorldInfoSeedDisplay(finalSeed);
      const submittedName = elements.worldNameInput ? elements.worldNameInput.value.trim() : '';
      state.worldName = submittedName || getRandomWorldName(state.worldName);
      const submittedChronology = getSanitisedChronologyFromInputs();
      if (submittedChronology) {
        state.worldChronology = submittedChronology;
      } else {
        state.worldChronology = generateRandomChronology();
        if (elements.worldYearInput) {
          elements.worldYearInput.value = state.worldChronology.year.toString();
        }
        if (elements.worldAgeInput) {
          elements.worldAgeInput.value = state.worldChronology.age.toString();
        }
      }
      updateChronologyDisplay();
      openDwarfCustomizer();
    });
  }

  if (elements.worldInfoCancel) {
    elements.worldInfoCancel.addEventListener('click', () => {
      closeWorldInfoModal({ returnFocus: true });
    });
  }

  if (elements.worldYearInput) {
    elements.worldYearInput.addEventListener('input', updateChronologyDisplay);
  }

  if (elements.worldAgeInput) {
    elements.worldAgeInput.addEventListener('input', updateChronologyDisplay);
  }

  if (elements.worldChronologyRandom) {
    elements.worldChronologyRandom.addEventListener('click', () => {
      const newChronology = generateRandomChronology();
      state.worldChronology = newChronology;
      if (elements.worldYearInput) {
        elements.worldYearInput.value = newChronology.year.toString();
        elements.worldYearInput.focus();
        elements.worldYearInput.select();
      }
      if (elements.worldAgeInput) {
        elements.worldAgeInput.value = newChronology.age.toString();
      }
      updateChronologyDisplay();
    });
  }

  if (elements.worldNameRandom) {
    elements.worldNameRandom.addEventListener('click', () => {
      const newName = getRandomWorldName(state.worldName);
      state.worldName = newName;
      if (elements.worldNameInput) {
        elements.worldNameInput.value = newName;
        elements.worldNameInput.focus();
        elements.worldNameInput.select();
      }
    });
  }

  if (elements.worldMapSizeSelect) {
    elements.worldMapSizeSelect.addEventListener('change', (event) => {
      const preset = getMapSizePreset(event.target.value);
      applyMapSizePresetToState(state, preset);
      if (elements.mapSizeSelect) {
        elements.mapSizeSelect.value = state.settings.mapSize;
      }
      updateWorldInfoSizeDisplay();
    });
  }

  if (elements.worldInfoGenerationTypeSelect) {
    elements.worldInfoGenerationTypeSelect.addEventListener('change', (event) => {
      setWorldGenerationType(event.target.value);
      if (elements.worldGenerationTypeSelect) {
        elements.worldGenerationTypeSelect.value = state.settings.worldGenerationType;
      }
    });
  }

  if (elements.worldSeedInput) {
    elements.worldSeedInput.addEventListener('input', (event) => {
      const newValue = event.target.value;
      state.settings.seedString = newValue.trim();
      updateWorldInfoSeedDisplay(newValue);
      if (elements.seedInput && elements.seedInput !== event.target) {
        elements.seedInput.value = newValue;
      }
    });
  }

  if (elements.regenerate) {
    elements.regenerate.addEventListener('click', handleRegenerate);
  }

  if (elements.dwarfPrev) {
    elements.dwarfPrev.addEventListener('click', () => {
      changeActiveDwarf(-1);
    });
  }

  if (elements.dwarfNext) {
    elements.dwarfNext.addEventListener('click', () => {
      changeActiveDwarf(1);
    });
  }

  if (elements.dwarfRandomise) {
    elements.dwarfRandomise.addEventListener('click', () => {
      randomiseActiveDwarf();
      playSoundEffect(soundEffects.randomiseClick);
      elements.dwarfRandomise.classList.add('randomise-button__dice--rolled');
    });
  }

  if (elements.dwarfBack) {
    elements.dwarfBack.addEventListener('click', () => {
      closeDwarfCustomizer({ returnFocus: true });
    });
  }

  if (elements.dwarfCustomizerForm) {
    elements.dwarfCustomizerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      beginGame();
      ensureMusicStarted();
    });
  }

  if (elements.dwarfNameInput) {
    elements.dwarfNameInput.addEventListener('input', (event) => {
      updateDwarfTrait('name', event.target.value);
    });
    elements.dwarfNameInput.addEventListener('blur', (event) => {
      const trimmed = event.target.value.trim();
      if (trimmed !== event.target.value) {
        event.target.value = trimmed;
      }
      updateDwarfTrait('name', trimmed);
    });
  }

  if (elements.dwarfGenderButtons) {
    elements.dwarfGenderButtons.addEventListener('click', (event) => {
      const button = event.target.closest('[data-gender-value]');
      if (!button || !elements.dwarfGenderButtons.contains(button)) {
        return;
      }
      const { genderValue } = button.dataset;
      if (!genderValue) {
        return;
      }
      updateDwarfTrait('gender', genderValue);
    });

    elements.dwarfGenderButtons.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        return;
      }
      event.preventDefault();
      const buttons = Array.from(elements.dwarfGenderButtons.querySelectorAll('[data-gender-value]'));
      if (buttons.length === 0) {
        return;
      }
      const currentIndex = buttons.findIndex((button) => button.classList.contains('active'));
      const direction = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + buttons.length) % buttons.length;
      const nextButton = buttons[nextIndex];
      if (!nextButton) {
        return;
      }
      nextButton.focus();
      const { genderValue } = nextButton.dataset;
      if (genderValue) {
        updateDwarfTrait('gender', genderValue);
      }
    });
  }

  if (elements.dwarfClanSelect) {
    elements.dwarfClanSelect.addEventListener('change', (event) => {
      updateDwarfTrait('clan', event.target.value);
    });
  }

  if (elements.dwarfProfessionSelect) {
    elements.dwarfProfessionSelect.addEventListener('change', (event) => {
      updateDwarfTrait('profession', event.target.value);
    });
  }

  setupTraitSliderControl('skin', elements.dwarfSkinSlider, elements.dwarfSkinSliderValue);
  setupTraitSliderControl('eyes', elements.dwarfEyeSlider, elements.dwarfEyeSliderValue);
  setupTraitSliderControl('hairStyle', elements.dwarfHairStyleSlider, elements.dwarfHairStyleSliderValue);
  setupTraitSliderControl('hair', elements.dwarfHairSlider, elements.dwarfHairSliderValue);
  setupTraitSliderControl('beard', elements.dwarfBeardSlider, elements.dwarfBeardSliderValue);

  document.addEventListener('keydown', (event) => {
    const activeElement = document.activeElement;
    const isFormControl = activeElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(activeElement.tagName);

    if (isDwarfCustomizerVisible() && !isFormControl) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        changeActiveDwarf(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        changeActiveDwarf(1);
        return;
      }
    }

    if (event.key === 'Escape') {
      if (state.localView && state.localView.active) {
        hideLocalView({ returnFocus: true });
        return;
      }
      if (structureDetailsState.visible) {
        hideStructureDetails({ returnFocus: true });
        return;
      }
      if (isDwarfCustomizerVisible()) {
        closeDwarfCustomizer({ returnFocus: true });
        return;
      }
      if (elements.worldInfoModal && !elements.worldInfoModal.classList.contains('hidden')) {
        closeWorldInfoModal({ returnFocus: true });
        return;
      }
      if (isOptionsVisible()) {
        closeOptionsScreen();
      }
    }
  });

  refreshOverlayToggleButtons();
}
