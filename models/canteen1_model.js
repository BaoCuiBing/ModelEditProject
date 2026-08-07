// 模型名称：第一风味餐饮中心精细模型 (百叶雨棚·采光中庭风)
function buildCanteen1Model(THREE, group) {
    const C_WALL    = 0xfdf6e3;
    const C_WOOD    = 0x6d4c28;
    const C_GLASS   = 0x29b6f6;
    const C_SLAT    = 0x8d5e2a;
    const C_BASE    = 0xccc0a8;
    const C_ACCENT  = 0xe8a030;
    const C_PIPE    = 0x607d8b;
    const C_CANOPY  = 0x795548;

    const bGroup = new THREE.Group();
    bGroup.name = "🍜 第一风味餐饮中心";
    bGroup.position.set(-189.69, 0.30, 102.98);
    bGroup.scale.set(1.57, 1.00, 4.22);

    const matWall   = new THREE.MeshStandardMaterial({ color: C_WALL,   roughness: 0.6 });
    const matWood   = new THREE.MeshStandardMaterial({ color: C_WOOD,   roughness: 0.85 });
    const matGlass  = new THREE.MeshPhysicalMaterial({ color: C_GLASS,  transparent: true, opacity: 0.68, roughness: 0.08 });
    const matSlat   = new THREE.MeshStandardMaterial({ color: C_SLAT,   roughness: 0.75 });
    const matBase   = new THREE.MeshStandardMaterial({ color: C_BASE,   roughness: 0.6 });
    const matAccent = new THREE.MeshStandardMaterial({ color: C_ACCENT, metalness: 0.3, roughness: 0.5 });
    const matPipe   = new THREE.MeshStandardMaterial({ color: C_PIPE,   metalness: 0.8, roughness: 0.3 });
    const matCanopy = new THREE.MeshStandardMaterial({ color: C_CANOPY, roughness: 0.7 });

    const BLDG_W = 52;
    const BLDG_H = 15;
    const BLDG_D = 22;

    // === 台基 ===
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 4, 0.6, BLDG_D + 4), matBase);
    plinth.position.set(0, 0.3, 0);
    bGroup.add(plinth);

    // === 主楼体 ===
    const body = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W, BLDG_H, BLDG_D), matWall);
    body.position.set(0, BLDG_H / 2 + 0.6, 0);
    body.castShadow = true; body.receiveShadow = true;
    bGroup.add(body);

    // === 正面落地观景玻璃窗 (大面) ===
    const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W - 6, BLDG_H - 3, 0.5), matGlass);
    frontGlass.position.set(0, BLDG_H / 2 + 0.6 - 1, BLDG_D / 2 + 0.25);
    bGroup.add(frontGlass);
    // 竖向窗框
    for (let cx = -BLDG_W / 2 + 6; cx <= BLDG_W / 2 - 6 + 1; cx += 8) {
        const vFrame = new THREE.Mesh(new THREE.BoxGeometry(0.5, BLDG_H - 3, 0.6), matWood);
        vFrame.position.set(cx, BLDG_H / 2 + 0.6 - 1, BLDG_D / 2 + 0.3);
        bGroup.add(vFrame);
    }
    // 横向窗框 (两层)
    [5, 10].forEach(hy => {
        const hFrame = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W - 6, 0.4, 0.6), matWood);
        hFrame.position.set(0, hy + 0.6, BLDG_D / 2 + 0.3);
        bGroup.add(hFrame);
    });

    // === 背面小窗 ===
    [-18, -9, 0, 9, 18].forEach(wx => {
        for (let fh = 4; fh < BLDG_H; fh += 5) {
            const bw = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.0), matGlass);
            bw.rotation.y = Math.PI;
            bw.position.set(wx, fh + 0.6, -(BLDG_D / 2 + 0.05));
            bGroup.add(bw);
        }
    });

    // === 木质百叶雨棚 (悬挑出挑 · 多条叶片) ===
    const AWNING_W = BLDG_W + 8;
    const AWNING_D = 5.0;
    // 主雨棚支撑梁
    const awningBeam = new THREE.Mesh(new THREE.BoxGeometry(AWNING_W, 0.4, 0.4), matWood);
    awningBeam.position.set(0, BLDG_H + 0.6 + 0.2, BLDG_D / 2 + AWNING_D / 2);
    bGroup.add(awningBeam);
    // 百叶条 (每0.6m一条)
    const SLAT_COUNT = Math.floor(AWNING_D / 0.55);
    for (let si = 0; si < SLAT_COUNT; si++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(AWNING_W, 0.15, 0.4), matSlat);
        slat.rotation.x = -0.18;
        slat.position.set(0, BLDG_H + 0.6 - si * 0.28, BLDG_D / 2 + si * 0.55);
        bGroup.add(slat);
    }
    // 主雨棚龙骨 (横向)
    const topSlab = new THREE.Mesh(new THREE.BoxGeometry(AWNING_W + 0.5, 0.3, AWNING_D), matWood);
    topSlab.position.set(0, BLDG_H + 0.6 + 0.3, BLDG_D / 2 + AWNING_D / 2);
    bGroup.add(topSlab);
    // 雨棚斜撑杆
    [-20, -10, 0, 10, 20].forEach(sx => {
        const brace = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, AWNING_D), matWood);
        brace.position.set(sx, BLDG_H + 0.6 + 0.1, BLDG_D / 2 + AWNING_D / 2);
        bGroup.add(brace);
    });

    // === 侧边外廊休憩区 ===
    const terrace = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 5, 0.2, 4), matBase);
    terrace.position.set(0, 0.7, BLDG_D / 2 + 2.5);
    bGroup.add(terrace);
    // 休憩区护栏柱
    for (let rx = -BLDG_W / 2; rx <= BLDG_W / 2; rx += 5) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.0, 0.15), matPipe);
        post.position.set(rx, 1.2, BLDG_D / 2 + 4.3);
        bGroup.add(post);
    }
    const railBar = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 5, 0.08, 0.08), matPipe);
    railBar.position.set(0, 1.7, BLDG_D / 2 + 4.3);
    bGroup.add(railBar);

    // === 入口遮阳篷 ===
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 5), matCanopy);
    canopy.position.set(0, BLDG_H + 0.6 + 0.15, BLDG_D / 2 + 5.5);
    bGroup.add(canopy);
    [-6, 6].forEach(px => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, BLDG_H, 6), matPipe);
        post.position.set(px, BLDG_H / 2 + 0.6, BLDG_D / 2 + 5.5);
        bGroup.add(post);
    });

    // === 侧边排烟塔 ===
    [-1, 1].forEach(sx => {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.7, BLDG_H + 4, 8), matPipe);
        pipe.position.set(sx * (BLDG_W / 2 + 1.5), (BLDG_H + 4) / 2 + 0.6, -6);
        bGroup.add(pipe);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.7, 0.5, 8), matPipe);
        cap.position.set(sx * (BLDG_W / 2 + 1.5), BLDG_H + 4.85, -6);
        bGroup.add(cap);
    });

    // === 橙色腰线 ===
    [5, 10].forEach(hy => {
        const belt = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 0.5, 0.35, BLDG_D + 0.5), matAccent);
        belt.position.set(0, hy + 0.6, 0);
        bGroup.add(belt);
    });

    // === 屋顶 ===
    const roofTop = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 1, 0.5, BLDG_D + 1), matBase);
    roofTop.position.set(0, BLDG_H + 0.6 + 0.25, 0);
    bGroup.add(roofTop);

    // === 台阶 ===
    [0, 1, 2].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(18 - i * 2, 0.25, 0.7), matBase);
        step.position.set(0, 0.6 + i * 0.25, BLDG_D / 2 + 3 - i * 0.7);
        bGroup.add(step);
    });

    group.add(bGroup);
}
