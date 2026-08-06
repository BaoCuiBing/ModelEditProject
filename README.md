# html_model — 3D 学校场景编辑器（模型加载版）

本目录是一个纯前端（无构建工具、无依赖安装）的 Three.js 场景编辑器。它负责：
- 加载任意一个「模型构建 JS 文件」，将其中的场景对象展示在 3D 视口中；
- 提供大纲树（Outliner）、选中/高亮、移动/旋转/缩放（Gizmo）、撤销/重做、复制变换数值、视角飞行、主题切换、模型文件导入等编辑能力。

## 目录结构

```
html_model/
├── model_load.html            # 页面入口：挂载编辑器 + 加载学校地基模型
├── modeledit.js               # 编辑器核心：注入界面、初始化 three.js 与交互逻辑
├── modeledit.log              # 运行日志（历史遗留，可忽略）
├── README.md                  # 本文档
└── school_model/              # 模型构建 JS 文件集（一个文件 = 一个可独立加载的场景）
    ├── school_diji_model.js           # 学校地基总场景（默认加载）
    ├── park_model.js                  # 公园场景
    ├── fountain_model.js              # 喷泉场景（含粒子动画示例）
    ├── teaching_building_model.js     # 教学楼模型
    ├── library_model.js               # 图书馆模型
    ├── canteen_model.js               # 食堂模型
    ├── stadium_model.js               # 体育场模型
    ├── gymnasium_model.js             # 体育馆模型
    └── volleyball_model.js            # 排球场地模型
```

---

## 一、如何调用（model_load.html + modeledit.js）

### 1. 页面结构要求

`model_load.html` 必须包含一个用于挂载编辑器的容器，例如：

```html
<body class="h-full m-0 overflow-hidden">
    <div id="app" class="h-full w-full flex flex-col overflow-hidden"></div>
</body>
```

### 2. 引入脚本（顺序重要）

1. 先引入 `modeledit.js`（编辑器核心）；
2. 再引入一个或多个「模型构建 JS 文件」；
3. 最后调用 `window.initModelEditor(容器元素, 构建函数)` 完成初始化。

```html
<script src="./modeledit.js"></script>                          <!-- 1. 编辑器核心 -->
<script src="./school_model/school_diji_model.js"></script>     <!-- 2. 模型构建函数 -->
<script>
    // 3. 初始化编辑器并挂载学校地基场景
    const container = document.getElementById('app');
    window.initModelEditor(container, buildMySchoolScene);
</script>
```

### 3. 编辑器自动加载的依赖（CDN）

`initModelEditor` 内部会依次动态加载以下脚本，**无需手动引入**：

| 依赖 | 地址 | 用途 |
| --- | --- | --- |
| Tailwind CSS | `https://cdn.tailwindcss.com` | 界面样式 |
| three.js | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` | 3D 核心 |
| lucide | `https://unpkg.com/lucide@latest` | 图标 |
| OrbitControls | `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js` | 视角轨道控制 |
| TransformControls | `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/TransformControls.js` | 变换 Gizmo |

> 注意：three.js 版本固定为 r128。该版本 TransformControls 存在 gizmo 轴与位移不一致的回归问题，`modeledit.js` 已通过 `transformControl.setSpace('local')` 修复（详见下文「已知问题与修复」）。

### 4. 编辑器功能一览

| 功能 | 操作 |
| --- | --- |
| 选中对象 | 视口中单击物体，或点击大纲树节点 |
| 移动 / 旋转 / 缩放 | 底部工具栏切换模式，拖拽 Gizmo 的箭头 / 圆环 / 方块 |
| 旋转视角 | 视口空白处拖拽（OrbitControls） |
| 鸟瞰全景 | 顶部「鸟瞰全景」按钮，复位相机视角 |
| 撤销 / 重做 | 顶部按钮，或 Ctrl+Z / Ctrl+Y |
| 复制变换值 | 选中后点击信息卡上的复制按钮（位移/旋转/缩放） |
| 大纲搜索 | 左侧搜索框按名称过滤对象 |
| 展开/收起 | 节点左侧箭头单节点切换；顶部「展开全部/折叠全部」批量操作 |
| 主题切换 | 顶部月亮/太阳按钮 |
| 导入模型 | 顶部「导入」按钮，选择任意 `model_xxx.js` 文件重建场景 |

---

## 二、模型 JS 文件如何编写

### 1. 基本格式（必读）

每个模型文件必须定义一个**全局函数**，签名为：

```javascript
function buildXxxScene(THREE, group) {
    // 在此构建场景……
}
```

要求：
- 函数名必须以 `build` 开头（导入功能靠该规则识别），且必须接收**恰好 2 个参数**：
  - `THREE`：three.js 命名空间（直接用其几何体、材质、分组等）；
  - `group`：编辑器提供的场景主组，所有对象必须挂到它（或它的子组）下面。
- 不要重复创建灯光以外的全局变量，不要创建第二个构建函数（如有，导入匹配时以文件内第一个双参 build 函数为准）。

### 2. 最小示例

```javascript
function buildMySimpleScene(THREE, group) {
    // 地面（平面需绕 X 轴旋转 -90° 平铺）
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ color: 0x48bb78 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.name = "绿色草坪";          // 必须命名，否则大纲树显示"未命名对象"
    group.add(ground);

    // 一座小房子
    const house = new THREE.Mesh(
        new THREE.BoxGeometry(4, 3, 4),
        new THREE.MeshStandardMaterial({ color: 0xf1f5f9 })
    );
    house.position.set(0, 1.5, 0);
    house.castShadow = true;
    house.name = "白色小屋";
    group.add(house);
}
```

