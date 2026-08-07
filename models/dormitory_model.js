// 模型名称：宿舍楼模型
function buildDormitoryModel(THREE, group) {
    // 色彩常量定义 (现代校园建筑风)
    const COLOR_WALL_MAIN   = 0xf4f4f0; // 主墙面米白瓷砖
    const COLOR_WALL_BRICK  = 0xaa3a2a; // 阳台/装饰红砖色
    const COLOR_BASE_STONE  = 0x334155; // 底部基座深灰色
    const COLOR_GLASS       = 0x1e293b; // 窗户/连廊深色玻璃
    const COLOR_RAILING     = 0x64748b; // 阳台铝合金栏杆
    const COLOR_AC_UNIT     = 0xe2e8f0; // 空调外机白色
    const COLOR_ROOF_FLOOR  = 0x475569; // 屋顶沥青地面
    const COLOR_PAVER       = 0x94a3b8; // 广场铺装路面
    const COLOR_ROAD        = 0x334155; // 沥青主干道
    const COLOR_GRASS       = 0x2e6b45; // 校园绿化草坪
    const COLOR_SOLAR_PANEL = 0x1e3a8a; // 太阳能板晶硅蓝
    const COLOR_TRUNK       = 0x4a3525; // 高大树木棕褐色树干
    const COLOR_LEAF_DARK   = 0x144223; // 墨绿深叶色
    const COLOR_LEAF_MID    = 0x236b38; // 经典茂密树叶绿
    const COLOR_LEAF_LIGHT  = 0x388e4d; // 树冠顶层迎光鲜绿

    // 1. 添加环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    ambientLight.name = "主环境光";
    group.add(ambientLight);

    // 2. 添加太阳平行光
    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.6);
    sunLight.name = "太阳日光";
    sunLight.position.set(50, 75, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 600;
    const shadowDim = 100;
    sunLight.shadow.camera.left = -shadowDim;
    sunLight.shadow.camera.right = shadowDim;
    sunLight.shadow.camera.top = shadowDim;
    sunLight.shadow.camera.bottom = -shadowDim;
    sunLight.shadow.bias = -0.0001;
    group.add(sunLight);

    // 3. 动态生成 Canvas 精细贴图
    const brickCanvas = document.createElement('canvas');
    brickCanvas.width = 512; brickCanvas.height = 512;
    const bCtx = brickCanvas.getContext('2d');
    bCtx.fillStyle = '#a83222'; bCtx.fillRect(0, 0, 512, 512);
    bCtx.strokeStyle = '#d4cebe'; bCtx.lineWidth = 3;
    for (let y = 0; y < 512; y += 32) {
        bCtx.beginPath(); bCtx.moveTo(0, y); bCtx.lineTo(512, y); bCtx.stroke();
        const offset = (y / 32) % 2 === 0 ? 0 : 32;
        for (let x = offset; x < 512; x += 64) {
            bCtx.beginPath(); bCtx.moveTo(x, y); bCtx.lineTo(x, y + 32); bCtx.stroke();
        }
    }
    const brickTexture = new THREE.CanvasTexture(brickCanvas);
    brickTexture.wrapS = THREE.RepeatWrapping; brickTexture.wrapT = THREE.RepeatWrapping;
    brickTexture.repeat.set(4, 4);

    const solarCanvas = document.createElement('canvas');
    solarCanvas.width = 256; solarCanvas.height = 256;
    const sCtx = solarCanvas.getContext('2d');
    sCtx.fillStyle = '#0f2b5c'; sCtx.fillRect(0, 0, 256, 256);
    sCtx.strokeStyle = '#38bdf8'; sCtx.lineWidth = 2;
    for (let i = 0; i <= 256; i += 32) {
        sCtx.beginPath(); sCtx.moveTo(0, i); sCtx.lineTo(256, i); sCtx.stroke();
        sCtx.beginPath(); sCtx.moveTo(i, 0); sCtx.lineTo(i, 256); sCtx.stroke();
    }
    const solarTexture = new THREE.CanvasTexture(solarCanvas);

    function createSignboardTexture(text) {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#1e293b'; ctx.fillRect(0, 0, 512, 128);
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 8;
        ctx.strokeRect(6, 6, 500, 116);
        ctx.fillStyle = '#ffffff'; ctx.font = 'bold 54px sans-serif';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 64);
        return new THREE.CanvasTexture(canvas);
    }

    // 4. 构建地面环境系统
    const groundGroup = new THREE.Group();
    groundGroup.name = "公寓园区地面组";

    function adaptGroundTransform(obj, origX, origY, origZ) {
        obj.position.set(origX * 0.67 + 16.65, origY, origZ * 0.79 + 12.27);
        obj.scale.set(0.67, 0.70, 0.79);
    }

    const mainGroundGeo = new THREE.PlaneGeometry(150, 110);
    const mainGroundMat = new THREE.MeshStandardMaterial({ color: COLOR_ROAD, roughness: 0.8 });
    const mainGround = new THREE.Mesh(mainGroundGeo, mainGroundMat);
    mainGround.rotation.x = -Math.PI / 2;
    mainGround.position.set(16.65, 0.00, 16.61);
    mainGround.scale.set(0.67, 0.60, 0.79);
    mainGround.receiveShadow = true;
    mainGround.name = "园区主沥青地坪";
    groundGroup.add(mainGround);

    const plazaGeo = new THREE.PlaneGeometry(120, 50);
    const plazaMat = new THREE.MeshStandardMaterial({ color: COLOR_PAVER, roughness: 0.6 });
    const plazaMesh = new THREE.Mesh(plazaGeo, plazaMat);
    plazaMesh.rotation.x = -Math.PI / 2;
    plazaMesh.position.set(16.65, 0.05, 29.18);
    plazaMesh.scale.set(0.67, 0.40, 0.79);
    plazaMesh.receiveShadow = true;
    plazaMesh.name = "公寓楼前休闲广场";
    groundGroup.add(plazaMesh);

    const lawnConfigs = [
        { w: 120, d: 15, x: 0, z: 40, name: "南侧主绿化带" },
        { w: 12, d: 70, x: -62, z: -5, name: "西侧隔离绿化带" },
        { w: 12, d: 70, x: 62, z: -5, name: "东侧隔离绿化带" },
    ];
    lawnConfigs.forEach(cfg => {
        const lawnGeo = new THREE.PlaneGeometry(cfg.w, cfg.d);
        const lawnMat = new THREE.MeshStandardMaterial({ color: COLOR_GRASS, roughness: 0.9 });
        const lawn = new THREE.Mesh(lawnGeo, lawnMat);
        lawn.rotation.x = -Math.PI / 2;
        adaptGroundTransform(lawn, cfg.x, 0.08, cfg.z);
        lawn.receiveShadow = true;
        lawn.name = cfg.name;
        groundGroup.add(lawn);
    });

    const roadLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let lineIdx = 1;
    for (let lx = -55; lx <= 55; lx += 10) {
        const lineGeo = new THREE.PlaneGeometry(4, 0.3);
        const lineMesh = new THREE.Mesh(lineGeo, roadLineMat);
        lineMesh.rotation.x = -Math.PI / 2;
        adaptGroundTransform(lineMesh, lx, 0.06, 30);
        lineMesh.name = `广场车道标线_${lineIdx++}`;
        groundGroup.add(lineMesh);
    }

    group.add(groundGroup);

    // 5. 核心模型构造函数：创建单幢高精细学生公寓
    function createDormitoryBuilding(buildingIdx) {
        const bGroup = new THREE.Group();
        bGroup.name = `学生公寓_${buildingIdx}号楼`;

        const bW = 28;  
        const bD = 13;  
        const floors = 6;
        const floorH = 3.2;
        const totalH = floors * floorH;

        const baseGeo = new THREE.BoxGeometry(bW + 0.8, 1.0, bD + 0.8);
        const baseMat = new THREE.MeshStandardMaterial({ color: COLOR_BASE_STONE, roughness: 0.8 });
        const baseMesh = new THREE.Mesh(baseGeo, baseMat);
        baseMesh.position.set(0, 0.5, 0);
        baseMesh.receiveShadow = true;
        baseMesh.castShadow = true;
        baseMesh.name = `楼宇防潮基座_${buildingIdx}`;
        bGroup.add(baseMesh);

        const coreGeo = new THREE.BoxGeometry(bW, totalH, bD);
        const coreMat = new THREE.MeshStandardMaterial({ color: COLOR_WALL_MAIN, roughness: 0.6 });
        const coreMesh = new THREE.Mesh(coreGeo, coreMat);
        coreMesh.position.set(0, 1.0 + totalH / 2, 0);
        coreMesh.castShadow = true;
        coreMesh.receiveShadow = true;
        coreMesh.name = `外墙主体骨架_${buildingIdx}`;
        bGroup.add(coreMesh);

        const roomMat = new THREE.MeshStandardMaterial({ color: COLOR_WALL_BRICK, map: brickTexture, roughness: 0.7 });
        const glassMat = new THREE.MeshStandardMaterial({ color: COLOR_GLASS, metalness: 0.8, roughness: 0.2 });
        const railMat = new THREE.MeshStandardMaterial({ color: COLOR_RAILING, metalness: 0.7, roughness: 0.3 });
        const acMat = new THREE.MeshStandardMaterial({ color: COLOR_AC_UNIT, roughness: 0.4 });
        const hangerMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.1 });

        const roomBaysX = [-11, -7.2, -3.4, 3.4, 7.2, 11];

        for (let f = 0; f < floors; f++) {
            const floorY = 1.0 + f * floorH + floorH / 2;

            const floorBeamGeo = new THREE.BoxGeometry(bW + 0.3, 0.25, bD + 0.3);
            const floorBeam = new THREE.Mesh(floorBeamGeo, coreMat);
            floorBeam.position.set(0, 1.0 + f * floorH, 0);
            floorBeam.castShadow = true;
            floorBeam.name = `F${f+1}_腰线分界梁_${buildingIdx}`;
            bGroup.add(floorBeam);

            roomBaysX.forEach((rx, roomIdx) => {
                const balconyGroup = new THREE.Group();
                balconyGroup.name = `F${f+1}_宿舍阳台组_${buildingIdx}_${roomIdx+1}`;
                balconyGroup.position.set(rx, floorY - 0.2, bD / 2 + 0.6);

                const balFloorGeo = new THREE.BoxGeometry(3.2, 0.2, 1.2);
                const balFloor = new THREE.Mesh(balFloorGeo, coreMat);
                balFloor.position.set(0, -1.3, 0);
                balFloor.castShadow = true;
                balFloor.receiveShadow = true;
                balFloor.name = `F${f+1}_阳台底板_${roomIdx+1}`;
                balconyGroup.add(balFloor);

                const balWallGeo = new THREE.BoxGeometry(3.2, 0.7, 0.12);
                const balWall = new THREE.Mesh(balWallGeo, roomMat);
                balWall.position.set(0, -0.85, 0.54);
                balWall.castShadow = true;
                balWall.name = `F${f+1}_阳台红砖矮墙_${roomIdx+1}`;
                balconyGroup.add(balWall);

                const railGeo = new THREE.BoxGeometry(3.2, 0.35, 0.05);
                const railMesh = new THREE.Mesh(railGeo, railMat);
                railMesh.position.set(0, -0.32, 0.54);
                railMesh.name = `F${f+1}_阳台防护栏杆_${roomIdx+1}`;
                balconyGroup.add(railMesh);

                const doorGeo = new THREE.BoxGeometry(2.8, 2.2, 0.1);
                const doorMesh = new THREE.Mesh(doorGeo, glassMat);
                doorMesh.position.set(0, 0.1, -0.5);
                doorMesh.name = `F${f+1}_阳台推拉门_${roomIdx+1}`;
                balconyGroup.add(doorMesh);

                const hangerGeo = new THREE.CylinderGeometry(0.02, 0.02, 3.0, 8);
                const hanger = new THREE.Mesh(hangerGeo, hangerMat);
                hanger.rotation.z = Math.PI / 2;
                hanger.position.set(0, 0.8, 0.1);
                hanger.name = `F${f+1}_阳台晾衣杆_${roomIdx+1}`;
                balconyGroup.add(hanger);

                const acBoxGeo = new THREE.BoxGeometry(0.8, 0.55, 0.35);
                const acMesh = new THREE.Mesh(acBoxGeo, acMat);
                acMesh.position.set(1.2, -0.5, 0.1);
                acMesh.castShadow = true;
                acMesh.name = `F${f+1}_空调外机_${roomIdx+1}`;
                balconyGroup.add(acMesh);

                const acGrillGeo = new THREE.PlaneGeometry(0.35, 0.35);
                const acGrillMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
                const acGrill = new THREE.Mesh(acGrillGeo, acGrillMat);
                acGrill.position.set(1.2, -0.5, 0.28);
                acGrill.name = `F${f+1}_空调栅格_${roomIdx+1}`;
                balconyGroup.add(acGrill);

                bGroup.add(balconyGroup);
            });

            roomBaysX.forEach((rx, roomIdx) => {
                const backWinGeo = new THREE.BoxGeometry(2.2, 1.4, 0.15);
                const backWin = new THREE.Mesh(backWinGeo, glassMat);
                backWin.position.set(rx, floorY + 0.2, -bD / 2 - 0.05);
                backWin.name = `F${f+1}_走廊采光窗_${roomIdx+1}`;
                bGroup.add(backWin);

                const sillGeo = new THREE.BoxGeometry(2.4, 0.08, 0.3);
                const sill = new THREE.Mesh(sillGeo, coreMat);
                sill.position.set(rx, floorY + 0.95, -bD / 2 - 0.12);
                sill.name = `F${f+1}_窗台雨篷_${roomIdx+1}`;
                bGroup.add(sill);
            });
        }

        const stairGlassGeo = new THREE.BoxGeometry(3.6, totalH - 1.5, 0.4);
        const stairGlass = new THREE.Mesh(stairGlassGeo, glassMat);
        stairGlass.position.set(0, 1.0 + totalH / 2 + 0.8, bD / 2 + 0.1);
        stairGlass.name = `楼梯间透明幕墙_${buildingIdx}`;
        bGroup.add(stairGlass);

        let mullionIdx = 1;
        for (let sx = -1.5; sx <= 1.5; sx += 1.5) {
            const mullionGeo = new THREE.BoxGeometry(0.08, totalH - 1.5, 0.5);
            const mullion = new THREE.Mesh(mullionGeo, railMat);
            mullion.position.set(sx, 1.0 + totalH / 2 + 0.8, bD / 2 + 0.15);
            mullion.name = `楼梯间竖向饰条_${buildingIdx}_${mullionIdx++}`;
            bGroup.add(mullion);
        }

        const entranceGroup = new THREE.Group();
        entranceGroup.name = `大门入口雨棚组_${buildingIdx}`;
        
        const canopyGeo = new THREE.BoxGeometry(6.5, 0.4, 3.2);
        const canopy = new THREE.Mesh(canopyGeo, coreMat);
        canopy.position.set(0, 3.8, bD / 2 + 1.6);
        canopy.castShadow = true;
        canopy.name = `入口雨棚主体_${buildingIdx}`;
        entranceGroup.add(canopy);

        [-2.8, 2.8].forEach((px, pIdx) => {
            const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.8, 16);
            const pillar = new THREE.Mesh(pillarGeo, railMat);
            pillar.position.set(px, 2.2, bD / 2 + 3.0);
            pillar.castShadow = true;
            pillar.name = `雨棚支撑立柱_${buildingIdx}_${pIdx+1}`;
            entranceGroup.add(pillar);
        });

        const glassDoorGeo = new THREE.BoxGeometry(3.2, 2.4, 0.1);
        const glassDoor = new THREE.Mesh(glassDoorGeo, glassMat);
        glassDoor.position.set(0, 2.2, bD / 2 + 0.2);
        glassDoor.name = `入口自动玻璃门_${buildingIdx}`;
        entranceGroup.add(glassDoor);

        const signTex = createSignboardTexture(`学生公寓 ${buildingIdx}号楼`);
        const signMat = new THREE.MeshBasicMaterial({ map: signTex });
        const signGeo = new THREE.PlaneGeometry(3.6, 0.9);
        const signMesh = new THREE.Mesh(signGeo, signMat);
        signMesh.position.set(0, 4.4, bD / 2 + 1.65);
        signMesh.name = `门牌标识牌_${buildingIdx}`;
        entranceGroup.add(signMesh);

        for (let st = 0; st < 3; st++) {
            const stepGeo = new THREE.BoxGeometry(5.0 + st * 0.4, 0.15, 0.5);
            const step = new THREE.Mesh(stepGeo, baseMat);
            step.position.set(0, 0.8 - st * 0.15, bD / 2 + 0.4 + st * 0.4);
            step.receiveShadow = true;
            step.name = `入口台阶_${buildingIdx}_${st+1}`;
            entranceGroup.add(step);
        }

        bGroup.add(entranceGroup);

        const roofY = 1.0 + totalH;

        const parapetGeo = new THREE.BoxGeometry(bW + 0.4, 1.2, bD + 0.4);
        const parapetMat = new THREE.MeshStandardMaterial({ color: COLOR_WALL_MAIN, roughness: 0.7 });
        const parapet = new THREE.Mesh(parapetGeo, parapetMat);
        parapet.position.set(0, roofY + 0.6, 0);
        parapet.castShadow = true;
        parapet.name = `屋顶女儿墙_${buildingIdx}`;
        bGroup.add(parapet);

        const roofFloorGeo = new THREE.PlaneGeometry(bW - 0.4, bD - 0.4);
        const roofFloorMat = new THREE.MeshStandardMaterial({ color: COLOR_ROOF_FLOOR, roughness: 0.9 });
        const roofFloor = new THREE.Mesh(roofFloorGeo, roofFloorMat);
        roofFloor.rotation.x = -Math.PI / 2;
        roofFloor.position.set(0, roofY + 0.05, 0);
        roofFloor.receiveShadow = true;
        roofFloor.name = `屋顶沥青地面_${buildingIdx}`;
        bGroup.add(roofFloor);

        const stairTowerGeo = new THREE.BoxGeometry(5.5, 2.8, 5.0);
        const stairTower = new THREE.Mesh(stairTowerGeo, coreMat);
        stairTower.position.set(0, roofY + 1.4, -1.0);
        stairTower.castShadow = true;
        stairTower.name = `屋顶电梯塔楼_${buildingIdx}`;
        bGroup.add(stairTower);

        const towerDoorGeo = new THREE.BoxGeometry(1.2, 2.0, 0.1);
        const towerDoor = new THREE.Mesh(towerDoorGeo, baseMat);
        towerDoor.position.set(0, roofY + 1.0, 1.51);
        towerDoor.name = `塔楼顶门_${buildingIdx}`;
        bGroup.add(towerDoor);

        const solarMat = new THREE.MeshStandardMaterial({ map: solarTexture, metalness: 0.8, roughness: 0.2 });
        const tankMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });

        let solarIdx = 1;
        [-8, 8].forEach((sx) => {
            [-3, 3].forEach((sz) => {
                const solarGroup = new THREE.Group();
                solarGroup.name = `屋顶太阳能组_${buildingIdx}_${solarIdx}`;
                solarGroup.position.set(sx, roofY + 0.2, sz);

                const frameGeo = new THREE.BoxGeometry(2.2, 0.8, 1.8);
                const frameMesh = new THREE.Mesh(frameGeo, railMat);
                frameMesh.position.set(0, 0.4, 0);
                frameMesh.name = `太阳能支架_${buildingIdx}_${solarIdx}`;
                solarGroup.add(frameMesh);

                const panelGeo = new THREE.PlaneGeometry(2.2, 2.0);
                const panel = new THREE.Mesh(panelGeo, solarMat);
                panel.rotation.x = -Math.PI / 3;
                panel.position.set(0, 0.8, 0.2);
                panel.castShadow = true;
                panel.name = `太阳能集热板_${buildingIdx}_${solarIdx}`;
                solarGroup.add(panel);

                const tankGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.4, 16);
                const tank = new THREE.Mesh(tankGeo, tankMat);
                tank.rotation.z = Math.PI / 2;
                tank.position.set(0, 1.4, -0.6);
                tank.castShadow = true;
                tank.name = `太阳能保温水箱_${buildingIdx}_${solarIdx}`;
                solarGroup.add(tank);

                bGroup.add(solarGroup);
                solarIdx++;
            });
        });

        [-bW/2 + 0.5, bW/2 - 0.5].forEach((lx, rodIdx) => {
            const rodGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.5, 8);
            const rod = new THREE.Mesh(rodGeo, hangerMat);
            rod.position.set(lx, roofY + 2.45, bD/2 - 0.5);
            rod.name = `屋顶避雷针_${buildingIdx}_${rodIdx+1}`;
            bGroup.add(rod);
        });

        return bGroup;
    }

    // 6. 实例化 3 幢学生公寓并定位
    const dorm1 = createDormitoryBuilding(1);
    const dorm2 = createDormitoryBuilding(2);
    const dorm3 = createDormitoryBuilding(3);

    const baseEuler = new THREE.Euler(
        THREE.MathUtils.degToRad(-180.00), 
        THREE.MathUtils.degToRad(89.92), 
        THREE.MathUtils.degToRad(-180.00)
    );

    dorm1.position.set(44.67, 0.00, 4.52);
    dorm1.rotation.copy(baseEuler);

    dorm2.position.set(18.07, -0.29, 5.14);
    dorm2.rotation.copy(baseEuler);

    dorm3.position.set(-7.97, 0.00, 4.92);
    dorm3.rotation.copy(baseEuler);

    group.add(dorm1);
    group.add(dorm2);
    group.add(dorm3);

    // 7. 校园自行车棚与配套设施
    function createBikeShelter(x, z, sideName) {
        const shelterGroup = new THREE.Group();
        shelterGroup.name = `宿舍自行车停放棚_${sideName}`;
        adaptGroundTransform(shelterGroup, x, 0, z);

        const canopyGeo = new THREE.BoxGeometry(12, 0.15, 3.5);
        const canopyMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });
        const canopy = new THREE.Mesh(canopyGeo, canopyMat);
        canopy.position.set(0, 2.5, 0);
        canopy.rotation.x = 0.1;
        canopy.castShadow = true;
        canopy.name = `车棚雨棚顶_${sideName}`;
        shelterGroup.add(canopy);

        [-5, 0, 5].forEach((cx, postIdx) => {
            const postGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 12);
            const postMat = new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.8 });
            const post = new THREE.Mesh(postGeo, postMat);
            post.position.set(cx, 1.25, -1.2);
            post.castShadow = true;
            post.name = `车棚立柱_${sideName}_${postIdx+1}`;
            shelterGroup.add(post);
        });

        let bikeIdx = 1;
        for (let bx = -5; bx <= 5; bx += 1.2) {
            const wheelGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 16);
            const wheelMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
            const wheel1 = new THREE.Mesh(wheelGeo, wheelMat);
            wheel1.position.set(bx, 0.35, -0.4);
            wheel1.name = `自行车前轮_${sideName}_${bikeIdx}`;
            shelterGroup.add(wheel1);

            const wheel2 = new THREE.Mesh(wheelGeo, wheelMat);
            wheel2.position.set(bx, 0.35, 0.5);
            wheel2.name = `自行车后轮_${sideName}_${bikeIdx}`;
            shelterGroup.add(wheel2);

            const frameGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 8);
            const frameMat = new THREE.MeshBasicMaterial({ color: (bikeIdx % 2 === 0) ? 0xdc2626 : 0x16a34a });
            const frame = new THREE.Mesh(frameGeo, frameMat);
            frame.rotation.x = Math.PI / 4;
            frame.position.set(bx, 0.45, 0.0);
            frame.name = `自行车车架_${sideName}_${bikeIdx}`;
            shelterGroup.add(frame);

            bikeIdx++;
        }

        return shelterGroup;
    }

    group.add(createBikeShelter(-48, 18, "左"));
    group.add(createBikeShelter(48, 18, "右"));

    // 校园庭院路灯
    const lampPositions = [-54, -36, -18, 0, 18, 36, 54];
    lampPositions.forEach((lx, idx) => {
        const lampGroup = new THREE.Group();
        lampGroup.name = `校园路灯_${idx + 1}`;
        adaptGroundTransform(lampGroup, lx, 0, 22);

        const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 4.5, 12);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(0, 2.25, 0);
        pole.castShadow = true;
        pole.name = `路灯灯杆_${idx + 1}`;
        lampGroup.add(pole);

        const bulbGeo = new THREE.SphereGeometry(0.25, 16, 16);
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(0, 4.5, 0);
        bulb.name = `路灯灯泡_${idx + 1}`;
        lampGroup.add(bulb);

        group.add(lampGroup);
    });

    // 8. 高大精细景观树木生成系统
    const treePitBorderMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });

    function createTallDetailedTree(type = 0, scaleFactor = 1.0, treeName = "高大树木") {
        const treeGroup = new THREE.Group();
        treeGroup.name = treeName;

        const pitGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.25, 8);
        const pit = new THREE.Mesh(pitGeo, treePitBorderMat);
        pit.position.set(0, 0.12, 0);
        pit.receiveShadow = true;
        treeGroup.add(pit);

        if (type === 0) {
            const trunkHeight = 6.5 * scaleFactor;
            const trunkGeo = new THREE.CylinderGeometry(0.45 * scaleFactor, 0.75 * scaleFactor, trunkHeight, 10);
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.set(0, trunkHeight / 2, 0);
            trunk.castShadow = true;
            treeGroup.add(trunk);

            const branchAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
            branchAngles.forEach((angle, bIdx) => {
                const branchGeo = new THREE.CylinderGeometry(0.25 * scaleFactor, 0.38 * scaleFactor, 3.2 * scaleFactor, 8);
                const branch = new THREE.Mesh(branchGeo, trunkMat);
                branch.position.set(
                    Math.sin(angle) * 0.8 * scaleFactor,
                    trunkHeight - 0.5 * scaleFactor,
                    Math.cos(angle) * 0.8 * scaleFactor
                );
                branch.rotation.z = Math.sin(angle) * 0.45;
                branch.rotation.x = Math.cos(angle) * 0.45;
                branch.castShadow = true;
                treeGroup.add(branch);
            });

            const canopyClusters = [
                { x: 0, y: trunkHeight + 3.2 * scaleFactor, z: 0, r: 3.8 * scaleFactor, mat: leafLightMat },
                { x: -1.8 * scaleFactor, y: trunkHeight + 1.2 * scaleFactor, z: 1.2 * scaleFactor, r: 3.0 * scaleFactor, mat: leafMidMat },
                { x: 1.8 * scaleFactor, y: trunkHeight + 1.4 * scaleFactor, z: -1.2 * scaleFactor, r: 3.1 * scaleFactor, mat: leafMidMat },
                { x: 1.2 * scaleFactor, y: trunkHeight + 1.0 * scaleFactor, z: 1.8 * scaleFactor, r: 2.8 * scaleFactor, mat: leafDarkMat },
                { x: -1.5 * scaleFactor, y: trunkHeight + 1.5 * scaleFactor, z: -1.6 * scaleFactor, r: 2.9 * scaleFactor, mat: leafDarkMat },
                { x: 0, y: trunkHeight + 4.8 * scaleFactor, z: 0, r: 2.5 * scaleFactor, mat: leafLightMat }
            ];

            canopyClusters.forEach((c, cIdx) => {
                const clusterGeo = new THREE.DodecahedronGeometry(c.r, 1);
                const cluster = new THREE.Mesh(clusterGeo, c.mat);
                cluster.position.set(c.x, c.y, c.z);
                cluster.rotation.set(cIdx * 0.5, cIdx * 0.8, cIdx * 0.3);
                cluster.castShadow = true;
                cluster.receiveShadow = true;
                treeGroup.add(cluster);
            });

        } else if (type === 1) {
            const trunkHeight = 11.0 * scaleFactor;
            const trunkGeo = new THREE.CylinderGeometry(0.35 * scaleFactor, 0.85 * scaleFactor, trunkHeight, 10);
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.set(0, trunkHeight / 2, 0);
            trunk.castShadow = true;
            treeGroup.add(trunk);

            const layers = 6;
            for (let l = 0; l < layers; l++) {
                const layerY = 3.5 * scaleFactor + l * 1.8 * scaleFactor;
                const layerRadius = (3.8 - l * 0.55) * scaleFactor;
                const layerHeight = (3.2 - l * 0.35) * scaleFactor;
                
                const mat = (l === layers - 1) ? leafLightMat : (l % 2 === 0 ? leafMidMat : leafDarkMat);
                const coneGeo = new THREE.ConeGeometry(Math.max(1.0, layerRadius), layerHeight, 8);
                const cone = new THREE.Mesh(coneGeo, mat);
                cone.position.set(0, layerY + layerHeight / 2, 0);
                cone.castShadow = true;
                cone.receiveShadow = true;
                treeGroup.add(cone);
            }

        } else {
            const trunkHeight = 5.2 * scaleFactor;
            const trunkGeo = new THREE.CylinderGeometry(0.55 * scaleFactor, 0.95 * scaleFactor, trunkHeight, 12);
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.set(0, trunkHeight / 2, 0);
            trunk.castShadow = true;
            treeGroup.add(trunk);

            const mainCanopyGeo = new THREE.IcosahedronGeometry(4.8 * scaleFactor, 1);
            const mainCanopy = new THREE.Mesh(mainCanopyGeo, leafMidMat);
            mainCanopy.position.set(0, trunkHeight + 2.8 * scaleFactor, 0);
            mainCanopy.scale.set(1.2, 0.85, 1.2);
            mainCanopy.castShadow = true;
            mainCanopy.receiveShadow = true;
            treeGroup.add(mainCanopy);

            const topCanopyGeo = new THREE.DodecahedronGeometry(3.2 * scaleFactor, 1);
            const topCanopy = new THREE.Mesh(topCanopyGeo, leafLightMat);
            topCanopy.position.set(0, trunkHeight + 4.5 * scaleFactor, 0);
            topCanopy.castShadow = true;
            treeGroup.add(topCanopy);
        }

        return treeGroup;
    }

    const trunkMat = new THREE.MeshStandardMaterial({ color: COLOR_TRUNK, roughness: 0.9 });
    const leafDarkMat = new THREE.MeshStandardMaterial({ color: COLOR_LEAF_DARK, roughness: 0.8 });
    const leafMidMat = new THREE.MeshStandardMaterial({ color: COLOR_LEAF_MID, roughness: 0.75 });
    const leafLightMat = new THREE.MeshStandardMaterial({ color: COLOR_LEAF_LIGHT, roughness: 0.7 });

    const southLawnTreeXs = [-52, -38, -24, -10, 10, 24, 38, 52];
    southLawnTreeXs.forEach((xPos, idx) => {
        const treeType = (idx % 2 === 0) ? 0 : 1;
        const scale = 1.0 + (idx % 3) * 0.12;
        const treeObj = createTallDetailedTree(treeType, scale, `南侧主绿化带大树_${idx + 1}`);
        adaptGroundTransform(treeObj, xPos, 0.08, 40);
        group.add(treeObj);
    });

    const westLawnTreeZs = [-32, -20, -8, 4, 16, 28];
    westLawnTreeZs.forEach((zPos, idx) => {
        const treeType = (idx % 3 === 0) ? 1 : 2;
        const scale = 0.95 + (idx % 2) * 0.18;
        const treeObj = createTallDetailedTree(treeType, scale, `西侧隔离带大树_${idx + 1}`);
        adaptGroundTransform(treeObj, -62, 0.08, zPos);
        group.add(treeObj);
    });

    const eastLawnTreeZs = [-32, -20, -8, 4, 16, 28];
    eastLawnTreeZs.forEach((zPos, idx) => {
        const treeType = (idx % 2 === 0) ? 0 : 1;
        const scale = 0.95 + (idx % 3) * 0.15;
        const treeObj = createTallDetailedTree(treeType, scale, `东侧隔离带大树_${idx + 1}`);
        adaptGroundTransform(treeObj, 62, 0.08, zPos);
        group.add(treeObj);
    });

    group.traverse((child) => {
        if (child.isMesh || child.isLine) {
            child.frustumCulled = false;
        }
    });
}
