// 模型名称：全新校区建筑群模型 (精细化异构建筑)
function buildCustomBuildingsModel(THREE, group) {
    const COLOR_WALL_WHITE = 0xf8fafc;
    const COLOR_WALL_BEIGE = 0xf5f5dc;
    const COLOR_WALL_BRICK = 0xb91c1c;
    const COLOR_WALL_DARK = 0x334155;
    const COLOR_GLASS_BLUE = 0x38bdf8;
    const COLOR_GLASS_DARK = 0x0f172a;
    const COLOR_GOLD = 0xf59e0b;
    const COLOR_STEEL = 0x94a3b8;
    const COLOR_ROOF = 0x475569;

    function createBuildingBlock(w, h, d, x, y, z, mat, name) {
        const geo = new THREE.BoxGeometry(w, h, d);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(x, y + h / 2, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = name;
        return mesh;
    }

    const matWhite = new THREE.MeshStandardMaterial({ color: COLOR_WALL_WHITE, roughness: 0.5 });
    const matBeige = new THREE.MeshStandardMaterial({ color: COLOR_WALL_BEIGE, roughness: 0.6 });
    const matBrick = new THREE.MeshStandardMaterial({ color: COLOR_WALL_BRICK, roughness: 0.7 });
    const matDark = new THREE.MeshStandardMaterial({ color: COLOR_WALL_DARK, roughness: 0.4 });
    const matGlass = new THREE.MeshPhysicalMaterial({ color: COLOR_GLASS_BLUE, transparent: true, opacity: 0.6, roughness: 0.1 });
    const matGold = new THREE.MeshStandardMaterial({ color: COLOR_GOLD, metalness: 0.8, roughness: 0.2 });
    const matSteel = new THREE.MeshStandardMaterial({ color: COLOR_STEEL, metalness: 0.8, roughness: 0.3 });
    const matRoof = new THREE.MeshStandardMaterial({ color: COLOR_ROOF, roughness: 0.9 });

    // 1. 北宿舍1号楼 (-192.97, 0.30, -399.74)
    const dorm1Group = new THREE.Group();
    dorm1Group.name = "🏢 北宿舍1号楼主体";
    dorm1Group.position.set(-192.97, 0.30, -399.74);
    dorm1Group.add(createBuildingBlock(85, 24, 70, 0, 0, 0, matWhite, "主楼体"));
    dorm1Group.add(createBuildingBlock(87, 2, 72, 0, 24, 0, matRoof, "屋顶檐口"));
    dorm1Group.add(createBuildingBlock(80, 16, 2, 0, 4, 36, matGlass, "正面观景阳台玻璃窗"));
    group.add(dorm1Group);

    // 2. 北宿舍3号楼 (-191.46, 0.30, -285.00)
    const dorm3Group = new THREE.Group();
    dorm3Group.name = "🏢 北宿舍3号楼 (双塔连廊风)";
    dorm3Group.position.set(-191.46, 0.30, -285.00);
    dorm3Group.add(createBuildingBlock(35, 26, 65, -22, 0, 0, matBrick, "左塔楼"));
    dorm3Group.add(createBuildingBlock(35, 26, 65, 22, 0, 0, matBrick, "右塔楼"));
    dorm3Group.add(createBuildingBlock(20, 6, 30, 0, 16, 0, matGlass, "中央空中玻璃连廊"));
    group.add(dorm3Group);

    // 3. 北宿舍5号楼 (-192.02, 0.30, -166.35)
    const dorm5Group = new THREE.Group();
    dorm5Group.name = "🏢 北宿舍5号楼 (U型庭院风)";
    dorm5Group.position.set(-192.02, 0.30, -166.35);
    dorm5Group.add(createBuildingBlock(85, 22, 25, 0, 0, -25, matBeige, "后侧横楼"));
    dorm5Group.add(createBuildingBlock(25, 22, 50, -30, 0, 12.5, matBeige, "左翼楼"));
    dorm5Group.add(createBuildingBlock(25, 22, 50, 30, 0, 12.5, matBeige, "右翼楼"));
    group.add(dorm5Group);

    // 4. 北宿舍10号楼 (200.72, 0.30, -215.15)
    const dorm10Group = new THREE.Group();
    dorm10Group.name = "🏢 留学生公寓10号楼 (高层幕墙)";
    dorm10Group.position.set(200.72, 0.30, -215.15);
    dorm10Group.add(createBuildingBlock(100, 35, 55, 0, 0, 0, matDark, "主体大楼"));
    dorm10Group.add(createBuildingBlock(95, 30, 57, 0, 3, 0, matGlass, "正面全景幕墙"));
    dorm10Group.add(createBuildingBlock(40, 4, 30, 0, 35, 0, matGold, "屋顶皇冠装饰塔"));
    group.add(dorm10Group);

    // 5. 图书资讯中心 (-192.11, 0.30, -37.50)
    const libGroup = new THREE.Group();
    libGroup.name = "🏛️ 逸夫图书资讯中心 (现代圆顶)";
    libGroup.position.set(-192.11, 0.30, -37.50);
    libGroup.add(createBuildingBlock(90, 20, 75, 0, 0, 0, matWhite, "图书馆主体"));
    const domeGeo = new THREE.SphereGeometry(22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMesh = new THREE.Mesh(domeGeo, matGlass);
    domeMesh.position.set(0, 20, 0);
    libGroup.add(domeMesh);
    group.add(libGroup);

    // 6. 第一餐饮中心 (-189.69, 0.30, 102.98)
    const canteen1Group = new THREE.Group();
    canteen1Group.name = "🍜 第一风味餐饮中心";
    canteen1Group.position.set(-189.69, 0.30, 102.98);
    canteen1Group.add(createBuildingBlock(85, 14, 85, 0, 0, 0, matBeige, "食堂主体"));
    canteen1Group.add(createBuildingBlock(75, 2, 75, 0, 14, 0, matGold, "金色浮空雨棚檐口"));
    group.add(canteen1Group);

    // 7. 第二风味餐厅 (-192.19, 0.30, 232.43)
    const canteen2Group = new THREE.Group();
    canteen2Group.name = "🍲 第二清真与教工餐厅";
    canteen2Group.position.set(-192.19, 0.30, 232.43);
    canteen2Group.add(createBuildingBlock(80, 15, 65, 0, 0, 0, matBrick, "红砖主体"));
    canteen2Group.add(createBuildingBlock(82, 10, 40, 0, 3, 14, matGlass, "采光玻璃中庭"));
    group.add(canteen2Group);

    // 8. 校行政大楼 (-189.14, 0.30, 358.52)
    const adminGroup = new THREE.Group();
    adminGroup.name = "🏛️ 校行政大楼与指挥中心";
    adminGroup.position.set(-189.14, 0.30, 358.52);
    adminGroup.add(createBuildingBlock(80, 30, 75, 0, 0, 0, matDark, "行政主塔楼"));
    adminGroup.add(createBuildingBlock(15, 12, 15, 0, 30, 0, matWhite, "顶层钟楼"));
    group.add(adminGroup);

    // 9. 阶梯教学楼B (0.15, 0.30, -422.23)
    const teachBGroup = new THREE.Group();
    teachBGroup.name = "🏫 中央阶梯教学楼B";
    teachBGroup.position.set(0.15, 0.30, -422.23);
    teachBGroup.add(createBuildingBlock(85, 18, 50, 0, 0, 0, matWhite, "教学主楼"));
    teachBGroup.add(createBuildingBlock(60, 14, 45, 0, 2, 25, matGlass, "阶梯阶梯教室玻璃侧翼"));
    group.add(teachBGroup);

    // 10. 实训中心C (200.00, 0.30, -46.73)
    const trainCGroup = new THREE.Group();
    trainCGroup.name = "🔬 工程实验实训中心C";
    trainCGroup.position.set(200.00, 0.30, -46.73);
    trainCGroup.add(createBuildingBlock(100, 22, 80, 0, 0, 0, matSteel, "工业钢结构主体"));
    trainCGroup.add(createBuildingBlock(90, 15, 82, 0, 4, 0, matGlass, "车间玻璃幕墙"));
    group.add(trainCGroup);

    // 11. 信息实训中心E (204.15, 0.30, 57.18)
    const trainEGroup = new THREE.Group();
    trainEGroup.name = "💻 信息技术实训中心E";
    trainEGroup.position.set(204.15, 0.30, 57.18);
    trainEGroup.add(createBuildingBlock(100, 25, 80, 0, 0, 0, matDark, "IT数据大楼主体"));
    trainEGroup.add(createBuildingBlock(40, 28, 40, 0, 0, 22, matGlass, "中央数据中枢玻璃塔"));
    group.add(trainEGroup);

    // 12. 综合教学楼C组团 (183.55, 0.30, 351.69)
    const teachCGroup = new THREE.Group();
    teachCGroup.name = "🏫 综合教学大楼C组团";
    teachCGroup.position.set(183.55, 0.30, 351.69);
    teachCGroup.add(createBuildingBlock(65, 28, 80, 0, 0, 0, matWhite, "纵向教学楼"));
    teachCGroup.add(createBuildingBlock(100, 22, 50, 0, 0, 80, matBrick, "横向教学楼"));
    group.add(teachCGroup);
}
