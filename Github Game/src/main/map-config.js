const mapSizePresets = [
  { key: 'mini', label: 'Mini', width: 192, height: 144 },
  { key: 'small', label: 'Small', width: 260, height: 195 },
  { key: 'normal', label: 'Normal', width: 324, height: 243 },
  { key: 'large', label: 'Large', width: 424, height: 318 },
  { key: 'extra-large', label: 'Extra Large', width: 520, height: 390 }
];

const mapSizeByKey = mapSizePresets.reduce((acc, preset) => {
  acc[preset.key] = preset;
  return acc;
}, {});

export function getMapSizePreset(key) {
  return mapSizeByKey[key] || mapSizeByKey.normal;
}

export function applyMapSizePresetToState(state, preset) {
  if (!preset || !state || !state.settings) {
    return;
  }
  state.settings.mapSize = preset.key;
  state.settings.width = preset.width;
  state.settings.height = preset.height;
}

export function getMapSizeLabel(preset, width, height) {
  if (preset) {
    return `${preset.label} — ${preset.width} × ${preset.height} tiles`;
  }
  if (typeof width === 'number' && typeof height === 'number') {
    return `${width} × ${height} tiles`;
  }
  return '—';
}

export const defaultMapSize = getMapSizePreset('normal');
export const defaultForestFrequency = 35;
export const defaultMountainFrequency = 35;
export const mapSizeOptions = mapSizePresets;

