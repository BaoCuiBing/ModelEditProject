// 模型名称：公园模型
function buildMyParkScene(THREE, parkMasterGroup) {
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        ambientLight.name = "环境光";
        parkMasterGroup.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
        sunLight.position.set(25, 45, 20);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 120;
        const d = 32;
        sunLight.shadow.camera.left = -d;
        sunLight.shadow.camera.right = d;
        sunLight.shadow.camera.top = d;
        sunLight.shadow.camera.bottom = -d;
        sunLight.shadow.bias = -0.0005;
        sunLight.name = "太阳平行光";
        parkMasterGroup.add(sunLight);

        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x475569, 0.35);
        hemiLight.name = "半球天空光";
        parkMasterGroup.add(hemiLight);

        const lakeShape = new THREE.Shape();
        lakeShape.moveTo(-9, -2);
        lakeShape.bezierCurveTo(-11, -7, -7, -12, -2, -12);
        lakeShape.bezierCurveTo(4, -12, 8, -10, 10, -5);
        lakeShape.bezierCurveTo(12, 0, 10, 6, 7, 8);
        lakeShape.bezierCurveTo(3, 10, -3, 10, -6, 6);
        lakeShape.bezierCurveTo(-9, 2, -9, 0, -9, -2);

        const terrainGroup = new THREE.Group();
        terrainGroup.name = "⛰️ 丘陵与地形绿化";

        const groundShape = new THREE.Shape();
        groundShape.moveTo(-28, -28); groundShape.lineTo(28, -28);
        groundShape.lineTo(28, 28); groundShape.lineTo(-28, 28); groundShape.lineTo(-28, -28);
        groundShape.holes.push(lakeShape); // Carve out pit

        const extrudeSettings = { depth: 0.8, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.04, bevelThickness: 0.04 };
        const lawnGeo = new THREE.ExtrudeGeometry(groundShape, extrudeSettings);
        const grassMat = new THREE.MeshStandardMaterial({ color: 0x48bb78, roughness: 0.85 });
        const pitWallMat = new THREE.MeshStandardMaterial({ color: 0x4a5d4e, roughness: 0.9 });
        const mainLawn = new THREE.Mesh(lawnGeo, [grassMat, pitWallMat]);
        
        mainLawn.rotation.x = -Math.PI / 2;
        mainLawn.position.set(0, 0, 0);
        mainLawn.scale.set(0.82, 0.81, -2.42);
        mainLawn.receiveShadow = true; mainLawn.castShadow = true;
        mainLawn.name = "主园区立体地形草坪(含凹坑)";
        terrainGroup.add(mainLawn);

        // Hills
        const hillMat = new THREE.MeshStandardMaterial({ color: 0x38a169, roughness: 0.8 });
        
        const hill1Geo = new THREE.SphereGeometry(7, 32, 24); hill1Geo.scale(1.8, 0.35, 1.0);
        const hill1 = new THREE.Mesh(hill1Geo, hillMat); 
        hill1.position.set(0.30, 0.80, -12.97); 
        hill1.rotation.set(0, THREE.MathUtils.degToRad(21.55), 0);
        hill1.receiveShadow = true; hill1.castShadow = true; hill1.name = "北部绿化丘陵"; terrainGroup.add(hill1);

        const hill2Geo = new THREE.SphereGeometry(6, 32, 24); hill2Geo.scale(1.3, 0.4, 1.2);
        const hill2 = new THREE.Mesh(hill2Geo, hillMat); 
        hill2.position.set(13.17, 0.80, -9.37);
        hill2.receiveShadow = true; hill2.castShadow = true; hill2.name = "东北坡地丘陵"; terrainGroup.add(hill2);

        const hill3Geo = new THREE.SphereGeometry(5.5, 32, 24); hill3Geo.scale(1.3, 0.35, 1.2);
        const hill3 = new THREE.Mesh(hill3Geo, hillMat); 
        hill3.position.set(-13.58, 0.80, -3.53);
        hill3.receiveShadow = true; hill3.castShadow = true; hill3.name = "西北绿化丘陵"; terrainGroup.add(hill3);

        const hill4Geo = new THREE.SphereGeometry(5, 32, 24); hill4Geo.scale(1.2, 0.3, 1.2);
        const hill4 = new THREE.Mesh(hill4Geo, hillMat); 
        hill4.position.set(-13.78, 0.80, 4.94);
        hill4.receiveShadow = true; hill4.castShadow = true; hill4.name = "西南景观丘陵"; terrainGroup.add(hill4);

        const hill5Geo = new THREE.SphereGeometry(5.5, 32, 24); hill5Geo.scale(1.2, 0.35, 1.3);
        const hill5 = new THREE.Mesh(hill5Geo, hillMat); 
        hill5.position.set(14.50, 0.80, 0.80);
        hill5.receiveShadow = true; hill5.castShadow = true; hill5.name = "东部坡地丘陵"; terrainGroup.add(hill5);

        const hill6Geo = new THREE.SphereGeometry(5, 32, 24); hill6Geo.scale(1.2, 0.3, 1.1);
        const hill6 = new THREE.Mesh(hill6Geo, hillMat); 
        hill6.position.set(11.23, 0.80, 9.76);
        hill6.receiveShadow = true; hill6.castShadow = true; hill6.name = "东南绿化丘陵"; terrainGroup.add(hill6);

        parkMasterGroup.add(terrainGroup);

        const waterGroup = new THREE.Group(); waterGroup.name = "🏞️ 湖泊与湖心岛";

        const lakeBedGeo = new THREE.ShapeGeometry(lakeShape);
        const lakeBedMat = new THREE.MeshStandardMaterial({ color: 0x022030, roughness: 0.95 });
        const lakeBedMesh = new THREE.Mesh(lakeBedGeo, lakeBedMat);
        lakeBedMesh.rotation.x = -Math.PI / 2; lakeBedMesh.position.y = 0.11;
        lakeBedMesh.receiveShadow = true; lakeBedMesh.name = "湖底基岩"; waterGroup.add(lakeBedMesh);

        const waterVolumeGeo = new THREE.ExtrudeGeometry(lakeShape, { depth: 0.42, bevelEnabled: false });
        const waterVolumeMat = new THREE.MeshStandardMaterial({ color: 0x0e80b2, roughness: 0.1, metalness: 0.15, transparent: true, opacity: 0.88 });
        const waterVolume = new THREE.Mesh(waterVolumeGeo, waterVolumeMat);
        waterVolume.rotation.x = -Math.PI / 2; waterVolume.position.y = 0.12;
        waterVolume.name = "中央观赏水体内容量"; waterGroup.add(waterVolume);

        // 动态生成噪点贴图作为法线贴图，模拟波光粼粼的扰动水面
        const waterCanvas = document.createElement('canvas');
        waterCanvas.width = 512; waterCanvas.height = 512;
        const wCtx = waterCanvas.getContext('2d');
        wCtx.fillStyle = 'rgb(128, 128, 255)'; // 基础平坦法线RGB值
        wCtx.fillRect(0, 0, 512, 512);
        for (let i = 0; i < 4000; i++) {
            let x = Math.random() * 512; let y = Math.random() * 512;
            let r = Math.random() * 8 + 4;
            let c = Math.floor(Math.random() * 80 + 128); 
            wCtx.fillStyle = `rgb(${c}, ${c}, 255)`; // 随机扰动X,Y法线
            wCtx.beginPath(); wCtx.arc(x, y, r, 0, Math.PI * 2); wCtx.fill();
        }
        wCtx.filter = 'blur(6px)'; wCtx.drawImage(waterCanvas, 0, 0); // 模糊处理使波纹平滑
        const waterNormals = new THREE.CanvasTexture(waterCanvas);
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;
        waterNormals.repeat.set(16, 16); // 密集重复以产生细碎波光

        const lakeGeo = new THREE.ShapeGeometry(lakeShape);
        const lakeMat = new THREE.MeshStandardMaterial({ 
            color: 0x38bdf8, 
            roughness: 0.05, 
            metalness: 0.85, // 提高金属感以反射强光
            transparent: true, 
            opacity: 0.92,
            normalMap: waterNormals, // 贴入法线贴图
            normalScale: new THREE.Vector2(0.6, 0.6) // 控制波纹强度
        });
        const lakeMesh = new THREE.Mesh(lakeGeo, lakeMat);
        lakeMesh.rotation.x = -Math.PI / 2; lakeMesh.position.y = 0.545;
        lakeMesh.name = "中央观赏湖水面"; waterGroup.add(lakeMesh);

        const bordersGroup = new THREE.Group(); bordersGroup.name = "🧱 边缘描边与驳岸墙";
        const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
        const lakePoints = lakeShape.getPoints(120);
        const lakePath3D = new THREE.CatmullRomCurve3(lakePoints.map(p => new THREE.Vector3(p.x, p.y, 0)), true);
        const lakeRimGeo = new THREE.TubeGeometry(lakePath3D, 120, 0.16, 12, true);
        const lakeRim = new THREE.Mesh(lakeRimGeo, rimMat);
        lakeRim.rotation.x = -Math.PI / 2; lakeRim.position.y = 0.82;
        lakeRim.receiveShadow = true; lakeRim.castShadow = true; lakeRim.name = "环湖统一石质驳岸描边墙";
        bordersGroup.add(lakeRim);
        waterGroup.add(bordersGroup);

        const islandGroup = new THREE.Group(); islandGroup.name = "🏝️ 湖心绿岛";
        const islandRimGeo = new THREE.CylinderGeometry(2.7, 2.9, 0.80, 32);
        const islandRimMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.5 });
        const islandRim = new THREE.Mesh(islandRimGeo, islandRimMat);
        islandRim.position.set(0, 0.52, 0); islandRim.receiveShadow = true; islandRim.castShadow = true; islandGroup.add(islandRim);
        
        const islandSoilGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.15, 32);
        const islandSoilMat = new THREE.MeshStandardMaterial({ color: 0x2f855a, roughness: 0.8 });
        const islandSoil = new THREE.Mesh(islandSoilGeo, islandSoilMat);
        islandSoil.position.set(0, 0.95, 0); islandSoil.receiveShadow = true; islandSoil.name = "湖心岛草坪地面"; islandGroup.add(islandSoil);
        
        waterGroup.add(islandGroup); parkMasterGroup.add(waterGroup);

        const infraGroup = new THREE.Group(); infraGroup.name = "🏛️ 广场与公共步道";
        const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d'); ctx.fillStyle = '#e2e8f0'; ctx.fillRect(0, 0, 512, 512);
        ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 12;
        for (let i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(i * 64, 0); ctx.lineTo(i * 64, 512); ctx.stroke(); }
        for (let j = 0; j <= 8; j++) { ctx.beginPath(); ctx.moveTo(0, j * 64); ctx.lineTo(512, j * 64); ctx.stroke(); }
        const tileTex = new THREE.CanvasTexture(canvas); tileTex.wrapS = THREE.RepeatWrapping; tileTex.wrapT = THREE.RepeatWrapping; tileTex.repeat.set(4, 2);
        const plazaGeo = new THREE.BoxGeometry(16, 0.18, 9);
        const plazaMat = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.6 });
        const plaza = new THREE.Mesh(plazaGeo, plazaMat);
        
        // 入口景观石板广场坐标: plaza.position.set(-1.83, 0.82, 12.50);
        plaza.position.set(-1.83, 0.82, 12.50); 
        plaza.receiveShadow = true; plaza.name = "入口景观石板广场"; infraGroup.add(plaza);

        function createParkBench(name) {
            const bench = new THREE.Group();
            bench.name = name;

            const woodMat = new THREE.MeshStandardMaterial({ color: 0x8f4614, roughness: 0.5, metalness: 0.1 }); // 温暖红棕实木
            const frameMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 }); // 深灰铸铁边框

            // 左右支撑边框与扶手
            [-0.9, 0.9].forEach((xPos) => {
                const frontLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.48), frameMat);
                frontLeg.position.set(xPos, 0.24, 0.22); frontLeg.castShadow = true; bench.add(frontLeg);

                const backLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.82), frameMat);
                backLeg.position.set(xPos, 0.41, -0.22); backLeg.rotation.x = -0.15; backLeg.castShadow = true; bench.add(backLeg);

                const armrest = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.52), frameMat);
                armrest.position.set(xPos, 0.48, 0); armrest.castShadow = true; bench.add(armrest);
            });

            // 坐垫木条 (4条)
            for (let i = 0; i < 4; i++) {
                const seatSlat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.035, 0.1), woodMat);
                seatSlat.position.set(0, 0.47, -0.15 + i * 0.12);
                seatSlat.castShadow = true; seatSlat.receiveShadow = true; bench.add(seatSlat);
            }

            // 靠背木条 (3条)
            for (let i = 0; i < 3; i++) {
                const backSlat = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.1, 0.035), woodMat);
                backSlat.position.set(0, 0.60 + i * 0.12, -0.21 - i * 0.02);
                backSlat.rotation.x = -0.15;
                backSlat.castShadow = true; backSlat.receiveShadow = true; bench.add(backSlat);
            }
            return bench;
        }

        // 广场两侧对称摆放4把休息公园长椅
        const bench1 = createParkBench("广场左侧长椅 #1"); bench1.position.set(-7.5, 0.91, 10.8); bench1.rotation.y = Math.PI / 2; infraGroup.add(bench1);
        const bench2 = createParkBench("广场左侧长椅 #2"); bench2.position.set(-7.5, 0.91, 13.8); bench2.rotation.y = Math.PI / 2; infraGroup.add(bench2);
        const bench3 = createParkBench("广场右侧长椅 #1"); bench3.position.set(3.8, 0.91, 10.8); bench3.rotation.y = -Math.PI / 2; infraGroup.add(bench3);
        const bench4 = createParkBench("广场右侧长椅 #2"); bench4.position.set(3.8, 0.91, 13.8); bench4.rotation.y = -Math.PI / 2; infraGroup.add(bench4);

        // =========================================================================
        // 2. 为”入口景观石板广场“精心建模并加入孔子人物雕像
        // =========================================================================
        const confuciusGroup = new THREE.Group();
        confuciusGroup.name = "📜 孔子大师雕像纪念碑";

        // 材料定义：使用高对比度的深色磨砂黑/花岗岩基座，与淡蓝色石板广场明显区分
        const darkGraniteMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.25 }); // 深黑/玄武岩花岗岩基座
        const bronzeMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.4, metalness: 0.6 }); // 青铜长袍
        const fleshMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.6 }); // 肤色

        // 1. 多层深色花岗岩基座与台阶（鲜明区分于浅色广场）
        const baseTier1 = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.35, 2.6), darkGraniteMat);
        baseTier1.position.set(0, 0.09 + 0.175, 0); baseTier1.castShadow = true; baseTier1.receiveShadow = true; baseTier1.name = "雕像基座底层(深色花岗岩)";
        confuciusGroup.add(baseTier1);

        const baseTier2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 1.8), darkGraniteMat);
        baseTier2.position.set(0, 0.26 + 0.15, 0); baseTier2.castShadow = true; baseTier2.receiveShadow = true; baseTier2.name = "雕像基座中层(深色花岗岩)";
        confuciusGroup.add(baseTier2);

        const stleGeo = new THREE.BoxGeometry(1.8, 1.1, 0.4);
        const stleMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3 });
        const stle = new THREE.Mesh(stleGeo, stleMat);
        stle.position.set(0, 0.41 + 0.55, -0.6); stle.castShadow = true; stle.receiveShadow = true; stle.name = "万世师表石碑";
        confuciusGroup.add(stle);

        // 2. 孔子身躯（儒袍与宽袖）
        const bodyGroup = new THREE.Group();
        bodyGroup.name = "孔子身躯";
        bodyGroup.position.set(0, 0.56, 0);

        // 躯干（宽大儒袍）
        const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.75, 1.3, 8), bronzeMat);
        torso.position.y = 0.65; torso.castShadow = true; torso.receiveShadow = true; bodyGroup.add(torso);

        // 宽大长袖（双手合拱于胸前，致敬经典儒家拱手礼）
        const leftSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.7), bronzeMat);
        leftSleeve.position.set(0.32, 0.75, 0.2); leftSleeve.rotation.z = -Math.PI / 12; leftSleeve.castShadow = true; bodyGroup.add(leftSleeve);

        const rightSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.7), bronzeMat);
        rightSleeve.position.set(-0.32, 0.75, 0.2); rightSleeve.rotation.z = Math.PI / 12; rightSleeve.castShadow = true; bodyGroup.add(rightSleeve);

        // 拱手双掌
        const hands = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.3), fleshMat);
        hands.position.set(0, 0.72, 0.45); hands.castShadow = true; bodyGroup.add(hands);

        // 3. 头部与儒冠（贤者气度）
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 24), fleshMat);
        head.position.set(0, 1.55, 0.05); head.scale.set(0.9, 1.1, 0.95); head.castShadow = true; bodyGroup.add(head);

        // 儒冠（高冠/进贤冠）
        const hatBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.45), bronzeMat);
        hatBase.position.set(0, 1.82, 0.05); hatBase.castShadow = true; bodyGroup.add(hatBase);

        const hatTop = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.32, 0.35), bronzeMat);
        hatTop.position.set(0, 2.02, 0.02); hatTop.rotation.x = -0.1; hatTop.castShadow = true; bodyGroup.add(hatTop);

        confuciusGroup.add(bodyGroup);

        // 将孔子雕像放置在广场正中央 (-1.83, 0.91, 10.50)，面向湖面审视公园
        confuciusGroup.position.set(-1.83, 0.91, 10.50);
        confuciusGroup.scale.set(1.15, 1.15, 1.15);
        parkMasterGroup.add(confuciusGroup);

        parkMasterGroup.add(infraGroup);

        const vegGroup = new THREE.Group(); vegGroup.name = "🌳 景观植被与树木集";

        function createTree(name, colorHex, heightScale = 1) {
            const tree = new THREE.Group(); tree.name = name;
            const trunkGeo = new THREE.CylinderGeometry(0.12 * heightScale, 0.22 * heightScale, 1.2 * heightScale, 8);
            const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = (0.6 * heightScale); trunk.castShadow = true; trunk.receiveShadow = true; trunk.name = `${name}-树干`; tree.add(trunk);
            const foliageMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.65 });
            for (let i = 0; i < 3; i++) {
                const radius = (0.65 - i * 0.12) * heightScale;
                const folGeo = new THREE.DodecahedronGeometry(radius, 1);
                const foliage = new THREE.Mesh(folGeo, foliageMat);
                foliage.position.y = (1.1 + i * 0.42) * heightScale; foliage.castShadow = true; foliage.receiveShadow = true; foliage.name = `${name}-树冠${i+1}`; tree.add(foliage);
            }
            return tree;
        }

        function createGiantTree(name, colorHex, heightScale = 1.8) {
            const tree = new THREE.Group(); tree.name = name;
            // 粗壮挺拔的巨树主干
            const trunkGeo = new THREE.CylinderGeometry(0.22 * heightScale, 0.38 * heightScale, 1.6 * heightScale, 10);
            const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.95 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.y = (0.8 * heightScale); trunk.castShadow = true; trunk.receiveShadow = true; trunk.name = `${name}-巨树主干`; tree.add(trunk);
            
            const foliageMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 });
            // 4层宽大庞大的巨型树冠，形成浓密参天的荫凉
            const layers = [
                { radius: 1.2 * heightScale, yOffset: 1.3 * heightScale },
                { radius: 1.0 * heightScale, yOffset: 1.8 * heightScale },
                { radius: 0.75 * heightScale, yOffset: 2.3 * heightScale },
                { radius: 0.5 * heightScale, yOffset: 2.7 * heightScale }
            ];
            layers.forEach((layer, i) => {
                const folGeo = new THREE.DodecahedronGeometry(layer.radius, 1);
                const foliage = new THREE.Mesh(folGeo, foliageMat);
                foliage.position.y = layer.yOffset;
                foliage.castShadow = true; foliage.receiveShadow = true;
                foliage.name = `${name}-巨型树冠第${i+1}层`;
                tree.add(foliage);
            });
            return tree;
        }

        const forestColors = [0x1c4532, 0x276749, 0x2f855a, 0x38a169, 0x48bb78, 0x68d391, 0xd69e2e];
        
        const islandTreesGroup = new THREE.Group(); islandTreesGroup.name = "湖心岛树木群";
        // 湖心岛树木减少为 3 棵
        const islandPos = [[-1.2, -0.4], [0.8, 0.8], [0.5, -1.1]];
        islandPos.forEach((p, idx) => { const t = createTree(`湖心岛树木 #${idx + 1}`, forestColors[idx % forestColors.length], 0.9 + idx * 0.1); t.position.set(p[0], 1.02, p[1]); islandTreesGroup.add(t); });
        vegGroup.add(islandTreesGroup);

        // ========================= 局部坐标系化的丘陵森林 (数量控制在4~6棵) =========================

        // 1. 北部密林区 (5棵)
        const northForestGroup = new THREE.Group(); northForestGroup.name = "北部丘陵密林区";
        northForestGroup.position.copy(hill1.position);
        northForestGroup.rotation.copy(hill1.rotation);
        function getHill1HeightLocal(lx, lz) { const dx = lx / (7 * 1.8); const dz = lz / (7 * 1.0); const distSq = dx * dx + dz * dz; return distSq >= 1 ? 0 : Math.sqrt(1 - distSq) * (7 * 0.35); }
        const northPos = [[-6, -16], [-2, -17], [1, -15], [-4, -14], [0, -13.5]];
        northPos.forEach((p, idx) => { 
            const lx = p[0] - (-2), lz = p[1] - (-15.5);
            const t = createTree(`北部丘陵树木 #${idx + 1}`, forestColors[idx % forestColors.length], 0.9 + (idx % 3) * 0.15); 
            t.position.set(lx, getHill1HeightLocal(lx, lz), lz); northForestGroup.add(t); 
        });
        // 加入 2 棵参天巨树，调整坐标将其移至边缘以避开小树群
        const northGiantPos = [[-8, -14.5], [3, -16.5]];
        northGiantPos.forEach((p, idx) => {
            const lx = p[0] - (-2), lz = p[1] - (-15.5);
            const gt = createGiantTree(`北部丘陵参天巨树 #${idx + 1}`, forestColors[(idx * 3 + 1) % forestColors.length], 1.7);
            gt.position.set(lx, getHill1HeightLocal(lx, lz), lz); northForestGroup.add(gt);
        });
        vegGroup.add(northForestGroup);

        // 2. 东北坡地树木 (4棵)
        const neForestGroup = new THREE.Group(); neForestGroup.name = "东北坡地丘陵树木区";
        neForestGroup.position.copy(hill2.position);
        function getHill2HeightLocal(lx, lz) { const dx = lx / (6 * 1.3); const dz = lz / (6 * 1.2); const distSq = dx * dx + dz * dz; return distSq >= 1 ? 0 : Math.sqrt(1 - distSq) * (6 * 0.4); }
        const nePos = [[8, -16], [12, -17], [10, -14], [13, -15]];
        nePos.forEach((p, idx) => { 
            const lx = p[0] - 11, lz = p[1] - (-15.5);
            const t = createTree(`东北丘陵树木 #${idx + 1}`, forestColors[(idx + 2) % forestColors.length], 0.85 + (idx % 3) * 0.2); 
            t.position.set(lx, getHill2HeightLocal(lx, lz), lz); neForestGroup.add(t); 
        });
        // 加入 2 棵参天巨树，调整坐标将其移至边缘以避开小树群
        const neGiantPos = [[7, -13.5], [14, -16.5]];
        neGiantPos.forEach((p, idx) => {
            const lx = p[0] - 11, lz = p[1] - (-15.5);
            const gt = createGiantTree(`东北丘陵参天巨树 #${idx + 1}`, forestColors[(idx * 2) % forestColors.length], 1.65);
            gt.position.set(lx, getHill2HeightLocal(lx, lz), lz); neForestGroup.add(gt);
        });
        vegGroup.add(neForestGroup);

        // 3. 西北树木 (4棵)
        const nwForestGroup = new THREE.Group(); nwForestGroup.name = "西北丘陵树木区";
        nwForestGroup.position.copy(hill3.position);
        function getHill3HeightLocal(lx, lz) { const dx = lx / (5.5 * 1.3); const dz = lz / (5.5 * 1.2); const distSq = dx * dx + dz * dz; return distSq >= 1 ? 0 : Math.sqrt(1 - distSq) * (5.5 * 0.35); }
        const nwPos = [[-15, -8], [-13, -7], [-15.5, -5], [-14, -4]];
        nwPos.forEach((p, idx) => { 
            const lx = p[0] - (-14.5), lz = p[1] - (-7);
            const t = createTree(`西北丘陵树木 #${idx + 1}`, forestColors[(idx + 1) % forestColors.length], 0.85 + (idx % 3) * 0.15); 
            t.position.set(lx, getHill3HeightLocal(lx, lz), lz); nwForestGroup.add(t); 
        });
        // 加入 2 棵参天巨树，调整坐标将其移至边缘以避开小树群
        const nwGiantPos = [[-12, -4.5], [-16.5, -9.5]];
        nwGiantPos.forEach((p, idx) => {
            const lx = p[0] - (-14.5), lz = p[1] - (-7);
            const gt = createGiantTree(`西北丘陵参天巨树 #${idx + 1}`, forestColors[(idx * 2 + 1) % forestColors.length], 1.7);
            gt.position.set(lx, getHill3HeightLocal(lx, lz), lz); nwForestGroup.add(gt);
        });
        vegGroup.add(nwForestGroup);

        // 4. 西南树木 (4棵)
        const swForestGroup = new THREE.Group(); swForestGroup.name = "西南丘陵树木区";
        swForestGroup.position.copy(hill4.position);
        function getHill4HeightLocal(lx, lz) { const dx = lx / (5 * 1.2); const dz = lz / (5 * 1.2); const distSq = dx * dx + dz * dz; return distSq >= 1 ? 0 : Math.sqrt(1 - distSq) * (5 * 0.3); }
        const swPos = [[-15, -2], [-13.5, 0], [-15, -0.5], [-14, -2.5]];
        swPos.forEach((p, idx) => { 
            const lx = p[0] - (-15), lz = p[1] - (-1.5);
            const t = createTree(`西南丘陵树木 #${idx + 1}`, forestColors[(idx + 3) % forestColors.length], 0.9 + (idx % 2) * 0.2); 
            t.position.set(lx, getHill4HeightLocal(lx, lz), lz); swForestGroup.add(t); 
        });
        // 加入 2 棵参天巨树，调整坐标将其移至边缘以避开小树群
        const swGiantPos = [[-12.5, -1.5], [-16.5, -3.5]];
        swGiantPos.forEach((p, idx) => {
            const lx = p[0] - (-15), lz = p[1] - (-1.5);
            const gt = createGiantTree(`西南丘陵参天巨树 #${idx + 1}`, forestColors[(idx * 3) % forestColors.length], 1.65);
            gt.position.set(lx, getHill4HeightLocal(lx, lz), lz); swForestGroup.add(gt);
        });
        vegGroup.add(swForestGroup);

        // 5. 东部树木 (4棵)
        const eastForestGroup = new THREE.Group(); eastForestGroup.name = "东部丘陵树木区";
        eastForestGroup.position.copy(hill5.position);
        function getHill5HeightLocal(lx, lz) { const dx = lx / (5.5 * 1.2); const dz = lz / (5.5 * 1.3); const distSq = dx * dx + dz * dz; return distSq >= 1 ? 0 : Math.sqrt(1 - distSq) * (5.5 * 0.35); }
        const eastPos = [[14, -5], [15.5, -3], [14.5, 0], [16, -1.5]];
        eastPos.forEach((p, idx) => { 
            const lx = p[0] - 14.5, lz = p[1] - (-3);
            const t = createTree(`东部丘陵树木 #${idx + 1}`, forestColors[(idx + 4) % forestColors.length], 0.85 + (idx % 3) * 0.2); 
            t.position.set(lx, getHill5HeightLocal(lx, lz), lz); eastForestGroup.add(t); 
        });
        // 加入 2 棵参天巨树，调整坐标将其移至边缘以避开小树群
        const eastGiantPos = [[12.5, -1.5], [17, -4.5]];
        eastGiantPos.forEach((p, idx) => {
            const lx = p[0] - 14.5, lz = p[1] - (-3);
            const gt = createGiantTree(`东部丘陵参天巨树 #${idx + 1}`, forestColors[(idx * 2 + 2) % forestColors.length], 1.7);
            gt.position.set(lx, getHill5HeightLocal(lx, lz), lz); eastForestGroup.add(gt);
        });
        vegGroup.add(eastForestGroup);

        // 6. 东南树木 (4棵)
        const seHillForestGroup = new THREE.Group(); seHillForestGroup.name = "东南丘陵树木区";
        seHillForestGroup.position.copy(hill6.position);
        function getHill6HeightLocal(lx, lz) { const dx = lx / (5 * 1.2); const dz = lz / (5 * 1.1); const distSq = dx * dx + dz * dz; return distSq >= 1 ? 0 : Math.sqrt(1 - distSq) * (5 * 0.3); }
        const seHillPos = [[13, 6], [15, 6.5], [13.5, 8], [14.5, 7]];
        seHillPos.forEach((p, idx) => { 
            const lx = p[0] - 13.5, lz = p[1] - 7;
            const t = createTree(`东南丘陵树木 #${idx + 1}`, forestColors[(idx + 2) % forestColors.length], 0.9 + (idx % 2) * 0.15); 
            t.position.set(lx, getHill6HeightLocal(lx, lz), lz); seHillForestGroup.add(t); 
        });
        // 加入 2 棵参天巨树，调整坐标将其移至边缘以避开小树群
        const seHillGiantPos = [[12, 8.5], [16, 5]];
        seHillGiantPos.forEach((p, idx) => {
            const lx = p[0] - 13.5, lz = p[1] - 7;
            const gt = createGiantTree(`东南丘陵参天巨树 #${idx + 1}`, forestColors[(idx * 3 + 1) % forestColors.length], 1.65);
            gt.position.set(lx, getHill6HeightLocal(lx, lz), lz); seHillForestGroup.add(gt);
        });
        vegGroup.add(seHillForestGroup);

        const seShoreGroup = new THREE.Group(); seShoreGroup.name = "东南沿岸观赏树丛";
        const sePos = [[8, 11], [11, 8], [13, 4], [13.5, 0]];
        sePos.forEach((p, idx) => { const t = createTree(`东南岸树木 #${idx + 1}`, forestColors[idx % forestColors.length], 1.0 + (idx % 2) * 0.2); t.position.set(p[0], 0.8, p[1]); seShoreGroup.add(t); });
        vegGroup.add(seShoreGroup);

        parkMasterGroup.add(vegGroup);
}