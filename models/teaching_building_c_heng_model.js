// 模型名称：综合教学楼C横楼精细模型 (长条板楼·多层水平窗带)
function buildTeachingBuildingCHengModel(THREE, group) {
    const C_WALL   = 0xf0f4f8;
    const C_BRICK  = 0x8b2e1e;
    const C_GLASS  = 0x90caf9;
    const C_FRAME  = 0x5d4037;
    const C_BASE   = 0xbdbdbd;
    const C_TRIM   = 0xef5350;
    const C_ROOF   = 0x455a64;
    const C_STAIR  = 0x78909c;

    const bGroup = new THREE.Group();
    bGroup.name = "🏫 综合教学大楼C（横楼）";
    bGroup.position.set(185.79, 0.30, 433.56);
    bGroup.scale.set(1.39, 1.00, 1.94);

    const matWall  = new THREE.MeshStandardMaterial({ color: C_WALL,  roughness: 0.5 });
    const matBrick = new THREE.MeshStandardMaterial({ color: C_BRICK, roughness: 0.72 });
    const matGlass = new THREE.MeshPhysicalMaterial({ color: C_GLASS, transparent: true, opacity: 0.7, roughness: 0.08 });
    const matFrame = new THREE.MeshStandardMaterial({ color: C_FRAME, roughness: 0.75 });
    const matBase  = new THREE.MeshStandardMaterial({ color: C_BASE,  roughness: 0.6 });
    const matTrim  = new THREE.MeshStandardMaterial({ color: C_TRIM,  roughness: 0.5 });
    const matRoof  = new THREE.MeshStandardMaterial({ color: C_ROOF,  roughness: 0.6 });
    const matStair = new THREE.MeshStandardMaterial({ color: C_STAIR, metalness: 0.6, roughness: 0.3 });

    const FLOORS = 6;
    const FLOOR_H = 3.5;
    const BLDG_W = 68;
    const BLDG_H = FLOORS * FLOOR_H;
    const BLDG_D = 24;

    // === 砖红基座 ===
    const base = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 3, 2.5, BLDG_D + 2), matBrick);
    base.position.set(0, 1.25, 0);
    base.castShadow = true; base.receiveShadow = true;
    bGroup.add(base);

    // === 主楼体 ===
    const body = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W, BLDG_H, BLDG_D), matWall);
    body.position.set(0, BLDG_H / 2 + 2.5, 0);
    body.castShadow = true; body.receiveShadow = true;
    bGroup.add(body);

    // === 多层水平窗带 (每层) ===
    const WIN_COLS = [];
    for (let wx = -30; wx <= 30; wx += 7.5) WIN_COLS.push(wx);
    for (let f = 0; f < FLOORS; f++) {
        const yW = 2.5 + f * FLOOR_H + 1.0;
        WIN_COLS.forEach(wx => {
            // 窗框
            const wf = new THREE.Mesh(new THREE.BoxGeometry(5.5, 2.6, 0.3), matFrame);
            wf.position.set(wx, yW + 1.2, BLDG_D / 2 + 0.15);
            bGroup.add(wf);
            // 玻璃
            const gl = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.0), matGlass);
            gl.position.set(wx, yW + 1.2, BLDG_D / 2 + 0.32);
            bGroup.add(gl);
        });
        // 水平窗带连接线
        const hBand = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W - 4, 0.22, 0.3), matTrim);
        hBand.position.set(0, yW + 2.35, BLDG_D / 2 + 0.15);
        bGroup.add(hBand);
    }

    // === 背面窗户 ===
    for (let f = 0; f < FLOORS; f++) {
        const yW = 2.5 + f * FLOOR_H + 1.0;
        WIN_COLS.forEach(wx => {
            const gl = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 2.0), matGlass);
            gl.rotation.y = Math.PI;
            gl.position.set(wx, yW + 1.2, -(BLDG_D / 2 + 0.05));
            bGroup.add(gl);
        });
    }

    // === 侧面楼梯间凸出体 ===
    [-1, 1].forEach(sx => {
        const stairBox = new THREE.Mesh(new THREE.BoxGeometry(5, BLDG_H + 2.5, 6), matStair);
        stairBox.position.set(sx * (BLDG_W / 2 + 2.5), BLDG_H / 2 + 2.5 + 1.25, -BLDG_D / 4);
        stairBox.castShadow = true;
        bGroup.add(stairBox);
        // 楼梯间竖条窗
        for (let f = 0; f < FLOORS; f++) {
            const sw = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.5), matGlass);
            sw.rotation.y = sx * Math.PI / 2;
            sw.position.set(sx * (BLDG_W / 2 + 5.05), 2.5 + f * FLOOR_H + 2.0, -BLDG_D / 4);
            bGroup.add(sw);
        }
    });

    // === 中央入口门厅 ===
    const lobby = new THREE.Mesh(new THREE.BoxGeometry(14, BLDG_H * 0.5, 5), matWall);
    lobby.position.set(0, BLDG_H * 0.5 / 2 + 2.5, BLDG_D / 2 + 2.5);
    bGroup.add(lobby);
    // 门厅玻璃
    const lobbyGlass = new THREE.Mesh(new THREE.BoxGeometry(12, BLDG_H * 0.5 - 1, 5.1), matGlass);
    lobbyGlass.position.set(0, BLDG_H * 0.5 / 2 + 2.5, BLDG_D / 2 + 2.5);
    bGroup.add(lobbyGlass);
    // 门厅遮阳板
    const lobbyTop = new THREE.Mesh(new THREE.BoxGeometry(15, 0.4, 6), matBrick);
    lobbyTop.position.set(0, BLDG_H * 0.5 + 2.7, BLDG_D / 2 + 2.5);
    bGroup.add(lobbyTop);

    // === 红色腰线装饰 ===
    [2, 4].forEach(fl => {
        const trimLine = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 0.5, 0.4, BLDG_D + 0.5), matTrim);
        trimLine.position.set(0, 2.5 + fl * FLOOR_H, 0);
        bGroup.add(trimLine);
    });

    // === 屋顶女儿墙 + 设施间 ===
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 1, 1.2, BLDG_D + 1), matRoof);
    parapet.position.set(0, BLDG_H + 2.5 + 0.6, 0);
    bGroup.add(parapet);
    // 屋顶设施间
    const penthouse = new THREE.Mesh(new THREE.BoxGeometry(20, 4, 10), matStair);
    penthouse.position.set(15, BLDG_H + 2.5 + 1.2 + 2, 0);
    bGroup.add(penthouse);

    // === 台阶 ===
    [0, 1, 2].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(16 - i * 2, 0.3, 0.8), matBase);
        step.position.set(0, i * 0.3, BLDG_D / 2 + 5.5 - i * 0.8);
        bGroup.add(step);
    });

    group.add(bGroup);
}
