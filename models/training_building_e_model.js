// 模型名称：信息技术实训中心E精细模型 (高科技AI数据中枢)
function buildTrainingBuildingEModel(THREE, group) {
    const C_DARK    = 0x0d1b2a;
    const C_GLASS   = 0x00b0ff;
    const C_CYAN    = 0x00e5ff;
    const C_STEEL   = 0x37474f;
    const C_ACCENT  = 0x0077b6;
    const C_PANEL   = 0x1a2c3a;
    const C_MESH    = 0x263238;
    const C_LEDBLUE = 0x29b6f6;

    const bGroup = new THREE.Group();
    bGroup.name = "💻 信息技术实训中心E";
    bGroup.position.set(178.34, 0.30, 49.05);
    bGroup.scale.set(1.23, 0.69, 2.21);

    const matDark   = new THREE.MeshStandardMaterial({ color: C_DARK,   roughness: 0.25, metalness: 0.3 });
    const matGlass  = new THREE.MeshPhysicalMaterial({ color: C_GLASS,  transparent: true, opacity: 0.78, roughness: 0.05, metalness: 0.15 });
    const matCyan   = new THREE.MeshBasicMaterial({ color: C_CYAN });
    const matSteel  = new THREE.MeshStandardMaterial({ color: C_STEEL,  metalness: 0.9, roughness: 0.2 });
    const matAccent = new THREE.MeshStandardMaterial({ color: C_ACCENT, metalness: 0.6, roughness: 0.3 });
    const matPanel  = new THREE.MeshStandardMaterial({ color: C_PANEL,  roughness: 0.3 });
    const matMesh   = new THREE.MeshStandardMaterial({ color: C_MESH,   roughness: 0.5 });
    const matLED    = new THREE.MeshBasicMaterial({ color: C_LEDBLUE });

    const MAIN_W = 48;
    const MAIN_H = 26;
    const MAIN_D = 28;
    const FLOOR_H = 3.8;
    const FLOORS = Math.round(MAIN_H / FLOOR_H);

    // === 底部基座 ===
    const base = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W + 4, 1.2, MAIN_D + 4), matSteel);
    base.position.set(0, 0.6, 0);
    bGroup.add(base);

    // === 主楼体 (深色高科技面板) ===
    const body = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W, MAIN_H, MAIN_D), matDark);
    body.position.set(0, MAIN_H / 2 + 1.2, 0);
    body.castShadow = true; body.receiveShadow = true;
    bGroup.add(body);

    // === 正面分区玻璃幕墙 (分格) ===
    const COLS = 6;
    const COL_W = (MAIN_W - 4) / COLS;
    for (let f = 0; f < FLOORS; f++) {
        for (let c = 0; c < COLS; c++) {
            const px = -MAIN_W / 2 + 2 + COL_W * c + COL_W / 2;
            const py = 1.2 + f * FLOOR_H + FLOOR_H / 2;
            const panelGlass = new THREE.Mesh(new THREE.BoxGeometry(COL_W - 0.35, FLOOR_H - 0.35, 0.15), matGlass);
            panelGlass.position.set(px, py, MAIN_D / 2 + 0.08);
            bGroup.add(panelGlass);
        }
    }
    // 幕墙钢框竖
    for (let c = 0; c <= COLS; c++) {
        const px = -MAIN_W / 2 + 2 + COL_W * c;
        const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.25, MAIN_H, 0.2), matSteel);
        vBar.position.set(px, MAIN_H / 2 + 1.2, MAIN_D / 2 + 0.1);
        bGroup.add(vBar);
    }
    // 幕墙钢框横
    for (let f = 0; f <= FLOORS; f++) {
        const hBar = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W - 4, 0.2, 0.2), matSteel);
        hBar.position.set(0, 1.2 + f * FLOOR_H, MAIN_D / 2 + 0.1);
        bGroup.add(hBar);
    }

    // === 中央数据中枢大玻璃塔 (突出正面) ===
    const TOWER_W = 22;
    const TOWER_H = MAIN_H + 6;
    const TOWER_D = 14;
    const tower = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W, TOWER_H, TOWER_D), matGlass);
    tower.position.set(0, TOWER_H / 2 + 1.2, MAIN_D / 2 + TOWER_D / 2 - 1);
    tower.castShadow = true;
    bGroup.add(tower);
    // 玻璃塔钢框
    for (let tf = 0; tf <= FLOORS + 2; tf++) {
        const tBar = new THREE.Mesh(new THREE.BoxGeometry(TOWER_W + 0.5, 0.2, TOWER_D + 0.5), matSteel);
        tBar.position.set(0, 1.2 + tf * FLOOR_H, MAIN_D / 2 + TOWER_D / 2 - 1);
        bGroup.add(tBar);
    }

    // === 侧面散热百叶格栅 ===
    [-1, 1].forEach(sx => {
        const px = sx * (MAIN_W / 2 + 0.1);
        // 散热百叶板 (多条)
        for (let sh = 5; sh < MAIN_H - 2; sh += 1.2) {
            const louver = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, MAIN_D - 2), matMesh);
            louver.position.set(px, sh + 1.2, 0);
            bGroup.add(louver);
        }
        // 百叶格框
        const louverFrame = new THREE.Mesh(new THREE.BoxGeometry(0.8, MAIN_H - 5, MAIN_D - 2), matPanel);
        louverFrame.position.set(px, MAIN_H / 2 + 1.2, 0);
        bGroup.add(louverFrame);
    });

    // === 多层LED灯带 (正面) ===
    const LED_LAYERS = [4, 8, 12, 16, 20];
    LED_LAYERS.forEach(lh => {
        const strip = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W + 0.5, 0.18, 0.18), matLED);
        strip.position.set(0, lh + 1.2, MAIN_D / 2 + 0.2);
        bGroup.add(strip);
    });

    // === 侧翼LED竖条 ===
    [-MAIN_W / 2 + 1, MAIN_W / 2 - 1].forEach(lx => {
        const vStrip = new THREE.Mesh(new THREE.BoxGeometry(0.18, MAIN_H, 0.18), matCyan);
        vStrip.position.set(lx, MAIN_H / 2 + 1.2, MAIN_D / 2 + 0.2);
        bGroup.add(vStrip);
    });

    // === 顶部天线 / 信号塔 ===
    const ant = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 8, 6), matSteel);
    ant.position.set(8, MAIN_H + 1.2 + 4, 0);
    bGroup.add(ant);
    const ant2 = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 6, 6), matSteel);
    ant2.position.set(-8, MAIN_H + 1.2 + 3, 0);
    bGroup.add(ant2);
    // 天线小横杆
    [-2, 0, 2].forEach(hy => {
        const crossBar = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.1), matCyan);
        crossBar.position.set(8, MAIN_H + 1.2 + 6 + hy, 0);
        bGroup.add(crossBar);
    });

    // === 机房服务器窗格 (背面) ===
    for (let f = 0; f < FLOORS; f++) {
        for (let bx = -18; bx <= 18; bx += 9) {
            const srv = new THREE.Mesh(new THREE.PlaneGeometry(6, 2.5), matPanel);
            srv.rotation.y = Math.PI;
            srv.position.set(bx, 1.2 + f * FLOOR_H + FLOOR_H / 2, -(MAIN_D / 2 + 0.05));
            bGroup.add(srv);
            // 服务器格纹
            for (let si = 0; si < 4; si++) {
                const sLine = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 0.08), matLED);
                sLine.rotation.y = Math.PI;
                sLine.position.set(bx, 1.2 + f * FLOOR_H + 0.5 + si * 0.6, -(MAIN_D / 2 + 0.06));
                bGroup.add(sLine);
            }
        }
    }

    // === 入口雨棚 ===
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(16, 0.3, 4), matAccent);
    canopy.position.set(0, 4.5, MAIN_D / 2 + TOWER_D - 1 + 2.5);
    bGroup.add(canopy);
    [-5.5, 5.5].forEach(cp => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 4.2, 6), matSteel);
        post.position.set(cp, 2.4, MAIN_D / 2 + TOWER_D - 1 + 2.5);
        bGroup.add(post);
    });

    // === 顶部设备层 ===
    const equipDeck = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W + 0.5, 2.5, MAIN_D + 0.5), matPanel);
    equipDeck.position.set(0, MAIN_H + 1.2 + 1.25, 0);
    bGroup.add(equipDeck);
    // LED顶环
    const topLED = new THREE.Mesh(new THREE.BoxGeometry(MAIN_W + 1, 0.2, MAIN_D + 1), matCyan);
    topLED.position.set(0, MAIN_H + 1.2 + 2.5, 0);
    bGroup.add(topLED);

    group.add(bGroup);
}
