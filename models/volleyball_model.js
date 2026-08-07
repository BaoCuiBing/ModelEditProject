// 模型名称：排球场模型
function buildMyVolleyballScene(THREE, group) {
            // 色彩常量定义 (精准匹配卫星图色彩)
            const COLOR_COURT_GREEN = 0x2e6b45; // 排球场绿底
            const COLOR_COURT_RED   = 0x9e382b; // 排球场红边/隔带
            const COLOR_LINE_WHITE  = 0xffffff; // 排球场白划线
            const COLOR_WALL        = 0xe8e8e4; // 楼宇外墙
            const COLOR_ROOF_TRIM   = 0xf8fafc; // 屋顶亮白包边框
            const COLOR_CONCRETE    = 0x7a8089; // 外围水泥地坪
            const COLOR_GRASS       = 0x3b6637; // 左侧草坪带

            // 1. 添加环境光
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
            ambientLight.name = "主环境光";
            group.add(ambientLight);

            // 2. 添加太阳平行光
            const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.5);
            sunLight.name = "太阳日光";
            sunLight.position.set(45, 60, 25);
            sunLight.castShadow = true;
            sunLight.shadow.mapSize.width = 4096;
            sunLight.shadow.mapSize.height = 4096;
            sunLight.shadow.camera.near = 0.5;
            sunLight.shadow.camera.far = 500;
            const shadowDim = 120;
            sunLight.shadow.camera.left = -shadowDim;
            sunLight.shadow.camera.right = shadowDim;
            sunLight.shadow.camera.top = shadowDim;
            sunLight.shadow.camera.bottom = -shadowDim;
            sunLight.shadow.bias = -0.0001;
            group.add(sunLight);

            // 3. 地坪与环境底盘
            const groundGroup = new THREE.Group();
            groundGroup.name = "地面环境组";

            // 水泥大底盘 (Y轴设为 0)
            const groundGeo = new THREE.PlaneGeometry(120, 120);
            const groundMat = new THREE.MeshStandardMaterial({ color: COLOR_CONCRETE, roughness: 0.85 });
            const groundMesh = new THREE.Mesh(groundGeo, groundMat);
            groundMesh.rotation.x = -Math.PI / 2;
            groundMesh.position.set(-4.38, 0.00, -16.62);
            groundMesh.scale.set(0.77, 0.47, 0.56);
            groundMesh.receiveShadow = true;
            groundMesh.name = "水泥地坪";
            groundGroup.add(groundMesh);

            // 左侧绿化草地带 (稍微抬高至 Y=0.08 防止与水泥地 z-fighting)
            const grassGeo = new THREE.PlaneGeometry(24, 80);
            const grassMat = new THREE.MeshStandardMaterial({ color: COLOR_GRASS, roughness: 0.9 });
            const grassMesh = new THREE.Mesh(grassGeo, grassMat);
            grassMesh.rotation.x = -Math.PI / 2;
            grassMesh.position.set(-37.72, 0.08, -16.27); 
            grassMesh.scale.set(1.00, 0.57, 0.94);
            grassMesh.receiveShadow = true;
            grassMesh.name = "左侧绿化带";
            groundGroup.add(grassMesh);

            group.add(groundGroup);

            // 4. 构建 4 连排排球场 (2×2 阵列布局，拉大层次高度比)
            const courtsGroup = new THREE.Group();
            courtsGroup.name = "4连排排球场组";
            courtsGroup.position.set(-8.00, 0.00, -16.13); 
            courtsGroup.scale.set(1.69, 1.43, 1.32);

            // 红色塑胶底层整体大方块 (Y 轴提高至 0.35)
            const padW = 20;
            const padL = 38;
            const padGeo = new THREE.PlaneGeometry(padW, padL);
            const padMat = new THREE.MeshStandardMaterial({ color: COLOR_COURT_RED, roughness: 0.65 });
            const padMesh = new THREE.Mesh(padGeo, padMat);
            padMesh.rotation.x = -Math.PI / 2;
            padMesh.position.set(0, 0.35, 0);
            padMesh.receiveShadow = true;
            padMesh.name = "排球场红色塑胶底座";
            courtsGroup.add(padMesh);

            // 场馆中央红绿隔离横带细节 (Y 轴提高至 0.38)
            const midDividerGeo = new THREE.PlaneGeometry(padW - 1, 0.8);
            const midDividerMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.7 });
            const midDividerMesh = new THREE.Mesh(midDividerGeo, midDividerMat);
            midDividerMesh.rotation.x = -Math.PI / 2;
            midDividerMesh.position.set(0, 0.38, 0);
            midDividerMesh.name = "排球场中央分隔横带";
            courtsGroup.add(midDividerMesh);

            // 4个标准排球场相对坐标
            const courtPositions = [
                { name: "1号球场(左上)", x: -4.2, z: -9.5 },
                { name: "2号球场(右上)", x: 4.2,  z: -9.5 },
                { name: "3号球场(左下)", x: -4.2, z: 9.5 },
                { name: "4号球场(右下)", x: 4.2,  z: 9.5 }
            ];

            courtPositions.forEach((pos) => {
                const singleCourtGroup = new THREE.Group();
                singleCourtGroup.name = pos.name;

                const courtW = 7.0;
                const courtL = 14.5;

                // 绿色比赛内框表面 (Y 轴提高至 0.42)
                const greenGeo = new THREE.PlaneGeometry(courtW, courtL);
                const greenMat = new THREE.MeshStandardMaterial({ color: COLOR_COURT_GREEN, roughness: 0.5 });
                const greenMesh = new THREE.Mesh(greenGeo, greenMat);
                greenMesh.rotation.x = -Math.PI / 2;
                greenMesh.position.set(pos.x, 0.42, pos.z);
                greenMesh.receiveShadow = true;
                greenMesh.name = `${pos.name}_绿色比赛场地`;
                singleCourtGroup.add(greenMesh);

                // 白色标线组 (Y 轴提高至 0.46)
                const lineMat = new THREE.MeshBasicMaterial({ color: COLOR_LINE_WHITE });

                // 边框线
                const borderGeo = new THREE.PlaneGeometry(courtW, courtL);
                const borderEdges = new THREE.EdgesGeometry(borderGeo);
                const borderLine = new THREE.LineSegments(borderEdges, lineMat);
                borderLine.rotation.x = -Math.PI / 2;
                borderLine.position.set(pos.x, 0.46, pos.z);
                borderLine.name = `${pos.name}_外围边界线`;
                singleCourtGroup.add(borderLine);

                // 中线
                const centerGeo = new THREE.PlaneGeometry(courtW, 0.15);
                const centerMesh = new THREE.Mesh(centerGeo, lineMat);
                centerMesh.rotation.x = -Math.PI / 2;
                centerMesh.position.set(pos.x, 0.47, pos.z);
                centerMesh.name = `${pos.name}_中场分割线`;
                singleCourtGroup.add(centerMesh);

                // 3米进攻线
                [-2.4, 2.4].forEach((offsetZ, lineIdx) => {
                    const atkGeo = new THREE.PlaneGeometry(courtW, 0.12);
                    const atkMesh = new THREE.Mesh(atkGeo, lineMat);
                    atkMesh.rotation.x = -Math.PI / 2;
                    atkMesh.position.set(pos.x, 0.47, pos.z + offsetZ);
                    atkMesh.name = `${pos.name}_进攻线_${lineIdx + 1}`;
                    singleCourtGroup.add(atkMesh);
                });

                // 排球网与立柱细节建模 (基座起点同步设为 0.42)
                const netHeight = 2.4;
                const postRadius = 0.08;
                const postGeo = new THREE.CylinderGeometry(postRadius, postRadius, netHeight, 16);
                const postMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.8, roughness: 0.2 });

                [-courtW / 2 - 0.3, courtW / 2 + 0.3].forEach((offsetX, pIdx) => {
                    // 金属立柱
                    const post = new THREE.Mesh(postGeo, postMat);
                    post.position.set(pos.x + offsetX, 0.42 + netHeight / 2, pos.z);
                    post.castShadow = true;
                    post.name = `${pos.name}_网柱_${pIdx + 1}`;
                    singleCourtGroup.add(post);

                    // 柱子底座防撞保护垫
                    const padBaseGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 12);
                    const padBaseMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.4 });
                    const padBase = new THREE.Mesh(padBaseGeo, padBaseMat);
                    padBase.position.set(pos.x + offsetX, 0.42 + 0.4, pos.z);
                    padBase.name = `${pos.name}_网柱保护垫_${pIdx + 1}`;
                    singleCourtGroup.add(padBase);
                });

                // 网布主体
                const netGeo = new THREE.PlaneGeometry(courtW + 0.6, 1.0);
                const netMat = new THREE.MeshStandardMaterial({
                    color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.8, wireframe: true
                });
                const netMesh = new THREE.Mesh(netGeo, netMat);
                netMesh.position.set(pos.x, 0.42 + netHeight - 0.5, pos.z);
                netMesh.name = `${pos.name}_排球网网格`;
                singleCourtGroup.add(netMesh);

                // 网顶白边带
                const topBandGeo = new THREE.BoxGeometry(courtW + 0.6, 0.08, 0.04);
                const topBandMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
                const topBand = new THREE.Mesh(topBandGeo, topBandMat);
                topBand.position.set(pos.x, 0.42 + netHeight, pos.z);
                topBand.name = `${pos.name}_球网顶包边`;
                singleCourtGroup.add(topBand);

                // 标志杆
                [-courtW / 2, courtW / 2].forEach((antX, aIdx) => {
                    const antennaGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.8, 8);
                    const antennaMat = new THREE.MeshBasicMaterial({ color: 0xdc2626 });
                    const antenna = new THREE.Mesh(antennaGeo, antennaMat);
                    antenna.position.set(pos.x + antX, 0.42 + netHeight - 0.1, pos.z);
                    antenna.name = `${pos.name}_红白标志杆_${aIdx + 1}`;
                    singleCourtGroup.add(antenna);
                });

                // 裁判高椅细节
                const chairGroup = new THREE.Group();
                chairGroup.name = `${pos.name}_裁判高椅`;
                const chairLegGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.0, 8);
                const chairMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.6 });
                
                [-0.3, 0.3].forEach((cx, legIdx) => {
                    const leg = new THREE.Mesh(chairLegGeo, chairMat);
                    leg.position.set(cx, 1.0, 0);
                    leg.name = `${pos.name}_裁判椅支架_${legIdx + 1}`;
                    chairGroup.add(leg);
                });
                
                const seatGeo = new THREE.BoxGeometry(0.7, 0.08, 0.6);
                const seatMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
                const seat = new THREE.Mesh(seatGeo, seatMat);
                seat.position.set(0, 1.8, 0);
                seat.name = `${pos.name}_裁判座椅`;
                chairGroup.add(seat);

                chairGroup.position.set(pos.x + courtW / 2 + 0.6, 0.42, pos.z);
                singleCourtGroup.add(chairGroup);

                courtsGroup.add(singleCourtGroup);
            });

            group.add(courtsGroup);

            // 5. 构建右侧楼宇主体
            const buildingGroup = new THREE.Group();
            buildingGroup.name = "主楼建筑组";

            const bW = 28;
            const bL = 36;
            const bH = 30.6; // 原高度18加高至1.7倍

            buildingGroup.position.set(23.50, bH / 2, -18.02); 

            // 楼体主墙面
            const wallGeo = new THREE.BoxGeometry(bW, bH, bL);
            const wallMat = new THREE.MeshStandardMaterial({ color: COLOR_WALL, roughness: 0.7 });
            const buildingMesh = new THREE.Mesh(wallGeo, wallMat);
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            buildingMesh.name = "主楼外墙主体";
            buildingGroup.add(buildingMesh);

            // 侧边深色玻璃幕墙 (根据高度成比例加高)
            const glassGeo = new THREE.PlaneGeometry(27.8, 23.8);
            const glassMat = new THREE.MeshStandardMaterial({ 
                color: 0x0f172a, 
                metalness: 0.9, 
                roughness: 0.1,
                polygonOffset: true,
                polygonOffsetFactor: -2,
                polygonOffsetUnits: -2
            });
            const glassMesh = new THREE.Mesh(glassGeo, glassMat);
            glassMesh.rotation.y = -Math.PI / 2;
            glassMesh.position.set(-bW / 2 - 0.2, 0, 0);
            glassMesh.name = "主楼侧面深色玻璃幕墙";
            buildingGroup.add(glassMesh);

            // 幕墙竖向金属窗框
            const gridMat = new THREE.MeshBasicMaterial({ color: 0x475569 });
            for (let gx = -12; gx <= 12; gx += 4) {
                const vertBarGeo = new THREE.BoxGeometry(0.08, 23.8, 0.08);
                const vertBar = new THREE.Mesh(vertBarGeo, gridMat);
                vertBar.position.set(-bW / 2 - 0.22, 0, gx);
                vertBar.name = `主楼幕墙竖向窗框_${gx}`;
                buildingGroup.add(vertBar);
            }

            // 腰线装饰条
            const stripeGeo = new THREE.BoxGeometry(bW + 0.4, 0.6, bL + 0.4);
            const stripeMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.8 });
            const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
            stripeMesh.position.set(0, 5.1, 0);
            stripeMesh.name = "主楼外墙腰线";
            buildingGroup.add(stripeMesh);

            // 生成屋顶纹理 Canvas
            const canvas = document.createElement('canvas');
            canvas.width = 1024; canvas.height = 1024;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#334155'; ctx.fillRect(0, 0, 1024, 1024);
            
            ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 4;
            for (let i = 0; i < 1024; i += 16) { 
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke(); 
            }
            ctx.strokeStyle = '#f8fafc'; ctx.lineWidth = 10;
            [256, 512, 768].forEach(x => { 
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke(); 
            });

            const roofTexture = new THREE.CanvasTexture(canvas);
            roofTexture.wrapS = THREE.RepeatWrapping; roofTexture.wrapT = THREE.RepeatWrapping;

            // 屋顶贴面
            const roofGeo = new THREE.PlaneGeometry(bW - 0.8, bL - 0.8);
            const roofMat = new THREE.MeshStandardMaterial({ 
                map: roofTexture, 
                roughness: 0.6,
                polygonOffset: true,
                polygonOffsetFactor: -2,
                polygonOffsetUnits: -2
            });
            const roofMesh = new THREE.Mesh(roofGeo, roofMat);
            roofMesh.rotation.x = -Math.PI / 2;
            roofMesh.position.set(0, bH / 2 + 0.25, 0);
            roofMesh.receiveShadow = true;
            roofMesh.name = "主楼屋顶彩钢板铺面";
            buildingGroup.add(roofMesh);

            // 白色结构梁/管道
            const beamGeo = new THREE.BoxGeometry(0.6, 0.4, bL - 4);
            const beamMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
            const beamMesh = new THREE.Mesh(beamGeo, beamMat);
            beamMesh.position.set(-1.0, bH / 2 + 0.45, 0);
            beamMesh.castShadow = true;
            beamMesh.name = "主楼屋顶白色贯穿梁结构";
            buildingGroup.add(beamMesh);

            // 屋顶 HVAC 机组
            const hvacGeo = new THREE.BoxGeometry(5.0, 2.2, 7.5);
            const hvacMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 });
            const hvacMesh = new THREE.Mesh(hvacGeo, hvacMat);
            hvacMesh.position.set(-5, bH / 2 + 1.1, -4);
            hvacMesh.castShadow = true;
            hvacMesh.name = "主楼屋顶 HVAC 空调机房";
            buildingGroup.add(hvacMesh);

            // 电梯井塔楼
            const stairGeo = new THREE.BoxGeometry(6.0, 3.0, 5.0);
            const stairMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.6 });
            const stairMesh = new THREE.Mesh(stairGeo, stairMat);
            stairMesh.position.set(4, bH / 2 + 1.5, 6);
            stairMesh.castShadow = true;
            stairMesh.name = "主楼屋顶出屋面电梯塔楼";
            buildingGroup.add(stairMesh);

            // 通风管道
            [-2, 0, 2].forEach((offsetZ, pIdx) => {
                const pipeGeo = new THREE.CylinderGeometry(0.3, 0.3, 3.5, 12);
                const pipeMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.3 });
                const pipe = new THREE.Mesh(pipeGeo, pipeMat);
                pipe.rotation.z = Math.PI / 2;
                pipe.position.set(-4, bH / 2 + 0.4, -2 + offsetZ);
                pipe.castShadow = true;
                pipe.name = `主楼屋顶通风管线_${pIdx + 1}`;
                buildingGroup.add(pipe);
            });

            // 侧门雨棚
            const canopyGeo = new THREE.BoxGeometry(2.0, 0.3, 6.0);
            const canopyMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
            const canopyMesh = new THREE.Mesh(canopyGeo, canopyMat);
            canopyMesh.position.set(-bW / 2 - 1.0, -bH / 2 + 2.5, 0);
            canopyMesh.castShadow = true;
            canopyMesh.name = "主楼侧门入口雨棚";
            buildingGroup.add(canopyMesh);

            // 裙楼防潮基座
            const baseW = bW + 0.6;
            const baseL = bL + 0.6;
            const baseH = 2.0;
            const baseGeo = new THREE.BoxGeometry(baseW, baseH, baseL);
            const baseMat = new THREE.MeshStandardMaterial({ color: 0x52525b, roughness: 0.9 });
            const baseMesh = new THREE.Mesh(baseGeo, baseMat);
            baseMesh.position.set(0, -bH / 2 + baseH / 2, 0);
            baseMesh.name = "主楼底部防潮基座";
            buildingGroup.add(baseMesh);
            // 正反面带状窗户阵列 (增加层数适配加高后的楼体)
            const winMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });
            for (let wy = -11; wy <= 11; wy += 3.5) {
                const winFrontGeo = new THREE.BoxGeometry(bW - 4, 1.2, 0.2);
                const winFront = new THREE.Mesh(winFrontGeo, winMat);
                winFront.position.set(0, wy, bL / 2 + 0.1);
                winFront.name = `主楼正面带状窗_层${wy}`;
                buildingGroup.add(winFront);
                
                const winBackGeo = new THREE.BoxGeometry(bW - 4, 1.2, 0.2);
                const winBack = new THREE.Mesh(winBackGeo, winMat);
                winBack.position.set(0, wy, -bL / 2 - 0.1);
                winBack.name = `主楼背面带状窗_层${wy}`;
                buildingGroup.add(winBack);
            }

            // 遮阳百叶 (扩展覆盖范围)
            const louverMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
            for (let ly = -10.5; ly <= 10.5; ly += 1.5) {
                const louverGeo = new THREE.BoxGeometry(0.15, 0.1, 28);
                const louver = new THREE.Mesh(louverGeo, louverMat);
                louver.position.set(-bW / 2 - 0.3, ly, 0);
                louver.name = `主楼侧面幕墙遮阳百叶_${ly}`;
                buildingGroup.add(louver);
            }

            // 右侧装饰柱
            const decoLineMat = new THREE.MeshStandardMaterial({ color: 0xa1a1aa, roughness: 0.7 });
            for (let dz = -12; dz <= 12; dz += 6) {
                const decoGeo = new THREE.BoxGeometry(0.2, bH - 2, 0.8);
                const decoMesh = new THREE.Mesh(decoGeo, decoLineMat);
                decoMesh.position.set(bW / 2 + 0.1, 0, dz);
                decoMesh.name = `主楼右侧结构装饰竖柱_${dz}`;
                buildingGroup.add(decoMesh);
            }

            group.add(buildingGroup);

            // 6. 添加左侧树木绿化带 (调整为3棵大树并匹配新的绿化带位置)
            const foliageGroup = new THREE.Group();
            foliageGroup.name = "外围绿化树木组";
            
            // 依据新绿化带的中心点 Z=-16.27 与缩放后的实际长度均匀分布3棵树
            const treePositions = [-31.27, -16.27, -1.27]; 
            
            treePositions.forEach((z, idx) => {
                const treeGroup = new THREE.Group();
                treeGroup.name = `参天大树组_${idx + 1}`;
                
                const trunkGeo = new THREE.CylinderGeometry(0.8, 1.2, 6, 8);
                const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 });
                const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                trunk.position.set(0, 3, 0);
                trunk.castShadow = true;
                trunk.receiveShadow = true;
                trunk.name = `参天大树树干_${idx + 1}`;
                
                const canopyGeo = new THREE.DodecahedronGeometry(5.5, 1);
                const canopyMat = new THREE.MeshStandardMaterial({ color: 0x22543d, roughness: 0.8 });
                const canopy = new THREE.Mesh(canopyGeo, canopyMat);
                canopy.position.set(0, 7.5, 0);
                canopy.castShadow = true;
                canopy.receiveShadow = true;
                canopy.name = `参天大树树冠_${idx + 1}`;
                
                treeGroup.add(trunk);
                treeGroup.add(canopy);
                
                treeGroup.position.set(-37.72, 0.08, z);
                foliageGroup.add(treeGroup);
            });

            group.add(foliageGroup);

            // 7. 【最终修复机制】：彻底解决视角缩放/旋转时模型消失与闪烁问题

            // 7.1 关闭所有网格对象的视锥体裁切，防止边缘视域被误判剔除
            group.traverse((child) => {
                if (child.isMesh || child.isLine) {
                    child.frustumCulled = false;
                }
            });

            // 7.2 将 onBeforeRender 正确挂载到实际渲染的 groundMesh 上（而非无法触发的 Group 节点）
            // 设定合理的 camera.near (0.5) 和 camera.far (10000)，保证高精度 Depth Buffer 防 Z-Fighting
            groundMesh.onBeforeRender = function(renderer, scene, camera) {
                if (camera) {
                    let needsUpdate = false;
                    if (camera.near !== 0.5) {
                        camera.near = 0.5;
                        needsUpdate = true;
                    }
                    if (camera.far < 10000) {
                        camera.far = 10000;
                        needsUpdate = true;
                    }
                    if (needsUpdate && typeof camera.updateProjectionMatrix === 'function') {
                        camera.updateProjectionMatrix();
                    }
                }
            };
        }