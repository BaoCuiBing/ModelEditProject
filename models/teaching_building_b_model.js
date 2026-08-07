// 模型名称：中央阶梯教学楼B精细模型 (坡度侧翼·蓝色幕墙)
function buildTeachingBuildingBModel(THREE, group) {
    const C_WALL   = 0xf0f4f8;
    const C_BLUE   = 0x1565c0;
    const C_GLASS  = 0x90caf9;
    const C_FRAME  = 0x1976d2;
    const C_BASE   = 0xbdbdbd;
    const C_STEEL  = 0x78909c;
    const C_ACCENT = 0x0d47a1;

    const bGroup = new THREE.Group();
    bGroup.name = "🏫 中央阶梯教学楼B";
    bGroup.position.set(0.15, 0.30, -422.23);
    bGroup.scale.set(1.57, 1.00, 1.69);

    const matWall   = new THREE.MeshStandardMaterial({ color: C_WALL,   roughness: 0.5 });
    const matBlue   = new THREE.MeshStandardMaterial({ color: C_BLUE,   metalness: 0.3, roughness: 0.35 });
    const matGlass  = new THREE.MeshPhysicalMaterial({ color: C_GLASS,  transparent: true, opacity: 0.72, roughness: 0.08 });
    const matFrame  = new THREE.MeshStandardMaterial({ color: C_FRAME,  metalness: 0.5, roughness: 0.3 });
    const matBase   = new THREE.MeshStandardMaterial({ color: C_BASE,   roughness: 0.6 });
    const matSteel  = new THREE.MeshStandardMaterial({ color: C_STEEL,  metalness: 0.8, roughness: 0.25 });
    const matAccent = new THREE.MeshStandardMaterial({ color: C_ACCENT, metalness: 0.4 });

    const FLOORS = 5;
    const FLOOR_H = 3.8;
    const MAIN_W = 48;
    const MAIN_H = FLOORS * FLOOR_H;
    const MAIN_D = 22;

    // === 台基 ===
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W + 5, 1.0, MAIN_D + 3), matBase);
    plinth.position.set(0, 0.5, 0);
    bGroup.add(plinth);

    // === 主教学楼体 ===
    const body = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W, MAIN_H, MAIN_D), matWall);
    body.position.set(0, MAIN_H / 2 + 1.0, 0);
    body.castShadow = true; body.receiveShadow = true;
    bGroup.add(body);

    // === 正面蓝色玻璃幕墙 ===
    const curtain = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W - 4, MAIN_H * 0.85, 0.4), matGlass);
    curtain.position.set(0, 1.0 + MAIN_H * 0.85 / 2 + 1.5, MAIN_D / 2 + 0.2);
    bGroup.add(curtain);
    // 蓝色幕墙框格 (竖向)
    for (let col = -5; col <= 5; col++) {
        const vf = new THREE.Mesh(new THREE.BoxGeometry(0.3, MAIN_H * 0.85, 0.5), matFrame);
        vf.position.set(col * 4.4, 1.0 + MAIN_H * 0.85 / 2 + 1.5, MAIN_D / 2 + 0.25);
        bGroup.add(vf);
    }
    // 水平层框
    for (let f = 0; f <= FLOORS; f++) {
        const hf = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W - 4, 0.22, 0.5), matBlue);
        hf.position.set(0, 1.0 + f * FLOOR_H + 1.5, MAIN_D / 2 + 0.25);
        bGroup.add(hf);
    }

    // === 蓝色阶梯教室坡度侧翼 (正面突出) ===
    const WING_W = 38;
    const WING_H = 10;
    const WING_D = 22;
    const wing = new THREE.Mesh(new THREE.BoxGeometry(WING_W, WING_H, WING_D), matBlue);
    wing.position.set(0, 1.0 + WING_H / 2, MAIN_D / 2 + WING_D / 2);
    wing.castShadow = true;
    bGroup.add(wing);
    // 侧翼坡屋顶 (坡度向前)
    const slopeGeo = new THREE.BufferGeometry();
    const hw = WING_W / 2;
    const slope_verts = new Float32Array([
        -hw, 0, -WING_D / 2,   hw, 0, -WING_D / 2,   hw, 0, WING_D / 2,
        -hw, 0, -WING_D / 2,   hw, 0, WING_D / 2,  -hw, 0, WING_D / 2,
    ]);
    slopeGeo.setAttribute('position', new THREE.BufferAttribute(slope_verts, 3));
    slopeGeo.computeVertexNormals();
    const slopeRoof = new THREE.Mesh(new THREE.BoxGeometry(WING_W + 0.5, 0.4, WING_D + 0.5), matAccent);
    slopeRoof.position.set(0, 1.0 + WING_H, MAIN_D / 2 + WING_D / 2);
    bGroup.add(slopeRoof);
    // 侧翼正面玻璃窗
    for (let wx = -15; wx <= 15; wx += 7.5) {
        const wg = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.5), matGlass);
        wg.position.set(wx, 1.0 + WING_H / 2, MAIN_D / 2 + WING_D + 0.05);
        bGroup.add(wg);
    }

    // === 主楼侧面窗 ===
    for (let f = 0; f < FLOORS; f++) {
        const wy = 1.0 + f * FLOOR_H + FLOOR_H / 2 + 1.0;
        [-10, 0, 10].forEach(wx => {
            const sw = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.2), matGlass);
            sw.rotation.y = Math.PI;
            sw.position.set(wx, wy, -(MAIN_D / 2 + 0.05));
            bGroup.add(sw);
        });
    }

    // === 侧面楼梯间 ===
    [-1, 1].forEach(sx => {
        const stair = new THREE.Mesh(new THREE.BoxGeometry(3.5, MAIN_H, 4), matBlue);
        stair.position.set(sx * (MAIN_W / 2 + 1.75), 1.0 + MAIN_H / 2, -MAIN_D / 4);
        bGroup.add(stair);
    });

    // === 屋顶 ===
    const roofTop = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W + 1, 1.2, MAIN_D + 1), matAccent);
    roofTop.position.set(0, 1.0 + MAIN_H + 0.6, 0);
    bGroup.add(roofTop);
    // 屋顶机房
    const penthouse = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 8), matSteel);
    penthouse.position.set(0, 1.0 + MAIN_H + 1.2 + 2.25, 0);
    bGroup.add(penthouse);

    // === 台阶 ===
    [0, 1, 2, 3].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(20 - i * 2, 0.3, 0.8), matBase);
        step.position.set(0, i * 0.3, MAIN_D / 2 + WING_D + 4 - i * 0.8);
        bGroup.add(step);
    });

    group.add(bGroup);
}
