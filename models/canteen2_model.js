// 模型名称：第二清真与教工餐厅精细模型 (拱门·采光中庭)
function buildCanteen2Model(THREE, group) {
    const C_BRICK   = 0xa83225;
    const C_STONE   = 0x546070;
    const C_GLASS   = 0x80d8ff;
    const C_ARCH    = 0xd4a04a;
    const C_BASE    = 0xbbb0a0;
    const C_TRIM    = 0x7b5e3a;
    const C_ROOF    = 0x455060;

    const bGroup = new THREE.Group();
    bGroup.name = "🍲 第二清真与教工餐厅";
    bGroup.position.set(-192.19, 0.30, 232.43);
    bGroup.scale.set(1.45, 1.00, 3.00);

    const matBrick  = new THREE.MeshStandardMaterial({ color: C_BRICK,  roughness: 0.75 });
    const matStone  = new THREE.MeshStandardMaterial({ color: C_STONE,  roughness: 0.55 });
    const matGlass  = new THREE.MeshPhysicalMaterial({ color: C_GLASS,  transparent: true, opacity: 0.65, roughness: 0.05 });
    const matArch   = new THREE.MeshStandardMaterial({ color: C_ARCH,   metalness: 0.4, roughness: 0.5 });
    const matBase   = new THREE.MeshStandardMaterial({ color: C_BASE,   roughness: 0.6 });
    const matTrim   = new THREE.MeshStandardMaterial({ color: C_TRIM,   roughness: 0.65 });
    const matRoof   = new THREE.MeshStandardMaterial({ color: C_ROOF,   roughness: 0.7 });

    const BLDG_W = 50;
    const BLDG_H = 16;
    const BLDG_D = 24;

    // === 台基 ===
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 5, 0.8, BLDG_D + 4), matBase);
    plinth.position.set(0, 0.4, 0);
    bGroup.add(plinth);

    // === 主楼体 ===
    const body = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W, BLDG_H, BLDG_D), matBrick);
    body.position.set(0, BLDG_H / 2 + 0.8, 0);
    body.castShadow = true; body.receiveShadow = true;
    bGroup.add(body);

    // === 砖面分层横线 ===
    [4, 8, 12].forEach(hy => {
        const band = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 0.5, 0.4, BLDG_D + 0.5), matStone);
        band.position.set(0, hy + 0.8, 0);
        bGroup.add(band);
    });

    // === 清真风拱门入口 (正面中央) ===
    // 拱门两侧立柱
    [-4, 4].forEach(px => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(1.5, 8, 1.5), matArch);
        pillar.position.set(px, 4.8, BLDG_D / 2 + 0.8);
        bGroup.add(pillar);
    });
    // 拱门过梁
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(10.5, 1.5, 1.5), matArch);
    lintel.position.set(0, 8.8, BLDG_D / 2 + 0.8);
    bGroup.add(lintel);
    // 拱形（半圆）装饰
    const archGeo = new THREE.TorusGeometry(3.5, 0.5, 8, 24, Math.PI);
    const arch = new THREE.Mesh(archGeo, matArch);
    arch.rotation.z = Math.PI;
    arch.position.set(0, 9.5, BLDG_D / 2 + 0.8);
    bGroup.add(arch);
    // 入口大门玻璃
    const doorGlass = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 7.0), matGlass);
    doorGlass.position.set(0, 4.3, BLDG_D / 2 + 0.85);
    bGroup.add(doorGlass);
    // 拱门两侧小窗
    [-13, 13].forEach(wx => {
        const sw = new THREE.Mesh(new THREE.PlaneGeometry(6, 5), matGlass);
        sw.position.set(wx, 5.5, BLDG_D / 2 + 0.85);
        bGroup.add(sw);
    });

    // === 背面窗户 ===
    [-15, -5, 5, 15].forEach(wx => {
        for (let fh = 3; fh < BLDG_H - 2; fh += 5) {
            const bw = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 3.2), matGlass);
            bw.rotation.y = Math.PI;
            bw.position.set(wx, fh + 0.8, -(BLDG_D / 2 + 0.05));
            bGroup.add(bw);
        }
    });

    // === 外廊走道 (两侧) ===
    [-1, 1].forEach(sx => {
        const corridor = new THREE.Mesh(new THREE.BoxGeometry(3, BLDG_H * 0.4, BLDG_D), matStone);
        corridor.position.set(sx * (BLDG_W / 2 + 1.5), BLDG_H * 0.4 / 2 + 0.8, 0);
        bGroup.add(corridor);
        // 外廊窗
        for (let fz = -8; fz <= 8; fz += 5) {
            const cw = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 2.5), matGlass);
            cw.rotation.y = sx * Math.PI / 2;
            cw.position.set(sx * (BLDG_W / 2 + 3.05), BLDG_H * 0.2 + 0.8, fz);
            bGroup.add(cw);
        }
    });

    // === 顶层四角采光金字塔 ===
    const CONE_POSITIONS = [[-10, 10], [-10, -10], [10, 10], [10, -10]];
    CONE_POSITIONS.forEach(([cx, cz]) => {
        const coneGeo = new THREE.ConeGeometry(4, 5, 4);
        const cone = new THREE.Mesh(coneGeo, matGlass);
        cone.rotation.y = Math.PI / 4;
        cone.position.set(cx, BLDG_H + 0.8 + 2.5, cz);
        bGroup.add(cone);
        // 锥底环
        const coneRing = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 8), matStone);
        coneRing.position.set(cx, BLDG_H + 0.8, cz);
        bGroup.add(coneRing);
    });

    // === 中央大采光金字塔 ===
    const mainConeGeo = new THREE.ConeGeometry(7, 7, 4);
    const mainCone = new THREE.Mesh(mainConeGeo, matGlass);
    mainCone.rotation.y = Math.PI / 4;
    mainCone.position.set(0, BLDG_H + 0.8 + 3.5, 0);
    bGroup.add(mainCone);
    const mainRing = new THREE.Mesh(new THREE.BoxGeometry(14, 0.5, 14), matStone);
    mainRing.position.set(0, BLDG_H + 0.8, 0);
    bGroup.add(mainRing);

    // === 屋顶女儿墙 ===
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 1, 1.2, BLDG_D + 1), matRoof);
    parapet.position.set(0, BLDG_H + 0.8 + 0.6, 0);
    bGroup.add(parapet);

    // === 装饰腰线 ===
    const trimBelt = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 0.6, 0.5, BLDG_D + 0.6), matTrim);
    trimBelt.position.set(0, BLDG_H * 0.65 + 0.8, 0);
    bGroup.add(trimBelt);

    // === 台阶 ===
    [0, 1, 2].forEach(i => {
        const step = new THREE.Mesh(new THREE.BoxGeometry(14 - i * 1.5, 0.3, 0.7), matBase);
        step.position.set(0, 0.8 + i * 0.3, BLDG_D / 2 + 3.5 - i * 0.7);
        bGroup.add(step);
    });

    group.add(bGroup);
}
