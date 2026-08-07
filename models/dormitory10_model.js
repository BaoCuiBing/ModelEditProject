// 模型名称：留学生公寓10号楼精细模型 (高层全景幕墙 · 12层)
function buildDormitory10Model(THREE, group) {
    const C_DARK    = 0x1a2332;
    const C_GLASS   = 0x29b6f6;
    const C_GOLD    = 0xf0a500;
    const C_STEEL   = 0x607d8b;
    const C_BASE    = 0x37474f;
    const C_PODIUM  = 0x263238;
    const C_ACCENT  = 0xff8f00;

    const bGroup = new THREE.Group();
    bGroup.name = "🏢 留学生公寓10号楼";
    bGroup.position.set(200.72, 0.30, -215.15);
    bGroup.scale.set(2.31, 1.00, 2.22);

    const matDark   = new THREE.MeshStandardMaterial({ color: C_DARK,   roughness: 0.3, metalness: 0.2 });
    const matGlass  = new THREE.MeshPhysicalMaterial({ color: C_GLASS,  transparent: true, opacity: 0.65, roughness: 0.05, metalness: 0.1 });
    const matGold   = new THREE.MeshStandardMaterial({ color: C_GOLD,   metalness: 0.85, roughness: 0.15 });
    const matSteel  = new THREE.MeshStandardMaterial({ color: C_STEEL,  metalness: 0.9, roughness: 0.2 });
    const matBase   = new THREE.MeshStandardMaterial({ color: C_BASE,   roughness: 0.5 });
    const matPodium = new THREE.MeshStandardMaterial({ color: C_PODIUM, roughness: 0.4 });
    const matAccent = new THREE.MeshStandardMaterial({ color: C_ACCENT, metalness: 0.7, roughness: 0.2 });

    const FLOORS = 12;
    const FLOOR_H = 3.2;
    const TOTAL_H = FLOORS * FLOOR_H;
    const PODIUM_H = 6.0;

    // === 底层裙楼 ===
    const podium = new THREE.Mesh(new THREE.BoxGeometry(45, PODIUM_H, 28), matPodium);
    podium.position.set(0, PODIUM_H / 2, 0);
    podium.castShadow = true; podium.receiveShadow = true;
    bGroup.add(podium);
    // 裙楼玻璃入口大厅
    const lobbyGlass = new THREE.Mesh(new THREE.BoxGeometry(20, PODIUM_H - 0.5, 29), matGlass);
    lobbyGlass.position.set(0, PODIUM_H / 2, 0);
    bGroup.add(lobbyGlass);
    // 裙楼顶部金色腰线
    const podiumBelt = new THREE.Mesh(new THREE.BoxGeometry(46, 0.5, 29), matGold);
    podiumBelt.position.set(0, PODIUM_H, 0);
    bGroup.add(podiumBelt);

    // === 主楼核心筒 (深色混凝土) ===
    const core = new THREE.Mesh(new THREE.BoxGeometry(42, TOTAL_H, 24), matDark);
    core.position.set(0, PODIUM_H + TOTAL_H / 2, 0);
    core.castShadow = true; core.receiveShadow = true;
    bGroup.add(core);

    // === 正面全景分格玻璃幕墙 ===
    const PANEL_W = 42 / 6;
    const PANEL_H = FLOOR_H * 0.88;
    for (let f = 0; f < FLOORS; f++) {
        for (let col = 0; col < 6; col++) {
            const px = -42 / 2 + PANEL_W * col + PANEL_W / 2;
            const py = PODIUM_H + f * FLOOR_H + FLOOR_H / 2;
            const glass = new THREE.Mesh(new THREE.BoxGeometry(PANEL_W - 0.3, PANEL_H, 0.15), matGlass);
            glass.position.set(px, py, 12.08);
            bGroup.add(glass);
        }
    }
    // 幕墙竖向钢框
    for (let col = 0; col <= 6; col++) {
        const px = -42 / 2 + PANEL_W * col;
        const steelV = new THREE.Mesh(new THREE.BoxGeometry(0.18, TOTAL_H, 0.2), matSteel);
        steelV.position.set(px, PODIUM_H + TOTAL_H / 2, 12.1);
        bGroup.add(steelV);
    }
    // 幕墙横向钢框
    for (let f = 0; f <= FLOORS; f++) {
        const steelH = new THREE.Mesh(new THREE.BoxGeometry(42.4, 0.18, 0.2), matSteel);
        steelH.position.set(0, PODIUM_H + f * FLOOR_H, 12.1);
        bGroup.add(steelH);
    }

    // === 背面小窗 ===
    for (let f = 0; f < FLOORS; f++) {
        [-12, -4, 4, 12].forEach(wx => {
            const bw = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.2), matGlass);
            bw.rotation.y = Math.PI;
            bw.position.set(wx, PODIUM_H + f * FLOOR_H + FLOOR_H / 2, -12.05);
            bGroup.add(bw);
        });
    }

    // === 侧面设备层 (中部) ===
    const equipFloor = Math.floor(FLOORS * 0.55);
    const equip = new THREE.Mesh(new THREE.BoxGeometry(43, 1.8, 25), matSteel);
    equip.position.set(0, PODIUM_H + equipFloor * FLOOR_H, 0);
    bGroup.add(equip);

    // === 顶部皇冠镂空框架 ===
    const crownBase = new THREE.Mesh(new THREE.BoxGeometry(44, 2.0, 25), matDark);
    crownBase.position.set(0, PODIUM_H + TOTAL_H + 1.0, 0);
    bGroup.add(crownBase);
    // 皇冠金色竖肋
    for (let ci = -3; ci <= 3; ci++) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.0, 0.4), matGold);
        rib.position.set(ci * 5.5, PODIUM_H + TOTAL_H + 3.5, 12.2);
        bGroup.add(rib);
    }
    // 皇冠顶横梁
    const crownTop = new THREE.Mesh(new THREE.BoxGeometry(44, 0.5, 25.5), matGold);
    crownTop.position.set(0, PODIUM_H + TOTAL_H + 6.0, 0);
    bGroup.add(crownTop);

    // === 楼顶天线 ===
    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 5, 6), matSteel);
    antenna.position.set(5, PODIUM_H + TOTAL_H + 9.0, 0);
    bGroup.add(antenna);

    // === 台阶 ===
    [0, 1, 2].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(24 - i * 2, 0.3, 0.6), matBase);
        step.position.set(0, i * 0.3, 14.5 - i * 0.6);
        bGroup.add(step);
    });

    // === 金色腰线 (每4层) ===
    [4, 8].forEach(fl => {
        const belt = new THREE.Mesh(new THREE.BoxGeometry(43.5, 0.35, 25.5), matAccent);
        belt.position.set(0, PODIUM_H + fl * FLOOR_H, 0);
        bGroup.add(belt);
    });

    group.add(bGroup);
}
