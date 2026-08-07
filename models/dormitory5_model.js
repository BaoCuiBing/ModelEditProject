// 模型名称：北宿舍楼5号精细模型 (U型庭院风 · 6层)
function buildDormitory5Model(THREE, group) {
    const C_WALL   = 0xfdf6e3;
    const C_ACCENT = 0xc47d0e;
    const C_GLASS  = 0x81d4fa;
    const C_BASE   = 0xbdbdbd;
    const C_TRIM   = 0xe6b85a;
    const C_RAIL   = 0xa0907a;

    const bGroup = new THREE.Group();
    bGroup.name = "🏢 北宿舍5号楼精细模型";
    bGroup.position.set(-192.02, 0.30, -166.35);
    bGroup.scale.set(1.81, 1.00, 3.03);

    const matWall   = new THREE.MeshStandardMaterial({ color: C_WALL,   roughness: 0.55 });
    const matAccent = new THREE.MeshStandardMaterial({ color: C_ACCENT, metalness: 0.3, roughness: 0.5 });
    const matGlass  = new THREE.MeshPhysicalMaterial({ color: C_GLASS,  transparent: true, opacity: 0.72, roughness: 0.1 });
    const matBase   = new THREE.MeshStandardMaterial({ color: C_BASE,   roughness: 0.6 });
    const matTrim   = new THREE.MeshStandardMaterial({ color: C_TRIM,   metalness: 0.4, roughness: 0.4 });
    const matRail   = new THREE.MeshStandardMaterial({ color: C_RAIL,   metalness: 0.5 });

    const FLOORS = 6;
    const FLOOR_H = 3.5;
    const TOTAL_H = FLOORS * FLOOR_H;

    // === U型主楼三段 ===
    // 背翼 (北段横楼)
    const backWing = new THREE.Mesh(new THREE.BoxGeometry(48, TOTAL_H, 10), matWall);
    backWing.position.set(0, TOTAL_H / 2, -12);
    backWing.castShadow = true; backWing.receiveShadow = true;
    bGroup.add(backWing);

    // 左翼
    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(10, TOTAL_H, 22), matWall);
    leftWing.position.set(-19, TOTAL_H / 2, 1);
    leftWing.castShadow = true; leftWing.receiveShadow = true;
    bGroup.add(leftWing);

    // 右翼
    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(10, TOTAL_H, 22), matWall);
    rightWing.position.set(19, TOTAL_H / 2, 1);
    rightWing.castShadow = true; rightWing.receiveShadow = true;
    bGroup.add(rightWing);

    // === 香槟金多层腰线 ===
    [2, 4].forEach(fl => {
        const belt = new THREE.Mesh(new THREE.BoxGeometry(48.4, 0.45, 10.4), matTrim);
        belt.position.set(0, fl * FLOOR_H, -12);
        bGroup.add(belt);
        const beltL = new THREE.Mesh(new THREE.BoxGeometry(10.4, 0.45, 22.4), matTrim);
        beltL.position.set(-19, fl * FLOOR_H, 1);
        bGroup.add(beltL);
        const beltR = beltL.clone();
        beltR.position.x = 19;
        bGroup.add(beltR);
    });

    // === 逐层窗户 (背翼正面南侧) ===
    const BACK_WIN_COLS = [-18, -9, 0, 9, 18];
    for (let f = 0; f < FLOORS; f++) {
        const yW = f * FLOOR_H + 1.0;
        BACK_WIN_COLS.forEach(wx => {
            const winF = new THREE.Mesh(new THREE.BoxGeometry(5.0, 2.8, 0.25), matAccent);
            winF.position.set(wx, yW + 1.3, -7.0 + 0.13);
            bGroup.add(winF);
            const glass = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.2), matGlass);
            glass.position.set(wx, yW + 1.3, -7.0 + 0.3);
            bGroup.add(glass);
        });
    }

    // === 逐层窗户 (左右翼面向庭院) ===
    for (let f = 0; f < FLOORS; f++) {
        const yW = f * FLOOR_H + 1.0;
        [-6, 0, 6].forEach(wz => {
            // 左翼
            const gL = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.2), matGlass);
            gL.rotation.y = Math.PI / 2;
            gL.position.set(-14.0, yW + 1.3, wz);
            bGroup.add(gL);
            // 右翼
            const gR = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 2.2), matGlass);
            gR.rotation.y = -Math.PI / 2;
            gR.position.set(14.0, yW + 1.3, wz);
            bGroup.add(gR);
        });
    }

    // === 庭院内廊道 (底层架空) ===
    const courtyard = new THREE.Mesh(new THREE.BoxGeometry(38, 4.0, 1.0), matBase);
    courtyard.position.set(0, 2.0, -8.0);
    bGroup.add(courtyard);

    // === 入口玻璃大厅 (正面中央) ===
    const lobbyBase = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 4), matBase);
    lobbyBase.position.set(0, 0.15, 14);
    bGroup.add(lobbyBase);
    const lobby = new THREE.Mesh(new THREE.BoxGeometry(12, 5.5, 4), matGlass);
    lobby.position.set(0, 2.75, 14);
    bGroup.add(lobby);
    // 入口顶棚
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(14, 0.3, 5), matTrim);
    canopy.position.set(0, 5.5, 14.5);
    bGroup.add(canopy);

    // === 台阶 ===
    [0, 1, 2].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(16 - i, 0.25, 0.6), matBase);
        step.position.set(0, i * 0.25, 16.5 - i * 0.6);
        bGroup.add(step);
    });

    // === 屋顶女儿墙 + 装饰格栅 ===
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(48 + 1, 1.2, 10 + 1), matAccent);
    parapet.position.set(0, TOTAL_H + 0.6, -12);
    bGroup.add(parapet);
    const parapetL = new THREE.Mesh(new THREE.BoxGeometry(10 + 1, 1.2, 22 + 1), matAccent);
    parapetL.position.set(-19, TOTAL_H + 0.6, 1);
    bGroup.add(parapetL);
    const parapetR = parapetL.clone();
    parapetR.position.x = 19;
    bGroup.add(parapetR);

    group.add(bGroup);
}
