// 模型名称：校园地基模型
function buildFoundationScene(THREE, group) {
    // ============ 精确颜色常量定义 ============
    const COLOR_PURPLE = 0x9B86BD; 
    const COLOR_YELLOW = 0xF6D155; 
    const COLOR_BLUE = 0x5EA4DC;   
    const COLOR_RED = 0xEF5350;    
    const COLOR_PINK = 0xD783BA;   

    // ============ 灯光 ============
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    ambientLight.name = "环境光";
    group.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 0.7);
    sunLight.position.set(150, 300, 150);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 1.0;
    sunLight.shadow.camera.far = 1100;
    const d = 600;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    sunLight.name = "太阳平行光";
    group.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x475569, 0.15);
    hemiLight.name = "半球天空光";
    group.add(hemiLight);

    // ============ 地面基座 (厚度10m的Box) ============
    const campusMat = new THREE.MeshStandardMaterial({ color: 0xd4d8dd, roughness: 0.9 });
    const campusGround = new THREE.Mesh(new THREE.BoxGeometry(600, 10, 975), campusMat);
    campusGround.position.y = -5; // 顶部齐平 y=0
    campusGround.receiveShadow = true;
    campusGround.name = "校园总地面";
    group.add(campusGround);

    // ============ 通用建筑地基创建函数 ============
    function createFoundation(name, w, h, d, x, y, z, color) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.85 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y + h / 2, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = name;
        return mesh;
    }

    // 新建精细建筑地基已移除（由各建筑模型自带底座）


    // ============ 全校马路与交通标线系统 ============
    const roadGroup = new THREE.Group();
    roadGroup.name = "🛣️ 校园主干道路与标线系统";

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.85 });
    const yellowLineMat = new THREE.MeshBasicMaterial({ color: 0xeab308 });
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc });
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5 });

    // 1. 主干道路_东 (X = 93.16, 全长衍生至北墙 Z: -469.5 到 424.09)
    const roadGeo1 = new THREE.PlaneGeometry(22, 50);
    const road1 = new THREE.Mesh(roadGeo1, roadMat);
    road1.rotation.x = -Math.PI / 2;
    road1.position.set(93.16, 0.02, -22.71);
    road1.scale.set(0.87, 17.87, 1.00);
    road1.receiveShadow = true;
    road1.name = "主干道路_东";
    roadGroup.add(road1);

    // 2. 主干道路_西 (X = -94.58, 全长衍生至北墙 Z: -469.5 到 424.09)
    const roadGeo2 = new THREE.PlaneGeometry(22, 50);
    const road2 = new THREE.Mesh(roadGeo2, roadMat);
    road2.rotation.x = -Math.PI / 2;
    road2.position.set(-94.58, 0.02, -22.71);
    road2.scale.set(0.87, 17.87, 1.00);
    road2.receiveShadow = true;
    road2.name = "主干道路_西";
    roadGroup.add(road2);

    // 3. 入口横向连接路段 (X = -0.71, Y = 0.02, Z = 424.09)
    const connGeo = new THREE.PlaneGeometry(187.74, 19.14);
    const conn = new THREE.Mesh(connGeo, roadMat);
    conn.rotation.x = -Math.PI / 2;
    conn.position.set(-0.71, 0.02, 424.09);
    conn.receiveShadow = true;
    conn.name = "入口横向连接路";
    roadGroup.add(conn);

    // 4. 校门中央进出柏油马路 (设置缩放为 1.00, 0.88, 1.00，位置设置为 0.00, 0.02, 453.67)
    const gateRoadGeo = new THREE.PlaneGeometry(33, 75);
    const gateRoad = new THREE.Mesh(gateRoadGeo, roadMat);
    gateRoad.rotation.x = -Math.PI / 2;
    gateRoad.position.set(0.00, 0.02, 453.67);
    gateRoad.scale.set(1.00, 0.88, 1.00);
    gateRoad.receiveShadow = true;
    gateRoad.name = "中央进出校柏油马路";
    roadGroup.add(gateRoad);

    // 5. 校门中央路沿石已移除

    // 6. 精准修正马路转弯圆角连接
    function createCornerCurve(shapeX, shapeY, startAngle, endAngle, innerR, outerR) {
        const shape = new THREE.Shape();
        shape.absarc(shapeX, shapeY, outerR, startAngle, endAngle, false);
        if (innerR > 0) shape.absarc(shapeX, shapeY, innerR, endAngle, startAngle, true);
        shape.closePath();
        const geo = new THREE.ShapeGeometry(shape, 32);
        const mesh = new THREE.Mesh(geo, roadMat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = 0.021;
        mesh.receiveShadow = true;
        return mesh;
    }

    // 西北圆角
    const cornerNW = createCornerCurve(-85.01, -414.52, Math.PI, Math.PI * 1.5, 0, 9.57);
    cornerNW.name = "西北转弯圆角";
    roadGroup.add(cornerNW);

    // 东北圆角
    const cornerNE = createCornerCurve(83.59, -414.52, Math.PI * 1.5, Math.PI * 2, 0, 9.57);
    cornerNE.name = "东北转弯圆角";
    roadGroup.add(cornerNE);

    // 西南丁字圆角
    const cornerSW = createCornerCurve(-16.50, -433.66, Math.PI / 2, Math.PI, 0, 9.57);
    cornerSW.name = "西南丁字路口圆角";
    roadGroup.add(cornerSW);

    // 东南丁字圆角
    const cornerSE = createCornerCurve(16.50, -433.66, 0, Math.PI / 2, 0, 9.57);
    cornerSE.name = "东南丁字路口圆角";
    roadGroup.add(cornerSE);

    // 7. 马路中间分隔双黄线 (仅主干道保留)
    function createDoubleYellowLine(x, z, length, isHorizontal = false) {
        const g = new THREE.Group();
        [-0.25, 0.25].forEach((off, idx) => {
            const lineW = isHorizontal ? length : 0.18;
            const lineH = isHorizontal ? 0.18 : length;
            const lineGeo = new THREE.PlaneGeometry(lineW, lineH);
            const line = new THREE.Mesh(lineGeo, yellowLineMat);
            line.rotation.x = -Math.PI / 2;
            if (isHorizontal) {
                line.position.set(x, 0.03, z + off);
            } else {
                line.position.set(x + off, 0.03, z);
            }
            line.name = `双黄线_${idx + 1}`;
            g.add(line);
        });
        return g;
    }

    // 西主干道双黄线
    const lineWest = createDoubleYellowLine(-94.58, -27.49, 884.0, false);
    lineWest.name = "西主干道双黄线";
    roadGroup.add(lineWest);

    // 东主干道双黄线
    const lineEast = createDoubleYellowLine(93.16, -27.49, 884.0, false);
    lineEast.name = "东主干道双黄线";
    roadGroup.add(lineEast);

    // 入口横向连接路双黄线
    const lineConnW = createDoubleYellowLine(-50.75, 424.09, 68.5, true);
    lineConnW.name = "连接路西段双黄线";
    roadGroup.add(lineConnW);

    const lineConnE = createDoubleYellowLine(50.00, 424.09, 67.0, true);
    lineConnE.name = "连接路东段双黄线";
    roadGroup.add(lineConnE);

    // 校门进出道路双黄线 (自适应对齐 Z=453.67, Z向长度 75*0.88 = 66)
    const lineGate = createDoubleYellowLine(0.00, 453.67, 66.00, false);
    lineGate.name = "校门道路双黄线";
    roadGroup.add(lineGate);

    // 8. 精简内部横向道路（无黄色分隔线，精确定位）
    function addInnerRoadAt(name, x, y, z, width, depth) {
        const rGeo = new THREE.PlaneGeometry(width, depth);
        const rMesh = new THREE.Mesh(rGeo, roadMat);
        rMesh.rotation.x = -Math.PI / 2;
        rMesh.position.set(x, y, z);
        rMesh.receiveShadow = true;
        rMesh.name = name;
        roadGroup.add(rMesh);
    }

    // 校园主横道_C（中轴线） -> (-1.02, 0.02, 11.57)
    addInnerRoadAt("校园主横道_C（中轴线）", -1.02, 0.02, 11.57, 205, 19);

    // 东区横道_J（宿舍南） -> (133.53, 0.02, -352.39)
    addInnerRoadAt("东区横道_J（宿舍南）", 133.53, 0.02, -352.39, 100, 19);

    // 东区横道_K（实训C北） -> (127.80, 0.02, -143.45)
    addInnerRoadAt("东区横道_K（实训C北）", 127.80, 0.02, -143.45, 88, 19);

    // 东区横道_L（创新中心北） -> (132.43, 0.02, 263.70)
    addInnerRoadAt("东区横道_L（创新中心北）", 132.43, 0.02, 263.70, 98, 19);

    // 东区横道_M（创新中心南） -> (128.95, 0.02, 173.61)
    addInnerRoadAt("东区横道_M（创新中心南）", 128.95, 0.02, 173.61, 91, 19);

    // 新生成 8 个与“东区横道_M（创新中心南）”一样大(91x19)的空隙连接马路
    addInnerRoadAt("新增连接路_1", 47.02, 0.02, 105.61, 91, 19);
    addInnerRoadAt("新增连接路_2", -46.77, 0.02, 105.61, 91, 19);
    addInnerRoadAt("新增连接路_3", -46.77, 0.02, 213.73, 91, 19);
    addInnerRoadAt("新增连接路_4", 45.15, 0.02, 213.73, 91, 19);
    addInnerRoadAt("新增连接路_5", 45.15, 0.02, 341.30, 91, 19);
    addInnerRoadAt("新增连接路_6", -47.10, 0.02, 341.30, 91, 19);
    addInnerRoadAt("新增连接路_7", -47.10, 0.02, -65.05, 91, 19);
    addInnerRoadAt("新增连接路_8", 45.77, 0.02, -65.05, 91, 19);

    // 新增连接路_9 至 18 (尺寸均为 91x19)
    addInnerRoadAt("新增连接路_9", 143.15, 0.02, 353.10, 91, 19);
    addInnerRoadAt("新增连接路_10", -145.13, 0.02, 363.13, 91, 19);
    addInnerRoadAt("新增连接路_11", -145.13, 0.02, 235.05, 91, 19);
    addInnerRoadAt("新增连接路_12", -145.13, 0.02, 109.84, 91, 19);
    addInnerRoadAt("新增连接路_13", -145.13, 0.02, -35.47, 91, 19);
    addInnerRoadAt("新增连接路_14", -112.19, 0.02, -170.70, 91, 19);
    addInnerRoadAt("新增连接路_15", -145.13, 0.02, -283.17, 91, 19);
    addInnerRoadAt("新增连接路_16", -145.13, 0.02, -402.79, 91, 19);
    addInnerRoadAt("新增连接路_17", -47.36, 0.02, -423.58, 91, 19);
    addInnerRoadAt("新增连接路_18", 43.56, 0.02, -423.58, 91, 19);

    // 新增东区横道 1 至 4 (尺寸均为 88x19)
    addInnerRoadAt("新增东区横道_1", 127.80, 0.02, -47.50, 88, 19);
    addInnerRoadAt("新增东区横道_2", 127.80, 0.02, 56.39, 88, 19);
    addInnerRoadAt("新增东区横道_3", 127.80, 0.02, -209.26, 88, 19);
    addInnerRoadAt("新增东区横道_4", 135.54, 0.02, 423.69, 88, 19);

    group.add(roadGroup);

    // ============ 南大门门卫室地基 ============
    const gateGroup = new THREE.Group();
    gateGroup.name = "🚪 ③⓪-南大门主出入口";
    group.add(gateGroup);
}