### 3. 编写规范要点

| 项 | 要求 | 说明 |
| --- | --- | --- |
| 命名 | 每个 `Mesh` / `Group` 都设置 `.name` | 大纲树显示、搜索、选中信息卡都依赖名称 |
| 灯光 | 建议在函数内自行添加灯光 | 编辑器不自动加灯；参考 `school_diji_model.js` 的环境光+平行光(开阴影)+半球光 |
| 阴影 | 立体物体 `castShadow = true`，地面 `receiveShadow = true` | 需同时开启平行光 `castShadow` 并配置 `shadow.camera` 范围 |
| 地面 | 用平面时 `rotation.x = -Math.PI / 2` 平铺 | 编辑器 Y 轴向上，地面通常位于 y=0 |
| 分组 | 复杂场景用 `new THREE.Group()` 收纳 | 子组会作为大纲树的「文件夹」节点展示，便于组织 |
| 动画 | 将每帧回调放入 `group.userData.updatables = [...]` | 编辑器动画循环会逐个调用（参考 `fountain_model.js` 喷泉粒子） |
| 坐标系 | 以原点为中心布局，地面范围建议 ≤ 60×100 | 相机默认视角 `(0, 24, 28)` 注视 `(0, 0.8, 0)` |

### 4. 动画示例（喷泉粒子）

```javascript
function buildFountain(THREE, group) {
    const updatables = [];
    // ……创建 particles（THREE.Points）……
    updatables.push(() => {
        const pos = particles.geometry.attributes.position.array;
        for (let i = 0; i < pos.length; i += 3) {
            pos[i + 1] -= 0.0035;          // 重力
            if (pos[i + 1] < 0) pos[i + 1] = 3;  // 重置到喷口
        }
        particles.geometry.attributes.position.needsUpdate = true;
    });
    group.userData.updatables = updatables;   // 关键：暴露给编辑器的动画循环
}
```

### 5. 如何让编辑器加载你的模型

三种方式：
1. **默认加载**：在 HTML 中 `<script>` 引入文件，并把函数传给 `initModelEditor(container, buildXxxScene)`（见上）。
2. **页面内「导入」按钮**：点击顶部「导入」选择 `model_xxx.js`，编辑器会读取、执行脚本、自动匹配 `build` 开头的双参函数并重建场景。
3. **直接改 HTML**：把第 3 个 `<script>` 换成你的文件与函数即可。

### 6. 在 HTML 内联模型（无需外部 js 文件）

不想单独建文件时，可以直接把构建函数写进 HTML 的 `<script>` 内联。**注意**：函数必须命名为 `build` 开头且接收 `(THREE, group)` 两个参数，否则页面内「导入」时不会被识别。

```html
<!-- 引用外部模型文件时注释掉即可（可选） -->
<!-- <script src="./school_model/school_diji_model.js"></script> -->

<script>
    function buildInlineDemoScene(THREE, group) { // 内联构建函数，build 开头 + 双参
        // 灯光
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        ambient.name = "环境光";
        group.add(ambient);

        const sun = new THREE.DirectionalLight(0xfffbeb, 1.2);
        sun.position.set(10, 20, 10);
        sun.castShadow = true;
        sun.name = "太阳平行光";
        group.add(sun);

        // 地面（平面需绕 X 轴旋转 -90° 平铺）
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(20, 20),
            new THREE.MeshStandardMaterial({ color: 0x48bb78 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        ground.name = "绿色草坪";
        group.add(ground);

        // 方块
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshStandardMaterial({ color: 0xf97316 })
        );
        box.position.set(0, 1, 0);
        box.castShadow = true;
        box.name = "橙色方块";
        group.add(box);
    }

    const container = document.getElementById('app');
    window.initModelEditor(container, buildInlineDemoScene); // 传入内联函数
</script>
```

说明：
- 若想临时换回外部模型，取消第 15-16 行 `<script src="./school_model/school_diji_model.js">` 的注释，并把 `buildInlineDemoScene` 改回 `buildMySchoolScene` 即可。
- 内联函数同样遵循第 3 节编写规范（命名、灯光、阴影、分组、动画等）。

---

## 三、已知问题与修复记录

### 3.1 three.js r128 TransformControls 轴错乱（已修复）

- **现象**：旋转视角后，部分物体移动时 Gizmo 箭头方向与实际位移不一致（如拖 Y 轴箭头，物体却沿 X 轴移动）。
- **根因**：r128 的 `TransformControls.js` 中 gizmo 朝向一行三元判断写反（`this.mode === 'scale' ? this.space : 'local'`，r132 已改为 `? 'local' : this.space`），导致 translate/rotate 的 gizmo 永远按物体**本地轴**渲染，而拖拽位移按默认 `space='world'` 的**世界轴**计算；物体只要带旋转就会箭头与位移不一致。
- **修复**：创建控制器后调用 `transformControl.setSpace('local')`，让位移跟随 gizmo 的本地轴，做到所见即所得。

### 3.2 大纲树箭头展开/收起无效（已修复）

- **现象**：点击节点左侧箭头无反应，只能通过顶部「展开全部/折叠全部」批量操作。
- **根因**：箭头 `<i data-lucide="...">` 在 `lucide.createIcons()` 时被替换为 `<svg>`，原先绑定在 `<i>` 上的点击监听器随元素销毁而丢失。
- **修复**：改为在树容器上做事件委托（`click` + `closest('.toggle-arrow')`），并只在首次构建时绑定一次，避免重建场景时监听器叠加。
