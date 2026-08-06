function buildTeachingBuildingModel(THREE, group) {
    // ============ 灯光 ============
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    ambientLight.name = "环境光";
    group.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    sunLight.position.set(45, 70, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 220;
    const d = 80;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    sunLight.name = "太阳平行光";
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x475569, 0.35);
    hemiLight.name = "半球天空光";
    group.add(hemiLight);

    const matStone = new THREE.MeshStandardMaterial({ color: 0xe6e3dc, roughness: 0.5, metalness: 0.05 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x1e3a4c, roughness: 0.1, metalness: 0.85, transparent: true, opacity: 0.72 });
    const matMullion = new THREE.MeshStandardMaterial({ color: 0x24282e, roughness: 0.3, metalness: 0.7 });
    const matBalconyGlass = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, metalness: 0.3, transparent: true, opacity: 0.45 });
    const matMetalRailing = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.8 });
    const matCanopyFrame = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.85 });
    const matCanopyGlass = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.6 });
    const matSlab = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8, metalness: 0.1 });
    const matGrass = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.9, metalness: 0.0 });
    const matPlaza = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.7, metalness: 0.1 });

    const buildingGroups = [];

    // Group 1: 基础与广场地面 (调整尺寸与中心位置，确保后方树木不悬空)
    const gPlaza = new THREE.Group();
    gPlaza.name = "🧱 基础与广场地面";

    const plazaMesh = new THREE.Mesh(new THREE.BoxGeometry(88, 0.2, 52), matPlaza);
    plazaMesh.position.set(0, 0.1, 2);
    plazaMesh.receiveShadow = true;
    plazaMesh.name = "主入口铺装广场";
    gPlaza.add(plazaMesh);

    const plinthMesh = new THREE.Mesh(new THREE.BoxGeometry(65.0, 0.6, 20.0), matStone);
    plinthMesh.position.set(0, 0.3, 0);
    plinthMesh.castShadow = true;
    plinthMesh.receiveShadow = true;
    plinthMesh.name = "±0.000 建筑室外花岗岩基座";
    gPlaza.add(plinthMesh);

    group.add(gPlaza);
    buildingGroups.push(gPlaza);

    const buildingWidth = 63.6;
    const buildingHeight = 20.9;
    const buildingDepth = 18.6;
    const totalFloors = 5;
    const floorHeight = 3.6;
    const baseElev = 0.6;

    const baySpansX = [-25.2, -16.8, -8.4, 0, 8.4, 16.8, 25.2];
    const pillarPositionsX = [-29.4, -21.0, -12.6, -4.2, 4.2, 12.6, 21.0, 29.4];

    // Group 2: 主体石材立柱与框架
    const gStructure = new THREE.Group();
    gStructure.name = "🏛️ 主体石材立柱与框架";

    const leftWing = new THREE.Mesh(new THREE.BoxGeometry(2.4, buildingHeight, buildingDepth), matStone);
    leftWing.position.set(-30.6, baseElev + buildingHeight/2, 0);
    leftWing.castShadow = true;
    leftWing.receiveShadow = true;
    leftWing.name = "西侧墙体端塔 (West Wing)";
    gStructure.add(leftWing);

    const rightWing = new THREE.Mesh(new THREE.BoxGeometry(2.4, buildingHeight, buildingDepth), matStone);
    rightWing.position.set(30.6, baseElev + buildingHeight/2, 0);
    rightWing.castShadow = true;
    rightWing.receiveShadow = true;
    rightWing.name = "东侧墙体端塔 (East Wing)";
    gStructure.add(rightWing);

    pillarPositionsX.forEach((px, idx) => {
        const frontPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, buildingHeight, 0.6), matStone);
        frontPillar.position.set(px, baseElev + buildingHeight/2, buildingDepth/2 + 0.15);
        frontPillar.castShadow = true;
        frontPillar.receiveShadow = true;
        frontPillar.name = `南立面结构竖柱 P${idx + 1} (X:${px}m)`;
        gStructure.add(frontPillar);

        const rearPillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, buildingHeight, 0.6), matStone);
        rearPillar.position.set(px, baseElev + buildingHeight/2, -buildingDepth/2 - 0.15);
        rearPillar.castShadow = true;
        rearPillar.receiveShadow = true;
        rearPillar.name = `北立面结构竖柱 P${idx + 1} (X:${px}m)`;
        gStructure.add(rearPillar);
    });

    for (let f = 0; f <= totalFloors; f++) {
        const elevY = baseElev + f * floorHeight;
        const spandrelFront = new THREE.Mesh(new THREE.BoxGeometry(buildingWidth - 4.0, 0.5, 0.4), matStone);
        spandrelFront.position.set(0, elevY + 0.25, buildingDepth/2 + 0.1);
        spandrelFront.castShadow = true;
        spandrelFront.name = `F${f + 1} 楼层分界石材腰线`;
        gStructure.add(spandrelFront);

        const spandrelRear = new THREE.Mesh(new THREE.BoxGeometry(buildingWidth - 4.0, 0.5, 0.4), matStone);
        spandrelRear.position.set(0, elevY + 0.25, -buildingDepth/2 - 0.1);
        spandrelRear.castShadow = true;
        spandrelRear.name = `F${f + 1} 北立面分界石材腰线`;
        gStructure.add(spandrelRear);
    }

    const parapetFront = new THREE.Mesh(new THREE.BoxGeometry(buildingWidth, 1.8, 0.6), matStone);
    parapetFront.position.set(0, baseElev + buildingHeight + 0.9, buildingDepth/2);
    parapetFront.castShadow = true;
    parapetFront.name = "南立面顶层花岗岩女儿墙与檐口";
    gStructure.add(parapetFront);

    const parapetRear = new THREE.Mesh(new THREE.BoxGeometry(buildingWidth, 1.8, 0.6), matStone);
    parapetRear.position.set(0, baseElev + buildingHeight + 0.9, -buildingDepth/2);
    parapetRear.castShadow = true;
    parapetRear.name = "北立面顶层女儿墙";
    gStructure.add(parapetRear);

    group.add(gStructure);
    buildingGroups.push(gStructure);

    // Group 3: 顶层跨空飞廊与屋顶
    const gRoof = new THREE.Group();
    gRoof.name = "🏗️ 顶层跨空飞廊与屋顶";

    const skyBridge = new THREE.Mesh(new THREE.BoxGeometry(25.2, 2.2, buildingDepth + 0.4), matStone);
    skyBridge.position.set(0, baseElev + 17.8, 0);
    skyBridge.castShadow = true;
    skyBridge.receiveShadow = true;
    skyBridge.name = "5F 顶层中央贯通跨空飞廊 (Skybridge)";
    gRoof.add(skyBridge);

    const mainRoofSlab = new THREE.Mesh(new THREE.BoxGeometry(buildingWidth - 0.8, 0.3, buildingDepth - 0.8), matSlab);
    mainRoofSlab.position.set(0, baseElev + buildingHeight, 0);
    mainRoofSlab.name = "主楼顶层防渗屋面";
    gRoof.add(mainRoofSlab);

    const hvacHouse = new THREE.Mesh(new THREE.BoxGeometry(16.0, 3.2, 8.0), matStone);
    hvacHouse.position.set(0, baseElev + buildingHeight + 1.6, -2.0);
    hvacHouse.castShadow = true;
    hvacHouse.name = "屋顶电梯机房与HVAC设备区";
    gRoof.add(hvacHouse);

    group.add(gRoof);
    buildingGroups.push(gRoof);

    // Group 4: 玻璃幕墙与分格窗框
    const gGlass = new THREE.Group();
    gGlass.name = "🪟 1F-5F 玻璃幕墙与窗框";

    baySpansX.forEach((bx, bIdx) => {
        for (let f = 0; f < totalFloors; f++) {
            const floorY = baseElev + f * floorHeight + floorHeight / 2;

            if ((f >= 3) && (bIdx >= 2 && bIdx <= 4)) {
                const glassPanel = new THREE.Mesh(new THREE.BoxGeometry(7.6, floorHeight - 0.6, 0.1), matGlass);
                glassPanel.position.set(bx, floorY, buildingDepth/2 - 2.5);
                glassPanel.name = `${f + 1}F-跨度B${bIdx + 1} 凹进景窗幕墙`;
                gGlass.add(glassPanel);
                continue;
            }

            const glassPanelFront = new THREE.Mesh(new THREE.BoxGeometry(7.5, floorHeight - 0.65, 0.1), matGlass);
            glassPanelFront.position.set(bx, floorY, buildingDepth/2);
            glassPanelFront.name = `${f + 1}F-跨度B${bIdx + 1} 南幕墙单元`;
            gGlass.add(glassPanelFront);

            for (let m = -3.0; m <= 3.0; m += 1.5) {
                const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, floorHeight - 0.65, 0.15), matMullion);
                mullion.position.set(bx + m, floorY, buildingDepth/2 + 0.05);
                mullion.name = `${f + 1}F-B${bIdx + 1} 幕墙铝合金立框 (${m}m)`;
                gGlass.add(mullion);
            }

            const glassPanelRear = new THREE.Mesh(new THREE.BoxGeometry(7.5, floorHeight - 0.65, 0.1), matGlass);
            glassPanelRear.position.set(bx, floorY, -buildingDepth/2);
            glassPanelRear.name = `${f + 1}F-跨度B${bIdx + 1} 北立面窗`;
            gGlass.add(glassPanelRear);
        }
    });

    group.add(gGlass);
    buildingGroups.push(gGlass);

    // Group 5: 阳台与防护栏杆
    const gBalcony = new THREE.Group();
    gBalcony.name = "🛗 阳台与防护栏杆";

    const balconyBays = [-25.2, -16.8, 16.8, 25.2];
    balconyBays.forEach((bx, bIdx) => {
        for (let f = 1; f < 4; f++) {
            const floorY = baseElev + f * floorHeight + 0.3;

            const balcFloor = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.3, 1.4), matStone);
            balcFloor.position.set(bx, floorY, buildingDepth/2 + 0.7);
            balcFloor.castShadow = true;
            balcFloor.name = `${f + 1}F 悬挑阳台底板 (X:${bx}m)`;
            gBalcony.add(balcFloor);

            const balcGlass = new THREE.Mesh(new THREE.BoxGeometry(7.4, 1.0, 0.05), matBalconyGlass);
            balcGlass.position.set(bx, floorY + 0.65, buildingDepth/2 + 1.35);
            balcGlass.name = `${f + 1}F 阳台安全玻璃护栏`;
            gBalcony.add(balcGlass);

            const balcRail = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.08, 0.1), matMetalRailing);
            balcRail.position.set(bx, floorY + 1.18, buildingDepth/2 + 1.35);
            balcRail.name = `${f + 1}F 阳台黑钛合金扶手`;
            gBalcony.add(balcRail);
        }
    });

    group.add(gBalcony);
    buildingGroups.push(gBalcony);

    // Group 6: 主入口雨棚与门廊
    const gEntrance = new THREE.Group();
    gEntrance.name = "🚪 主入口雨棚与门廊";

    const mainDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.0, 0.2), matMullion);
    mainDoorFrame.position.set(0, baseElev + 1.5, buildingDepth/2 + 0.05);
    mainDoorFrame.name = "1F 主入口自动感应双开玻璃门框";
    gEntrance.add(mainDoorFrame);

    const beamLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 4.5), matCanopyFrame);
    beamLeft.position.set(-4.2, baseElev + 3.4, buildingDepth/2 + 2.25);
    beamLeft.castShadow = true;
    beamLeft.name = "雨棚左侧悬臂钢梁";
    gEntrance.add(beamLeft);

    const beamRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 4.5), matCanopyFrame);
    beamRight.position.set(4.2, baseElev + 3.4, buildingDepth/2 + 2.25);
    beamRight.castShadow = true;
    beamRight.name = "雨棚右侧悬臂钢梁";
    gEntrance.add(beamRight);

    const canopyGlass = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.1, 4.8), matCanopyGlass);
    canopyGlass.position.set(0, baseElev + 3.6, buildingDepth/2 + 2.4);
    canopyGlass.castShadow = true;
    canopyGlass.name = "主入口钢化夹胶玻璃雨棚顶盖";
    gEntrance.add(canopyGlass);

    for (let s = 0; s < 3; s++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(12.0 + s*0.6, 0.2, 0.6), matStone);
        step.position.set(0, 0.1 + s*0.2, buildingDepth/2 + 0.3 + s*0.6);
        step.receiveShadow = true;
        step.name = `入口迎宾台阶 Step ${3-s}`;
        gEntrance.add(step);
    }

    group.add(gEntrance);
    buildingGroups.push(gEntrance);

    // Group 7: 内部楼板结构
    const gInterior = new THREE.Group();
    gInterior.name = "🏢 内部层板结构";

    for (let f = 1; f < totalFloors; f++) {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(buildingWidth - 4.8, 0.25, buildingDepth - 1.0), matSlab);
        slab.position.set(0, baseElev + f * floorHeight, 0);
        slab.name = `${f + 1}F 内部钢筋混凝土楼板`;
        gInterior.add(slab);
    }

    group.add(gInterior);
    buildingGroups.push(gInterior);

    // Group 8: 周边景观与设施 (环绕植被 - 精简5颗并均匀分布)
    const gLandscape = new THREE.Group();
    gLandscape.name = "🌳 周边景观与设施 (环绕植被)";

    function addTree(x, z, label) {
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 3.5, 8), matCanopyFrame);
        trunk.position.set(x, 1.75, z);
        trunk.castShadow = true;
        trunk.name = `${label} 树干`;
        gLandscape.add(trunk);

        const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 1), matGrass);
        foliage.position.set(x, 4.5, z);
        foliage.castShadow = true;
        foliage.name = `${label} 树冠`;
        gLandscape.add(foliage);
    }

    // 南侧广场及正前方树木群 (4棵对称分布)
    const frontTreesX = [-32, -16, 16, 32];
    frontTreesX.forEach((tx, idx) => addTree(tx, 19, `南侧前广场绿化树 T${idx + 1}`));

    // 北侧后方绿化树木群 (4棵对称分布)
    const rearTreesX = [-32, -16, 16, 32];
    rearTreesX.forEach((tx, idx) => addTree(tx, -17, `北侧后方景观林 T${idx + 1}`));

    // 东西两侧环绕树木群 (各4棵，共8棵，总计16棵)
    const sideTreesZ = [-12, -4, 4, 12];
    sideTreesZ.forEach((tz, idx) => {
        addTree(-36, tz, `西侧园区景观树 T${idx + 1}`);
        addTree(36, tz, `东侧园区景观树 T${idx + 1}`);
    });

    group.add(gLandscape);
    buildingGroups.push(gLandscape);
}
