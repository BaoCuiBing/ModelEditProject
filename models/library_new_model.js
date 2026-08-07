// 模型名称：逸夫图书资讯中心精细模型 (现代圆顶典雅风)
function buildLibraryNewModel(THREE, group) {
    const C_MARBLE  = 0xf5f5f5;
    const C_GLASS   = 0x81d4fa;
    const C_GOLD    = 0xcb8a0a;
    const C_COLUMN  = 0xe8e0d0;
    const C_BASE    = 0xd0ccc2;
    const C_WING    = 0xeef0f2;
    const C_ROOFTOP = 0x5d6268;

    const bGroup = new THREE.Group();
    bGroup.name = "🏛️ 逸夫图书资讯中心";
    bGroup.position.set(-192.11, 0.30, -37.50);
    bGroup.scale.set(1.37, 1.00, 2.11);

    const matMarble  = new THREE.MeshStandardMaterial({ color: C_MARBLE,  roughness: 0.25 });
    const matGlass   = new THREE.MeshPhysicalMaterial({ color: C_GLASS,   transparent: true, opacity: 0.6, roughness: 0.05 });
    const matGold    = new THREE.MeshStandardMaterial({ color: C_GOLD,    metalness: 0.75, roughness: 0.2 });
    const matColumn  = new THREE.MeshStandardMaterial({ color: C_COLUMN,  roughness: 0.35 });
    const matBase    = new THREE.MeshStandardMaterial({ color: C_BASE,    roughness: 0.55 });
    const matWing    = new THREE.MeshStandardMaterial({ color: C_WING,    roughness: 0.4 });
    const matRooftop = new THREE.MeshStandardMaterial({ color: C_ROOFTOP, roughness: 0.6 });

    // === 高基座 (宽台阶) ===
    const baseH = 2.5;
    const base = new THREE.Mesh(new THREE.BoxGeometry(68, baseH, 40), matBase);
    base.position.set(0, baseH / 2, 0);
    base.castShadow = true; base.receiveShadow = true;
    bGroup.add(base);
    // 台阶 (三级)
    [0, 1, 2].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(44 + (2 - i) * 4, 0.35, 0.9), matBase);
        step.position.set(0, baseH + i * 0.35, 20 + (2 - i) * 0.9);
        bGroup.add(step);
    });

    // === 主楼中央体 ===
    const mainH = 22;
    const main = new THREE.Mesh(new THREE.BoxGeometry(62, mainH, 36), matMarble);
    main.position.set(0, baseH + mainH / 2, 0);
    main.castShadow = true; main.receiveShadow = true;
    bGroup.add(main);

    // === 正面廊柱 (6根) ===
    const COL_POSITIONS = [-22, -13, -4, 4, 13, 22];
    COL_POSITIONS.forEach(cx => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.8, mainH * 0.7, 12), matColumn);
        col.position.set(cx, baseH + mainH * 0.7 / 2, 18.2);
        col.castShadow = true;
        bGroup.add(col);
        // 柱础
        const capBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 2.0), matColumn);
        capBase.position.set(cx, baseH, 18.2);
        bGroup.add(capBase);
        // 柱帽
        const cap = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 1.8), matColumn);
        cap.position.set(cx, baseH + mainH * 0.7, 18.2);
        bGroup.add(cap);
    });
    // 廊柱顶横梁
    const entab = new THREE.Mesh(new THREE.BoxGeometry(50, 1.2, 2.5), matMarble);
    entab.position.set(0, baseH + mainH * 0.7 + 0.6, 18.2);
    bGroup.add(entab);

    // === 正面大窗 (多层) ===
    for (let f = 0; f < 3; f++) {
        [-18, 0, 18].forEach(wx => {
            const wFrame = new THREE.Mesh(new THREE.BoxGeometry(10, 5.5, 0.3), matGold);
            wFrame.position.set(wx, baseH + 4 + f * 7, 18.1);
            bGroup.add(wFrame);
            const glass = new THREE.Mesh(new THREE.PlaneGeometry(9.2, 4.8), matGlass);
            glass.position.set(wx, baseH + 4 + f * 7, 18.2);
            bGroup.add(glass);
        });
    }

    // === 两侧阅览室凸窗 ===
    [-1, 1].forEach(sx => {
        const bay = new THREE.Mesh(new THREE.BoxGeometry(8, mainH * 0.6, 4), matWing);
        bay.position.set(sx * 35, baseH + mainH * 0.3, sx * 2);
        bGroup.add(bay);
        // 凸窗玻璃
        for (let wf = 0; wf < 3; wf++) {
            const bwg = new THREE.Mesh(new THREE.PlaneGeometry(6, 3.5), matGlass);
            bwg.rotation.y = sx * -Math.PI / 2;
            bwg.position.set(sx * (35 + 4.05), baseH + 3.5 + wf * 5, sx * 2);
            bGroup.add(bwg);
        }
    });

    // === 中央玻璃穹顶 ===
    const domeGeo = new THREE.SphereGeometry(15, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2);
    const dome = new THREE.Mesh(domeGeo, matGlass);
    dome.position.set(0, baseH + mainH, 0);
    bGroup.add(dome);
    // 穹顶底圆圈 (金色)
    const domeRing = new THREE.Mesh(new THREE.TorusGeometry(15, 0.4, 8, 48), matGold);
    domeRing.position.set(0, baseH + mainH, 0);
    bGroup.add(domeRing);
    // 穹顶竖肋 (8根)
    for (let ri = 0; ri < 8; ri++) {
        const angle = (ri / 8) * Math.PI * 2;
        const ribGeo = new THREE.TorusGeometry(15, 0.15, 4, 32, Math.PI / 2);
        const rib = new THREE.Mesh(ribGeo, matGold);
        rib.position.set(0, baseH + mainH, 0);
        rib.rotation.y = angle;
        bGroup.add(rib);
    }
    // 穹顶顶灯塔
    const lantern = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 3, 12), matColumn);
    lantern.position.set(0, baseH + mainH + 15.2, 0);
    bGroup.add(lantern);

    // === 牌匾 (Canvas贴图) ===
    const plaqueCanvas = document.createElement('canvas');
    plaqueCanvas.width = 512; plaqueCanvas.height = 128;
    const pCtx = plaqueCanvas.getContext('2d');
    pCtx.fillStyle = '#7c1d1d'; pCtx.fillRect(0, 0, 512, 128);
    pCtx.strokeStyle = '#f59e0b'; pCtx.lineWidth = 6; pCtx.strokeRect(5, 5, 502, 118);
    pCtx.fillStyle = '#ffffff'; pCtx.font = 'bold 44px serif';
    pCtx.textAlign = 'center'; pCtx.textBaseline = 'middle';
    pCtx.fillText('逸夫图书资讯中心', 256, 64);
    const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
    const plaque = new THREE.Mesh(new THREE.PlaneGeometry(18, 4), new THREE.MeshBasicMaterial({ map: plaqueTex }));
    plaque.position.set(0, baseH + mainH - 3, 18.2);
    bGroup.add(plaque);

    // === 屋顶平台设施 ===
    const rooftop = new THREE.Mesh(new THREE.BoxGeometry(62, 1.0, 36), matRooftop);
    rooftop.position.set(0, baseH + mainH + 0.5, 0);
    bGroup.add(rooftop);

    group.add(bGroup);
}
