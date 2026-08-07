// 模型名称：操场模型
function buildStadiumModel(THREE, group) {
    // ============ 灯光 ============
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    ambientLight.name = "环境光";
    group.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    sunLight.position.set(60, 90, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 240;
    const d = 90;
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

    const fieldGroup = new THREE.Group(); fieldGroup.name = "⚽ 足球场内部区域";
    const trackGroup = new THREE.Group(); trackGroup.name = "🏃 标准田径跑道 (400m)";
    const buildingGroup = new THREE.Group(); buildingGroup.name = "🏛️ 主席台及看台建筑";
    const environmentGroup = new THREE.Group(); environmentGroup.name = "🌳 外围环境";

    const sceneGroups = [fieldGroup, trackGroup, buildingGroup, environmentGroup];
    sceneGroups.forEach(g => group.add(g));

    createGround();
    createFootballField();
    createAthleticTrack();
    createGrandstand();
    createIronFence();
    createVegetation();
    createMetalBleachers();
    createSportsEquipment();

    function createGround() {
        const geo = new THREE.PlaneGeometry(160, 220);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x475569,
            roughness: 1,
            metalness: 0
        });
        const ground = new THREE.Mesh(geo, mat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.1;
        ground.receiveShadow = true;
        ground.name = "外围沥青地面";
        environmentGroup.add(ground);

        const shape = new THREE.Shape();
        shape.moveTo(36.5, 42.195);
        shape.absarc(0, 42.195, 36.5, 0, Math.PI, false);
        shape.lineTo(-36.5, -42.195);
        shape.absarc(0, -42.195, 36.5, Math.PI, Math.PI * 2, false);
        shape.lineTo(36.5, 42.195);

        const turfGeo = new THREE.ShapeGeometry(shape);
        const turfMat = new THREE.MeshStandardMaterial({ color: 0x2d6a4f, roughness: 0.9 });
        const dZoneTurf = new THREE.Mesh(turfGeo, turfMat);
        dZoneTurf.rotation.x = -Math.PI / 2;
        dZoneTurf.position.y = 0;
        dZoneTurf.receiveShadow = true;
        dZoneTurf.name = "D区人工草皮/辅助区";
        fieldGroup.add(dZoneTurf);
    }

    function createFootballField() {
        const fieldWidth = 68;
        const fieldLength = 105;

        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = Math.round(1024 * (fieldLength / fieldWidth));
        const ctx = canvas.getContext('2d');

        const scale = canvas.width / fieldWidth;

        const numStripes = 20;
        const stripeHeight = canvas.height / numStripes;
        for (let i = 0; i < numStripes; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#3e7337' : '#47823f';
            ctx.fillRect(0, i * stripeHeight, canvas.width, stripeHeight);
        }

        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = Math.max(3, scale * 0.12);

        const px = (mX) => (fieldWidth / 2 + mX) * scale;
        const py = (mY) => (fieldLength / 2 + mY) * scale;
        const m2px = (m) => m * scale;

        ctx.beginPath();
        ctx.strokeRect(px(-34), py(-52.5), m2px(68), m2px(105));

        ctx.beginPath();
        ctx.moveTo(px(-34), py(0));
        ctx.lineTo(px(34), py(0));
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px(0), py(0), m2px(9.15), 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(px(0), py(0), m2px(0.3), 0, Math.PI * 2);
        ctx.fill();

        const drawBox = (yGoalLine, sign) => {
            ctx.beginPath();
            ctx.strokeRect(px(-20.16), py(yGoalLine - (sign < 0 ? 0 : 16.5)), m2px(40.32), m2px(16.5));

            ctx.beginPath();
            ctx.strokeRect(px(-9.16), py(yGoalLine - (sign < 0 ? 0 : 5.5)), m2px(18.32), m2px(5.5));

            const spotY = yGoalLine - sign * 11;
            ctx.beginPath();
            ctx.arc(px(0), py(spotY), m2px(0.25), 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            const startAngle = sign > 0 ? Math.PI + 0.65 : 0.65;
            const endAngle = sign > 0 ? 2 * Math.PI - 0.65 : Math.PI - 0.65;
            ctx.arc(px(0), py(spotY), m2px(9.15), startAngle, endAngle);
            ctx.stroke();
        };

        drawBox(52.5, 1);
        drawBox(-52.5, -1);

        const drawCorner = (cx, cy, startA, endA) => {
            ctx.beginPath();
            ctx.arc(px(cx), py(cy), m2px(1), startA, endA);
            ctx.stroke();
        };
        drawCorner(-34, -52.5, 0, Math.PI / 2);
        drawCorner(34, -52.5, Math.PI / 2, Math.PI);
        drawCorner(34, 52.5, Math.PI, Math.PI * 1.5);
        drawCorner(-34, 52.5, Math.PI * 1.5, Math.PI * 2);

        const texture = new THREE.CanvasTexture(canvas);
        texture.anisotropy = 8;

        const geo = new THREE.PlaneGeometry(fieldWidth, fieldLength);
        const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
        const field = new THREE.Mesh(geo, mat);
        field.rotation.x = -Math.PI / 2;
        field.position.y = 0.05;
        field.receiveShadow = true;
        field.name = "中心足球场坪";
        fieldGroup.add(field);

        createGoalPosts(0, 0.05, 52.5, Math.PI, "南侧球门");
        createGoalPosts(0, 0.05, -52.5, 0, "北侧球门");
    }

    function createGoalPosts(x, y, z, rotation, name) {
        const goalGroup = new THREE.Group();
        goalGroup.name = name;
        goalGroup.position.set(x, y, z);
        goalGroup.rotation.y = rotation;

        const frameMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.6, roughness: 0.2 });
        const pipeRadius = 0.06;

        const postGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, 2.44, 16);
        const barGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, 7.32 + pipeRadius*2, 16);

        const leftPost = new THREE.Mesh(postGeo, frameMat);
        leftPost.position.set(-3.66, 1.22, 0);
        leftPost.castShadow = true;

        const rightPost = new THREE.Mesh(postGeo, frameMat);
        rightPost.position.set(3.66, 1.22, 0);
        rightPost.castShadow = true;

        const crossbar = new THREE.Mesh(barGeo, frameMat);
        crossbar.rotation.z = Math.PI / 2;
        crossbar.position.set(0, 2.44, 0);
        crossbar.castShadow = true;

        goalGroup.add(leftPost, rightPost, crossbar);

        const depth = 1.8;
        const rearBottomGeo = new THREE.CylinderGeometry(pipeRadius * 0.8, pipeRadius * 0.8, 7.32, 12);
        const rearBottomBar = new THREE.Mesh(rearBottomGeo, frameMat);
        rearBottomBar.rotation.z = Math.PI / 2;
        rearBottomBar.position.set(0, 0.05, depth);
        goalGroup.add(rearBottomBar);

        const sidePipeGeo = new THREE.CylinderGeometry(pipeRadius * 0.7, pipeRadius * 0.7, depth, 12);
        [-3.66, 3.66].forEach(posX => {
            const bPipe = new THREE.Mesh(sidePipeGeo, frameMat);
            bPipe.rotation.x = Math.PI / 2;
            bPipe.position.set(posX, 0.05, depth / 2);
            goalGroup.add(bPipe);

            const strutLen = Math.hypot(2.44, depth);
            const strutGeo = new THREE.CylinderGeometry(pipeRadius * 0.7, pipeRadius * 0.7, strutLen, 12);
            const strut = new THREE.Mesh(strutGeo, frameMat);
            strut.position.set(posX, 1.22, depth / 2);
            strut.rotation.x = -Math.atan2(depth, 2.44);
            goalGroup.add(strut);
        });

        const netCanvas = document.createElement('canvas');
        netCanvas.width = 64; netCanvas.height = 64;
        const nctx = netCanvas.getContext('2d');
        nctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        nctx.lineWidth = 2;
        nctx.strokeRect(0, 0, 64, 64);
        const netTexture = new THREE.CanvasTexture(netCanvas);
        netTexture.wrapS = THREE.RepeatWrapping;
        netTexture.wrapT = THREE.RepeatWrapping;
        netTexture.repeat.set(12, 6);

        const netMat = new THREE.MeshBasicMaterial({
            map: netTexture,
            transparent: true,
            opacity: 0.4,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const backNetGeo = new THREE.PlaneGeometry(7.32, Math.hypot(2.44, depth));
        const backNet = new THREE.Mesh(backNetGeo, netMat);
        backNet.position.set(0, 1.22, depth / 2);
        backNet.rotation.x = Math.atan2(2.44, depth);
        goalGroup.add(backNet);

        const sideNetShape = new THREE.Shape();
        sideNetShape.moveTo(0, 0);
        sideNetShape.lineTo(depth, 0);
        sideNetShape.lineTo(0, 2.44);
        sideNetShape.closePath();
        const sideNetGeo = new THREE.ShapeGeometry(sideNetShape);

        const leftNet = new THREE.Mesh(sideNetGeo, netMat);
        leftNet.position.set(-3.66, 0, 0);
        leftNet.rotation.y = Math.PI / 2;

        const rightNet = new THREE.Mesh(sideNetGeo, netMat);
        rightNet.position.set(3.66, 0, 0);
        rightNet.rotation.y = Math.PI / 2;

        goalGroup.add(leftNet, rightNet);
        fieldGroup.add(goalGroup);
    }

    function createAthleticTrack() {
        const trackColor = 0xb83a2c;
        const trackMat = new THREE.MeshStandardMaterial({ color: trackColor, roughness: 0.8 });
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const innerRadius = 36.5;
        const laneWidth = 1.22;
        const numLanes = 8;
        const trackWidth = numLanes * laneWidth;
        const outerRadius = innerRadius + trackWidth;
        const straightLength = 84.39;

        const leftStraightGeo = new THREE.PlaneGeometry(trackWidth, straightLength);
        const leftStraight = new THREE.Mesh(leftStraightGeo, trackMat);
        leftStraight.rotation.x = -Math.PI / 2;
        leftStraight.position.set(-innerRadius - trackWidth/2, 0.02, 0);
        leftStraight.receiveShadow = true;
        leftStraight.name = "跑道西侧直道";
        trackGroup.add(leftStraight);

        const rightStraightGeo = new THREE.PlaneGeometry(trackWidth, straightLength);
        const rightStraight = new THREE.Mesh(rightStraightGeo, trackMat);
        rightStraight.rotation.x = -Math.PI / 2;
        rightStraight.position.set(innerRadius + trackWidth/2, 0.02, 0);
        rightStraight.receiveShadow = true;
        rightStraight.name = "跑道东侧直道";
        trackGroup.add(rightStraight);

        const topCurveGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64, 1, 0, Math.PI);
        const topCurve = new THREE.Mesh(topCurveGeo, trackMat);
        topCurve.rotation.x = -Math.PI / 2;
        topCurve.position.set(0, 0.02, -straightLength / 2);
        topCurve.receiveShadow = true;
        topCurve.name = "跑道北侧弯道";
        trackGroup.add(topCurve);

        const bottomCurveGeo = new THREE.RingGeometry(innerRadius, outerRadius, 64, 1, Math.PI, Math.PI);
        const bottomCurve = new THREE.Mesh(bottomCurveGeo, trackMat);
        bottomCurve.rotation.x = -Math.PI / 2;
        bottomCurve.position.set(0, 0.02, straightLength / 2);
        bottomCurve.receiveShadow = true;
        bottomCurve.name = "跑道南侧弯道";
        trackGroup.add(bottomCurve);

        const linesGroup = new THREE.Group();
        linesGroup.name = "跑道分离线 (细节)";

        for(let i=0; i<=numLanes; i++) {
            const currentRadius = innerRadius + i * laneWidth;

            const lLineGeo = new THREE.PlaneGeometry(0.05, straightLength);
            const lLine = new THREE.Mesh(lLineGeo, lineMat);
            lLine.rotation.x = -Math.PI / 2;
            lLine.position.set(-currentRadius, 0.03, 0);
            linesGroup.add(lLine);

            const rLineGeo = new THREE.PlaneGeometry(0.05, straightLength);
            const rLine = new THREE.Mesh(rLineGeo, lineMat);
            rLine.rotation.x = -Math.PI / 2;
            rLine.position.set(currentRadius, 0.03, 0);
            linesGroup.add(rLine);

            const tCurveGeo = new THREE.RingGeometry(currentRadius - 0.025, currentRadius + 0.025, 64, 1, 0, Math.PI);
            const tCurve = new THREE.Mesh(tCurveGeo, lineMat);
            tCurve.rotation.x = -Math.PI / 2;
            tCurve.position.set(0, 0.03, -straightLength / 2);
            linesGroup.add(tCurve);

            const bCurveGeo = new THREE.RingGeometry(currentRadius - 0.025, currentRadius + 0.025, 64, 1, Math.PI, Math.PI);
            const bCurve = new THREE.Mesh(bCurveGeo, lineMat);
            bCurve.rotation.x = -Math.PI / 2;
            bCurve.position.set(0, 0.03, straightLength / 2);
            linesGroup.add(bCurve);
        }
        trackGroup.add(linesGroup);
    }

    function createGrandstand() {
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 });
        const baseGeo = new THREE.BoxGeometry(12, 2.5, 45);
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.set(-54, 1.25, 0);
        base.castShadow = true;
        base.receiveShadow = true;
        base.name = "看台建筑底层基座";
        buildingGroup.add(base);

        const stepMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
        const numSteps = 6;
        const stepWidth = 1.2;
        const stepHeight = 0.5;

        const bleachersGroup = new THREE.Group();
        bleachersGroup.name = "观众席看台阶梯";

        for(let i=0; i<numSteps; i++) {
            const stepGeo = new THREE.BoxGeometry(stepWidth, stepHeight, 43);
            const step = new THREE.Mesh(stepGeo, stepMat);
            step.position.set(-48.5 - (i * stepWidth), 2.5 + (i * stepHeight) + stepHeight/2, 0);
            step.castShadow = true;
            step.receiveShadow = true;
            bleachersGroup.add(step);
        }
        buildingGroup.add(bleachersGroup);

        const pillarMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.3 });
        const pillarGeo = new THREE.CylinderGeometry(0.25, 0.25, 8);
        const pillarZPositions = [-18, -6, 6, 18];

        const pillarsGroup = new THREE.Group();
        pillarsGroup.name = "顶棚支撑立柱";
        pillarZPositions.forEach(z => {
            const pillar = new THREE.Mesh(pillarGeo, pillarMat);
            pillar.position.set(-58, 4, z);
            pillar.castShadow = true;
            pillarsGroup.add(pillar);
        });
        buildingGroup.add(pillarsGroup);

        const roofMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
        const roofGeo = new THREE.BoxGeometry(16, 0.4, 47);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.rotation.z = -0.1;
        roof.position.set(-52, 8, 0);
        roof.castShadow = true;
        roof.name = "主席台钢结构顶棚";
        buildingGroup.add(roof);
    }

    function createIronFence() {
        const fenceGroup = new THREE.Group();
        fenceGroup.name = "🛡️ 场地外围铁栅栏";

        const fenceMat = new THREE.MeshStandardMaterial({
            color: 0x334155,
            metalness: 0.8,
            roughness: 0.3
        });
        const spearMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            metalness: 0.9,
            roughness: 0.2
        });

        const minX = -66, maxX = 54;
        const minZ = -100, maxZ = 100;
        const fenceHeight = 2.4;
        const postSpacing = 6.0;

        const postGeo = new THREE.CylinderGeometry(0.1, 0.1, fenceHeight, 10);
        const capGeo = new THREE.ConeGeometry(0.15, 0.3, 8);
        const picketGeo = new THREE.CylinderGeometry(0.02, 0.02, fenceHeight - 0.3, 6);

        const addFenceLine = (p1, p2) => {
            const dx = p2.x - p1.x;
            const dz = p2.z - p1.z;
            const len = Math.hypot(dx, dz);
            const angle = Math.atan2(dx, dz);
            const numPosts = Math.floor(len / postSpacing);

            for (let i = 0; i <= numPosts; i++) {
                const t = i / numPosts;
                const px = p1.x + dx * t;
                const pz = p1.z + dz * t;

                const post = new THREE.Mesh(postGeo, fenceMat);
                post.position.set(px, fenceHeight / 2, pz);
                post.castShadow = true;
                fenceGroup.add(post);

                const cap = new THREE.Mesh(capGeo, spearMat);
                cap.position.set(px, fenceHeight + 0.15, pz);
                fenceGroup.add(cap);

                if (i < numPosts) {
                    const picketsPerSeg = 10;
                    for (let j = 1; j < picketsPerSeg; j++) {
                        const subT = (i + j / picketsPerSeg) / numPosts;
                        const subX = p1.x + dx * subT;
                        const subZ = p1.z + dz * subT;

                        const picket = new THREE.Mesh(picketGeo, fenceMat);
                        picket.position.set(subX, fenceHeight / 2, subZ);
                        fenceGroup.add(picket);
                    }
                }
            }

            [0.4, fenceHeight - 0.2].forEach(h => {
                const railGeo = new THREE.CylinderGeometry(0.03, 0.03, len, 8);
                const rail = new THREE.Mesh(railGeo, fenceMat);
                rail.position.set((p1.x + p2.x) / 2, h, (p1.z + p2.z) / 2);
                rail.rotation.x = Math.PI / 2;
                rail.rotation.z = angle;
                fenceGroup.add(rail);
            });
        };

        addFenceLine({ x: minX, z: minZ }, { x: maxX, z: minZ });
        addFenceLine({ x: maxX, z: minZ }, { x: maxX, z: maxZ });
        addFenceLine({ x: maxX, z: maxZ }, { x: minX, z: maxZ });
        addFenceLine({ x: minX, z: maxZ }, { x: minX, z: minZ });

        environmentGroup.add(fenceGroup);
    }

    function createVegetation() {
        const vegGroup = new THREE.Group();
        vegGroup.name = "🌳 外围植被 (橡木树与杉树 - 高度已提升为1.5倍)";

        const oakTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.9 });
        const firTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.9 });

        const leafMats = [
            new THREE.MeshStandardMaterial({ color: 0x2e6f40, roughness: 0.8 }),
            new THREE.MeshStandardMaterial({ color: 0x1e5631, roughness: 0.8 }),
            new THREE.MeshStandardMaterial({ color: 0x3d8b4f, roughness: 0.7 })
        ];

        const firMats = [
            new THREE.MeshStandardMaterial({ color: 0x143826, roughness: 0.8 }),
            new THREE.MeshStandardMaterial({ color: 0x1b4d3e, roughness: 0.7 }),
            new THREE.MeshStandardMaterial({ color: 0x265c42, roughness: 0.7 })
        ];

        // 树木高度整体提升为原本的1.5倍（树干与各层级高度均乘以1.5）
        const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 4.5 * 1.5, 8);
        const foliageGeos = [
            new THREE.DodecahedronGeometry(2.2, 1),
            new THREE.IcosahedronGeometry(1.8, 1),
            new THREE.DodecahedronGeometry(2.5, 1)
        ];

        const createOakTree = (x, z, scale = 1) => {
            const tree = new THREE.Group();
            tree.position.set(x, 0, z);

            const trunk = new THREE.Mesh(trunkGeo, oakTrunkMat);
            trunk.position.y = (2.25 * 1.5) * scale;
            trunk.scale.set(scale * (0.8 + Math.random()*0.4), scale * 1.5, scale * (0.8 + Math.random()*0.4));
            trunk.castShadow = true;
            tree.add(trunk);

            for (let i = 0; i < 4; i++) {
                const mat = leafMats[Math.floor(Math.random() * leafMats.length)];
                const geo = foliageGeos[Math.floor(Math.random() * foliageGeos.length)];
                const leaf = new THREE.Mesh(geo, mat);

                const offsetX = ((Math.sin(i * 3 + x) * 1.2)) * scale;
                const offsetY = (3.6 + i * 0.9) * 1.5 * scale;
                const offsetZ = ((Math.cos(i * 3 + z) * 1.2)) * scale;

                leaf.position.set(offsetX, offsetY, offsetZ);
                leaf.scale.setScalar((0.7 + Math.random() * 0.6) * scale);
                leaf.castShadow = true;
                tree.add(leaf);
            }
            return tree;
        };

        const createFirTree = (x, z, scale = 1) => {
            const tree = new THREE.Group();
            tree.position.set(x, 0, z);

            const trunk = new THREE.Mesh(trunkGeo, firTrunkMat);
            trunk.position.y = (2 * 1.5) * scale;
            trunk.scale.set(0.6 * scale, (1.2 * 1.5) * scale, 0.6 * scale);
            trunk.castShadow = true;
            tree.add(trunk);

            const coneHeights = [3.5 * 1.5, 3.0 * 1.5, 2.4 * 1.5, 1.8 * 1.5];
            const coneRadii = [2.2, 1.8, 1.3, 0.8];
            const coneYPositions = [2.5 * 1.5, 4.0 * 1.5, 5.3 * 1.5, 6.4 * 1.5];

            for (let i = 0; i < coneHeights.length; i++) {
                const mat = firMats[i % firMats.length];
                const coneGeo = new THREE.ConeGeometry(coneRadii[i], coneHeights[i], 7);
                const cone = new THREE.Mesh(coneGeo, mat);
                cone.position.y = coneYPositions[i] * scale;
                cone.scale.setScalar(scale * (0.85 + Math.random() * 0.3));
                cone.castShadow = true;
                tree.add(cone);
            }
            return tree;
        };

        const shrubGeos = [
            new THREE.DodecahedronGeometry(0.8, 1),
            new THREE.IcosahedronGeometry(0.7, 1)
        ];
        const createShrub = (x, z, scale = 1) => {
            const mat = leafMats[Math.floor(Math.random() * leafMats.length)];
            const geo = shrubGeos[Math.floor(Math.random() * shrubGeos.length)];
            const shrub = new THREE.Mesh(geo, mat);
            shrub.position.set(x, 0.4 * scale, z);
            shrub.scale.set((1.0 + Math.random()*0.6) * scale, (0.6 + Math.random()*0.5) * scale, (1.0 + Math.random()*0.6) * scale);
            shrub.castShadow = true;
            return shrub;
        };

        for (let x = -72; x <= 62; x += 8) {
            const isFir = (Math.abs(x) % 16 === 0);
            vegGroup.add(isFir ? createFirTree(x, -108, 1.1 + (x % 5) * 0.1) : createOakTree(x, -108, 0.8 + (x % 4) * 0.2));
            vegGroup.add(createShrub(x + 3, -104, 0.7 + (x % 3) * 0.3));
        }
        for (let x = -72; x <= 62; x += 8) {
            const isFir = (Math.abs(x + 4) % 16 === 0);
            vegGroup.add(isFir ? createFirTree(x, 108, 1.2) : createOakTree(x, 108, 0.9 + (x % 3) * 0.15));
            vegGroup.add(createShrub(x - 3, 104, 0.8 + (x % 2) * 0.3));
        }
        for (let z = -96; z <= 96; z += 10) {
            const isFir = (Math.abs(z) % 20 === 0);
            vegGroup.add(isFir ? createFirTree(-74, z, 1.0) : createOakTree(-74, z, 0.9 + (z % 3) * 0.2));
            vegGroup.add(createShrub(-70, z + 4, 0.8));
        }
        for (let z = -96; z <= 96; z += 10) {
            const isFir = (Math.abs(z + 10) % 20 === 0);
            vegGroup.add(isFir ? createFirTree(62, z, 1.1) : createOakTree(62, z, 1.0 + (z % 4) * 0.1));
            vegGroup.add(createShrub(58, z - 4, 0.9));
        }

        environmentGroup.add(vegGroup);
    }

    function createMetalBleachers() {
        const bleachersGroup = new THREE.Group();
        bleachersGroup.name = "💺 跑道外侧铁架看台 (含新增4个)";

        const frameMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7, roughness: 0.3 });
        const seatMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });

        const createBleacherUnit = (x, z, rotationY) => {
            const unit = new THREE.Group();
            unit.position.set(x, 0, z);
            unit.rotation.y = rotationY;

            const rows = 4;
            const width = 12;
            const rowDepth = 0.8;
            const rowHeight = 0.45;

            for (let i = 0; i < rows; i++) {
                const stepGeo = new THREE.BoxGeometry(width, 0.1, rowDepth);
                const step = new THREE.Mesh(stepGeo, frameMat);
                step.position.set(0, (i + 1) * rowHeight - 0.05, -i * rowDepth);
                step.castShadow = true;
                step.receiveShadow = true;
                unit.add(step);

                const seatGeo = new THREE.BoxGeometry(width - 0.4, 0.08, rowDepth * 0.6);
                const seat = new THREE.Mesh(seatGeo, seatMat);
                seat.position.set(0, (i + 1) * rowHeight + 0.04, -i * rowDepth + 0.1);
                seat.castShadow = true;
                unit.add(seat);

                const legGeo = new THREE.CylinderGeometry(0.05, 0.05, (i + 1) * rowHeight);
                [-width / 2 + 0.5, 0, width / 2 - 0.5].forEach(legX => {
                    const leg = new THREE.Mesh(legGeo, frameMat);
                    leg.position.set(legX, ((i + 1) * rowHeight) / 2, -i * rowDepth);
                    leg.castShadow = true;
                    unit.add(leg);
                });
            }

            const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
            const backHeight = rows * rowHeight + 0.9;
            const backZ = -(rows - 1) * rowDepth - 0.3;

            const topRailGeo = new THREE.CylinderGeometry(0.04, 0.04, width);
            const topRail = new THREE.Mesh(topRailGeo, railMat);
            topRail.rotation.z = Math.PI / 2;
            topRail.position.set(0, backHeight, backZ);
            unit.add(topRail);

            return unit;
        };

        const eastUnit1 = createBleacherUnit(50, -25, -Math.PI / 2);
        eastUnit1.name = "东侧临时看台 (1号)";
        const eastUnit2 = createBleacherUnit(50, 25, -Math.PI / 2);
        eastUnit2.name = "东侧临时看台 (2号)";

        const northUnit1 = createBleacherUnit(-20, -92, 0);
        northUnit1.name = "北侧临时看台 (1号 - 靠栅栏)";
        const northUnit2 = createBleacherUnit(20, -92, 0);
        northUnit2.name = "北侧临时看台 (2号 - 靠栅栏)";

        const southUnit1 = createBleacherUnit(-20, 92, Math.PI);
        southUnit1.name = "南侧临时看台 (1号 - 靠栅栏)";
        const southUnit2 = createBleacherUnit(20, 92, Math.PI);
        southUnit2.name = "南侧临时看台 (2号 - 靠栅栏)";

        bleachersGroup.add(eastUnit1, eastUnit2, northUnit1, northUnit2, southUnit1, southUnit2);
        buildingGroup.add(bleachersGroup);
    }

    function createSportsEquipment() {
        const sandpitGroup = new THREE.Group();
        sandpitGroup.name = "🏖️ 跳远沙坑与助跑道";
        sandpitGroup.position.set(-52, 0, -48);

        const runwayGeo = new THREE.PlaneGeometry(1.8, 22);
        const runwayMat = new THREE.MeshStandardMaterial({ color: 0xb83a2c, roughness: 0.8 });
        const runway = new THREE.Mesh(runwayGeo, runwayMat);
        runway.rotation.x = -Math.PI / 2;
        runway.position.set(0, 0.02, 10);
        runway.receiveShadow = true;
        sandpitGroup.add(runway);

        const boardGeo = new THREE.PlaneGeometry(1.6, 0.3);
        const boardMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const board = new THREE.Mesh(boardGeo, boardMat);
        board.rotation.x = -Math.PI / 2;
        board.position.set(0, 0.03, 0.2);
        sandpitGroup.add(board);

        const borderGeo = new THREE.BoxGeometry(3.6, 0.2, 8.4);
        const borderMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7 });
        const border = new THREE.Mesh(borderGeo, borderMat);
        border.position.set(0, 0.1, -4.2);
        border.castShadow = true;
        border.receiveShadow = true;
        sandpitGroup.add(border);

        const sandGeo = new THREE.BoxGeometry(3.2, 0.18, 8.0);
        const sandMat = new THREE.MeshStandardMaterial({ color: 0xdfb15b, roughness: 0.9 });
        const sand = new THREE.Mesh(sandGeo, sandMat);
        sand.position.set(0, 0.11, -4.2);
        sand.receiveShadow = true;
        sandpitGroup.add(sand);

        const highJumpGroup = new THREE.Group();
        highJumpGroup.name = "🏃‍♂️ 跳高训练场地 (垫子与横杆)";
        highJumpGroup.position.set(-52, 0, 48);

        const hjRunwayGeo = new THREE.PlaneGeometry(10, 10);
        const hjRunwayMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.8 });
        const hjRunway = new THREE.Mesh(hjRunwayGeo, hjRunwayMat);
        hjRunway.rotation.x = -Math.PI / 2;
        hjRunway.position.set(0, 0.02, -2);
        hjRunway.receiveShadow = true;
        highJumpGroup.add(hjRunway);

        const matGeo = new THREE.BoxGeometry(4.8, 0.6, 2.8);
        const matMaterial = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.6 });
        const hjMat = new THREE.Mesh(matGeo, matMaterial);
        hjMat.position.set(0, 0.3, 2);
        hjMat.castShadow = true;
        hjMat.receiveShadow = true;
        highJumpGroup.add(hjMat);

        const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8, roughness: 0.2 });
        const baseGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.08);

        [-2.2, 2.2].forEach(posX => {
            const pole = new THREE.Mesh(poleGeo, poleMat);
            pole.position.set(posX, 1.1, 0.4);
            pole.castShadow = true;
            highJumpGroup.add(pole);

            const poleBase = new THREE.Mesh(baseGeo, poleMat);
            poleBase.position.set(posX, 0.04, 0.4);
            highJumpGroup.add(poleBase);
        });

        const barGeo = new THREE.CylinderGeometry(0.02, 0.02, 4.5);
        const barMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
        const bar = new THREE.Mesh(barGeo, barMat);
        bar.rotation.z = Math.PI / 2;
        bar.position.set(0, 1.8, 0.4);
        bar.castShadow = true;
        highJumpGroup.add(bar);

        buildingGroup.add(sandpitGroup, highJumpGroup);
    }
}
