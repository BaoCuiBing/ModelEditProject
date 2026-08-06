function buildLibraryModel(THREE, group) {
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

            const libraryGroup = new THREE.Group();
            libraryGroup.name = "🏛️ 图书馆主建筑群 (72m×36m×22.8m)";
            group.add(libraryGroup);

            // Dimensional Parameters based on Figure 1
            const LENGTH = 72.0;  // X axis (South/North elevation 72,000mm)
            const WIDTH = 36.0;   // Z axis (East/West elevation 36,000mm)
            const HEIGHT = 22.8;  // Y axis (5F Total Height 22.80m)
            const GLASS_INSET = 1.2; // Depth inset for glass curtain walls

            // Materials
            const stoneMat = new THREE.MeshStandardMaterial({
                color: 0xded8cd, // Warm limestone tint
                roughness: 0.6,
                metalness: 0.05,
                name: "真石漆/石材面"
            });
            const darkStoneMat = new THREE.MeshStandardMaterial({
                color: 0x4a4f56, // Dark slate trim
                roughness: 0.5,
                metalness: 0.1
            });
            const glassMat = new THREE.MeshStandardMaterial({
                color: 0x224466, // Dark blue-grey reflective glass
                roughness: 0.1,
                metalness: 0.8,
                opacity: 0.85,
                transparent: true
            });
            const mullionMat = new THREE.MeshStandardMaterial({
                color: 0x282c34, // Dark metallic window frames
                roughness: 0.3,
                metalness: 0.7
            });
            const plazaMat = new THREE.MeshStandardMaterial({
                color: 0xc8ceaa, // Pavement plaza color
                roughness: 0.8
            });
            const grassMat = new THREE.MeshStandardMaterial({
                color: 0x5a8844, // Green lawn
                roughness: 0.9
            });
            const signPlateMat = new THREE.MeshStandardMaterial({
                color: 0x1e293b, // Dark navy signage board
                roughness: 0.3,
                metalness: 0.7
            });
            const metalTrimMat = new THREE.MeshStandardMaterial({
                color: 0xd4af37, // Brass / metallic accent
                roughness: 0.2,
                metalness: 0.9
            });
            const lightEmissiveMat = new THREE.MeshBasicMaterial({
                color: 0xfff5ea // Warm LED glow
            });

            // 1. 地基与周边广场 (Foundation & Plaza Environment)
            const envGroup = new THREE.Group();
            envGroup.name = "1. 地面与广场景观";
            libraryGroup.add(envGroup);

            const plazaMesh = new THREE.Mesh(new THREE.BoxGeometry(140, 0.4, 90), plazaMat);
            plazaMesh.position.set(0, -0.2, 5);
            plazaMesh.receiveShadow = true;
            plazaMesh.name = "室外硬质铺装广场";
            envGroup.add(plazaMesh);

            const westGrass = new THREE.Mesh(new THREE.BoxGeometry(30, 0.1, 50), grassMat);
            westGrass.position.set(-52, 0.05, 10);
            westGrass.receiveShadow = true;
            westGrass.name = "西侧绿化草坪";
            envGroup.add(westGrass);

            const eastGrass = new THREE.Mesh(new THREE.BoxGeometry(30, 0.1, 50), grassMat);
            eastGrass.position.set(52, 0.05, 10);
            eastGrass.receiveShadow = true;
            eastGrass.name = "东侧绿化草坪";
            envGroup.add(eastGrass);

            // 2. 建筑主体外框与结构 (Main Building Frame & Envelope)
            const frameGroup = new THREE.Group();
            frameGroup.name = "2. 建筑主体外框与结构";
            libraryGroup.add(frameGroup);

            // Main Base Plinth (基座 +0.000) - Split into main body and side wings to avoid entrance step overlap
            const plinthGroup = new THREE.Group();
            plinthGroup.name = "建筑基座 (Plinth Base)";
            frameGroup.add(plinthGroup);

            // Main base body (behind entrance line Z = 16.8)
            const basePlinthMain = new THREE.Mesh(new THREE.BoxGeometry(LENGTH + 0.8, 0.6, WIDTH - 2.4), darkStoneMat);
            basePlinthMain.position.set(0, 0.3, -1.2);
            basePlinthMain.castShadow = true;
            basePlinthMain.receiveShadow = true;
            basePlinthMain.name = "主体基座箱体";
            plinthGroup.add(basePlinthMain);

            // Left base extension (West side outside entrance)
            const basePlinthLeft = new THREE.Mesh(new THREE.BoxGeometry((LENGTH - 25.0) / 2, 0.6, 2.4), darkStoneMat);
            basePlinthLeft.position.set(-LENGTH / 2 + (LENGTH - 25.0) / 4, 0.3, WIDTH / 2 - 1.2);
            basePlinthLeft.castShadow = true;
            basePlinthLeft.receiveShadow = true;
            basePlinthLeft.name = "西侧前基座";
            plinthGroup.add(basePlinthLeft);

            // Right base extension (East side outside entrance)
            const basePlinthRight = new THREE.Mesh(new THREE.BoxGeometry((LENGTH - 25.0) / 2, 0.6, 2.4), darkStoneMat);
            basePlinthRight.position.set(LENGTH / 2 - (LENGTH - 25.0) / 4, 0.3, WIDTH / 2 - 1.2);
            basePlinthRight.castShadow = true;
            basePlinthRight.receiveShadow = true;
            basePlinthRight.name = "东侧前基座";
            plinthGroup.add(basePlinthRight);

            // Left Outer Stone Wall Mass (Width 4.5m)
            const leftStoneWall = new THREE.Mesh(new THREE.BoxGeometry(4.5, HEIGHT - 0.6, WIDTH), stoneMat);
            leftStoneWall.position.set(-LENGTH / 2 + 2.25, HEIGHT / 2 + 0.3, 0);
            leftStoneWall.castShadow = true;
            leftStoneWall.receiveShadow = true;
            leftStoneWall.name = "西端实体石材墙体";
            frameGroup.add(leftStoneWall);

            // Right Outer Stone Wall Mass (Width 4.5m)
            const rightStoneWall = new THREE.Mesh(new THREE.BoxGeometry(4.5, HEIGHT - 0.6, WIDTH), stoneMat);
            rightStoneWall.position.set(LENGTH / 2 - 2.25, HEIGHT / 2 + 0.3, 0);
            rightStoneWall.castShadow = true;
            rightStoneWall.receiveShadow = true;
            rightStoneWall.name = "东端实体石材墙体";
            frameGroup.add(rightStoneWall);

            // Top Parapet Roof Beam (女儿墙顶端 +22.800)
            const topRoofBeam = new THREE.Mesh(new THREE.BoxGeometry(LENGTH, 2.0, WIDTH), stoneMat);
            topRoofBeam.position.set(0, HEIGHT - 1.0, 0);
            topRoofBeam.castShadow = true;
            topRoofBeam.receiveShadow = true;
            topRoofBeam.name = "顶层檐口女儿墙 (+22.8m)";
            frameGroup.add(topRoofBeam);

            // Inner Central Roof Deck
            const roofDeck = new THREE.Mesh(new THREE.BoxGeometry(LENGTH - 8, 0.4, WIDTH - 8), darkStoneMat);
            roofDeck.position.set(0, HEIGHT - 2.0, 0);
            roofDeck.name = "屋顶平台";
            frameGroup.add(roofDeck);

            // 3. 南立面幕墙与精细饰柱 (South Elevation - Main Facade)
            const southGroup = new THREE.Group();
            southGroup.name = "3. 南立面 (主入口 façade)";
            libraryGroup.add(southGroup);

            // South Glass Curtain Wall - Split around entrance opening
            const southGlassLeft = new THREE.Mesh(new THREE.BoxGeometry(25.3, 19.8, 0.3), glassMat);
            southGlassLeft.position.set(-18.85, 10.5, WIDTH / 2 - GLASS_INSET);
            southGlassLeft.name = "南立面西侧玻璃幕墙";
            southGroup.add(southGlassLeft);

            const southGlassRight = new THREE.Mesh(new THREE.BoxGeometry(25.3, 19.8, 0.3), glassMat);
            southGlassRight.position.set(18.85, 10.5, WIDTH / 2 - GLASS_INSET);
            southGlassRight.name = "南立面东侧玻璃幕墙";
            southGroup.add(southGlassRight);

            const southGlassTop = new THREE.Mesh(new THREE.BoxGeometry(12.4, 15.3, 0.3), glassMat);
            southGlassTop.position.set(0, 12.75, WIDTH / 2 - GLASS_INSET);
            southGlassTop.name = "南立面主入口上方幕墙玻璃";
            southGroup.add(southGlassTop);

            // 10 Glass bays separated by 11 Vertical Stone Louver Fins
            const numSouthPillars = 11;
            const southPillarStartX = -31.5;
            const southPillarSpacing = 63.0 / (numSouthPillars - 1);

            for (let i = 0; i < numSouthPillars; i++) {
                const px = southPillarStartX + i * southPillarSpacing;
                const isCenter = Math.abs(px) < 6;
                const pillarHeight = isCenter ? 14.5 : 19.8;
                const pillarPosY = isCenter ? 13.15 : 10.5;

                const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, pillarHeight, 1.2), stoneMat);
                pillar.position.set(px, pillarPosY, WIDTH / 2 - GLASS_INSET / 2);
                pillar.castShadow = true;
                pillar.receiveShadow = true;
                pillar.name = `南立面装饰立柱 Fin-${i + 1}`;
                southGroup.add(pillar);
            }

            // Floor Horizontal Spandrel Lines
            const floorHeights = [4.8, 9.3, 13.8, 18.3];
            floorHeights.forEach((fh, idx) => {
                if (fh === 4.8) {
                    const spandrelLeft = new THREE.Mesh(new THREE.BoxGeometry(25.1, 0.4, 0.3), mullionMat);
                    spandrelLeft.position.set(-18.95, fh, WIDTH / 2 - GLASS_INSET + 0.1);
                    spandrelLeft.name = `南立面 F${idx + 2} 西侧楼层分界线条 (${fh}m)`;
                    southGroup.add(spandrelLeft);

                    const spandrelRight = new THREE.Mesh(new THREE.BoxGeometry(25.1, 0.4, 0.3), mullionMat);
                    spandrelRight.position.set(18.95, fh, WIDTH / 2 - GLASS_INSET + 0.1);
                    spandrelRight.name = `南立面 F${idx + 2} 东侧楼层分界线条 (${fh}m)`;
                    southGroup.add(spandrelRight);
                } else {
                    const spandrel = new THREE.Mesh(new THREE.BoxGeometry(63, 0.5, 0.4), mullionMat);
                    spandrel.position.set(0, fh, WIDTH / 2 - GLASS_INSET + 0.1);
                    spandrel.name = `南立面 F${idx + 2} 楼层分界线条 (${fh}m)`;
                    southGroup.add(spandrel);
                }
            });

            // 4. Grand Main Entrance Canopy & Portico (主入口雨棚与门厅精细建模)
            const entranceGroup = new THREE.Group();
            entranceGroup.name = "4. 主入口雨棚与门口";
            libraryGroup.add(entranceGroup);

            const doorZPos = WIDTH / 2 - GLASS_INSET; // 16.8m

            // 4.1 多级台阶与基座平台 (Granite Entry Steps)
            const stepsGroup = new THREE.Group();
            stepsGroup.name = "4.1 主入口多级花岗岩台阶";
            entranceGroup.add(stepsGroup);

            const stepWidth = 18.0;
            const stepDepth = 0.45;
            const stepHeight = 0.15;
            for (let s = 0; s < 4; s++) {
                const stepMesh = new THREE.Mesh(
                    new THREE.BoxGeometry(stepWidth - s * 0.4, stepHeight, 3.2 - s * stepDepth),
                    darkStoneMat
                );
                stepMesh.position.set(0, s * stepHeight + stepHeight / 2, doorZPos + 1.6 - (s * stepDepth) / 2);
                stepMesh.receiveShadow = true;
                stepMesh.name = `主入口第 ${4 - s} 级台阶 (+${(s * stepHeight).toFixed(2)}m)`;
                stepsGroup.add(stepMesh);
            }

            // Left & Right Step Retaining Cheek Walls
            const cheekLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 3.4), stoneMat);
            cheekLeft.position.set(-stepWidth / 2 - 0.4, 0.4, doorZPos + 1.6);
            cheekLeft.castShadow = true;
            cheekLeft.name = "西侧台阶石材包边挡墙";
            stepsGroup.add(cheekLeft);

            const cheekRight = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 3.4), stoneMat);
            cheekRight.position.set(stepWidth / 2 + 0.4, 0.4, doorZPos + 1.6);
            cheekRight.castShadow = true;
            cheekRight.name = "东侧台阶石材包边挡墙";
            stepsGroup.add(cheekRight);

            // 4.2 悬挑大雨棚与天花筒灯
            const canopyGroup = new THREE.Group();
            canopyGroup.name = "4.2 主入口悬挑雨棚结构";
            entranceGroup.add(canopyGroup);

            const canopySlab = new THREE.Mesh(new THREE.BoxGeometry(18.0, 0.8, 5.0), stoneMat);
            canopySlab.position.set(0, 5.2, doorZPos + 2.5);
            canopySlab.castShadow = true;
            canopySlab.receiveShadow = true;
            canopySlab.name = "主入口悬挑雨棚顶板";
            canopyGroup.add(canopySlab);

            const canopyTrim = new THREE.Mesh(new THREE.BoxGeometry(18.4, 0.3, 5.2), mullionMat);
            canopyTrim.position.set(0, 5.5, doorZPos + 2.5);
            canopyTrim.name = "雨棚铝合金檐口压顶";
            canopyGroup.add(canopyTrim);

            const soffitPanel = new THREE.Mesh(new THREE.BoxGeometry(17.6, 0.1, 4.6), darkStoneMat);
            soffitPanel.position.set(0, 4.75, doorZPos + 2.5);
            soffitPanel.name = "雨棚底面深色吊顶";
            canopyGroup.add(soffitPanel);

            const spotGridGroup = new THREE.Group();
            spotGridGroup.name = "雨棚天花板嵌入式 LED 筒灯组";
            canopyGroup.add(spotGridGroup);

            for (let rx = -5; rx <= 5; rx += 2) {
                for (let rz = -1.5; rz <= 1.5; rz += 3) {
                    const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16), mullionMat);
                    fixture.position.set(rx * 1.4, 4.7, doorZPos + 2.5 + rz * 1.0);
                    fixture.name = `天花板筒灯底座 (${rx},${rz})`;
                    
                    const bulb = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16), lightEmissiveMat);
                    bulb.position.set(rx * 1.4, 4.68, doorZPos + 2.5 + rz * 1.0);
                    bulb.name = `LED 发光光源 (${rx},${rz})`;
                    
                    spotGridGroup.add(fixture);
                    spotGridGroup.add(bulb);
                }
            }

            // 4.3 门头幕墙与大门构架
            const doorEnclosure = new THREE.Group();
            doorEnclosure.name = "4.3 主入口门套与自动玻璃门组";
            entranceGroup.add(doorEnclosure);

            const portalTop = new THREE.Mesh(new THREE.BoxGeometry(12.8, 0.35, 0.4), darkStoneMat);
            portalTop.position.set(0, 4.75, doorZPos + 0.05);
            portalTop.name = "主入口门套上横梁框";
            doorEnclosure.add(portalTop);

            const portalLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.1, 0.4), darkStoneMat);
            portalLeft.position.set(-6.2, 2.65, doorZPos + 0.05);
            portalLeft.name = "主入口门套左侧边框柱";
            doorEnclosure.add(portalLeft);

            const portalRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.1, 0.4), darkStoneMat);
            portalRight.position.set(6.2, 2.65, doorZPos + 0.05);
            portalRight.name = "主入口门套右侧边框柱";
            doorEnclosure.add(portalRight);

            const postLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.8, 0.25), mullionMat);
            postLeft.position.set(-2.1, 2.0, doorZPos + 0.05);
            postLeft.name = "门套西侧受力隔断立柱";
            doorEnclosure.add(postLeft);

            const postRight = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.8, 0.25), mullionMat);
            postRight.position.set(2.1, 2.0, doorZPos + 0.05);
            postRight.name = "门套东侧受力隔断立柱";
            doorEnclosure.add(postRight);

            const signBoard = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.8, 0.2), signPlateMat);
            signBoard.position.set(0, 4.1, doorZPos + 0.15);
            signBoard.castShadow = true;
            signBoard.name = "主入口门头标识横匾";
            doorEnclosure.add(signBoard);

            const signAccent = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.05, 0.22), metalTrimMat);
            signAccent.position.set(0, 3.68, doorZPos + 0.16);
            signAccent.name = "门头标识金属饰条";
            doorEnclosure.add(signAccent);

            const operatorBox = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.25, 0.25), darkStoneMat);
            operatorBox.position.set(0, 3.42, doorZPos + 0.08);
            operatorBox.name = "自动门隐蔽式滑轨机箱";
            doorEnclosure.add(operatorBox);

            const sideGlassLeft = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.7, 0.05), glassMat);
            sideGlassLeft.position.set(-4.05, 1.95, doorZPos);
            sideGlassLeft.name = "西侧固定旁路玻璃门窗";
            doorEnclosure.add(sideGlassLeft);

            const sideGlassRight = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.7, 0.05), glassMat);
            sideGlassRight.position.set(4.05, 1.95, doorZPos);
            sideGlassRight.name = "东侧固定旁路玻璃门窗";
            doorEnclosure.add(sideGlassRight);

            const centerDoorGroup = new THREE.Group();
            centerDoorGroup.name = "中央双开自动感应玻璃门组";
            doorEnclosure.add(centerDoorGroup);

            const doorLeftLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.95, 2.65, 0.05), glassMat);
            doorLeftLeaf.position.set(-1.025, 1.925, doorZPos + 0.07);
            doorLeftLeaf.name = "左侧感应滑动玻璃门扇";
            centerDoorGroup.add(doorLeftLeaf);

            const handleLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 12), metalTrimMat);
            handleLeft.position.set(-0.15, 1.8, doorZPos + 0.13);
            handleLeft.name = "左门不锈钢竖向拉手";
            centerDoorGroup.add(handleLeft);

            const doorRightLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.95, 2.65, 0.05), glassMat);
            doorRightLeaf.position.set(1.025, 1.925, doorZPos + 0.07);
            doorRightLeaf.name = "右侧感应滑动玻璃门扇";
            centerDoorGroup.add(doorRightLeaf);

            const handleRight = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 12), metalTrimMat);
            handleRight.position.set(0.15, 1.8, doorZPos + 0.13);
            handleRight.name = "右门不锈钢竖向拉手";
            centerDoorGroup.add(handleRight);

            const interiorMat = new THREE.Mesh(new THREE.BoxGeometry(10.0, 0.02, 3.5), darkStoneMat);
            interiorMat.position.set(0, 0.61, doorZPos - 1.8);
            interiorMat.name = "室内入户大理石地垫";
            doorEnclosure.add(interiorMat);

            const lobbyWall = new THREE.Mesh(new THREE.BoxGeometry(8.0, 3.6, 0.3), stoneMat);
            lobbyWall.position.set(0, 2.4, doorZPos - 3.8);
            lobbyWall.name = "室内门厅大理石艺术背景墙";
            doorEnclosure.add(lobbyWall);

            // 5. 侧立面 (East & West Elevations - 36,000mm)
            const sidesGroup = new THREE.Group();
            sidesGroup.name = "5. 侧立面 (东立面/西立面)";
            libraryGroup.add(sidesGroup);

            const eastGlass = new THREE.Mesh(new THREE.BoxGeometry(0.3, 19.8, 27), glassMat);
            eastGlass.position.set(LENGTH / 2 - GLASS_INSET, 10.5, 0);
            eastGlass.name = "东立面幕墙玻璃";
            sidesGroup.add(eastGlass);

            const westGlass = new THREE.Mesh(new THREE.BoxGeometry(0.3, 19.8, 27), glassMat);
            westGlass.position.set(-LENGTH / 2 + GLASS_INSET, 10.5, 0);
            westGlass.name = "西立面幕墙玻璃";
            sidesGroup.add(westGlass);

            const numSidePillars = 5;
            const sidePillarStartZ = -10.8;
            const sidePillarSpacing = 21.6 / (numSidePillars - 1);

            for (let i = 0; i < numSidePillars; i++) {
                const pz = sidePillarStartZ + i * sidePillarSpacing;

                const eastPillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 19.8, 0.8), stoneMat);
                eastPillar.position.set(LENGTH / 2 - GLASS_INSET / 2, 10.5, pz);
                eastPillar.castShadow = true;
                eastPillar.name = `东立面装饰柱 E-Fin-${i + 1}`;
                sidesGroup.add(eastPillar);

                const westPillar = new THREE.Mesh(new THREE.BoxGeometry(1.2, 19.8, 0.8), stoneMat);
                westPillar.position.set(-LENGTH / 2 + GLASS_INSET / 2, 10.5, pz);
                westPillar.castShadow = true;
                westPillar.name = `西立面装饰柱 W-Fin-${i + 1}`;
                sidesGroup.add(westPillar);
            }

            // 6. 北立面 (North Elevation - Back Facade)
            const northGroup = new THREE.Group();
            northGroup.name = "6. 北立面 (背面 façade)";
            libraryGroup.add(northGroup);

            const northGlass = new THREE.Mesh(new THREE.BoxGeometry(63, 19.8, 0.3), glassMat);
            northGlass.position.set(0, 10.5, -WIDTH / 2 + GLASS_INSET);
            northGlass.name = "北立面大幕墙";
            northGroup.add(northGlass);

            const northPierXs = [-24, -12, 0, 12, 24];
            northPierXs.forEach((px, idx) => {
                const pier = new THREE.Mesh(new THREE.BoxGeometry(3.0, 19.8, 1.0), stoneMat);
                pier.position.set(px, 10.5, -WIDTH / 2 + GLASS_INSET / 2);
                pier.castShadow = true;
                pier.name = `北立面石材承重墙柱 N-Pier-${idx + 1}`;
                northGroup.add(pier);
            });

            const northDoor = new THREE.Mesh(new THREE.BoxGeometry(6.0, 3.0, 0.4), darkStoneMat);
            northDoor.position.set(0, 2.1, -WIDTH / 2 + 0.2);
            northDoor.name = "北侧后勤出入口门";
            northGroup.add(northDoor);

            // 7. 景观树木与高耸杉树
            const treeGroup = new THREE.Group();
            treeGroup.name = "7. 景观树木与高耸杉树";
            libraryGroup.add(treeGroup);

            const treePositions = [
                [-52, 25], [-38, 25], [38, 25], [52, 25],
                [-55, -15], [55, -15], [-55, 0], [55, 0]
            ];

            const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.9 });
            const foliageMat = new THREE.MeshStandardMaterial({ color: 0x2e6f40, roughness: 0.7 });

            treePositions.forEach((pos, i) => {
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 3), trunkMat);
                trunk.position.set(pos[0], 1.5, pos[1]);
                trunk.castShadow = true;

                const foliage = new THREE.Mesh(new THREE.SphereGeometry(2.2, 8, 8), foliageMat);
                foliage.position.set(pos[0], 4.2, pos[1]);
                foliage.castShadow = true;
                foliage.name = `广场景观树 Tree-${i + 1}`;

                treeGroup.add(trunk);
                treeGroup.add(foliage);
            });

            const cypressMat1 = new THREE.MeshStandardMaterial({ color: 0x1b432c, roughness: 0.7 });
            const cypressMat2 = new THREE.MeshStandardMaterial({ color: 0x235235, roughness: 0.6 });
            const cypressMat3 = new THREE.MeshStandardMaterial({ color: 0x2a603b, roughness: 0.7 });

            function addCypressTree(x, z, scale = 1.0, name = "景观高杉树") {
                const tree = new THREE.Group();
                tree.name = name;

                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * scale, 0.45 * scale, 5 * scale), trunkMat);
                trunk.position.y = 2.5 * scale;
                trunk.castShadow = true;
                tree.add(trunk);

                const tiers = [
                    { r: 2.2 * scale, h: 5.0 * scale, y: 5.0 * scale, mat: cypressMat1 },
                    { r: 1.7 * scale, h: 4.5 * scale, y: 7.5 * scale, mat: cypressMat2 },
                    { r: 1.2 * scale, h: 4.0 * scale, y: 10.0 * scale, mat: cypressMat3 },
                    { r: 0.6 * scale, h: 3.0 * scale, y: 12.0 * scale, mat: cypressMat2 }
                ];

                tiers.forEach(t => {
                    const cone = new THREE.Mesh(new THREE.ConeGeometry(t.r, t.h, 8), t.mat);
                    cone.position.y = t.y;
                    cone.castShadow = true;
                    tree.add(cone);
                });

                tree.position.set(x, 0.2, z);
                treeGroup.add(tree);
            }

            const westCypressPos = [
                [-52, 22], [-46, 38], [-38, 24], [-50, 42], [-42, 30]
            ];
            westCypressPos.forEach((p, idx) => {
                addCypressTree(p[0], p[1], 0.95 + (idx % 3) * 0.15, `西侧高耸杉树 W-Cypress-${idx + 1}`);
            });

            const eastCypressPos = [
                [52, 22], [46, 38], [38, 24], [50, 42], [42, 30]
            ];
            eastCypressPos.forEach((p, idx) => {
                addCypressTree(p[0], p[1], 0.95 + (idx % 3) * 0.15, `东侧高耸杉树 E-Cypress-${idx + 1}`);
            });
        }