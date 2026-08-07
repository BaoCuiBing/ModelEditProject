// 模型名称：综合教学楼C纵楼精细模型 (竖向高层·玻璃电梯)
function buildTeachingBuildingCZongModel(THREE, group) {
    const C_WALL   = 0xeceff1;
    const C_GLASS  = 0x29b6f6;
    const C_FRAME  = 0x546e7a;
    const C_BASE   = 0xb0bec5;
    const C_TRIM   = 0x0288d1;
    const C_ROOF   = 0x37474f;
    const C_STAIR  = 0x607d8b;
    const C_LOBBY  = 0x80deea;

    const bGroup = new THREE.Group();
    bGroup.name = "🏫 综合教学大楼C（纵楼）";
    bGroup.position.set(183.55, 0.30, 351.69);
    bGroup.scale.set(2.67, 1.00, 1.19);

    const matWall  = new THREE.MeshStandardMaterial({ color: C_WALL,  roughness: 0.5 });
    const matGlass = new THREE.MeshPhysicalMaterial({ color: C_GLASS, transparent: true, opacity: 0.72, roughness: 0.07 });
    const matFrame = new THREE.MeshStandardMaterial({ color: C_FRAME, metalness: 0.5, roughness: 0.35 });
    const matBase  = new THREE.MeshStandardMaterial({ color: C_BASE,  roughness: 0.6 });
    const matTrim  = new THREE.MeshStandardMaterial({ color: C_TRIM,  metalness: 0.4, roughness: 0.4 });
    const matRoof  = new THREE.MeshStandardMaterial({ color: C_ROOF,  roughness: 0.65 });
    const matStair = new THREE.MeshStandardMaterial({ color: C_STAIR, metalness: 0.7, roughness: 0.3 });
    const matLobby = new THREE.MeshPhysicalMaterial({ color: C_LOBBY, transparent: true, opacity: 0.6, roughness: 0.05 });

    const FLOORS = 8;
    const FLOOR_H = 3.6;
    const BLDG_W = 24;
    const BLDG_H = FLOORS * FLOOR_H;
    const BLDG_D = 64;

    // === 基座 ===
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 3, 1.5, BLDG_D + 2), matBase);
    plinth.position.set(0, 0.75, 0);
    plinth.castShadow = true; plinth.receiveShadow = true;
    bGroup.add(plinth);

    // === 主楼体 ===
    const body = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W, BLDG_H, BLDG_D), matWall);
    body.position.set(0, BLDG_H / 2 + 1.5, 0);
    body.castShadow = true; body.receiveShadow = true;
    bGroup.add(body);

    // === 纵向窗列 (正面南侧) ===
    const WIN_DEPTHS = [-24, -16, -8, 0, 8, 16, 24];
    for (let f = 0; f < FLOORS; f++) {
        const yW = 1.5 + f * FLOOR_H + 0.8;
        WIN_DEPTHS.forEach(wz => {
            // 窗框
            const wFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.8, 5.5), matFrame);
            wFrame.position.set(BLDG_W / 2 + 0.15, yW + 1.4, wz);
            bGroup.add(wFrame);
            // 玻璃
            const gl = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.2), matGlass);
            gl.rotation.y = Math.PI / 2;
            gl.position.set(BLDG_W / 2 + 0.3, yW + 1.4, wz);
            bGroup.add(gl);
        });
    }

    // === 纵向窗列 (背面北侧) ===
    for (let f = 0; f < FLOORS; f++) {
        const yW = 1.5 + f * FLOOR_H + 0.8;
        WIN_DEPTHS.forEach(wz => {
            const gl = new THREE.Mesh(new THREE.PlaneGeometry(5.0, 2.2), matGlass);
            gl.rotation.y = -Math.PI / 2;
            gl.position.set(-(BLDG_W / 2 + 0.3), yW + 1.4, wz);
            bGroup.add(gl);
        });
    }

    // === 端头横向窗 ===
    for (let f = 0; f < FLOORS; f++) {
        const yW = 1.5 + f * FLOOR_H + 0.8;
        [-8, 0, 8].forEach(wx => {
            // 南端
            const gl1 = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.2), matGlass);
            gl1.position.set(wx, yW + 1.4, BLDG_D / 2 + 0.05);
            bGroup.add(gl1);
            // 北端
            const gl2 = gl1.clone();
            gl2.rotation.y = Math.PI;
            gl2.position.set(wx, yW + 1.4, -(BLDG_D / 2 + 0.05));
            bGroup.add(gl2);
        });
    }

    // === 玻璃外挂电梯间 (主侧) ===
    const ELEV_W = 5;
    const ELEV_H = BLDG_H + 4;
    const ELEV_D = 7;
    const elevBox = new THREE.Mesh(new THREE.BoxGeometry(ELEV_W, ELEV_H, ELEV_D), matGlass);
    elevBox.position.set(BLDG_W / 2 + ELEV_W / 2, ELEV_H / 2 + 1.5, 15);
    elevBox.castShadow = true;
    bGroup.add(elevBox);
    // 电梯钢框
    const elevFrame = new THREE.Mesh(new THREE.BoxGeometry(ELEV_W + 0.4, ELEV_H + 0.2, ELEV_D + 0.4), matStair);
    elevFrame.position.set(BLDG_W / 2 + ELEV_W / 2, ELEV_H / 2 + 1.5, 15);
    // 用线框替代
    for (let ef = 0; ef <= FLOORS + 1; ef++) {
        const eBar = new THREE.Mesh(new THREE.BoxGeometry(ELEV_W + 0.5, 0.2, ELEV_D + 0.5), matStair);
        eBar.position.set(BLDG_W / 2 + ELEV_W / 2, 1.5 + ef * FLOOR_H, 15);
        bGroup.add(eBar);
    }
    // 电梯顶机房
    const elevPent = new THREE.Mesh(new THREE.BoxGeometry(ELEV_W + 0.5, 3, ELEV_D + 0.5), matFrame);
    elevPent.position.set(BLDG_W / 2 + ELEV_W / 2, ELEV_H + 3.0, 15);
    bGroup.add(elevPent);

    // === 底层门厅 (南端) ===
    const lobby = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W, 5.5, 5), matLobby);
    lobby.position.set(0, 4.25, BLDG_D / 2 + 2.5);
    bGroup.add(lobby);
    // 门厅顶棚
    const lobbyRoof = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 1, 0.4, 6), matTrim);
    lobbyRoof.position.set(0, 5.7, BLDG_D / 2 + 2.5);
    bGroup.add(lobbyRoof);
    // 门厅立柱
    [-9, 0, 9].forEach(lpx => {
        const lp = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 5.5, 8), matBase);
        lp.position.set(lpx, 4.25, BLDG_D / 2 + 4.5);
        bGroup.add(lp);
    });

    // === 蓝色水平装饰腰线 ===
    [2, 4, 6].forEach(fl => {
        const trimLine = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 0.5, 0.35, BLDG_D + 0.5), matTrim);
        trimLine.position.set(0, 1.5 + fl * FLOOR_H, 0);
        bGroup.add(trimLine);
    });

    // === 屋顶女儿墙 + 机房 ===
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 1, 1.3, BLDG_D + 1), matRoof);
    parapet.position.set(0, BLDG_H + 1.5 + 0.65, 0);
    bGroup.add(parapet);
    const penthouse = new THREE.Mesh(new THREE.BoxGeometry(12, 4, 14), matStair);
    penthouse.position.set(-4, BLDG_H + 1.5 + 1.3 + 2, -10);
    bGroup.add(penthouse);
    // 屋顶冷却塔
    const cooler = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.8, 4, 12), matBase);
    cooler.position.set(7, BLDG_H + 1.5 + 1.3 + 2, 10);
    bGroup.add(cooler);

    // === 台阶 ===
    [0, 1, 2].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W - i * 2, 0.3, 0.8), matBase);
        step.position.set(0, i * 0.3, BLDG_D / 2 + 5.5 - i * 0.8);
        bGroup.add(step);
    });

    group.add(bGroup);
}
