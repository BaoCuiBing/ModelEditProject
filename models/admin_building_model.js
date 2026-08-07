// 模型名称：校行政大楼与指挥中心精细模型 (庄严钟楼·廊柱·大台阶)
function buildAdminBuildingModel(THREE, group) {
    const C_GRANITE = 0x2e3d4e;
    const C_MARBLE  = 0xf4f4f4;
    const C_GOLD    = 0xf0b030;
    const C_GLASS   = 0xa8d8f0;
    const C_STEP    = 0xc0bab0;
    const C_COLUMN  = 0xe8e4dc;
    const C_DARK    = 0x1e2b38;
    const C_FLAG    = 0xcc2222;

    const bGroup = new THREE.Group();
    bGroup.name = "🏛️ 校行政大楼与指挥中心";
    bGroup.position.set(-189.14, 0.30, 358.52);
    bGroup.scale.set(1.36, 1.00, 3.16);

    const matGranite = new THREE.MeshStandardMaterial({ color: C_GRANITE, roughness: 0.4 });
    const matMarble  = new THREE.MeshStandardMaterial({ color: C_MARBLE,  roughness: 0.25 });
    const matGold    = new THREE.MeshStandardMaterial({ color: C_GOLD,    metalness: 0.85, roughness: 0.15 });
    const matGlass   = new THREE.MeshPhysicalMaterial({ color: C_GLASS,   transparent: true, opacity: 0.6, roughness: 0.08 });
    const matStep    = new THREE.MeshStandardMaterial({ color: C_STEP,    roughness: 0.55 });
    const matColumn  = new THREE.MeshStandardMaterial({ color: C_COLUMN,  roughness: 0.3 });
    const matDark    = new THREE.MeshStandardMaterial({ color: C_DARK,    roughness: 0.35 });
    const matFlag    = new THREE.MeshStandardMaterial({ color: C_FLAG,    roughness: 0.5 });

    const MAIN_W = 58;
    const MAIN_H = 30;
    const MAIN_D = 26;

    // === 宽阔前广场台阶 ===
    [0, 1, 2, 3, 4].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W - i * 2, 0.35, 1.0), matStep);
        step.position.set(0, i * 0.35, MAIN_D / 2 + 5.5 - i * 1.0);
        bGroup.add(step);
    });

    // === 台基 ===
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W + 4, 2.0, MAIN_D + 4), matStep);
    plinth.position.set(0, 1.0, 0);
    bGroup.add(plinth);

    // === 主楼体 (花岗岩深色) ===
    const body = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W, MAIN_H, MAIN_D), matGranite);
    body.position.set(0, 2.0 + MAIN_H / 2, 0);
    body.castShadow = true; body.receiveShadow = true;
    bGroup.add(body);

    // === 正面大理石廊柱 (8根) ===
    const COL_POS = [-24, -17, -10, -3, 3, 10, 17, 24];
    COL_POS.forEach(cx => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.75, MAIN_H * 0.55, 12), matColumn);
        col.position.set(cx, 2.0 + MAIN_H * 0.55 / 2, MAIN_D / 2 + 0.2);
        col.castShadow = true;
        bGroup.add(col);
        // 柱础
        const capB = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.4, 1.8), matColumn);
        capB.position.set(cx, 2.0, MAIN_D / 2 + 0.2);
        bGroup.add(capB);
        // 柱帽
        const capT = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 1.8), matColumn);
        capT.position.set(cx, 2.0 + MAIN_H * 0.55, MAIN_D / 2 + 0.2);
        bGroup.add(capT);
    });
    // 廊柱顶额枋
    const entab = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W, 1.5, 2.0), matMarble);
    entab.position.set(0, 2.0 + MAIN_H * 0.55 + 0.75, MAIN_D / 2 + 0.2);
    bGroup.add(entab);

    // === 正面大窗 (每层) ===
    const WIN_ROWS = [8, 15, 22];
    WIN_ROWS.forEach(wy => {
        [-18, -9, 0, 9, 18].forEach(wx => {
            const wFrame = new THREE.Mesh(new THREE.BoxGeometry(5.5, 4.0, 0.4), matGold);
            wFrame.position.set(wx, 2.0 + wy, MAIN_D / 2 + 0.2);
            bGroup.add(wFrame);
            const glass = new THREE.Mesh(new THREE.PlaneGeometry(4.7, 3.4), matGlass);
            glass.position.set(wx, 2.0 + wy, MAIN_D / 2 + 0.42);
            bGroup.add(glass);
        });
    });

    // === 主楼两侧翼楼 ===
    [-1, 1].forEach(sx => {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(12, MAIN_H * 0.75, MAIN_D), matGranite);
        wing.position.set(sx * (MAIN_W / 2 + 6), 2.0 + MAIN_H * 0.75 / 2, 0);
        wing.castShadow = true;
        bGroup.add(wing);
        // 翼楼窗
        for (let wf = 6; wf < MAIN_H * 0.75; wf += 6) {
            const ww = new THREE.Mesh(new THREE.PlaneGeometry(5, 3.5), matGlass);
            ww.position.set(sx * (MAIN_W / 2 + 6), 2.0 + wf, MAIN_D / 2 + 0.05);
            bGroup.add(ww);
        }
    });

    // === 中央钟楼 ===
    const CLOCK_W = 15;
    const CLOCK_H = 18;
    const towerY = 2.0 + MAIN_H;
    const tower = new THREE.Mesh(new THREE.BoxGeometry(CLOCK_W, CLOCK_H, CLOCK_W), matMarble);
    tower.position.set(0, towerY + CLOCK_H / 2, 0);
    tower.castShadow = true;
    bGroup.add(tower);
    // 钟楼腰线
    const beltT = new THREE.Mesh(new THREE.BoxGeometry(CLOCK_W + 1, 0.6, CLOCK_W + 1), matGold);
    beltT.position.set(0, towerY + CLOCK_H * 0.55, 0);
    bGroup.add(beltT);
    // 钟楼顶部三角山花
    const peakGeo = new THREE.CylinderGeometry(0, CLOCK_W / 2, 4, 4);
    const peak = new THREE.Mesh(peakGeo, matMarble);
    peak.rotation.y = Math.PI / 4;
    peak.position.set(0, towerY + CLOCK_H + 2, 0);
    bGroup.add(peak);

    // === 四面钟盘 (Canvas贴图) ===
    const clockCanvas = document.createElement('canvas');
    clockCanvas.width = 256; clockCanvas.height = 256;
    const cCtx = clockCanvas.getContext('2d');
    cCtx.fillStyle = '#f8f8f8'; cCtx.fillRect(0, 0, 256, 256);
    cCtx.strokeStyle = '#1e2b38'; cCtx.lineWidth = 12;
    cCtx.beginPath(); cCtx.arc(128, 128, 112, 0, Math.PI * 2); cCtx.stroke();
    cCtx.fillStyle = '#c8a020'; cCtx.font = 'bold 30px serif'; cCtx.textAlign = 'center'; cCtx.textBaseline = 'middle';
    cCtx.fillText('XII', 128, 30); cCtx.fillText('VI', 128, 226); cCtx.fillText('IX', 28, 128); cCtx.fillText('III', 228, 128);
    // 刻度
    for (let ti = 0; ti < 12; ti++) {
        const ang = (ti / 12) * Math.PI * 2 - Math.PI / 2;
        const r1 = 95; const r2 = 108;
        cCtx.lineWidth = 4; cCtx.beginPath();
        cCtx.moveTo(128 + r1 * Math.cos(ang), 128 + r1 * Math.sin(ang));
        cCtx.lineTo(128 + r2 * Math.cos(ang), 128 + r2 * Math.sin(ang));
        cCtx.stroke();
    }
    cCtx.lineWidth = 10; cCtx.lineCap = 'round';
    cCtx.beginPath(); cCtx.moveTo(128, 128); cCtx.lineTo(128, 55); cCtx.stroke();
    cCtx.lineWidth = 7;
    cCtx.beginPath(); cCtx.moveTo(128, 128); cCtx.lineTo(175, 128); cCtx.stroke();
    const clockTex = new THREE.CanvasTexture(clockCanvas);
    const clockMat = new THREE.MeshBasicMaterial({ map: clockTex });
    const clockGeo = new THREE.PlaneGeometry(10, 10);
    [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach((ry, fi) => {
        const face = new THREE.Mesh(clockGeo, clockMat);
        const r = CLOCK_W / 2 + 0.15;
        face.position.set(Math.sin(ry) * r, towerY + CLOCK_H * 0.6, Math.cos(ry) * r);
        face.rotation.y = ry;
        bGroup.add(face);
    });

    // === 钟楼旗杆 ===
    const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 10, 6), matGold);
    flagPole.position.set(0, towerY + CLOCK_H + 6, 0);
    bGroup.add(flagPole);
    // 旗帜
    const flagMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.0), matFlag);
    flagMesh.position.set(1.75, towerY + CLOCK_H + 9.5, 0);
    bGroup.add(flagMesh);

    // === 主楼顶部 ===
    const roofParapet = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W + 1, 1.5, MAIN_D + 1), matDark);
    roofParapet.position.set(0, 2.0 + MAIN_H + 0.75, 0);
    bGroup.add(roofParapet);

    group.add(bGroup);
}
