// 模型名称：工程实验实训中心C精细模型 (工业车间风·锯齿屋顶)
function buildTrainingBuildingCModel(THREE, group) {
    const C_STEEL   = 0x5a6e7e;
    const C_GLASS   = 0x80deea;
    const C_YELLOW  = 0xffc107;
    const C_DARK    = 0x2e3a42;
    const C_TRUSS   = 0x455a64;
    const C_PIPE    = 0x78909c;
    const C_FLOOR   = 0x8d6e63;
    const C_DOOR    = 0x607d8b;

    const bGroup = new THREE.Group();
    bGroup.name = "🔬 工程实验实训中心C";
    bGroup.position.set(200.00, 0.30, -46.73);
    bGroup.scale.set(1.77, 1.00, 3.27);

    const matSteel  = new THREE.MeshStandardMaterial({ color: C_STEEL,  metalness: 0.8, roughness: 0.35 });
    const matGlass  = new THREE.MeshPhysicalMaterial({ color: C_GLASS,  transparent: true, opacity: 0.68, roughness: 0.08 });
    const matYellow = new THREE.MeshStandardMaterial({ color: C_YELLOW, metalness: 0.3, roughness: 0.5 });
    const matDark   = new THREE.MeshStandardMaterial({ color: C_DARK,   metalness: 0.4, roughness: 0.4 });
    const matTruss  = new THREE.MeshStandardMaterial({ color: C_TRUSS,  metalness: 0.9, roughness: 0.2 });
    const matPipe   = new THREE.MeshStandardMaterial({ color: C_PIPE,   metalness: 0.7, roughness: 0.3 });
    const matFloor  = new THREE.MeshStandardMaterial({ color: C_FLOOR,  roughness: 0.8 });
    const matDoor   = new THREE.MeshStandardMaterial({ color: C_DOOR,   metalness: 0.6, roughness: 0.4 });

    const BLDG_W = 48;
    const BLDG_H = 22;
    const BLDG_D = 28;

    // === 混凝土地基 ===
    const foundation = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 6, 0.8, BLDG_D + 5), matFloor);
    foundation.position.set(0, 0.4, 0);
    bGroup.add(foundation);

    // === 工业车间大化主楼 ===
    const body = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W, BLDG_H, BLDG_D), matSteel);
    body.position.set(0, BLDG_H / 2 + 0.8, 0);
    body.castShadow = true; body.receiveShadow = true;
    bGroup.add(body);

    // === 锯齿形工业屋顶 (北向天窗) ===
    const TOOTH_COUNT = 4;
    const TOOTH_W = BLDG_W / TOOTH_COUNT;
    for (let ti = 0; ti < TOOTH_COUNT; ti++) {
        const tx = -BLDG_W / 2 + TOOTH_W * ti + TOOTH_W / 2;
        const ty = BLDG_H + 0.8;
        // 斜面 (钢板)
        const slopeBox = new THREE.Mesh(new THREE.BoxGeometry(TOOTH_W - 0.3, 0.3, BLDG_D + 0.5), matDark);
        slopeBox.position.set(tx, ty + 2.5, 0);
        slopeBox.rotation.z = -Math.PI / 10;
        bGroup.add(slopeBox);
        // 北向天窗 (玻璃)
        const skyWin = new THREE.Mesh(new THREE.BoxGeometry(TOOTH_W - 0.5, 3.5, BLDG_D), matGlass);
        skyWin.position.set(tx + TOOTH_W * 0.25, ty + 2.0, 0);
        skyWin.rotation.z = Math.PI / 6;
        bGroup.add(skyWin);
    }
    // 屋顶顶板
    const roofFlat = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 0.5, 0.5, BLDG_D + 0.5), matDark);
    roofFlat.position.set(0, BLDG_H + 0.8 + 5.5, 0);
    bGroup.add(roofFlat);

    // === 侧面钢结构桁架 ===
    [-1, 1].forEach(sx => {
        const px = sx * (BLDG_W / 2 + 0.1);
        // 主纵梁
        const longBeam = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, BLDG_D + 2), matTruss);
        longBeam.position.set(px, BLDG_H * 0.65 + 0.8, 0);
        bGroup.add(longBeam);
        const longBeam2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, BLDG_D + 2), matTruss);
        longBeam2.position.set(px, BLDG_H * 0.35 + 0.8, 0);
        bGroup.add(longBeam2);
        // X形斜撑
        for (let bz = -12; bz <= 12; bz += 8) {
            const diag1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, BLDG_H * 0.35, 0.3), matTruss);
            diag1.rotation.z = Math.PI / 4;
            diag1.position.set(px, BLDG_H * 0.5 + 0.8, bz);
            bGroup.add(diag1);
        }
        // 侧面高窗
        for (let fz = -10; fz <= 10; fz += 8) {
            const sw = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 4.0), matGlass);
            sw.rotation.y = sx * Math.PI / 2;
            sw.position.set(px + sx * 0.1, BLDG_H * 0.6 + 0.8, fz);
            bGroup.add(sw);
        }
    });

    // === 正面多个大卷帘门 ===
    const DOOR_POSITIONS = [-18, -6, 6, 18];
    DOOR_POSITIONS.forEach(dx => {
        // 门框
        const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 0.5), matDoor);
        doorFrame.position.set(dx, 12 + 0.8, BLDG_D / 2 + 0.25);
        bGroup.add(doorFrame);
        const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 12, 0.5), matDoor);
        frameL.position.set(dx - 5, 6 + 0.8, BLDG_D / 2 + 0.25);
        bGroup.add(frameL);
        const frameR = frameL.clone();
        frameR.position.x = dx + 5;
        bGroup.add(frameR);
        // 卷帘门板 (条纹)
        for (let dh = 0; dh < 12; dh += 1.5) {
            const strip = new THREE.Mesh(new THREE.BoxGeometry(9, 0.1, 0.3), matSteel);
            strip.position.set(dx, dh + 0.8 + 0.75, BLDG_D / 2 + 0.15);
            bGroup.add(strip);
        }
        // 门玻璃
        const dg = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 11.5), matGlass);
        dg.position.set(dx, 6.5 + 0.8, BLDG_D / 2 + 0.22);
        bGroup.add(dg);
    });

    // === 黄色安全警示条纹 ===
    const warningStripe = new THREE.Mesh(new THREE.BoxGeometry(BLDG_W + 0.5, 1.0, 0.4), matYellow);
    warningStripe.position.set(0, 1.3, BLDG_D / 2 + 0.2);
    bGroup.add(warningStripe);

    // === 管道设施 ===
    [[-15, true], [0, false], [15, true]].forEach(([pz, large]) => {
        const r = large ? 0.5 : 0.3;
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(r, r, BLDG_H + 5, 8), matPipe);
        pipe.position.set(BLDG_W / 2 + 1.5, (BLDG_H + 5) / 2 + 0.8, pz);
        bGroup.add(pipe);
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.5, r * 1.2, 0.5, 8), matPipe);
        cap.position.set(BLDG_W / 2 + 1.5, BLDG_H + 5.55, pz);
        bGroup.add(cap);
    });

    // === 背面小窗 ===
    for (let fx = -18; fx <= 18; fx += 9) {
        for (let fh = 5; fh < BLDG_H - 2; fh += 6) {
            const bw = new THREE.Mesh(new THREE.PlaneGeometry(5, 3.5), matGlass);
            bw.rotation.y = Math.PI;
            bw.position.set(fx, fh + 0.8, -(BLDG_D / 2 + 0.05));
            bGroup.add(bw);
        }
    }

    group.add(bGroup);
}
