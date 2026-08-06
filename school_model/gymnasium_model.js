function buildGymnasiumModel(THREE, group) {
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

    const W = 36.8, D = 33.6;
    const gymGroup = new THREE.Group();
    gymGroup.name = "🏛️ 体育馆主体建筑";
    group.add(gymGroup);

    // 材质库
    const matConcrete = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.6, metalness: 0.1 }); // 花岗岩/石材墙面
    const matDarkWall = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5, metalness: 0.2 }); // 暗色侧墙与饰面
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.65 }); // 蓝灰色玻璃幕墙
    const matMullion = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 }); // 铝合金立柱与龙骨
    const matRoofTop = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.4 }); // 屋顶铝镁锰板
    const matSoffit = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4, metalness: 0.3 }); // 屋檐下檐口板
    const matCanopy = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2, metalness: 0.7 }); // 雨棚材质
    const matPlaza = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8, metalness: 0.1 }); // 广场铺装
    const matGrass = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9, metalness: 0.0 }); // 绿化带

    // ==================== 1. 地基与周边广场 (Plaza & Foundation) ====================
    const baseGroup = new THREE.Group();
    baseGroup.name = "🏁 1. 地基与入口广场";
    gymGroup.add(baseGroup);

    // 地盘地面 (缩小尺寸以更好地适配体育馆主体模型)
    const ground = new THREE.Mesh(new THREE.BoxGeometry(64, 0.2, 64), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 }));
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    ground.name = "室外地坪 (±0.000)";
    baseGroup.add(ground);

    // 体育馆抬高基座台阶
    const podium = new THREE.Mesh(new THREE.BoxGeometry(W + 10, 0.6, D + 10), matPlaza);
    podium.position.set(0, 0.3, 0);
    podium.receiveShadow = true;
    podium.castShadow = true;
    podium.name = "主馆入口台阶与平台";
    baseGroup.add(podium);

    // 入口主阶梯 (南面)
    for (let i = 0; i < 3; i++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(16, 0.15, 1.2 - i * 0.3), matPlaza);
        step.position.set(0, 0.15 * i + 0.075, D / 2 + 5.0 + i * 0.5);
        step.receiveShadow = true;
        step.name = `入口阶梯 第${i+1}级`;
        baseGroup.add(step);
    }

    // ==================== 2. 混凝土主体墙体与内部楼板 (Concrete Structure & Walls) ====================
    const wallGroup = new THREE.Group();
    wallGroup.name = "🧱 2. 混凝土主体结构与墙体";
    gymGroup.add(wallGroup);

    // 契合屋顶倾斜角度的侧墙 (东/西侧墙 梯形截面，与屋顶底面无缝对接)
    const sideWallShape = new THREE.Shape();
    sideWallShape.moveTo(-D / 2, 0);       // 北侧底部 (-16.8, 0)
    sideWallShape.lineTo(D / 2, 0);        // 南侧底部 (+16.8, 0)
    sideWallShape.lineTo(D / 2, 17.23);    // 南侧顶部 (+16.8, 17.23) 完美贴合屋顶南沿底部
    sideWallShape.lineTo(-D / 2, 12.67);   // 北侧顶部 (-16.8, 12.67) 完美贴合屋顶北沿底部
    sideWallShape.closePath();

    const sideWallGeo = new THREE.ExtrudeGeometry(sideWallShape, { depth: 0.8, bevelEnabled: false });

    // 东立面实体混凝土墙 (右侧/侧面)
    const eastWall = new THREE.Mesh(sideWallGeo, matConcrete);
    eastWall.rotation.y = -Math.PI / 2;
    eastWall.position.set(W / 2, 0, 0);
    eastWall.castShadow = true;
    eastWall.receiveShadow = true;
    eastWall.name = "东侧实墙 (East Concrete Facade)";
    wallGroup.add(eastWall);

    // 西立面实体混凝土墙 (左侧/侧面)
    const westWall = new THREE.Mesh(sideWallGeo, matConcrete);
    westWall.rotation.y = -Math.PI / 2;
    westWall.position.set(-W / 2 + 0.8, 0, 0);
    westWall.castShadow = true;
    westWall.receiveShadow = true;
    westWall.name = "西侧实墙 (West Concrete Facade)";
    wallGroup.add(westWall);

    // 北立面后墙 (背面 高度精确匹配屋顶后沿底部 12.67m)
    const northWall = new THREE.Mesh(new THREE.BoxGeometry(W, 12.67, 0.8), matConcrete);
    northWall.position.set(0, 12.67 / 2, -D / 2 + 0.4);
    northWall.castShadow = true;
    northWall.receiveShadow = true;
    northWall.name = "北立面后墙 (North Rear Wall)";
    wallGroup.add(northWall);

    // 内部楼板 (一层 6.000m)
    const floor1 = new THREE.Mesh(new THREE.BoxGeometry(W - 1.6, 0.3, D - 1.6), matDarkWall);
    floor1.position.set(0, 6.0, 0);
    floor1.name = "二层楼板标高 (6.000m)";
    wallGroup.add(floor1);

    // ==================== 3. 玻璃幕墙与南立面主结构柱 (Glass Curtain Wall & Columns) ====================
    const facadeGroup = new THREE.Group();
    facadeGroup.name = "🪟 3. 立面玻璃幕墙与结构柱";
    gymGroup.add(facadeGroup);

    // 南立面通高玻璃幕墙 (高度增至 17.23m 直达屋顶底部)
    const southGlass = new THREE.Mesh(new THREE.BoxGeometry(W - 1.6, 17.23, 0.2), matGlass);
    southGlass.position.set(0, 17.23 / 2, D / 2 - 0.5);
    southGlass.name = "南立面全景玻璃幕墙 (Main Facade Glass)";
    facadeGroup.add(southGlass);

    // 南立面 6根外立面通高承重柱 (高度延伸至 17.23m)
    const colXPositions = [-W/2 + 3.0, -W/2 + 9.0, -W/2 + 18.0, W/2 - 18.0, W/2 - 9.0, W/2 - 3.0];
    colXPositions.forEach((x, idx) => {
        const column = new THREE.Mesh(new THREE.BoxGeometry(0.8, 17.23, 0.8), matConcrete);
        column.position.set(x, 17.23 / 2, D / 2 + 0.2);
        column.castShadow = true;
        column.receiveShadow = true;
        column.name = "南立面主体结构柱 C" + (idx + 1);
        facadeGroup.add(column);
    });

    // 玻璃幕墙横向分格铝合金龙骨
    const transom1 = new THREE.Mesh(new THREE.BoxGeometry(W - 1.2, 0.25, 0.4), matMullion);
    transom1.position.set(0, 6.0, D / 2 - 0.4);
    transom1.name = "二层幕墙横梁 (6.000m Transom)";
    facadeGroup.add(transom1);

    const transom2 = new THREE.Mesh(new THREE.BoxGeometry(W - 1.2, 0.25, 0.4), matMullion);
    transom2.position.set(0, 13.2, D / 2 - 0.4);
    transom2.name = "檐口幕墙中梁 (13.200m Transom)";
    facadeGroup.add(transom2);

    const transom3 = new THREE.Mesh(new THREE.BoxGeometry(W - 1.2, 0.25, 0.4), matMullion);
    transom3.position.set(0, 17.1, D / 2 - 0.4);
    transom3.name = "顶端幕墙收口梁 (17.100m Transom)";
    facadeGroup.add(transom3);

    // 细分竖向龙骨网格
    for (let x = -W / 2 + 2; x <= W / 2 - 2; x += 1.8) {
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.1, 17.23, 0.15), matMullion);
        mullion.position.set(x, 17.23 / 2, D / 2 - 0.35);
        mullion.name = `幕墙竖向龙骨 (X=${x.toFixed(1)})`;
        facadeGroup.add(mullion);
    }

    // 东/西/北立面采光窗
    [-D/4, 0, D/4].forEach((z, idx) => {
        const windowE = new THREE.Mesh(new THREE.BoxGeometry(0.9, 4.0, 1.2), matGlass);
        windowE.position.set(W / 2 - 0.4, 7.5, z);
        windowE.name = `东侧采光竖窗 W-E${idx+1}`;
        facadeGroup.add(windowE);

        const windowW = new THREE.Mesh(new THREE.BoxGeometry(0.9, 4.0, 1.2), matGlass);
        windowW.position.set(-W / 2 + 0.4, 7.5, z);
        windowW.name = `西侧采光竖窗 W-W${idx+1}`;
        facadeGroup.add(windowW);
    });

    // 北立面横向条状窗
    const northWindow1 = new THREE.Mesh(new THREE.BoxGeometry(W - 8, 2.0, 0.9), matGlass);
    northWindow1.position.set(0, 3.5, -D / 2 + 0.4);
    northWindow1.name = "北立面一层带状窗";
    facadeGroup.add(northWindow1);

    const northWindow2 = new THREE.Mesh(new THREE.BoxGeometry(W - 8, 2.0, 0.9), matGlass);
    northWindow2.position.set(0, 8.5, -D / 2 + 0.4);
    northWindow2.name = "北立面二层带状窗";
    facadeGroup.add(northWindow2);

    // ==================== 4. 倾斜大跨度屋顶系统 (Sloped Floating Roof Structure) ====================
    const roofGroup = new THREE.Group();
    roofGroup.name = "顶 4. 倾斜大跨度屋顶系统";
    gymGroup.add(roofGroup);

    const roofWidth = W + 6.0;   // 42.8m
    const roofDepth = 39.8;      // 前后总跨度 39.8m
    const roofThickness = 0.8;

    // 倾斜计算: 南高 18.6m, 北低 13.2m
    const slopeAngle = Math.atan2(5.4, roofDepth);

    // 组枢轴位置设在屋顶中心点 (0, 15.9, 1.1)
    roofGroup.position.set(0, 15.9, 1.1);
    roofGroup.rotation.x = -slopeAngle; // 绕X轴负旋转使南高北低

    // 主屋面板 (Sloped Roof Board)
    const roofMesh = new THREE.Mesh(new THREE.BoxGeometry(roofWidth, roofThickness, roofDepth), matRoofTop);
    roofMesh.position.set(0, 0, 0);
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    roofMesh.name = "大跨度双向倾斜屋顶 (Sloped Roof)";
    roofGroup.add(roofMesh);

    // 屋檐金属前封边 (Front Eaves Fascia) —— 嵌套在屋顶组中，紧贴前沿无缝连结
    const fasciaFront = new THREE.Mesh(new THREE.BoxGeometry(roofWidth + 0.2, roofThickness + 0.2, 0.3), matMullion);
    fasciaFront.position.set(0, 0, roofDepth / 2);
    fasciaFront.name = "南立面屋顶前挑檐封边 (Front Eaves Fascia)";
    roofGroup.add(fasciaFront);

    // 屋檐金属后封边 (Rear Eaves Fascia)
    const fasciaRear = new THREE.Mesh(new THREE.BoxGeometry(roofWidth + 0.2, roofThickness + 0.2, 0.3), matMullion);
    fasciaRear.position.set(0, 0, -roofDepth / 2);
    fasciaRear.name = "北立面屋顶后挑檐封边 (Rear Eaves Fascia)";
    roofGroup.add(fasciaRear);

    // 侧向封边 (East / West Fascias)
    const fasciaEast = new THREE.Mesh(new THREE.BoxGeometry(0.3, roofThickness + 0.2, roofDepth), matMullion);
    fasciaEast.position.set(roofWidth / 2, 0, 0);
    fasciaEast.name = "东侧屋顶挑檐封边";
    roofGroup.add(fasciaEast);

    const fasciaWest = new THREE.Mesh(new THREE.BoxGeometry(0.3, roofThickness + 0.2, roofDepth), matMullion);
    fasciaWest.position.set(-roofWidth / 2, 0, 0);
    fasciaWest.name = "西侧屋顶挑檐封边";
    roofGroup.add(fasciaWest);

    // 屋顶底面檐口吊顶板 (Soffit)
    const soffit = new THREE.Mesh(new THREE.BoxGeometry(roofWidth - 0.2, 0.1, roofDepth - 0.2), matSoffit);
    soffit.position.set(0, -roofThickness / 2 - 0.05, 0);
    soffit.name = "屋檐铝板吊顶 (Roof Ceiling Soffit)";
    roofGroup.add(soffit);

    // ==================== 5. 主入口雨棚与门斗 (Main Entrance Canopy & Porch) ====================
    const canopyGroup = new THREE.Group();
    canopyGroup.name = "🚪 5. 主入口雨棚与门斗";
    gymGroup.add(canopyGroup);

    // 雨棚顶板
    const canopyRoof = new THREE.Mesh(new THREE.BoxGeometry(11.0, 0.4, 4.5), matCanopy);
    canopyRoof.position.set(0, 4.2, D / 2 + 2.0);
    canopyRoof.castShadow = true;
    canopyRoof.name = "主入口悬挑雨棚";
    canopyGroup.add(canopyRoof);

    // 雨棚支撑钢柱
    [-4.8, 4.8].forEach((x, idx) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 3.6, 16), matMullion);
        pillar.position.set(x, 2.4, D / 2 + 3.8);
        pillar.castShadow = true;
        pillar.name = `雨棚支撑钢柱 Pillar-${idx+1}`;
        canopyGroup.add(pillar);
    });

    // 玻璃自动感应大门
    const entranceDoor = new THREE.Mesh(new THREE.BoxGeometry(7.0, 3.2, 0.2), matGlass);
    entranceDoor.position.set(0, 2.2, D / 2 - 0.2);
    entranceDoor.name = "主入口玻璃感应门";
    canopyGroup.add(entranceDoor);

    // ==================== 6. 周边景观与树木 (Landscape & Environment) ====================
    const landscapeGroup = new THREE.Group();
    landscapeGroup.name = "🌳 6. 周边景观与绿化";
    gymGroup.add(landscapeGroup);

    // 前广场两侧绿化带
    const lawnLeft = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 15), matGrass);
    lawnLeft.position.set(-W / 2 - 4, 0.35, D / 2 + 5);
    lawnLeft.name = "西侧绿化带 Lawn-West";
    landscapeGroup.add(lawnLeft);

    const lawnRight = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 15), matGrass);
    lawnRight.position.set(W / 2 + 4, 0.35, D / 2 + 5);
    lawnRight.name = "东侧绿化带 Lawn-East";
    landscapeGroup.add(lawnRight);

    // 生成低多边形景观树
    const createTree = (x, z, name) => {
        const tree = new THREE.Group();
        tree.name = name;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 2.5, 8), matDarkWall);
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        tree.add(trunk);

        const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.8, 4.0, 8), matGrass);
        leaves.position.y = 4.0;
        leaves.castShadow = true;
        tree.add(leaves);

        tree.position.set(x, 0.3, z);
        return tree;
    };

    [
        [-22, D/2 + 2, "景观银杏树 T1"],
        [-22, D/2 + 8, "景观银杏树 T2"],
        [22, D/2 + 2, "景观银杏树 T3"],
        [22, D/2 + 8, "景观银杏树 T4"],
        [-24, -10, "侧区景观树 T5"],
        [24, -10, "侧区景观树 T6"]
    ].forEach(t => landscapeGroup.add(createTree(t[0], t[1], t[2])));
}