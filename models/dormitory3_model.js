// 模型名称：北宿舍楼3号精细模型 (双塔连廊风 · 7层)
function buildDormitory3Model(THREE, group) {
    const C_BRICK   = 0x8d3b2b;
    const C_WALL    = 0xeceff1;
    const C_GLASS   = 0x4fc3f7;
    const C_STEEL   = 0x78909c;
    const C_RAILING = 0xb0bec5;
    const C_BASE    = 0x9e9e9e;
    const C_FRAME   = 0x4e342e;

    const bGroup = new THREE.Group();
    bGroup.name = "🏢 北宿舍3号楼精细模型";
    bGroup.position.set(-191.46, 0.30, -285.00);
    bGroup.scale.set(1.76, 1.00, 2.72);

    const matBrick   = new THREE.MeshStandardMaterial({ color: C_BRICK,   roughness: 0.7 });
    const matWall    = new THREE.MeshStandardMaterial({ color: C_WALL,    roughness: 0.55 });
    const matGlass   = new THREE.MeshPhysicalMaterial({ color: C_GLASS,   transparent: true, opacity: 0.7, roughness: 0.1 });
    const matSteel   = new THREE.MeshStandardMaterial({ color: C_STEEL,   metalness: 0.8, roughness: 0.3 });
    const matRailing = new THREE.MeshStandardMaterial({ color: C_RAILING, metalness: 0.6 });
    const matBase    = new THREE.MeshStandardMaterial({ color: C_BASE,    roughness: 0.6 });
    const matFrame   = new THREE.MeshStandardMaterial({ color: C_FRAME,   roughness: 0.8 });

    const FLOORS = 7;
    const FLOOR_H = 3.4;
    const TOWER_W = 18;
    const TOWER_D = 20;
    const TOTAL_H = FLOORS * FLOOR_H;
    const TOWER_X = [-17, 17];

    // --- 底部架空柱廊平台 ---
    const baseSlab = new THREE.Mesh(new THREE.BoxGeometry(40, 0.5, TOWER_D + 2), matBase);
    baseSlab.position.set(0, 0.25, 0);
    bGroup.add(baseSlab);
    // 柱廊立柱
    for (let cx = -15; cx <= 15; cx += 7.5) {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 3.5, 8), matBase);
        pillar.position.set(cx, 1.75, 0);
        bGroup.add(pillar);
    }

    // --- 双塔主体 ---
    TOWER_X.forEach((tx, idx) => {
        // 塔楼主体
        const tower = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W, TOTAL_H, TOWER_D), matBrick);
        tower.position.set(tx, TOTAL_H / 2 + 3.5, 0);
        tower.castShadow = true; tower.receiveShadow = true;
        tower.name = `宿舍3号楼塔楼_${idx + 1}`;
        bGroup.add(tower);

        // 每层窗户
        const WIN_COLS = [-5, 0, 5];
        for (let f = 0; f < FLOORS; f++) {
            const yBase = f * FLOOR_H + 3.5 + 0.8;
            WIN_COLS.forEach(wx => {
                // 窗框
                const frame = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.6, 0.3), matFrame);
                frame.position.set(tx + wx, yBase + 1.2, TOWER_D / 2 + 0.15);
                bGroup.add(frame);
                // 玻璃
                const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.0), matGlass);
                glass.position.set(tx + wx, yBase + 1.2, TOWER_D / 2 + 0.32);
                bGroup.add(glass);
            });
            // 阳台板
            const balSlab = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W + 0.5, 0.15, 1.4), matBase);
            balSlab.position.set(tx, yBase - 0.08, TOWER_D / 2 + 0.7);
            bGroup.add(balSlab);
            // 阳台护栏
            const rail = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W + 0.5, 0.06, 0.06), matRailing);
            rail.position.set(tx, yBase + 0.8, TOWER_D / 2 + 1.35);
            bGroup.add(rail);
        }

        // 塔楼女儿墙
        const parapet = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W + 1, 1.0, TOWER_D + 1), matWall);
        parapet.position.set(tx, TOTAL_H + 3.5 + 0.5, 0);
        bGroup.add(parapet);
    });

    // --- 中央玻璃连廊 (高位 · 含钢骨结构) ---
    const BRIDGE_Y = TOTAL_H * 0.6 + 3.5;
    const BRIDGE_H = 5.5;
    // 连廊主体
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(16, BRIDGE_H, 10), matGlass);
    bridge.position.set(0, BRIDGE_Y, 0);
    bridge.castShadow = true;
    bGroup.add(bridge);
    // 钢骨上梁
    const topBeam = new THREE.Mesh(new THREE.BoxGeometry(16, 0.4, 10.5), matSteel);
    topBeam.position.set(0, BRIDGE_Y + BRIDGE_H / 2, 0);
    bGroup.add(topBeam);
    // 钢骨竖框
    [-6, 0, 6].forEach(bx => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.3, BRIDGE_H, 0.3), matSteel);
        post.position.set(bx, BRIDGE_Y, -4.5);
        bGroup.add(post);
        const post2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, BRIDGE_H, 0.3), matSteel);
        post2.position.set(bx, BRIDGE_Y, 4.5);
        bGroup.add(post2);
    });
    // 连廊护栏
    const bridgeRail = new THREE.Mesh(new THREE.BoxGeometry(16, 0.06, 0.06), matRailing);
    bridgeRail.position.set(0, BRIDGE_Y - BRIDGE_H / 2 + 1.0, 5.0);
    bGroup.add(bridgeRail);
    const bridgeRail2 = bridgeRail.clone();
    bridgeRail2.position.z = -5.0;
    bGroup.add(bridgeRail2);

    // --- 连廊下方低位连廊 (底部架空走廊) ---
    const lowBridge = new THREE.Mesh(new THREE.BoxGeometry(16, 3.2, TOWER_D), matWall);
    lowBridge.position.set(0, 5.1, 0);
    bGroup.add(lowBridge);

    group.add(bGroup);
}
