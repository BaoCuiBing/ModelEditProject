function buildMySchoolScene(THREE, schoolMasterGroup) {
    // ============ 灯光 ============
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    ambientLight.name = "环境光";
    schoolMasterGroup.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    sunLight.position.set(30, 50, 25);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 160;
    const d = 55;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    sunLight.name = "太阳平行光";
    schoolMasterGroup.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x475569, 0.35);
    hemiLight.name = "半球天空光";
    schoolMasterGroup.add(hemiLight);

    // ============ 校园总地面 ============
    const campusGeo = new THREE.PlaneGeometry(60, 100);
    const campusMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
    const campusGround = new THREE.Mesh(campusGeo, campusMat);
    campusGround.rotation.x = -Math.PI / 2;
    campusGround.position.y = -0.05;
    campusGround.receiveShadow = true;
    campusGround.name = "学校水泥底座平台";
    schoolMasterGroup.add(campusGround);

    // ============ 道路（外圈） ============
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
    // 顶部道路
    const topRoad = new THREE.Mesh(new THREE.PlaneGeometry(60, 4), roadMat);
    topRoad.rotation.x = -Math.PI / 2;
    topRoad.position.set(0, -0.02, -48);
    topRoad.receiveShadow = true;
    topRoad.name = "北侧市政道路";
    schoolMasterGroup.add(topRoad);
    // 底部道路
    const bottomRoad = new THREE.Mesh(new THREE.PlaneGeometry(60, 4), roadMat);
    bottomRoad.rotation.x = -Math.PI / 2;
    bottomRoad.position.set(0, -0.02, 48);
    bottomRoad.receiveShadow = true;
    bottomRoad.name = "南侧市政道路";
    schoolMasterGroup.add(bottomRoad);
    // 左侧道路
    const leftRoad = new THREE.Mesh(new THREE.PlaneGeometry(4, 100), roadMat);
    leftRoad.rotation.x = -Math.PI / 2;
    leftRoad.position.set(-28, -0.02, 0);
    leftRoad.receiveShadow = true;
    leftRoad.name = "西侧市政道路";
    schoolMasterGroup.add(leftRoad);
    // 右侧道路
    const rightRoad = new THREE.Mesh(new THREE.PlaneGeometry(4, 100), roadMat);
    rightRoad.rotation.x = -Math.PI / 2;
    rightRoad.position.set(28, -0.02, 0);
    rightRoad.receiveShadow = true;
    rightRoad.name = "东侧市政道路";
    schoolMasterGroup.add(rightRoad);

    // ============ 内部主干道（十字） ============
    const mainRoadMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.85 });
    const mainEW = new THREE.Mesh(new THREE.PlaneGeometry(56, 3), mainRoadMat);
    mainEW.rotation.x = -Math.PI / 2;
    mainEW.position.set(0, -0.01, 0);
    mainEW.receiveShadow = true;
    mainEW.name = "校内东西主干道";
    schoolMasterGroup.add(mainEW);
    const mainNS = new THREE.Mesh(new THREE.PlaneGeometry(3, 96), mainRoadMat);
    mainNS.rotation.x = -Math.PI / 2;
    mainNS.position.set(0, -0.01, 0);
    mainNS.receiveShadow = true;
    mainNS.name = "校内南北主轴";
    schoolMasterGroup.add(mainNS);

    // ============ 绿化草坪区域 ============
    const grassMat = new THREE.MeshStandardMaterial({ color: 0x48bb78, roughness: 0.85 });
    // 西北草坪
    const lawnNW = new THREE.Mesh(new THREE.PlaneGeometry(20, 32), grassMat);
    lawnNW.rotation.x = -Math.PI / 2;
    lawnNW.position.set(-13, 0, -15);
    lawnNW.receiveShadow = true;
    lawnNW.name = "西北绿化草坪";
    schoolMasterGroup.add(lawnNW);
    // 东北草坪
    const lawnNE = new THREE.Mesh(new THREE.PlaneGeometry(20, 32), grassMat);
    lawnNE.rotation.x = -Math.PI / 2;
    lawnNE.position.set(13, 0, -15);
    lawnNE.receiveShadow = true;
    lawnNE.name = "东北绿化草坪";
    schoolMasterGroup.add(lawnNE);
    // 西南草坪
    const lawnSW = new THREE.Mesh(new THREE.PlaneGeometry(20, 28), grassMat);
    lawnSW.rotation.x = -Math.PI / 2;
    lawnSW.position.set(-13, 0, 20);
    lawnSW.receiveShadow = true;
    lawnSW.name = "西南绿化草坪";
    schoolMasterGroup.add(lawnSW);
    // 东南草坪
    const lawnSE = new THREE.Mesh(new THREE.PlaneGeometry(20, 28), grassMat);
    lawnSE.rotation.x = -Math.PI / 2;
    lawnSE.position.set(13, 0, 20);
    lawnSE.receiveShadow = true;
    lawnSE.name = "东南绿化草坪";
    schoolMasterGroup.add(lawnSE);

    // ============ 体育场地基（北侧，跑道+足球场） ============
    const fieldGroup = new THREE.Group();
    fieldGroup.name = "🏟️ 体育场地基";

    const fieldBaseGeo = new THREE.PlaneGeometry(28, 18);
    const fieldBaseMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.85 });
    const fieldBase = new THREE.Mesh(fieldBaseGeo, fieldBaseMat);
    fieldBase.rotation.x = -Math.PI / 2;
    fieldBase.position.set(0, 0.02, -30);
    fieldBase.receiveShadow = true;
    fieldBase.name = "运动场灰色地基";
    fieldGroup.add(fieldBase);

    // 跑道（环形，使用 Shape + Hole）
    const trackOuter = new THREE.Shape();
    trackOuter.moveTo(-12, -8); trackOuter.lineTo(12, -8);
    trackOuter.lineTo(12, 8); trackOuter.lineTo(-12, 8); trackOuter.lineTo(-12, -8);
    const trackInner = new THREE.Path();
    trackInner.moveTo(-9, -5); trackInner.lineTo(9, -5);
    trackInner.lineTo(9, 5); trackInner.lineTo(-9, 5); trackInner.lineTo(-9, -5);
    trackOuter.holes.push(trackInner);
    const trackGeo = new THREE.ShapeGeometry(trackOuter);
    const trackMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
    const track = new THREE.Mesh(trackGeo, trackMat);
    track.rotation.x = -Math.PI / 2;
    track.position.set(0, 0.03, -30);
    track.receiveShadow = true;
    track.name = "红色塑胶跑道";
    fieldGroup.add(track);

    // 足球场草坪
    const footballGeo = new THREE.PlaneGeometry(16, 9);
    const footballMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.85 });
    const football = new THREE.Mesh(footballGeo, footballMat);
    football.rotation.x = -Math.PI / 2;
    football.position.set(0, 0.04, -30);
    football.receiveShadow = true;
    football.name = "中央足球场草坪";
    fieldGroup.add(football);

    // 篮球场（跑道右侧）
    const basketGeo = new THREE.PlaneGeometry(7, 8);
    const basketMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.85 });
    const basket = new THREE.Mesh(basketGeo, basketMat);
    basket.rotation.x = -Math.PI / 2;
    basket.position.set(18, 0.04, -30);
    basket.receiveShadow = true;
    basket.name = "室外篮球场地基";
    fieldGroup.add(basket);

    schoolMasterGroup.add(fieldGroup);

    // ============ 教学楼地基（中部，大型白色建筑） ============
    const mainBldGroup = new THREE.Group();
    mainBldGroup.name = "🏛️ 主教学楼地基";

    const mainBldGeo = new THREE.BoxGeometry(14, 0.4, 10);
    const mainBldMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.85 });
    const mainBld = new THREE.Mesh(mainBldGeo, mainBldMat);
    mainBld.position.set(0, 0.2, -10);
    mainBld.castShadow = true;
    mainBld.receiveShadow = true;
    mainBld.name = "主教学楼基座";
    mainBldGroup.add(mainBld);

    // 主楼前广场
    const mainPlazaGeo = new THREE.PlaneGeometry(18, 8);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const mainPlaza = new THREE.Mesh(mainPlazaGeo, plazaMat);
    mainPlaza.rotation.x = -Math.PI / 2;
    mainPlaza.position.set(0, 0.05, -3);
    mainPlaza.receiveShadow = true;
    mainPlaza.name = "主楼前中央广场";
    mainBldGroup.add(mainPlaza);

    schoolMasterGroup.add(mainBldGroup);

    // ============ 景观水池（中心） ============
    const pondShape = new THREE.Shape();
    pondShape.moveTo(-5, -3);
    pondShape.bezierCurveTo(-6, -5, -4, -7, 0, -7);
    pondShape.bezierCurveTo(4, -7, 6, -5, 5, -3);
    pondShape.bezierCurveTo(6, 0, 4, 3, 0, 3);
    pondShape.bezierCurveTo(-4, 3, -6, 0, -5, -3);

    const pondGroup = new THREE.Group();
    pondGroup.name = "💧 中央景观水池";
    const pondBaseGeo = new THREE.PlaneGeometry(16, 14);
    const pondBaseMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.85 });
    const pondBase = new THREE.Mesh(pondBaseGeo, pondBaseMat);
    pondBase.rotation.x = -Math.PI / 2;
    pondBase.position.set(0, 0.05, 8);
    pondBase.receiveShadow = true;
    pondBase.name = "水池外围石板地";
    pondGroup.add(pondBase);

    const pondWaterGeo = new THREE.ShapeGeometry(pondShape);
    const pondWaterMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8, roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.85
    });
    const pondWater = new THREE.Mesh(pondWaterGeo, pondWaterMat);
    pondWater.rotation.x = -Math.PI / 2;
    pondWater.position.set(0, 0.06, 8);
    pondWater.name = "景观水池水面";
    pondGroup.add(pondWater);
    schoolMasterGroup.add(pondGroup);

    // ============ 图书馆/报告厅地基（南侧中央） ============
    const libGroup = new THREE.Group();
    libGroup.name = "📚 图书馆地基";
    const libGeo = new THREE.BoxGeometry(16, 0.4, 8);
    const libMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.85 });
    const libBld = new THREE.Mesh(libGeo, libMat);
    libBld.position.set(0, 0.2, 22);
    libBld.castShadow = true;
    libBld.receiveShadow = true;
    libBld.name = "图书馆基座";
    libGroup.add(libBld);
    schoolMasterGroup.add(libGroup);

    // ============ 入口广场（最南端） ============
    const entranceGeo = new THREE.PlaneGeometry(16, 6);
    const entranceMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 });
    const entrance = new THREE.Mesh(entranceGeo, entranceMat);
    entrance.rotation.x = -Math.PI / 2;
    entrance.position.set(0, 0.05, 38);
    entrance.receiveShadow = true;
    entrance.name = "南门入口广场";
    schoolMasterGroup.add(entrance);

    // ============ 通用建筑地基生成器 ============
    // 颜色：浅灰（教学楼）、深灰（宿舍）、米黄（食堂）
    function createBuildingFoundation(name, w, d, x, z, color) {
        const geo = new THREE.BoxGeometry(w, 0.35, d);
        const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.85 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, 0.18, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = name;
        return mesh;
    }

    const bldGroup = new THREE.Group();
    bldGroup.name = "🏘️ 校园建筑地基集";

    // ---- 北侧（运动场上方）教学楼 ----
    // 西北角
    bldGroup.add(createBuildingFoundation("北-西1号教学楼地基", 6, 4, -21, -42, 0xe2e8f0));
    bldGroup.add(createBuildingFoundation("北-西2号教学楼地基", 6, 4, -21, -36, 0xe2e8f0));
    // 东北角
    bldGroup.add(createBuildingFoundation("北-东1号教学楼地基", 6, 4, 21, -42, 0xe2e8f0));
    bldGroup.add(createBuildingFoundation("北-东2号教学楼地基", 6, 4, 21, -36, 0xe2e8f0));

    // ---- 西侧（运动场下方）教学楼 ----
    bldGroup.add(createBuildingFoundation("西-上教学楼地基", 7, 4, -21, -22, 0xd1d5db));
    bldGroup.add(createBuildingFoundation("西-中教学楼地基", 7, 4, -21, -10, 0xd1d5db));

    // ---- 东侧（运动场下方）教学楼 ----
    bldGroup.add(createBuildingFoundation("东-上教学楼地基", 7, 4, 21, -22, 0xd1d5db));
    bldGroup.add(createBuildingFoundation("东-中教学楼地基", 7, 4, 21, -10, 0xd1d5db));

    // ---- 西侧（下半区）宿舍楼 ----
    bldGroup.add(createBuildingFoundation("西-下1号宿舍楼地基", 6, 5, -21, 12, 0xa8a29e));
    bldGroup.add(createBuildingFoundation("西-下2号宿舍楼地基", 6, 5, -21, 22, 0xa8a29e));
    bldGroup.add(createBuildingFoundation("西-下3号宿舍楼地基", 6, 5, -21, 32, 0xa8a29e));

    // ---- 东侧（下半区）宿舍楼 ----
    bldGroup.add(createBuildingFoundation("东-下1号宿舍楼地基", 6, 5, 21, 12, 0xa8a29e));
    bldGroup.add(createBuildingFoundation("东-下2号宿舍楼地基", 6, 5, 21, 22, 0xa8a29e));
    bldGroup.add(createBuildingFoundation("东-下3号宿舍楼地基", 6, 5, 21, 32, 0xa8a29e));

    // ---- 西南角特殊建筑（红色顶/白色楼） ----
    const swSpecial = createBuildingFoundation("西南特殊楼地基", 5, 4, -21, 40, 0xfee2e2);
    bldGroup.add(swSpecial);

    // ---- 东南角食堂 ----
    bldGroup.add(createBuildingFoundation("东南食堂地基", 7, 5, 21, 40, 0xfde68a));

    // ---- 南侧入口处门卫室 ----
    bldGroup.add(createBuildingFoundation("南门门卫室地基", 3, 2, -7, 42, 0x94a3b8));
    bldGroup.add(createBuildingFoundation("南门门卫室地基(右)", 3, 2, 7, 42, 0x94a3b8));

    schoolMasterGroup.add(bldGroup);

    // ============ 操场辅助：观众看台地基 ============
    const standGeo = new THREE.BoxGeometry(4, 0.3, 8);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.85 });
    const stand = new THREE.Mesh(standGeo, standMat);
    stand.position.set(-16, 0.15, -30);
    stand.castShadow = true;
    stand.receiveShadow = true;
    stand.name = "西侧看台地基";
    schoolMasterGroup.add(stand);

    // ============ 旗台（主楼前） ============
    const flagGeo = new THREE.CylinderGeometry(0.6, 0.8, 0.5, 16);
    const flagMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.7 });
    const flag = new THREE.Mesh(flagGeo, flagMat);
    flag.position.set(0, 0.25, -5);
    flag.castShadow = true;
    flag.receiveShadow = true;
    flag.name = "国旗台基座";
    schoolMasterGroup.add(flag);
}
