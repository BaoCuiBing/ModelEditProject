// 模型名称：校门模型
function buildGateModel(THREE, group) {
    // --- 材质与色彩常量定义 ---
    const COLOR_GRANITE_DARK   = 0x3a3f47; // 柱体深灰色花岗岩
    const COLOR_GRANITE_LIGHT  = 0xe2e8f0; // 主体浅白大理石/花岗岩
    const COLOR_MARBLE_RED    = 0x7c1d1d; // 校名墙红褐色大理石
    const COLOR_GOLD           = 0xf59e0b; // 铜字/金色烫金装饰
    const COLOR_ASPHALT        = 0x27272a; // 柏油马路暗灰
    const COLOR_PAVER          = 0x94a3b8; // 广场花岗岩地砖
    const COLOR_GRASS          = 0x22c55e; // 草坪绿
    const COLOR_DARK_GRASS     = 0x15803d; // 花坛侧面灌木深绿
    const COLOR_GLASS          = 0x38bdf8; // 门卫室玻璃
    const COLOR_IRON_FENCE     = 0x1e293b; // 铁艺围栏黑灰
    const COLOR_STEEL          = 0xd1d5db; // 不锈钢闸机/旗杆

    // 1. 添加环境光与半球光 (增强户外天光自然质感)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    ambientLight.name = "主环境光";
    group.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x334155, 0.5);
    hemiLight.position.set(0, 50, 0);
    hemiLight.name = "天空半球光";
    group.add(hemiLight);

    // 2. 添加太阳平行光
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.4);
    sunLight.name = "太阳日光";
    sunLight.position.set(50, 65, 35);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 500;
    const shadowDim = 100;
    sunLight.shadow.camera.left = -shadowDim;
    sunLight.shadow.camera.right = shadowDim;
    sunLight.shadow.camera.top = shadowDim;
    sunLight.shadow.camera.bottom = -shadowDim;
    sunLight.shadow.bias = -0.0001;
    group.add(sunLight);

    // 3. 构建地坪、道路与入口广场
    const groundGroup = new THREE.Group();
    groundGroup.name = "地坪与道路系统";

    // 马路与分隔标线已统一整合移至 foundation.js 的 roadGroup 中

    // 广场两侧花岗岩铺装步道
    [-26, 26].forEach((pX, sideIdx) => {
        const plazaGeo = new THREE.PlaneGeometry(28, 120);
        const plazaMat = new THREE.MeshStandardMaterial({ color: COLOR_PAVER, roughness: 0.65 });
        const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
        plazaMesh.rotation.x = -Math.PI / 2;
        plazaMesh.position.set(pX, 0.03, 0);
        plazaMesh.scale.set(1.00, 0.20, 1.01);
        plazaMesh.receiveShadow = true;
        plazaMesh.name = `两侧铺装广场_${sideIdx === 0 ? "左" : "右"}`;
        groundGroup.add(plazaMesh);
    });

    group.add(groundGroup);

    // 4. 构建大学主校门宏伟框架 (现代与经典融合的大理石门楼)
    const mainGateGroup = new THREE.Group();
    mainGateGroup.name = "大学主校门主体建筑";

    // 主柱高、宽、深参数
    const pillarH = 14;
    const pillarW = 4.2;
    const pillarD = 5.5;

    // 双侧主大理石立柱
    const pillarPositions = [-14, 14];
    pillarPositions.forEach((xPos, idx) => {
        const pGroup = new THREE.Group();
        pGroup.name = `主校门巨型柱塔_${idx === 0 ? "左" : "右"}`;

        // 柱体基座
        const pBaseGeo = new THREE.BoxGeometry(pillarW + 0.8, 1.8, pillarD + 0.8);
        const pBaseMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_DARK, roughness: 0.4 });
        const pBase = new THREE.Mesh(pBaseGeo, pBaseMat);
        pBase.position.set(0, 0.9, 0);
        pBase.castShadow = true;
        pBase.receiveShadow = true;
        pBase.name = "柱基";
        pGroup.add(pBase);

        // 柱体主干 (干挂大理石切缝质感)
        const pBodyGeo = new THREE.BoxGeometry(pillarW, pillarH - 2.8, pillarD);
        const pBodyMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_LIGHT, roughness: 0.3 });
        const pBody = new THREE.Mesh(pBodyGeo, pBodyMat);
        pBody.position.set(0, (pillarH - 2.8) / 2 + 1.8, 0);
        pBody.castShadow = true;
        pBody.receiveShadow = true;
        pBody.name = "主石柱身";
        pGroup.add(pBody);

        // 柱身凹凸线条与竖向暗槽
        for (let lineOffset = -pillarD / 2 + 0.8; lineOffset <= pillarD / 2 - 0.8; lineOffset += 1.2) {
            const grooveGeo = new THREE.BoxGeometry(0.15, pillarH - 3.5, 0.15);
            const grooveMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_DARK, roughness: 0.5 });
            const grooveFront = new THREE.Mesh(grooveGeo, grooveMat);
            grooveFront.position.set(pillarW / 2 + 0.05, pillarH / 2 + 0.5, lineOffset);
            grooveFront.name = `柱面立体饰条_前_${lineOffset}`;
            pGroup.add(grooveFront);

            const grooveBack = new THREE.Mesh(grooveGeo, grooveMat);
            grooveBack.position.set(-pillarW / 2 - 0.05, pillarH / 2 + 0.5, lineOffset);
            grooveBack.name = `柱面立体饰条_后_${lineOffset}`;
            pGroup.add(grooveBack);
        }

        // 柱头檐口 (Pillar Crown)
        const pCrownGeo = new THREE.BoxGeometry(pillarW + 1.0, 1.0, pillarD + 1.0);
        const pCrownMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_DARK, roughness: 0.3 });
        const pCrown = new THREE.Mesh(pCrownGeo, pCrownMat);
        pCrown.position.set(0, pillarH - 0.5, 0);
        pCrown.castShadow = true;
        pCrown.name = "柱头挑檐";
        pGroup.add(pCrown);

        pGroup.position.set(xPos, 0, 0);
        mainGateGroup.add(pGroup);
    });

    // 跨越中央的现代弧形/箱梁飞檐 (Roof Crossbeam)
    const beamSpan = 38;
    const beamGeo = new THREE.BoxGeometry(beamSpan, 2.2, pillarD - 0.5);
    const beamMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_LIGHT, roughness: 0.35 });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0, pillarH - 0.3, 0);
    beamMesh.castShadow = true;
    beamMesh.receiveShadow = true;
    beamMesh.name = "跨度主门楣横梁";
    mainGateGroup.add(beamMesh);

    // 在门楣横梁正面增加"薄脆饼的大学"牌匾
    const plaqueCanvas = document.createElement('canvas');
    plaqueCanvas.width = 1024;
    plaqueCanvas.height = 256;
    const pCtx = plaqueCanvas.getContext('2d');

    pCtx.fillStyle = '#6b1717';
    pCtx.fillRect(0, 0, 1024, 256);

    pCtx.strokeStyle = '#d97706';
    pCtx.lineWidth = 12;
    pCtx.strokeRect(10, 10, 1004, 236);

    pCtx.fillStyle = '#fef08a';
    pCtx.font = 'bold 110px "Kaiti", "楷体", "SimSun", serif';
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    pCtx.fillText('薄 脆 饼 的 大 学', 512, 128);

    const plaqueTexture = new THREE.CanvasTexture(plaqueCanvas);
    const plaqueGeo = new THREE.PlaneGeometry(18, 1.8);
    const plaqueMat = new THREE.MeshStandardMaterial({
        map: plaqueTexture,
        roughness: 0.2,
        polygonOffset: true,
        polygonOffsetFactor: -2
    });
    const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaqueMesh.position.set(0, pillarH - 0.3, (pillarD - 0.5) / 2 + 0.05);
    plaqueMesh.name = "跨度主门楣横梁_校名牌匾";
    mainGateGroup.add(plaqueMesh);

    // 门楣下方的香槟金金属蜂窝装饰板 (Steel Soffit Ceiling)
    const soffitGeo = new THREE.BoxGeometry(beamSpan - 8.5, 0.2, pillarD - 1.2);
    const soffitMat = new THREE.MeshStandardMaterial({ color: COLOR_GOLD, metalness: 0.8, roughness: 0.2 });
    const soffitMesh = new THREE.Mesh(soffitGeo, soffitMat);
    soffitMesh.position.set(0, pillarH - 1.45, 0);
    soffitMesh.name = "门楣底部金色金属吊顶";
    mainGateGroup.add(soffitMesh);

    // 吊顶嵌入式筒灯 (Soffit Spotlights)
    for (let lightX = -12; lightX <= 12; lightX += 4) {
        const spotLightGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16);
        const spotLightMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
        const spotLightMesh = new THREE.Mesh(spotLightGeo, spotLightMat);
        spotLightMesh.position.set(lightX, pillarH - 1.55, 0);
        spotLightMesh.name = `门顶嵌入筒灯_${lightX}`;
        mainGateGroup.add(spotLightMesh);
    }

    group.add(mainGateGroup);

    // 5. 门卫保卫室 (Modern Security Lodge)
    const lodgeGroup = new THREE.Group();
    lodgeGroup.name = "校门保卫处门卫室";

    const lodgeW = 6.5;
    const lodgeL = 9.0;
    const lodgeH = 4.2;

    lodgeGroup.position.set(15.5, 0, 0);

    // 门卫室主体混凝土框
    const lodgeBodyGeo = new THREE.BoxGeometry(lodgeW, lodgeH, lodgeL);
    const lodgeBodyMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_LIGHT, roughness: 0.5 });
    const lodgeBody = new THREE.Mesh(lodgeBodyGeo, lodgeBodyMat);
    lodgeBody.position.set(0, lodgeH / 2, 0);
    lodgeBody.castShadow = true;
    lodgeBody.receiveShadow = true;
    lodgeBody.name = "保卫室主体结构";
    lodgeGroup.add(lodgeBody);

    // 全景铝合金落地玻璃窗
    const glassGeo = new THREE.BoxGeometry(lodgeW + 0.1, 2.2, lodgeL - 2.0);
    const glassMat = new THREE.MeshPhysicalMaterial({
        color: COLOR_GLASS,
        transparent: true,
        opacity: 0.5,
        roughness: 0.1,
        transmission: 0.9,
        ior: 1.5
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 2.2, -0.5);
    glassMesh.name = "保卫室全景观瞻窗";
    lodgeGroup.add(glassMesh);

    // 窗框黑钛金饰条
    const windowFrameGeo = new THREE.BoxGeometry(lodgeW + 0.2, 0.15, lodgeL - 1.8);
    const windowFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
    const windowFrameTop = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrameTop.position.set(0, 3.3, -0.5);
    lodgeGroup.add(windowFrameTop);

    const windowFrameBottom = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrameBottom.position.set(0, 1.1, -0.5);
    lodgeGroup.add(windowFrameBottom);

    // 保卫室平顶悬挑雨棚 (Overhanging Roof Canopy)
    const canopyGeo = new THREE.BoxGeometry(lodgeW + 2.5, 0.4, lodgeL + 2.5);
    const canopyMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_DARK, roughness: 0.3 });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(0, lodgeH + 0.2, 0);
    canopy.castShadow = true;
    canopy.name = "保卫室屋顶挑檐雨棚";
    lodgeGroup.add(canopy);

    // 屋顶空调外机
    const acGeo = new THREE.BoxGeometry(1.2, 0.9, 0.5);
    const acMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const acMesh = new THREE.Mesh(acGeo, acMat);
    acMesh.position.set(1.5, lodgeH + 0.85, 2.0);
    acMesh.name = "空调室外机";
    lodgeGroup.add(acMesh);

    group.add(lodgeGroup);

    // 6. 智能车辆与行人出入闸机系统 (Vehicle Barrier Gates & Pedestrian Turnstiles)
    const barrierGroup = new THREE.Group();
    barrierGroup.name = "智能门禁与车闸系统";

    // 车道分流中央安全岛 (Traffic Island)
    const islandW = 1.6;
    const islandL = 16.0;
    const islandH = 0.3;
    const islandGeo = new THREE.BoxGeometry(islandW, islandH, islandL);
    const islandMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5 });
    
    [0].forEach((islandX) => {
        const island = new THREE.Mesh(islandGeo, islandMat);
        island.position.set(islandX, islandH / 2, 0);
        island.receiveShadow = true;
        island.name = "中央车闸分隔岛";
        barrierGroup.add(island);

        // 黑黄相间防撞反光警戒纹理 (Curb hazard stripes)
        for (let iz = -islandL / 2 + 0.8; iz <= islandL / 2 - 0.8; iz += 1.6) {
            const stripeGeo = new THREE.BoxGeometry(islandW + 0.05, islandH + 0.02, 0.6);
            const stripeMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
            const stripe = new THREE.Mesh(stripeGeo, stripeMat);
            stripe.position.set(islandX, islandH / 2, iz);
            stripe.name = `防撞警示条_${iz}`;
            barrierGroup.add(stripe);
        }
    });

    // 智能车牌识别抬杆闸机 (Automatic Boom Barrier Gates)
    [-6.0, 6.0].forEach((gateX, gIdx) => {
        const gateZ = 3.0;
        const gateCabinetGeo = new THREE.BoxGeometry(0.5, 1.4, 0.5);
        const gateCabinetMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
        const cabinet = new THREE.Mesh(gateCabinetGeo, gateCabinetMat);
        cabinet.position.set(gateX, 0.7, gateZ);
        cabinet.castShadow = true;
        cabinet.name = `车牌识别闸机机箱_${gIdx + 1}`;
        barrierGroup.add(cabinet);

        const screenGeo = new THREE.BoxGeometry(0.3, 0.4, 0.1);
        const screenMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(gateX, 1.2, gateZ + 0.26);
        screen.name = `闸机显示屏_${gIdx + 1}`;
        barrierGroup.add(screen);

        const armLength = 4.8;
        const armGeo = new THREE.CylinderGeometry(0.06, 0.06, armLength, 12);
        const armMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
        const arm = new THREE.Mesh(armGeo, armMat);
        arm.rotation.z = Math.PI / 2;
        arm.position.set(gateX + (gIdx === 0 ? armLength / 2 : -armLength / 2), 1.1, gateZ);
        arm.castShadow = true;
        arm.name = `红白挡车杆_${gIdx + 1}`;
        barrierGroup.add(arm);
    });

    // 人行通道刷卡测温闸机 (Pedestrian Speed Gates / Turnstiles)
    [-10.2, 10.2].forEach((turnstileX, tIdx) => {
        for (let turnIdx = -1.2; turnIdx <= 1.2; turnIdx += 1.2) {
            const turnBodyGeo = new THREE.BoxGeometry(0.35, 1.1, 1.4);
            const turnBodyMat = new THREE.MeshStandardMaterial({ color: COLOR_STEEL, metalness: 0.8, roughness: 0.2 });
            const turnBody = new THREE.Mesh(turnBodyGeo, turnBodyMat);
            turnBody.position.set(turnstileX + turnIdx, 0.55, 3);
            turnBody.castShadow = true;
            turnBody.name = `人行闸机翼闸_${tIdx}_${turnIdx}`;
            barrierGroup.add(turnBody);

            const scannerGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 8);
            const scannerMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
            const scanner = new THREE.Mesh(scannerGeo, scannerMat);
            scanner.position.set(turnstileX + turnIdx, 1.3, 2.5);
            scanner.name = `人脸识别柱_${turnIdx}`;
            barrierGroup.add(scanner);
        }
    });

    group.add(barrierGroup);

    // 7. 围墙与铸铁艺术栏杆 (Perimeter Wrought-Iron Fencing - 四面全环绕)
    const fenceGroup = new THREE.Group();
    fenceGroup.name = "周界铁艺艺术围栏";

    const postGeo = new THREE.BoxGeometry(0.8, 3.2, 0.8);
    const postMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_LIGHT, roughness: 0.4 });
    const capGeo = new THREE.ConeGeometry(0.5, 0.4, 4);
    const capMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_DARK });
    const railMat = new THREE.MeshStandardMaterial({ color: COLOR_IRON_FENCE, metalness: 0.7, roughness: 0.3 });
    const spearGeo = new THREE.ConeGeometry(0.08, 0.3, 8);
    const spearMat = new THREE.MeshStandardMaterial({ color: COLOR_GOLD, metalness: 0.9 });

    function addFenceLine(x1, z1, x2, z2, step = 15) {
        const dx = x2 - x1;
        const dz = z2 - z1;
        const len = Math.hypot(dx, dz);
        if (len === 0) return;

        const count = Math.max(1, Math.round(len / step));
        const segLen = len / count;
        const angle = Math.atan2(dx, dz);

        for (let i = 0; i <= count; i++) {
            const ratio = i / count;
            const px = x1 + dx * ratio;
            const pz = z1 + dz * ratio;

            const post = new THREE.Mesh(postGeo, postMat);
            post.position.set(px, 1.6, pz);
            post.castShadow = true;
            fenceGroup.add(post);

            const cap = new THREE.Mesh(capGeo, capMat);
            cap.rotation.y = Math.PI / 4;
            cap.position.set(px, 3.4, pz);
            fenceGroup.add(cap);

            if (i < count) {
                const nextRatio = (i + 1) / count;
                const nx = x1 + dx * nextRatio;
                const nz = z1 + dz * nextRatio;
                const midX = (px + nx) / 2;
                const midZ = (pz + nz) / 2;

                const railWidth = segLen - 0.8;
                if (railWidth > 0) {
                    const railGeo = new THREE.BoxGeometry(0.1, 2.2, railWidth);
                    const rail = new THREE.Mesh(railGeo, railMat);
                    rail.position.set(midX, 1.5, midZ);
                    rail.rotation.y = angle;
                    rail.castShadow = true;
                    fenceGroup.add(rail);

                    const spearCount = Math.floor(railWidth / 0.8);
                    for (let s = 0; s < spearCount; s++) {
                        const offset = (s - (spearCount - 1) / 2) * 0.8;
                        const spearX = midX + Math.sin(angle) * offset;
                        const spearZ = midZ + Math.cos(angle) * offset;
                        const spear = new THREE.Mesh(spearGeo, spearMat);
                        spear.position.set(spearX, 2.75, spearZ);
                        fenceGroup.add(spear);
                    }
                }
            }
        }
    }

    const minX = -188;
    const maxX = 188;
    const southZ = 0.27;
    const northZ = -625.73;

    // 南侧门出入口留空，东西两侧封闭围墙
    addFenceLine(minX, southZ, -16.5, southZ, 15);
    addFenceLine(16.5, southZ, maxX, southZ, 15);
    addFenceLine(maxX, southZ, maxX, northZ, 18);
    addFenceLine(minX, northZ, minX, southZ, 18);

    // 北侧围墙：为东西主干道出口预留后校门通口 (-69.5至-56.5 和 55.5至68.5)
    addFenceLine(minX, northZ, -69.5, northZ, 18);
    addFenceLine(-56.5, northZ, 55.5, northZ, 18);
    addFenceLine(68.5, northZ, maxX, northZ, 18);

    // 9. 构建北侧后校门 (后门/北门简约闸机门柱系统)
    const backGateGroup = new THREE.Group();
    backGateGroup.name = "🚪 北侧后校门系统";

    function createBackGateStructure(gateCenterX, gateName) {
        const g = new THREE.Group();
        g.name = gateName;

        // 双侧干挂大理石门柱
        [-6.5, 6.5].forEach((pX, idx) => {
            const pGroup = new THREE.Group();
            pGroup.name = `后校门门柱_${idx === 0 ? "左" : "右"}`;

            const pillarGeo = new THREE.BoxGeometry(1.4, 4.2, 1.4);
            const pillarMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_LIGHT, roughness: 0.4 });
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.set(pX, 2.1, northZ);
            pillar.castShadow = true;
            pillar.receiveShadow = true;
            pGroup.add(pillar);

            const capGeo = new THREE.ConeGeometry(1.0, 0.6, 4);
            const capMat = new THREE.MeshStandardMaterial({ color: COLOR_GRANITE_DARK });
            const cap = new THREE.Mesh(capGeo, capMat);
            cap.rotation.y = Math.PI / 4;
            cap.position.set(pX, 4.5, northZ);
            pGroup.add(cap);

            g.add(pGroup);
        });

        // 智能汽车抬杆闸机
        [-3.2, 3.2].forEach((barrierX, idx) => {
            const cabinetGeo = new THREE.BoxGeometry(0.4, 1.2, 0.4);
            const cabinetMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 });
            const cabinet = new THREE.Mesh(cabinetGeo, cabinetMat);
            cabinet.position.set(gateCenterX + barrierX, 0.6, northZ);
            cabinet.castShadow = true;
            g.add(cabinet);

            const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8);
            const armMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
            const arm = new THREE.Mesh(armGeo, armMat);
            arm.rotation.z = Math.PI / 2;
            arm.position.set(gateCenterX + (idx === 0 ? barrierX + 1.6 : barrierX - 1.6), 1.0, northZ);
            g.add(arm);
        });

        // 北门标识牌
        const signGeo = new THREE.BoxGeometry(3.6, 0.6, 0.15);
        const signMat = new THREE.MeshStandardMaterial({ color: COLOR_MARBLE_RED });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(gateCenterX, 3.5, northZ + 0.7);
        sign.name = "后校门标识牌";
        g.add(sign);

        return g;
    }

    fenceGroup.add(createBackGateStructure(-63.0, "西侧后校门"));
    fenceGroup.add(createBackGateStructure(62.0, "东侧后校门"));

    group.add(fenceGroup);

    // 8. 性能与裁剪面防护机制
    group.traverse((child) => {
        if (child.isMesh || child.isLine) {
            child.frustumCulled = false;
        }
    });
}
