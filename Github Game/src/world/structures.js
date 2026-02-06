const resolveTileSheets = (deps) => {
  if (deps?.tileSheets) {
    return deps.tileSheets;
  }
  if (deps?.state?.tileSheets) {
    return deps.state.tileSheets;
  }
  return null;
};

export function drawHamletStructure(ctx, { pixelX, pixelY, size }, deps = {}) {
  const tile = {
    sheet: 'custom',
    sx: 0,
    sy: 0,
    size: 16
  };
  const tileSheets = resolveTileSheets(deps);
  const sheet = tileSheets?.[tile.sheet];
  if (!sheet?.image) {
    return;
  }
  ctx.drawImage(sheet.image, tile.sx, tile.sy, tile.size, tile.size, pixelX, pixelY, size, size);
}

export function drawCastleStructure(ctx, { pixelX, pixelY, size }) {
  ctx.save();
  ctx.translate(pixelX, pixelY);
  ctx.fillStyle = '#5b666f';
  ctx.fillRect(size * 0.12, size * 0.3, size * 0.76, size * 0.5);
  ctx.fillStyle = '#77828b';
  ctx.fillRect(size * 0.18, size * 0.36, size * 0.64, size * 0.38);

  ctx.fillStyle = '#4a545c';
  const towerWidth = size * 0.2;
  ctx.fillRect(size * 0.12, size * 0.18, towerWidth, size * 0.42);
  ctx.fillRect(size * 0.68, size * 0.18, towerWidth, size * 0.42);

  ctx.fillStyle = '#2a2f33';
  ctx.fillRect(size * 0.44, size * 0.54, size * 0.12, size * 0.26);

  ctx.fillStyle = '#c7352d';
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.18);
  ctx.lineTo(size * 0.6, size * 0.32);
  ctx.lineTo(size * 0.4, size * 0.32);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#32393f';
  ctx.lineWidth = Math.max(1, size * 0.03);
  ctx.beginPath();
  const merlonCount = 4;
  for (let i = 0; i < merlonCount; i += 1) {
    const startX = size * 0.22 + (size * 0.56 * i) / merlonCount;
    ctx.moveTo(startX, size * 0.32);
    ctx.lineTo(startX + size * 0.08, size * 0.32);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawDarkDwarfholdStructure(ctx, { pixelX, pixelY, size }) {
  ctx.save();
  ctx.translate(pixelX, pixelY);

  const baseWidth = size * 0.72;
  const baseHeight = size * 0.38;
  const baseX = (size - baseWidth) / 2;
  const baseY = size * 0.44;

  ctx.fillStyle = '#241b2b';
  ctx.fillRect(baseX, baseY, baseWidth, baseHeight);

  const towerWidth = size * 0.18;
  const towerHeight = size * 0.46;
  const towerY = size * 0.18;
  ctx.fillStyle = '#35263d';
  ctx.fillRect(baseX - size * 0.04, towerY, towerWidth, towerHeight);
  ctx.fillRect(baseX + baseWidth - towerWidth + size * 0.04, towerY, towerWidth, towerHeight);

  ctx.fillStyle = '#4a2e3a';
  ctx.fillRect(size * 0.44, size * 0.34, size * 0.12, size * 0.48);

  ctx.fillStyle = '#f97316';
  ctx.fillRect(baseX + baseWidth * 0.22, baseY + baseHeight * 0.1, baseWidth * 0.18, baseHeight * 0.26);
  ctx.fillRect(baseX + baseWidth * 0.6, baseY + baseHeight * 0.08, baseWidth * 0.18, baseHeight * 0.28);

  ctx.fillStyle = '#1f2937';
  ctx.beginPath();
  ctx.moveTo(size * 0.18, towerY);
  ctx.lineTo(size * 0.32, towerY - size * 0.12);
  ctx.lineTo(size * 0.46, towerY);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(size * 0.54, towerY);
  ctx.lineTo(size * 0.68, towerY - size * 0.12);
  ctx.lineTo(size * 0.82, towerY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(size * 0.46, size * 0.62, size * 0.08, size * 0.2);

  ctx.strokeStyle = 'rgba(249, 115, 22, 0.65)';
  ctx.lineWidth = Math.max(1, size * 0.06);
  ctx.beginPath();
  ctx.moveTo(baseX + baseWidth * 0.1, baseY + baseHeight * 0.9);
  ctx.lineTo(baseX + baseWidth * 0.9, baseY + baseHeight * 0.9);
  ctx.stroke();

  ctx.restore();
}

export function drawRoadsideTavernStructure(ctx, { pixelX, pixelY, size }) {
  ctx.save();
  ctx.translate(pixelX, pixelY);
  const baseWidth = size * 0.74;
  const baseHeight = size * 0.44;
  const baseX = (size - baseWidth) / 2;
  const baseY = size * 0.38;

  ctx.fillStyle = '#c7a06b';
  ctx.fillRect(baseX, baseY, baseWidth, baseHeight);

  ctx.fillStyle = '#854c30';
  ctx.beginPath();
  ctx.moveTo(baseX - size * 0.04, baseY);
  ctx.lineTo(size / 2, size * 0.18);
  ctx.lineTo(baseX + baseWidth + size * 0.04, baseY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#56311f';
  ctx.fillRect(baseX + baseWidth * 0.36, baseY + baseHeight * 0.38, baseWidth * 0.16, baseHeight * 0.62);

  ctx.fillStyle = '#f1d8a5';
  ctx.fillRect(baseX + baseWidth * 0.14, baseY + baseHeight * 0.28, baseWidth * 0.16, baseHeight * 0.32);
  ctx.fillRect(baseX + baseWidth * 0.7, baseY + baseHeight * 0.28, baseWidth * 0.16, baseHeight * 0.32);

  ctx.fillStyle = '#d27d2c';
  ctx.fillRect(baseX + baseWidth * 0.82, baseY + baseHeight * 0.1, baseWidth * 0.14, baseHeight * 0.28);

  ctx.fillStyle = '#311a10';
  ctx.fillRect(baseX + baseWidth * 0.86, baseY + baseHeight * 0.24, baseWidth * 0.06, baseHeight * 0.18);

  ctx.restore();
}

export function drawAmbientHuntingLodgeStructure(ctx, { pixelX, pixelY, size }) {
  ctx.save();
  ctx.translate(pixelX, pixelY);

  const cabinWidth = size * 0.6;
  const cabinHeight = size * 0.32;
  const cabinX = (size - cabinWidth) / 2;
  const cabinY = size * 0.42;

  ctx.fillStyle = '#7b4f2b';
  ctx.fillRect(cabinX, cabinY, cabinWidth, cabinHeight);

  ctx.fillStyle = '#4a2f18';
  ctx.fillRect(cabinX + cabinWidth * 0.38, cabinY + cabinHeight * 0.28, cabinWidth * 0.18, cabinHeight * 0.72);

  ctx.fillStyle = '#9c6c3c';
  ctx.beginPath();
  ctx.moveTo(cabinX - size * 0.04, cabinY);
  ctx.lineTo(cabinX + cabinWidth / 2, cabinY - size * 0.2);
  ctx.lineTo(cabinX + cabinWidth + size * 0.04, cabinY);
  ctx.closePath();
  ctx.fill();

  const smokeBaseX = cabinX + cabinWidth * 0.68;
  const smokeBaseY = cabinY - size * 0.08;
  ctx.fillStyle = '#c8c8c8';
  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.ellipse(smokeBaseX, smokeBaseY, size * 0.08, size * 0.12, 0, 0, Math.PI * 2);
  ctx.ellipse(smokeBaseX - size * 0.06, smokeBaseY - size * 0.12, size * 0.06, size * 0.1, 0, 0, Math.PI * 2);
  ctx.ellipse(smokeBaseX - size * 0.12, smokeBaseY - size * 0.22, size * 0.05, size * 0.08, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  const treeBaseY = size * 0.38;
  const treeBaseX = cabinX - size * 0.1;
  const treeWidth = size * 0.16;
  const treeHeight = size * 0.32;
  ctx.fillStyle = '#3f6b2b';
  ctx.beginPath();
  ctx.moveTo(treeBaseX + treeWidth / 2, treeBaseY - treeHeight);
  ctx.lineTo(treeBaseX, treeBaseY);
  ctx.lineTo(treeBaseX + treeWidth, treeBaseY);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(treeBaseX + treeWidth * 0.44, treeBaseY, treeWidth * 0.12, size * 0.14);

  ctx.restore();
}

export function drawAmbientMoonwellStructure(ctx, { pixelX, pixelY, size }) {
  ctx.save();
  ctx.translate(pixelX, pixelY);

  const clearingRadiusX = size * 0.46;
  const clearingRadiusY = size * 0.28;
  const clearingCenterX = size * 0.5;
  const clearingCenterY = size * 0.64;

  ctx.fillStyle = '#355640';
  ctx.beginPath();
  ctx.ellipse(clearingCenterX, clearingCenterY, clearingRadiusX, clearingRadiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#4e7256';
  ctx.beginPath();
  ctx.ellipse(
    clearingCenterX,
    clearingCenterY,
    clearingRadiusX * 0.84,
    clearingRadiusY * 0.82,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  const poolRadiusX = clearingRadiusX * 0.62;
  const poolRadiusY = clearingRadiusY * 0.68;
  ctx.fillStyle = '#7cd6ff';
  ctx.beginPath();
  ctx.ellipse(clearingCenterX, clearingCenterY, poolRadiusX, poolRadiusY, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#b6f4ff';
  ctx.beginPath();
  ctx.ellipse(
    clearingCenterX,
    clearingCenterY - size * 0.04,
    poolRadiusX * 0.65,
    poolRadiusY * 0.62,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.strokeStyle = '#d6f7ff';
  ctx.lineWidth = Math.max(1.2, size * 0.025);
  ctx.beginPath();
  ctx.ellipse(clearingCenterX, clearingCenterY, poolRadiusX, poolRadiusY, 0, 0, Math.PI * 2);
  ctx.stroke();

  const stoneCount = 6;
  const ringRadius = poolRadiusX * 1.1;
  ctx.fillStyle = '#d4d8f0';
  for (let i = 0; i < stoneCount; i += 1) {
    const angle = (Math.PI * 2 * i) / stoneCount;
    const stoneX = clearingCenterX + Math.cos(angle) * ringRadius;
    const stoneY = clearingCenterY + Math.sin(angle) * ringRadius * 0.8;
    const stoneWidth = size * 0.12;
    const stoneHeight = size * 0.18;
    ctx.save();
    ctx.translate(stoneX, stoneY);
    ctx.rotate(Math.sin(angle) * 0.12);
    ctx.beginPath();
    ctx.ellipse(0, 0, stoneWidth * 0.5, stoneHeight * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const lightCount = 4;
  ctx.fillStyle = 'rgba(180, 246, 255, 0.85)';
  for (let i = 0; i < lightCount; i += 1) {
    const angle = (Math.PI * 2 * i) / lightCount + Math.PI / lightCount;
    const lightX = clearingCenterX + Math.cos(angle) * poolRadiusX * 0.55;
    const lightY = clearingCenterY + Math.sin(angle) * poolRadiusY * 0.5 - size * 0.1;
    const lightRadius = size * 0.06;
    const gradient = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, lightRadius);
    gradient.addColorStop(0, 'rgba(210, 255, 255, 0.95)');
    gradient.addColorStop(1, 'rgba(180, 246, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(lightX, lightY, lightRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
