// 模型名称：食堂模型
function buildCanteenModel(THREE, group) {
    // ============ 灯光 ============
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    ambientLight.name = "环境光";
    group.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    sunLight.position.set(40, 60, 30);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 200;
    const d = 60;
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

    const canteenGroup = new THREE.Group();
    canteenGroup.name = "🏛️ 校园食堂数字孪生工程";
    group.add(canteenGroup);

    // 建筑关键尺寸 (单位: 米)
    const WIDTH = 37.2;   // X 轴总宽度
    const DEPTH = 28.8;   // Z 轴总进深
    const H_1F = 8.1;     // 1层标高 (原 5.4 * 1.5)
    const H_2F = 15.0;    // 2层/后檐标高 (原 10.0 * 1.5)
    const H_ROOF_MAX = 22.2; // 斜屋顶南侧最高标高 (原 14.8 * 1.5)

    // 材质定义
    const matConcrete = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.6, metalness: 0.1 });
    const matStoneWall = new THREE.MeshStandardMaterial({ color: 0xe7e5e4, roughness: 0.4, metalness: 0.1 });
    const matGlass = new THREE.MeshPhysicalMaterial({
        color: 0x38bdf8, transparent: true, opacity: 0.45, roughness: 0.1, metalness: 0.8, transmission: 0.6, ior: 1.5
    });
    const matFrame = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.8 });
    const matRoofTop = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.2 });
    const matSlab = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
    const matPlaza = new THREE.MeshStandardMaterial({ color: 0xc8d3de, roughness: 0.8 });
    const matGrass = new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.9 });
    const matWoodDoor = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.3 });

    // 1. 周边环境与室外广场组
    const envGroup = new THREE.Group();
    envGroup.name = "🌳 校园绿化与周边广场";
    canteenGroup.add(envGroup);

    // 绿化草地底座
    const grassMesh = new THREE.Mesh(new THREE.BoxGeometry(80, 0.2, 70), matGrass);
    grassMesh.position.set(0, -0.1, 0);
    grassMesh.receiveShadow = true;
    grassMesh.name = "铺装草坪底座";
    envGroup.add(grassMesh);

    // 主入口大理石广场
    const plazaMesh = new THREE.Mesh(new THREE.BoxGeometry(46, 0.22, 22), matPlaza);
    plazaMesh.position.set(0, -0.09, -20);
    plazaMesh.receiveShadow = true;
    plazaMesh.name = "南入口主广场铺装";
    envGroup.add(plazaMesh);

    // 筛选并向外平移后的稀疏杉树坐标（与建筑保持更远距离）
    const firTreePositions = [
        // 西侧草坪（向西平移至 X = -32）
        { pos: [-32, -8], id: 2 },
        { pos: [-32, 12], id: 4 },
        // 东侧草坪（向东平移至 X = 31）
        { pos: [31, -18], id: 6 },
        { pos: [31, 2], id: 8 },
        { pos: [31, 22], id: 10 },
        // 北侧后院（向北平移至 Z = 28）
        { pos: [-14, 28], id: 11 },
        { pos: [6, 28], id: 13 }
    ];
    const firTreeGroup = new THREE.Group();
    firTreeGroup.name = "🌲 校园高大杉树阵列 (稀疏版)";

    const matTrunk = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });
    const matFoliageDark = new THREE.MeshStandardMaterial({ color: 0x14452f, roughness: 0.7 });
    const matFoliageLight = new THREE.MeshStandardMaterial({ color: 0x1e563b, roughness: 0.6 });

    firTreePositions.forEach((item, idx) => {
        const firTree = new THREE.Group();
        const treeHeight = 11 + (item.id % 3) * 1.8;
        firTree.name = `高大杉树 #${item.id} (${treeHeight.toFixed(1)}m)`;

        // 树干
        const trunkGeo = new THREE.CylinderGeometry(0.35, 0.55, treeHeight * 0.4, 8);
        const trunk = new THREE.Mesh(trunkGeo, matTrunk);
        trunk.position.set(0, treeHeight * 0.2, 0);
        trunk.castShadow = true;
        trunk.name = `杉树干 #${item.id}`;
        firTree.add(trunk);

        // 4层塔状针叶树冠
        const layers = 4;
        for (let l = 0; l < layers; l++) {
            const layerProgress = l / layers;
            const coneRadius = 2.8 * (1 - layerProgress * 0.52);
            const coneHeight = treeHeight * 0.28;
            const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 8);
            const foliageMat = l % 2 === 0 ? matFoliageDark : matFoliageLight;
            const cone = new THREE.Mesh(coneGeo, foliageMat);
            cone.position.set(0, treeHeight * 0.26 + l * (treeHeight * 0.16), 0);
            cone.castShadow = true;
            cone.name = `杉树针叶树冠 L${l + 1}`;
            firTree.add(cone);
        }

        firTree.position.set(item.pos[0], 0, item.pos[1]);
        firTreeGroup.add(firTree);
    });
    envGroup.add(firTreeGroup);

    // 2. 建筑主体结构组
    const structGroup = new THREE.Group();
    structGroup.name = "🏛️ 食堂主体结构工程";
    canteenGroup.add(structGroup);

    // 2.1 东西两侧石材塔楼翼房（基于三视图：宽 6.0m，进深 28.8m，斜屋面侧坡压顶，1F/2F 窗洞分格）
    const sideWingsGroup = new THREE.Group();
    sideWingsGroup.name = "🧱 东西侧石材塔楼翼墙工程 (6m)";

    function createStoneWing(isWest) {
        const sideName = isWest ? "西侧" : "东侧";
        const xSign = isWest ? -1 : 1;
        const xCenter = xSign * (WIDTH / 2 - 3.0); // ±15.6m

        const wing = new THREE.Group();
        wing.name = `${sideName}石材塔楼翼墙主体`;

        // 1F 石材底座墙体 (+0.0m 至 +5.4m)
        const wall1F = new THREE.Mesh(new THREE.BoxGeometry(5.8, H_1F, DEPTH - 0.2), matStoneWall);
        wall1F.position.set(xCenter, H_1F / 2, 0);
        wall1F.castShadow = true;
        wall1F.receiveShadow = true;
        wall1F.name = `${sideName} 1F 石材外墙 (+5.4m)`;
        wing.add(wall1F);

        // 2F 沿 Z 轴倾斜顶部墙体 (10.0m 后檐 -> 14.8m 前檐)
        const shape = new THREE.Shape();
        shape.moveTo(DEPTH / 2, H_1F);
        shape.lineTo(-DEPTH / 2, H_1F);
        shape.lineTo(-DEPTH / 2, H_ROOF_MAX - 0.6);
        shape.lineTo(DEPTH / 2, H_2F - 0.2);
        shape.closePath();

        const extrudeWall = new THREE.ExtrudeGeometry(shape, { depth: 5.8, bevelEnabled: false });
        extrudeWall.rotateY(Math.PI / 2);
        const wall2F = new THREE.Mesh(extrudeWall, matStoneWall);
        wall2F.position.set(xCenter - 2.9, 0, 0);
        wall2F.castShadow = true;
        wall2F.receiveShadow = true;
        wall2F.name = `${sideName} 2F 渐变斜顶石材墙体`;
        wing.add(wall2F);

        // 侧立面石材采光窗 (参考东立面图分格)
        const zPositions = [-8.0, 0.0, 8.0];
        zPositions.forEach((zPos, idx) => {
            // 1F 窗户
            const win1F = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.2, 2.4), matFrame);
            win1F.position.set(xCenter + xSign * 2.91, 2.7, zPos);
            win1F.name = `${sideName}翼墙 1F 采光窗 #${idx + 1}`;
            wing.add(win1F);

            const glass1F = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.0, 2.2), matGlass);
            glass1F.position.set(xCenter + xSign * 2.92, 2.7, zPos);
            wing.add(glass1F);

            // 2F 窗户
            const win2F = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.4, 2.4), matFrame);
            win2F.position.set(xCenter + xSign * 2.91, 7.5, zPos);
            win2F.name = `${sideName}翼墙 2F 采光窗 #${idx + 1}`;
            wing.add(win2F);

            const glass2F = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.2, 2.2), matGlass);
            glass2F.position.set(xCenter + xSign * 2.92, 7.5, zPos);
            wing.add(glass2F);
        });

        // 石材分格凹缝横纹
        const stoneBands = [1.8, 3.6, 5.4, 7.2, 9.0, 11.0];
        stoneBands.forEach((yH, bIdx) => {
            const band = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.08, DEPTH + 0.1), matFrame);
            band.position.set(xCenter, yH, 0);
            band.name = `${sideName}石材饰面分格缝 L${bIdx + 1}`;
            wing.add(band);
        });

        // 顶端斜石材压顶檐口 (Roof Parapet Coping Trim)
        const capShape = new THREE.Shape();
        capShape.moveTo(-DEPTH / 2 - 0.3, H_ROOF_MAX - 0.4);
        capShape.lineTo(DEPTH / 2 + 0.3, H_2F);
        capShape.lineTo(DEPTH / 2 + 0.3, H_2F + 0.3);
        capShape.lineTo(-DEPTH / 2 - 0.3, H_ROOF_MAX - 0.1);
        capShape.closePath();

        const capGeo = new THREE.ExtrudeGeometry(capShape, { depth: 6.2, bevelEnabled: false });
        capGeo.rotateY(Math.PI / 2);
        const capMesh = new THREE.Mesh(capGeo, matConcrete);
        capMesh.position.set(xCenter - 3.1, 0, 0);
        capMesh.name = `${sideName}翼墙顶石材压顶檐口`;
        wing.add(capMesh);

        return wing;
    }

    sideWingsGroup.add(createStoneWing(true));  // 西侧翼墙
    sideWingsGroup.add(createStoneWing(false)); // 东侧翼墙
    structGroup.add(sideWingsGroup);

    // 2.2 室内楼板 (1层/2层/顶层)
    const floorGroup = new THREE.Group();
    floorGroup.name = "楼 楼层楼板结构";

    const floor1 = new THREE.Mesh(new THREE.BoxGeometry(WIDTH - 0.4, 0.3, DEPTH - 0.4), matSlab);
    floor1.position.set(0, 0.15, 0);
    floor1.name = "1F 地面楼板 (±0.000)";
    floorGroup.add(floor1);

    const floor2 = new THREE.Mesh(new THREE.BoxGeometry(WIDTH - 6.2, 0.4, DEPTH - 0.4), matSlab);
    floor2.position.set(0, H_1F, 0);
    floor2.name = "2F 餐饮楼层楼板 (+5.400m)";
    floorGroup.add(floor2);

    structGroup.add(floorGroup);

    // 2.3 立面主结构柱阵列 (前立面 6 根通高外柱)
    const columnGroup = new THREE.Group();
    columnGroup.name = "柱 主立面通高承重柱阵列";
    
    // X 轴轴网分布: -18.6, -12.6, -4.2, 4.2, 12.6, 18.6
    const colXPositions = [-18.6, -12.6, -4.2, 4.2, 12.6, 18.6];
    colXPositions.forEach((xPos, idx) => {
        // 柱高适应斜屋顶高度
        const colHeight = H_2F + (14.8 - H_2F) * (1 - (-DEPTH / 2) / DEPTH);
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.8, colHeight, 0.8), matConcrete);
        col.position.set(xPos, colHeight / 2, -DEPTH / 2 - 0.4);
        col.castShadow = true;
        col.receiveShadow = true;
        col.name = "主立面结构外柱 C" + (idx + 1);
        columnGroup.add(col);
    });
    structGroup.add(columnGroup);

    // 3. 倾斜飞檐斜屋顶 (核心造型：北低 10m -> 南高 14.8m)
    const roofGroup = new THREE.Group();
    roofGroup.name = "📐 前倾式斜屋顶与大飞檐";

    // 使用 ExtrudeGeometry 精确拉伸侧面斜屋顶造型
    const roofShape = new THREE.Shape();
    const frontOverhang = 3.6; // 前挑檐 3.6m
    const backOverhang = 1.6;  // 后挑檐 1.6m
    const roofThickness = 0.8; // 屋顶板厚

    const zSouth = -DEPTH / 2 - frontOverhang; // -18.0
    const zNorth = DEPTH / 2 + backOverhang;   // 16.0
    const ySouth = H_ROOF_MAX;                // 14.8
    const yNorth = H_2F + 0.2;                // 10.2

    roofShape.moveTo(zNorth, yNorth);
    roofShape.lineTo(zSouth, ySouth);
    roofShape.lineTo(zSouth, ySouth - roofThickness);
    roofShape.lineTo(zNorth, yNorth - roofThickness);
    roofShape.closePath();

    const extrudeSettings = {
        steps: 1,
        depth: WIDTH + 4.0, // 两侧各挑出 2.0m
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 2
    };

    const roofGeo = new THREE.ExtrudeGeometry(roofShape, extrudeSettings);
    roofGeo.rotateY(Math.PI / 2);
    roofGeo.translate(0, 0, 0); // 居中调整

    const roofMesh = new THREE.Mesh(roofGeo, matRoofTop);
    roofMesh.position.set(- (WIDTH + 4.0) / 2, 0, 0);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofMesh.name = "倾斜大飞檐屋顶主体 (+14.8m)";
    roofGroup.add(roofMesh);

    // 屋底灯光天花板底面
    const soffitGeo = new THREE.BoxGeometry(WIDTH + 3.6, 0.1, DEPTH + 5.0);
    const matSoffit = new THREE.MeshStandardMaterial({ color: 0xfafaf9, roughness: 0.3 });
    const soffitMesh = new THREE.Mesh(soffitGeo, matSoffit);
    soffitMesh.position.set(0, (ySouth + yNorth) / 2 - 0.5, -1);
    soffitMesh.rotation.x = Math.atan2(ySouth - yNorth, zNorth - zSouth);
    soffitMesh.name = "屋顶底面天花吊顶 (Soffit)";
    roofGroup.add(soffitMesh);

    canteenGroup.add(roofGroup);

    // 4. 北立面采光玻璃幕墙系统（基于三视图北立面图：高10.0m，3跨8.4m分格，带腰线与后门）
    const curtainGroup = new THREE.Group();
    curtainGroup.name = "🪟 采光玻璃幕墙系统";

    // 南立面大玻璃幕墙（中间 25.2m 区域）
    const glassWidth = 25.2;
    const glassHeight = H_2F + 2.0;
    const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(glassWidth, glassHeight, 0.1), matGlass);
    frontGlass.position.set(0, glassHeight / 2, -DEPTH / 2 + 0.1);
    frontGlass.name = "南主立面通高玻璃幕墙";
    curtainGroup.add(frontGlass);

    // 北立面精线玻璃幕墙组 (North Facade Curtain Wall)
    const northCurtainGroup = new THREE.Group();
    northCurtainGroup.name = "北立面三跨通高玻璃幕墙组 (背面 10.0m)";

    // 1F/2F 玻璃大面
    const northGlassMesh = new THREE.Mesh(new THREE.BoxGeometry(glassWidth, H_2F, 0.1), matGlass);
    northGlassMesh.position.set(0, H_2F / 2, DEPTH / 2 - 0.1);
    northGlassMesh.name = "北立面双层采光玻璃";
    northCurtainGroup.add(northGlassMesh);

    // 北立面 +5.400m 层间结构腰线/横梁 (Spandrel Beam Band)
    const northSpandrel = new THREE.Mesh(new THREE.BoxGeometry(glassWidth + 0.2, 0.6, 0.25), matFrame);
    northSpandrel.position.set(0, H_1F, DEPTH / 2 - 0.1);
    northSpandrel.name = "北立面 +5.400m 层间结构腰线";
    northCurtainGroup.add(northSpandrel);

    // 北立面顶檐口挡板梁 (+10.000m)
    const northEaveBeam = new THREE.Mesh(new THREE.BoxGeometry(glassWidth + 0.4, 0.4, 0.3), matConcrete);
    northEaveBeam.position.set(0, H_2F - 0.2, DEPTH / 2 - 0.1);
    northEaveBeam.name = "北立面顶檐口混凝土梁 (+10.0m)";
    northCurtainGroup.add(northEaveBeam);

    // 北立面 3 跨竖向分格龙骨柱 (8.4m 轴线: x = -12.6, -4.2, 4.2, 12.6)
    const northBayX = [-12.6, -4.2, 4.2, 12.6];
    northBayX.forEach((xPos, bIdx) => {
        const mainMullion = new THREE.Mesh(new THREE.BoxGeometry(0.2, H_2F, 0.25), matFrame);
        mainMullion.position.set(xPos, H_2F / 2, DEPTH / 2 - 0.15);
        mainMullion.castShadow = true;
        mainMullion.name = `北立面主分格钢柱 M${bIdx + 1}`;
        northCurtainGroup.add(mainMullion);
    });

    // 北立面细分竖龙骨 (每跨分成 4 小格)
    for (let x = -11.55; x <= 11.55; x += 2.1) {
        if (Math.abs(x % 8.4) > 0.3) {
            const subMullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, H_2F, 0.15), matFrame);
            subMullion.position.set(x, H_2F / 2, DEPTH / 2 - 0.12);
            subMullion.name = `北立面竖分格龙骨 (${x.toFixed(1)}m)`;
            northCurtainGroup.add(subMullion);
        }
    }

    // 北立面横向分格龙骨 (1.8m, 3.6m, 7.2m, 8.8m)
    const northHLevels = [1.8, 3.6, 7.2, 8.8];
    northHLevels.forEach(h => {
        const hMullion = new THREE.Mesh(new THREE.BoxGeometry(glassWidth, 0.08, 0.15), matFrame);
        hMullion.position.set(0, h, DEPTH / 2 - 0.12);
        hMullion.name = `北立面横向分格龙骨 (+${h}m)`;
        northCurtainGroup.add(hMullion);
    });

    // 北立面中央后门出入口
    const backDoorGroup = new THREE.Group();
    backDoorGroup.name = "北立面后门与应急通道门组";
    
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.6, 0.2), matFrame);
    doorFrame.position.set(0, 1.3, DEPTH / 2 - 0.2);
    doorFrame.name = "北后门框结构";
    backDoorGroup.add(doorFrame);

    const backDoorLeft = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.1), matGlass);
    backDoorLeft.position.set(-0.85, 1.2, DEPTH / 2 - 0.18);
    backDoorLeft.name = "北后门左扇玻璃门";
    backDoorGroup.add(backDoorLeft);

    const backDoorRight = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.4, 0.1), matGlass);
    backDoorRight.position.set(0.85, 1.2, DEPTH / 2 - 0.18);
    backDoorRight.name = "北后门右扇玻璃门";
    backDoorGroup.add(backDoorRight);

    northCurtainGroup.add(backDoorGroup);
    curtainGroup.add(northCurtainGroup);

    // 玻璃幕墙铝合金龙骨格栅 (Mullions Grid)
    const gridGroup = new THREE.Group();
    gridGroup.name = "幕墙铝合金金属分格框架";
    
    // 竖向龙骨
    for (let x = -12; x <= 12; x += 2.1) {
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, glassHeight, 0.15), matFrame);
        mullion.position.set(x, glassHeight / 2, -DEPTH / 2 + 0.15);
        gridGroup.add(mullion);
    }
    // 横向龙骨
    const hLevels = [1.8, 3.6, 5.4, 7.2, 8.8];
    hLevels.forEach(h => {
        const hMullion = new THREE.Mesh(new THREE.BoxGeometry(glassWidth, 0.08, 0.15), matFrame);
        hMullion.position.set(0, h, -DEPTH / 2 + 0.15);
        gridGroup.add(hMullion);
    });
    curtainGroup.add(gridGroup);

    canteenGroup.add(curtainGroup);

    // 5. 南主入口雨棚与进出大门 (Entrance Canopy)
    const entranceGroup = new THREE.Group();
    entranceGroup.name = "🚪 南门厅主入口雨棚系统";

    // 突出雨棚顶盖
    const canopyWidth = 9.6;
    const canopyDepth = 4.2;
    const canopyMesh = new THREE.Mesh(new THREE.BoxGeometry(canopyWidth, 0.3, canopyDepth), matConcrete);
    canopyMesh.position.set(0, 4.2, -DEPTH / 2 - canopyDepth / 2);
    canopyMesh.castShadow = true;
    canopyMesh.receiveShadow = true;
    canopyMesh.name = "主入口悬挑雨棚顶板";
    entranceGroup.add(canopyMesh);

    // 雨棚支撑钢柱
    const p1 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 4.2), matFrame);
    p1.position.set(-canopyWidth / 2 + 0.4, 2.1, -DEPTH / 2 - canopyDepth + 0.4);
    p1.name = "雨棚左支撑钢柱";
    entranceGroup.add(p1);

    const p2 = p1.clone();
    p2.position.set(canopyWidth / 2 - 0.4, 2.1, -DEPTH / 2 - canopyDepth + 0.4);
    p2.name = "雨棚右支撑钢柱";
    entranceGroup.add(p2);

    // 自动感应玻璃门
    const doorGroup = new THREE.Group();
    doorGroup.name = "主入口感应玻璃门组";
    const doorLeaf1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.8, 0.1), matFrame);
    doorLeaf1.position.set(-1.0, 1.4, -DEPTH / 2 + 0.2);
    doorLeaf1.name = "左自动玻璃门";
    doorGroup.add(doorLeaf1);

    const doorLeaf2 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.8, 0.1), matFrame);
    doorLeaf2.position.set(1.0, 1.4, -DEPTH / 2 + 0.2);
    doorLeaf2.name = "右自动玻璃门";
    doorGroup.add(doorLeaf2);

    entranceGroup.add(doorGroup);
    canteenGroup.add(entranceGroup);

    // 6. 室内食堂设施（桌椅/售餐台布置）
    const interiorGroup = new THREE.Group();
    interiorGroup.name = "🪑 室内食堂餐饮设施布局";

    // 售餐保温打饭窗口台 (1层与2层靠后区域)
    const counterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const counter1 = new THREE.Mesh(new THREE.BoxGeometry(22, 1.1, 1.8), counterMat);
    counter1.position.set(0, 0.55, 8.0);
    counter1.name = "1F 售餐服务窗口台";
    interiorGroup.add(counter1);

    const counter2 = new THREE.Mesh(new THREE.BoxGeometry(22, 1.1, 1.8), counterMat);
    counter2.position.set(0, H_1F + 0.55, 8.0);
    counter2.name = "2F 特色餐饮服务台";
    interiorGroup.add(counter2);

    // 餐桌椅矩阵（1层大厅）
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x475569 });

    const diningTablesGroup = new THREE.Group();
    diningTablesGroup.name = "1F/2F 集中就餐桌椅矩阵";

    for (let x = -9; x <= 9; x += 4.5) {
        for (let z = -8; z <= 2; z += 3.5) {
            // 1层桌椅
            const table = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 1.0), tableMat);
            table.position.set(x, 0.4, z);
            table.name = `1F 4人就餐桌 (${x},${z})`;
            diningTablesGroup.add(table);

            // 2层桌椅
            const table2F = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.8, 1.0), tableMat);
            table2F.position.set(x, H_1F + 0.4, z);
            table2F.name = `2F 观景就餐桌 (${x},${z})`;
            diningTablesGroup.add(table2F);
        }
    }
    interiorGroup.add(diningTablesGroup);
    canteenGroup.add(interiorGroup);
}
