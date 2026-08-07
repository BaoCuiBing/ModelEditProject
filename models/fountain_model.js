// 模型名称：喷泉模型
function buildFountainModel(THREE, group) {
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

    const updatables = [];

    const parkGroups = {
        plaza: null,
        lawn: null,
        trees: null,
        hedges: null,
        facilities: null
    };

    parkGroups.plaza = new THREE.Group();
    parkGroups.plaza.name = "广场铺装";
    group.add(parkGroups.plaza);
    parkGroups.lawn = new THREE.Group();
    parkGroups.lawn.name = "草坪绿化";
    group.add(parkGroups.lawn);
    parkGroups.trees = new THREE.Group();
    parkGroups.trees.name = "景观树木";
    group.add(parkGroups.trees);
    parkGroups.hedges = new THREE.Group();
    parkGroups.hedges.name = "灌木绿篱";
    group.add(parkGroups.hedges);
    parkGroups.facilities = new THREE.Group();
    parkGroups.facilities.name = "公共设施";
    group.add(parkGroups.facilities);

    function createTileTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');

        // 浅灰白色大理石基底
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(0, 0, 1024, 1024);

        // 地砖网格 (128x128 像素/砖块)
        const tileSize = 128;
        for (let x = 0; x < 1024; x += tileSize) {
            for (let y = 0; y < 1024; y += tileSize) {
                const shade = Math.floor(Math.random() * 10 - 5);
                ctx.fillStyle = `rgb(${242 + shade}, ${245 + shade}, ${248 + shade})`;
                ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

                // 石材表面微小颗粒纹路
                ctx.fillStyle = 'rgba(100, 116, 139, 0.05)';
                for (let k = 0; k < 12; k++) {
                    const nx = x + Math.random() * tileSize;
                    const ny = y + Math.random() * tileSize;
                    ctx.fillRect(nx, ny, Math.random() * 6 + 2, 2);
                }
            }
        }

        // 清析深色地砖勾缝线条 (Grout Lines)
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 8;
        for (let x = 0; x <= 1024; x += tileSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1024); ctx.stroke();
        }
        for (let y = 0; y <= 1024; y += tileSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1024, y); ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(12, 14); // 设置合适密度的地砖格子
        return texture;
    }

    // ----------------------------------------------------
    // 1. 粗糙大理石铺装主广场 (缩小为适当尺寸 90x100)
    // ----------------------------------------------------
    const tileTexture = createTileTexture();
    const plazaMat = new THREE.MeshStandardMaterial({
        map: tileTexture,
        roughness: 0.85,
        metalness: 0.05
    });

    const plazaGeoBase = new THREE.PlaneGeometry(90, 100);
    const mainPlaza = new THREE.Mesh(plazaGeoBase, plazaMat);
    mainPlaza.rotation.x = -Math.PI / 2;
    mainPlaza.position.set(0, 0.0, 5);
    mainPlaza.receiveShadow = true;
    mainPlaza.name = "大理石广场地面";
    parkGroups.plaza.add(mainPlaza);

    // ----------------------------------------------------
    // 2. 草坪 (严格参考图2布局)
    // ----------------------------------------------------
    const grassMat = new THREE.MeshStandardMaterial({ color: 0xa7f3d0, roughness: 0.95 }); // 浅薄荷绿
    const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x6ee7b7, roughness: 0.9 });  // 稍深绿篱

    // (A) 中央两个长方形草坪
    const centerLawnGeo = new THREE.BoxGeometry(10, 0.2, 16);

    const centerLawn1 = new THREE.Mesh(centerLawnGeo, grassMat);
    centerLawn1.position.set(0, 0.1, -12);
    centerLawn1.receiveShadow = true;
    centerLawn1.name = "中央北部草坪";
    parkGroups.lawn.add(centerLawn1);

    const centerLawn2 = new THREE.Mesh(centerLawnGeo, grassMat);
    centerLawn2.position.set(0, 0.1, 10);
    centerLawn2.receiveShadow = true;
    centerLawn2.name = "中央南部草坪";
    parkGroups.lawn.add(centerLawn2);

    // (B) 四个侧翼斜向矩形草坪
    const sideLawnCoords = [
        { name: "左上侧草坪", x: -25, z: -18, rot: 0.25, w: 14, l: 30 },
        { name: "右上侧草坪", x: 25, z: -18, rot: -0.25, w: 14, l: 30 },
        { name: "左下侧草坪", x: -28, z: 18, rot: -0.2, w: 14, l: 30 },
        { name: "右下侧草坪", x: 28, z: 18, rot: 0.2, w: 14, l: 30 }
    ];

    sideLawnCoords.forEach(item => {
        const sideGeo = new THREE.BoxGeometry(item.w, 0.2, item.l);
        const sideMesh = new THREE.Mesh(sideGeo, grassMat);
        sideMesh.position.set(item.x, 0.1, item.z);
        sideMesh.rotation.y = item.rot;
        sideMesh.receiveShadow = true;
        sideMesh.name = item.name;
        parkGroups.lawn.add(sideMesh);
    });

    // (C) 底部半圆形草坪
    const semiCircleGeo = new THREE.CylinderGeometry(14, 14, 0.2, 32, 1, false, -Math.PI/2, Math.PI);
    const semiCircleLawn = new THREE.Mesh(semiCircleGeo, grassMat);
    semiCircleLawn.position.set(0, 0.1, 38);
    semiCircleLawn.receiveShadow = true;
    semiCircleLawn.name = "底部半圆草坪";
    parkGroups.lawn.add(semiCircleLawn);

    // ----------------------------------------------------
    // 3. 灌木与绿篱 (Hedges)
    // ----------------------------------------------------
    function createHedgeBorder(parentLawn, width, length, namePrefix) {
        const hHeight = 0.6;
        const hThick = 0.8;

        const boxGeoH = new THREE.BoxGeometry(width + hThick, hHeight, hThick);
        const boxGeoV = new THREE.BoxGeometry(hThick, hHeight, length);

        const north = new THREE.Mesh(boxGeoH, hedgeMat); north.position.set(0, hHeight/2, length/2); north.name = `${namePrefix}-北侧绿篱`;
        const south = new THREE.Mesh(boxGeoH, hedgeMat); south.position.set(0, hHeight/2, -length/2); south.name = `${namePrefix}-南侧绿篱`;
        const east = new THREE.Mesh(boxGeoV, hedgeMat); east.position.set(width/2, hHeight/2, 0); east.name = `${namePrefix}-东侧绿篱`;
        const west = new THREE.Mesh(boxGeoV, hedgeMat); west.position.set(-width/2, hHeight/2, 0); west.name = `${namePrefix}-西侧绿篱`;

        [north, south, east, west].forEach(h => {
            h.castShadow = true;
            h.receiveShadow = true;
            parentLawn.add(h);
        });
    }

    createHedgeBorder(centerLawn1, 10, 16, "北部中心");
    createHedgeBorder(centerLawn2, 10, 16, "南部中心");

    // ----------------------------------------------------
    // 4. 树木生成 (包含指定草坪上的高大树木)
    // ----------------------------------------------------
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });

    // 高大树木生成函数 (双层结构)
    function createTallTree(x, z, name) {
        const tree = new THREE.Group(); tree.name = name;

        // 粗壮高大树干
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 3.5, 8), trunkMat);
        trunk.position.y = 1.75; trunk.castShadow = true; tree.add(trunk);

        // 挺拔高大树冠 (深绿茂盛)
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 });
        const crownLower = new THREE.Mesh(new THREE.ConeGeometry(2.2, 4.5, 8), leafMat);
        crownLower.position.y = 4.5; crownLower.castShadow = true; tree.add(crownLower);

        const crownUpper = new THREE.Mesh(new THREE.ConeGeometry(1.6, 3.8, 8), leafMat);
        crownUpper.position.y = 6.2; crownUpper.castShadow = true; tree.add(crownUpper);

        tree.position.set(x, 0, z);
        return tree;
    }

    // (A) 在 7 个指定草坪上分别添加 3 棵高大树木
    // 1. 中央北部草坪 (x:0, z:-12) - 保持纯净开阔草坪

    // 3. 左上侧草坪 (-25, -18)
    parkGroups.trees.add(createTallTree(-27, -22, "左上侧草坪-高大景观树 1"));
    parkGroups.trees.add(createTallTree(-23, -18, "左上侧草坪-高大景观树 2"));
    parkGroups.trees.add(createTallTree(-26, -12, "左上侧草坪-高大景观树 3"));

    // 4. 右上侧草坪 (25, -18)
    parkGroups.trees.add(createTallTree(27, -22, "右上侧草坪-高大景观树 1"));
    parkGroups.trees.add(createTallTree(23, -18, "右上侧草坪-高大景观树 2"));
    parkGroups.trees.add(createTallTree(26, -12, "右上侧草坪-高大景观树 3"));

    // 5. 左下侧草坪 (-28, 18)
    parkGroups.trees.add(createTallTree(-30, 12, "左下侧草坪-高大景观树 1"));
    parkGroups.trees.add(createTallTree(-26, 18, "左下侧草坪-高大景观树 2"));
    parkGroups.trees.add(createTallTree(-29, 24, "左下侧草坪-高大景观树 3"));

    // 6. 右下侧草坪 (28, 18)
    parkGroups.trees.add(createTallTree(30, 12, "右下侧草坪-高大景观树 1"));
    parkGroups.trees.add(createTallTree(26, 18, "右下侧草坪-高大景观树 2"));
    parkGroups.trees.add(createTallTree(29, 24, "右下侧草坪-高大景观树 3"));

    // 7. 底部半圆草坪 (圆心 0, 38, 半径 14)
    parkGroups.trees.add(createTallTree(-5, 41, "底部半圆草坪-高大景观树 1"));
    parkGroups.trees.add(createTallTree(0, 44, "底部半圆草坪-高大景观树 2"));
    parkGroups.trees.add(createTallTree(5, 41, "底部半圆草坪-高大景观树 3"));

    // (B) 轴线锥形树列
    function createConeTree(x, z, name) {
        const tree = new THREE.Group(); tree.name = name;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1.2), trunkMat);
        trunk.position.y = 0.6; trunk.castShadow = true; tree.add(trunk);

        const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3, 8), new THREE.MeshStandardMaterial({color: 0x86efac, roughness: 0.9}));
        leaves.position.y = 2.7; leaves.castShadow = true; tree.add(leaves);

        tree.position.set(x, 0, z);
        return tree;
    }

    const axialZ = [-18, -13, -8, 6, 11, 16];
    axialZ.forEach((z, idx) => {
        parkGroups.trees.add(createConeTree(-8, z, `左侧列植圆锥树 ${idx+1}`));
        parkGroups.trees.add(createConeTree(8, z, `右侧列植圆锥树 ${idx+1}`));
    });

    // (C) 侧翼散落球形树
    function createSphereTree(x, z, colorHex, scale, name) {
        const tree = new THREE.Group(); tree.name = name;
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2*scale, 0.2*scale, 1.5*scale), trunkMat);
        trunk.position.y = 0.75*scale; trunk.castShadow = true; tree.add(trunk);

        const leaves = new THREE.Mesh(new THREE.SphereGeometry(1.5*scale, 16, 16), new THREE.MeshStandardMaterial({color: colorHex, roughness: 0.9}));
        leaves.position.y = 2.2*scale; leaves.castShadow = true; tree.add(leaves);

        tree.position.set(x, 0, z);
        return tree;
    }

    const treeColors = [0x6ee7b7, 0x34d399, 0xa7f3d0, 0xfef08a];
    sideLawnCoords.forEach((lawn, lIdx) => {
        for(let i = 0; i < 6; i++) {
            const tx = lawn.x + (Math.random() - 0.5) * lawn.w * 0.7;
            const tz = lawn.z + (Math.random() - 0.5) * lawn.l * 0.8;
            const color = treeColors[Math.floor(Math.random() * treeColors.length)];
            parkGroups.trees.add(createSphereTree(tx, tz, color, 0.8 + Math.random()*0.5, `侧翼景观树 ${lIdx}-${i+1}`));
        }
    });

    // ----------------------------------------------------
    // 5. 设施 (Facilities - 景观喷泉、雕塑与精细长椅)
    // ----------------------------------------------------

    function createParticleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(200, 230, 255, 0.7)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(canvas);
    }

    function createDetailedFountain(x, z) {
        const fountain = new THREE.Group();
        fountain.name = "后方大理石动态景观喷泉";

        const stoneMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.1 });
        const rimMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.4, metalness: 0.3 });
        const waterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.8, roughness: 0.1, metalness: 0.7 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });

        // 1. 底层水池外沿与池水 (修复Z-Fighting: 采用Torus中空圆环作为边缘)
        const outerRim = new THREE.Mesh(new THREE.TorusGeometry(7.0, 0.4, 16, 64), rimMat);
        outerRim.rotation.x = -Math.PI / 2;
        outerRim.position.y = 0.4;
        outerRim.castShadow = true; outerRim.receiveShadow = true; fountain.add(outerRim);

        // 压低石材底座厚度，拉大与水面的间距，防止缩小视野时发生 Z-fighting 闪烁
        const innerBed = new THREE.Mesh(new THREE.CylinderGeometry(7.0, 7.0, 0.2, 32), stoneMat);
        innerBed.position.y = 0.1; innerBed.receiveShadow = true; fountain.add(innerBed);

        const mainWater = new THREE.Mesh(new THREE.CylinderGeometry(6.9, 6.9, 0.1, 32), waterMat);
        mainWater.position.y = 0.55; fountain.add(mainWater);

        // 8个金属小喷头
        for(let i=0; i<8; i++){
            const angle = (i / 8) * Math.PI * 2;
            const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.4, 8), goldMat);
            spout.position.set(Math.cos(angle)*6.2, 0.7, Math.sin(angle)*6.2);
            spout.lookAt(0, 2.5, 0);
            fountain.add(spout);
        }

        // 2. 中层底座与次级基座碗 (同样采用Torus作为碗沿分离结构)
        const pedestalBase = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 2.0, 1.4, 16), stoneMat);
        pedestalBase.position.y = 1.1; pedestalBase.castShadow = true; fountain.add(pedestalBase);

        // 压低中层石碗内部实体高度
        const midBowlBody = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 1.2, 0.4, 32), stoneMat);
        midBowlBody.position.y = 1.9; midBowlBody.castShadow = true; fountain.add(midBowlBody);

        const midBowlRim = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.2, 16, 32), stoneMat);
        midBowlRim.rotation.x = -Math.PI / 2;
        midBowlRim.position.y = 2.3; midBowlRim.castShadow = true; fountain.add(midBowlRim);

        const midWater = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.1, 32), waterMat);
        midWater.position.y = 2.35; fountain.add(midWater);

        // 3. 顶层立柱与顶级雕花碗
        const upperPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 1.0, 16), stoneMat);
        upperPillar.position.y = 2.8; upperPillar.castShadow = true; fountain.add(upperPillar);

        // 压低顶层石碗内部实体高度
        const topBowlBody = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 0.6, 0.2, 24), stoneMat);
        topBowlBody.position.y = 3.4; topBowlBody.castShadow = true; fountain.add(topBowlBody);

        const topBowlRim = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.15, 16, 24), stoneMat);
        topBowlRim.rotation.x = -Math.PI / 2;
        topBowlRim.position.y = 3.7; topBowlRim.castShadow = true; fountain.add(topBowlRim);

        const topWater = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 0.1, 24), waterMat);
        topWater.position.y = 3.75; fountain.add(topWater);

        const topOrnam = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), goldMat);
        topOrnam.position.y = 4.2; topOrnam.castShadow = true; fountain.add(topOrnam);

        // 4. 动态水花粒子系统 (Particle System)
        const pCount = 5000;
        const pGeo = new THREE.BufferGeometry();
        const pPos = new Float32Array(pCount * 3);
        const pVel = [];
        const pType = [];

        function resetParticle(i, pos, vel, type) {
            let idx = i * 3;
            if (type === 0) { // 顶部主喷泉向上
                pos[idx] = (Math.random() - 0.5) * 0.2;
                pos[idx+1] = 4.4;
                pos[idx+2] = (Math.random() - 0.5) * 0.2;
                vel[i].set((Math.random() - 0.5) * 0.02, 0.08 + Math.random() * 0.05, (Math.random() - 0.5) * 0.02);
            } else if (type === 1) { // 8周侧边内聚喷泉
                const angle = Math.floor(Math.random() * 8) * (Math.PI / 4);
                const spread = (Math.random() - 0.5) * 0.2;
                const r = 6.2;
                pos[idx] = Math.cos(angle + spread) * r;
                pos[idx+1] = 0.8;
                pos[idx+2] = Math.sin(angle + spread) * r;
                vel[i].set(-pos[idx]*0.012, 0.08 + Math.random() * 0.03, -pos[idx+2]*0.012);
            } else if (type === 2) { // 中碗溢水瀑布层
                const angle = Math.random() * Math.PI * 2;
                const r = 3.65 + Math.random() * 0.1;
                pos[idx] = Math.cos(angle) * r;
                pos[idx+1] = 2.4;
                pos[idx+2] = Math.sin(angle) * r;
                vel[i].set(Math.cos(angle)*0.01, (Math.random()-0.5)*0.01, Math.sin(angle)*0.01);
            } else if (type === 3) { // 顶碗溢水瀑布层
                const angle = Math.random() * Math.PI * 2;
                const r = 2.05 + Math.random() * 0.1;
                pos[idx] = Math.cos(angle) * r;
                pos[idx+1] = 3.8;
                pos[idx+2] = Math.sin(angle) * r;
                vel[i].set(Math.cos(angle)*0.01, (Math.random()-0.5)*0.01, Math.sin(angle)*0.01);
            }
        }

        for(let i=0; i<pCount; i++) {
            pVel.push(new THREE.Vector3());
            let mode = i % 10;
            if(mode < 2) pType.push(0);
            else if(mode < 5) pType.push(1);
            else if(mode < 8) pType.push(2);
            else pType.push(3);

            resetParticle(i, pPos, pVel, pType[i]);
            pPos[i*3+1] -= Math.random() * 1.5;
        }
        pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

        const pMat = new THREE.PointsMaterial({
            map: createParticleTexture(),
            size: 0.35,
            color: 0xffffff,
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(pGeo, pMat);
        fountain.add(particles);

        // 添加到全局更新循环中
        updatables.push(() => {
            const positions = particles.geometry.attributes.position.array;
            for(let i=0; i<pCount; i++) {
                let idx = i * 3;
                pVel[i].y -= 0.0035; // 重力
                positions[idx] += pVel[i].x;
                positions[idx+1] += pVel[i].y;
                positions[idx+2] += pVel[i].z;

                // 同步修正粒子落水重置高度判定
                let type = pType[i];
                if (type === 0 && positions[idx+1] < 3.8) resetParticle(i, positions, pVel, type);
                if (type === 1 && positions[idx+1] < 2.4) resetParticle(i, positions, pVel, type);
                if (type === 2 && positions[idx+1] < 0.7) resetParticle(i, positions, pVel, type);
                if (type === 3 && positions[idx+1] < 2.4) resetParticle(i, positions, pVel, type);
            }
            particles.geometry.attributes.position.needsUpdate = true;
        });

        // 5. 池底水下柔光氛围灯
        const light = new THREE.PointLight(0x0ea5e9, 1.5, 20);
        light.position.set(0, 1.2, 0);
        fountain.add(light);

        // 抬高0.1防止与大理石主广场地面产生Z-Fighting闪烁
        fountain.position.set(x, 0.1, z);
        return fountain;
    }

    // 添加后方精细喷泉 (Z轴 -35 区域)
    parkGroups.facilities.add(createDetailedFountain(0, -35));

    const monument = new THREE.Group(); monument.name = "金球纪念雕塑";
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.5, 2.5), new THREE.MeshStandardMaterial({color: 0xe2e8f0}));
    base.position.y = 0.75; base.castShadow = true; monument.add(base);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), new THREE.MeshStandardMaterial({color: 0xfcd34d, metalness: 0.6, roughness: 0.3}));
    sphere.position.y = 2.5; sphere.castShadow = true; monument.add(sphere);
    monument.position.set(0, 0, 24);
    parkGroups.facilities.add(monument);

    function createBench(x, z, rot) {
        const bench = new THREE.Group(); bench.name = "精细木质休闲长椅";

        const woodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.5, metalness: 0.1 });
        const metalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 });

        // 1. 左右铸铁支架与扶手
        [-0.85, 0.85].forEach(xOff => {
            const legSupport = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 0.6), metalMat);
            legSupport.position.set(xOff, 0.25, 0); legSupport.castShadow = true; bench.add(legSupport);

            const armRest = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.25, 0.55), metalMat);
            armRest.position.set(xOff, 0.55, -0.02); armRest.castShadow = true; bench.add(armRest);

            const backSupport = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.55, 0.08), metalMat);
            backSupport.position.set(xOff, 0.7, -0.26); backSupport.rotation.x = -0.15; backSupport.castShadow = true; bench.add(backSupport);
        });

        // 2. 座椅木条 (4条)
        for (let i = 0; i < 4; i++) {
            const slat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.035, 0.11), woodMat);
            slat.position.set(0, 0.48, -0.18 + i * 0.13); slat.castShadow = true; bench.add(slat);
        }

        // 3. 靠背木条 (3条)
        for (let j = 0; j < 3; j++) {
            const bSlat = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.11, 0.035), woodMat);
            bSlat.position.set(0, 0.62 + j * 0.13, -0.27 - j * 0.02); bSlat.rotation.x = -0.15; bSlat.castShadow = true; bench.add(bSlat);
        }

        bench.position.set(x, 0, z); bench.rotation.y = rot;
        return bench;
    }

    // 沿主轴线及喷泉放置长椅
    [-4, 2].forEach(z => {
        parkGroups.facilities.add(createBench(-7.5, z, Math.PI/2));
        parkGroups.facilities.add(createBench(7.5, z, -Math.PI/2));
    });
    parkGroups.facilities.add(createBench(-8.5, -35, Math.PI/2));
    parkGroups.facilities.add(createBench(8.5, -35, -Math.PI/2));

    // 暴露动态更新函数给编辑器动画循环（喷泉粒子运动）
    group.userData.updatables = updatables;
}
