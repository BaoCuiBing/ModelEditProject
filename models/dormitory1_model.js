// 模型名称：北宿舍楼1号精细模型 (标准板楼风 · 6层)
function buildDormitory1Model(THREE, group) {
    const C_WALL   = 0xf0f4f8;
    const C_BRICK  = 0xc0392b;
    const C_GLASS  = 0x90caf9;
    const C_FRAME  = 0x5d4037;
    const C_ROOF   = 0x37474f;
    const C_STEP   = 0xbdbdbd;
    const C_SOLAR  = 0x1565c0;
    const C_RAILING= 0x90a4ae;

    const bGroup = new THREE.Group();
    bGroup.name = "🏢 北宿舍1号楼精细模型";
    bGroup.position.set(-192.97, 0.30, -399.74);
    bGroup.scale.set(1.82, 1.00, 2.90);

    const matWall    = new THREE.MeshStandardMaterial({ color: C_WALL,    roughness: 0.6 });
    const matBrick   = new THREE.MeshStandardMaterial({ color: C_BRICK,   roughness: 0.7 });
    const matGlass   = new THREE.MeshPhysicalMaterial({ color: C_GLASS,   transparent: true, opacity: 0.75, roughness: 0.1, metalness: 0.3 });
    const matFrame   = new THREE.MeshStandardMaterial({ color: C_FRAME,   roughness: 0.8 });
    const matRoof    = new THREE.MeshStandardMaterial({ color: C_ROOF,    roughness: 0.9 });
    const matStep    = new THREE.MeshStandardMaterial({ color: C_STEP,    roughness: 0.5 });
    const matSolar   = new THREE.MeshStandardMaterial({ color: C_SOLAR,   metalness: 0.5, roughness: 0.3 });
    const matRailing = new THREE.MeshStandardMaterial({ color: C_RAILING, metalness: 0.6, roughness: 0.4 });

    const FLOORS = 6;
    const FLOOR_H = 3.6;
    const BLDG_W = 48;
    const BLDG_D = 14;
    const TOTAL_H = FLOORS * FLOOR_H;

    // --- 主楼体 ---
    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W, TOTAL_H, BLDG_D), matWall);
    bodyMesh.position.set(0, TOTAL_H / 2, 0);
    bodyMesh.castShadow = true; bodyMesh.receiveShadow = true;
    bGroup.add(bodyMesh);

    // --- 砖红色腰线 (每2层一道) ---
    [2, 4].forEach(fl => {
        const belt = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 0.4, 0.4, BLDG_D + 0.4), matBrick);
        belt.position.set(0, fl * FLOOR_H, 0);
        bGroup.add(belt);
    });

    // --- 逐层阳台 + 窗户 ---
    const WIN_COLS = [-18, -9, 0, 9, 18];
    for (let f = 0; f < FLOORS; f++) {
        const yBase = f * FLOOR_H + 0.5;
        WIN_COLS.forEach(wx => {
            // 窗框
            const winFrame = new THREE.Mesh(new THREE.BoxGeometry(4.6, 2.8, 0.3), matFrame);
            winFrame.position.set(wx, yBase + 1.6, BLDG_D / 2 + 0.15);
            bGroup.add(winFrame);
            // 玻璃
            const glass = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.2), matGlass);
            glass.position.set(wx, yBase + 1.6, BLDG_D / 2 + 0.32);
            bGroup.add(glass);
            // 阳台板
            if (f > 0) {
                const balSlab = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.15, 1.6), matStep);
                balSlab.position.set(wx, yBase - 0.08, BLDG_D / 2 + 0.8);
                bGroup.add(balSlab);
                // 阳台栏杆
                for (let rx = -2; rx <= 2; rx += 2) {
                    const post = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.9, 0.1), matRailing);
                    post.position.set(wx + rx, yBase + 0.45, BLDG_D / 2 + 1.55);
                    bGroup.add(post);
                }
                const rail = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.08, 0.08), matRailing);
                rail.position.set(wx, yBase + 0.9, BLDG_D / 2 + 1.55);
                bGroup.add(rail);
            }
        });
    }

    // --- 入口门廊 ---
    const porchBase = new THREE.Mesh(new THREE.BoxGeometry(10, 0.3, 3), matStep);
    porchBase.position.set(0, 0.15, BLDG_D / 2 + 1.5);
    bGroup.add(porchBase);
    // 门廊立柱
    [-3.5, 3.5].forEach(cx => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 4, 8), matStep);
        col.position.set(cx, 2.0, BLDG_D / 2 + 1.5);
        bGroup.add(col);
    });
    // 门廊顶板
    const porchRoof = new THREE.Mesh(new THREE.BoxGeometry(10, 0.25, 3.5), matBrick);
    porchRoof.position.set(0, 4.1, BLDG_D / 2 + 1.75);
    bGroup.add(porchRoof);
    // 入口大门
    const door = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.2), matGlass);
    door.position.set(0, 1.6, BLDG_D / 2 + 0.05);
    bGroup.add(door);

    // --- 台阶 ---
    [0, 1, 2].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(12 - i * 1.5, 0.22, 0.5), matStep);
        step.position.set(0, i * 0.22, BLDG_D / 2 + 2.5 - i * 0.5);
        bGroup.add(step);
    });

    // --- 女儿墙 ---
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 1, 1.2, BLDG_D + 1), matRoof);
    parapet.position.set(0, TOTAL_H + 0.6, 0);
    bGroup.add(parapet);

    // --- 屋顶太阳能板阵列 ---
    for (let si = -2; si <= 2; si++) {
        const solar = new THREE.Mesh(new THREE.BoxGeometry(8, 0.08, 3.5), matSolar);
        solar.rotation.x = -Math.PI / 8;
        solar.position.set(si * 10, TOTAL_H + 1.5, -2);
        bGroup.add(solar);
    }

    // --- 背面(北侧)窗户 ---
    for (let f = 0; f < FLOORS; f++) {
        const yBase = f * FLOOR_H + 0.5;
        WIN_COLS.forEach(wx => {
            const glass2 = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 2.2), matGlass);
            glass2.rotation.y = Math.PI;
            glass2.position.set(wx, yBase + 1.6, -(BLDG_D / 2 + 0.05));
            bGroup.add(glass2);
        });
    }

    // --- 侧面楼梯间凸出 ---
    [-1, 1].forEach(sx => {
        const stairBox = new THREE.Mesh(new THREE.BoxGeometry(3.5, TOTAL_H, 4), matBrick);
        stairBox.position.set(sx * (BLDG_W / 2 + 1.75), TOTAL_H / 2, 0);
        stairBox.castShadow = true;
        bGroup.add(stairBox);
        // 楼梯间窗
        for (let f = 0; f < FLOORS; f++) {
            const sw = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.0), matGlass);
            sw.position.set(sx * (BLDG_W / 2 + 3.5 + 0.05), f * FLOOR_H + 2, sx > 0 ? 0 : 0);
            sw.rotation.y = sx > 0 ? 0 : Math.PI;
            bGroup.add(sw);
        }
    });

    group.add(bGroup);
}
