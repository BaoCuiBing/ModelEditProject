window.initModelEditor = function(containerElement, buildSceneCallback) { // 编辑器入口：注入界面并绑定场景构建回调
    // 0. 确保容器具有正确的布局类
    containerElement.classList.add('flex', 'flex-col', 'h-full', 'w-full', 'overflow-hidden'); // 为容器添加全屏纵向布局类
    // 1. 注入 CSS
    const style = document.createElement('style'); // 创建 style 元素
    style.innerHTML = `.dark { --apple-background: #020617; --apple-foreground: #f8fafc; --apple-card: #0f172a; --apple-primary: #0ea5e9; --apple-secondary: #1e293b; --apple-secondary-foreground: #f8fafc; --apple-muted: #334155; --apple-muted-foreground: #94a3b8; --apple-border: #334155; }
        :root { --apple-background: #f8fafc; --apple-foreground: #0f172a; --apple-card: #ffffff; --apple-primary: #0284c7; --apple-secondary: #f1f5f9; --apple-secondary-foreground: #0f172a; --apple-muted: #cbd5e1; --apple-muted-foreground: #64748b; --apple-border: #e2e8f0; }
        body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: var(--apple-background); color: var(--apple-foreground); overflow: hidden; user-select: none; }
        .glass-panel { background: rgba(255, 255, 255, 0.88); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.4); }
        .dark .glass-panel { background: rgba(15, 23, 42, 0.88); border: 1px solid rgba(255, 255, 255, 0.08); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .tree-node { transition: all 0.15s ease; }
        .tree-node:hover { background-color: rgba(14, 165, 233, 0.12); }
        .tree-node.selected { background-color: rgba(14, 165, 233, 0.25) !important; border-left: 3px solid #0ea5e9; color: #0ea5e9; font-weight: 600; }
        .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 38px; padding: 0 14px; border: none; border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; transition: all 0.2s ease; }
        .btn-secondary { background: var(--apple-secondary); color: var(--apple-secondary-foreground); }
        .btn-secondary:hover:not(:disabled) { background: var(--apple-muted); transform: translateY(-1px); }`; // 注入编辑器主题与组件样式
    document.head.appendChild(style); // 将样式挂载到页面头部
    // 2. 注入 HTML
    containerElement.innerHTML = `<header class="h-14 px-5 glass-panel flex items-center justify-between z-20 shrink-0 border-b border-[var(--apple-border)]">
        <div class="flex items-center space-x-3">
            <i data-lucide="trees" class="w-6 h-6 text-emerald-500"></i>
            <span class="font-bold text-sm tracking-wide">3D 湖泊公园场景编辑器</span>
        </div>
        <div class="flex items-center space-x-2">
            <!-- 历史记录控制区 (撤销/重做) -->
            <div class="flex items-center space-x-1 border-r border-[var(--apple-border)] pr-2 mr-1">
                <button onclick="undo()" id="btn-undo" class="btn btn-secondary !w-9 !p-0 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-opacity" title="撤回 (Ctrl+Z)" disabled>
                    <i data-lucide="undo-2" class="w-4 h-4 text-slate-500 dark:text-slate-400"></i>
                </button>
                <button onclick="redo()" id="btn-redo" class="btn btn-secondary !w-9 !p-0 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-opacity" title="取消撤回 (Ctrl+Y)" disabled>
                    <i data-lucide="redo-2" class="w-4 h-4 text-slate-500 dark:text-slate-400"></i>
                </button>
            </div>
            <button onclick="clearSelection()" class="btn btn-secondary text-xs">
                <i data-lucide="x-circle" class="w-4 h-4 text-amber-500"></i>
                <span>取消选中</span>
            </button>
            <button onclick="resetCamera()" class="btn btn-secondary text-xs">
                <i data-lucide="focus" class="w-4 h-4 text-sky-500"></i>
                <span>鸟瞰全景</span>
            </button>
            <div class="relative">
                <button onclick="toggleImportMenu(event)" class="btn btn-secondary text-xs" title="导入模型">
                    <i data-lucide="file-plus" class="w-4 h-4 text-emerald-500"></i>
                    <span>导入</span>
                    <i data-lucide="chevron-down" class="w-3 h-3 text-[var(--apple-muted-foreground)]"></i>
                </button>
                <div id="import-menu" class="hidden absolute right-0 top-full mt-1 glass-panel rounded-xl shadow-xl border border-[var(--apple-border)] z-50 min-w-[170px] py-1">
                    <button onclick="importModel()" class="w-full text-left px-3 py-2 text-xs hover:bg-sky-500/10 flex items-center space-x-2">
                        <i data-lucide="file-plus" class="w-3.5 h-3.5 text-emerald-500"></i>
                        <span>导入（重建场景）</span>
                    </button>
                    <button onclick="appendImportModel()" class="w-full text-left px-3 py-2 text-xs hover:bg-sky-500/10 flex items-center space-x-2">
                        <i data-lucide="file-plus-2" class="w-3.5 h-3.5 text-sky-500"></i>
                        <span>附加导入（追加到场景）</span>
                    </button>
                </div>
            </div>
            <input type="file" id="model-file-input" accept=".js" class="hidden" onchange="handleModelFileSelected(this.files[0])">
            <button onclick="exportGLB()" class="btn btn-secondary text-xs" title="导出当前场景为 GLB">
                <i data-lucide="download" class="w-4 h-4 text-sky-500"></i>
                <span>导出 GLB</span>
            </button>
            <button id="toggle-theme" class="btn btn-secondary !w-9 !p-0 rounded-lg" title="切换主题">
                <i data-lucide="moon" class="w-4 h-4"></i>
            </button>
        </div>
    </header>
    <main class="flex-1 relative flex overflow-hidden">
        <aside class="w-80 glass-panel border-r border-[var(--apple-border)] flex flex-col z-10 shrink-0 shadow-2xl">
            <div class="p-3 border-b border-[var(--apple-border)] flex items-center justify-between bg-slate-500/5">
                <div class="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-[var(--apple-muted-foreground)]">
                    <i data-lucide="list-tree" class="w-4 h-4 text-sky-500"></i>
                    <span>场景大纲视图 (Outliner)</span>
                </div>
                <div class="flex items-center space-x-1">
                    <button onclick="toggleAllTree(true)" class="p-1 text-slate-400 hover:text-sky-500 rounded transition-colors" title="展开全部">
                        <i data-lucide="chevrons-down" class="w-3.5 h-3.5"></i>
                    </button>
                    <button onclick="toggleAllTree(false)" class="p-1 text-slate-400 hover:text-sky-500 rounded transition-colors" title="折叠全部">
                        <i data-lucide="chevrons-up" class="w-3.5 h-3.5"></i>
                    </button>
                    <span id="tree-count-badge" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 font-semibold ml-1">0 对象</span>
                </div>
            </div>
            <div class="p-2 border-b border-[var(--apple-border)]">
                <div class="relative">
                    <i data-lucide="search" class="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[var(--apple-muted-foreground)]"></i>
                    <input type="text" id="tree-search" placeholder="搜索公园模型对象..." oninput="filterTree(this.value)" class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-[var(--apple-secondary)] text-[var(--apple-foreground)] border-none focus:outline-none focus:ring-1 focus:ring-sky-500">
                </div>
            </div>
            <div id="outliner-tree" class="flex-1 overflow-y-auto p-2 space-y-1 text-xs no-scrollbar"></div>
        </aside>
        <div id="canvas-container" class="flex-1 relative w-full h-full bg-slate-900">
            <canvas id="viewport" class="w-full h-full block cursor-crosshair"></canvas>
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-2 py-1.5 rounded-xl flex items-center space-x-1 shadow-xl border border-[var(--apple-border)] z-20">
                <button onclick="setTransformMode('translate')" id="btn-translate" class="btn btn-secondary !px-3 bg-sky-500/20 text-sky-600 dark:text-sky-400">
                    <i data-lucide="move" class="w-4 h-4"></i> 移动
                </button>
                <button onclick="setTransformMode('rotate')" id="btn-rotate" class="btn btn-secondary !px-3">
                    <i data-lucide="rotate-cw" class="w-4 h-4"></i> 旋转
                </button>
                <button onclick="setTransformMode('scale')" id="btn-scale" class="btn btn-secondary !px-3">
                    <i data-lucide="maximize" class="w-4 h-4"></i> 缩放
                </button>
            </div>
            <!-- Enhanced Selected Info Card with Transform Info -->
            <div class="absolute top-4 left-4 glass-panel px-4 py-3 rounded-xl flex flex-col text-xs shadow-lg border border-[var(--apple-border)] pointer-events-auto min-w-[220px]">
                <div class="flex items-center space-x-3">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <div>
                        <div class="font-semibold" id="selected-info">当前选中：无</div>
                        <div class="text-[10px] text-[var(--apple-muted-foreground)] mt-0.5" id="camera-status">视角坐标: (0, 0, 0)</div>
                    </div>
                </div>
                <!-- Transform Properties Panel -->
                <div id="transform-info" class="hidden flex-col space-y-2 pt-3 mt-3 border-t border-[var(--apple-border)]">
                    <div class="flex justify-between items-center group">
                        <span class="text-[10px] text-[var(--apple-muted-foreground)] w-10">位移</span>
                        <span id="pos-val" class="font-mono text-[10.5px] text-slate-600 dark:text-slate-300 flex-1 text-center tracking-tight">0.00, 0.00, 0.00</span>
                        <button onclick="copyTransform('pos')" class="btn btn-secondary !p-1 !h-6 !w-6 opacity-60 hover:opacity-100 hover:text-sky-500" title="复制坐标"><i data-lucide="copy" class="w-3 h-3"></i></button>
                    </div>
                    <div class="flex justify-between items-center group">
                        <span class="text-[10px] text-[var(--apple-muted-foreground)] w-10">旋转</span>
                        <span id="rot-val" class="font-mono text-[10.5px] text-slate-600 dark:text-slate-300 flex-1 text-center tracking-tight">0.00°, 0.00°, 0.00°</span>
                        <button onclick="copyTransform('rot')" class="btn btn-secondary !p-1 !h-6 !w-6 opacity-60 hover:opacity-100 hover:text-sky-500" title="复制旋转"><i data-lucide="copy" class="w-3 h-3"></i></button>
                    </div>
                    <div class="flex justify-between items-center group">
                        <span class="text-[10px] text-[var(--apple-muted-foreground)] w-10">缩放</span>
                        <span id="scale-val" class="font-mono text-[10.5px] text-slate-600 dark:text-slate-300 flex-1 text-center tracking-tight">1.00, 1.00, 1.00</span>
                        <button onclick="copyTransform('scale')" class="btn btn-secondary !p-1 !h-6 !w-6 opacity-60 hover:opacity-100 hover:text-sky-500" title="复制缩放"><i data-lucide="copy" class="w-3 h-3"></i></button>
                    </div>
                </div>
            </div>
            <!-- Toast Notification -->
            <div id="toast-notify" class="absolute top-4 right-4 glass-panel px-3 py-2 rounded-xl text-xs font-semibold text-sky-500 flex items-center space-x-2 shadow-xl border border-sky-500/30 transition-all duration-300 opacity-0 pointer-events-none translate-y-[-10px] z-50">
                <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-500"></i>
                <span id="toast-msg">已复制</span>
            </div>
            <div class="absolute bottom-4 right-4 glass-panel px-3 py-1.5 rounded-lg text-[11px] text-[var(--apple-muted-foreground)] flex items-center space-x-2 shadow-md pointer-events-none z-10">
                <i data-lucide="mouse-pointer-click" class="w-3.5 h-3.5 text-sky-500"></i>
                <span>点击元素高亮选中 • 鼠标拖拽旋转视角</span>
            </div>
        </div>
    </main>`; // 注入编辑器界面 HTML 结构
    // 3. 动态加载脚本
    const loadScript = (src) => { // 定义脚本动态加载函数
        return new Promise((resolve, reject) => { // 返回 Promise 便于链式加载
            if (document.querySelector(`script[src="${src}"]`)) { // 若该脚本已存在则直接完成
                resolve(); // 直接成功返回
                return; // 提前结束
            }
            const script = document.createElement('script'); // 创建 script 元素
            script.src = src; // 设置脚本源地址
            script.onload = resolve; // 加载成功时 resolve
            script.onerror = reject; // 加载失败时 reject
            document.head.appendChild(script); // 将脚本追加到页面头部
        });
    };
    Promise.all([ // 并行加载基础依赖库
        loadScript("https://cdn.tailwindcss.com"), // 加载 Tailwind CSS 样式库
        loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"), // 加载 Three.js 核心库
        loadScript("https://unpkg.com/lucide@latest") // 加载 Lucide 图标库
    ]).then(() => { // 基础库加载完成后
        return Promise.all([ // 继续并行加载 Three.js 扩展控件与导出器
            loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"), // 加载轨道控制器
            loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/TransformControls.js"), // 加载变换控制器
            loadScript("https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/exporters/GLTFExporter.js") // 加载 GLTF 导出器
        ]);
    }).then(() => { // 全部依赖加载完成后
        runEditorLogic(buildSceneCallback); // 启动编辑器核心逻辑
    });
}
function runEditorLogic(buildSceneCallback) { // 编辑器核心逻辑：初始化 3D 场景与交互
    // 挂载全局方法供 HTML 的 onclick 使用
    window.undo = undo; // 暴露撤销方法
    window.redo = redo; // 暴露重做方法
    window.clearSelection = clearSelection; // 暴露取消选中方法
    window.resetCamera = resetCamera; // 暴露复位视角方法
    window.toggleAllTree = toggleAllTree; // 暴露树展开/折叠方法
    window.filterTree = filterTree; // 暴露大纲搜索方法
    window.setTransformMode = setTransformMode; // 暴露变换模式切换方法
    window.copyTransform = copyTransform; // 暴露复制变换值方法
    window.copyToClipboard = copyToClipboard; // 暴露复制文本方法
    window.importModel = importModel; // 暴露导入模型方法
    window.appendImportModel = appendImportModel; // 暴露附加导入方法
    window.toggleImportMenu = toggleImportMenu; // 暴露导入下拉菜单切换方法
    window.handleModelFileSelected = handleModelFileSelected; // 暴露文件选择处理方法
    window.exportGLB = exportGLB; // 暴露导出 GLB 方法
    lucide.createIcons(); // 初始化 Lucide 图标
    const htmlEl = document.documentElement; // 获取根 html 元素
    document.getElementById('toggle-theme').addEventListener('click', () => { // 绑定主题切换按钮
        htmlEl.classList.toggle('dark'); // 切换暗色主题类
        const isDark = htmlEl.classList.contains('dark'); // 判断当前是否为暗色
        document.getElementById('toggle-theme').innerHTML = isDark ? '<i data-lucide="sun" class="w-4 h-4"></i>' : '<i data-lucide="moon" class="w-4 h-4"></i>'; // 切换主题图标
        lucide.createIcons(); // 重新初始化图标
        if (scene) scene.background = new THREE.Color(isDark ? 0x0a0f1d : 0xedf2f7); // 切换场景背景色
    });
    // History Manager Variables
    let historyStack = []; // 历史记录栈
    let historyIndex = -1; // 当前历史索引
    let transformStartData = null; // 拖拽开始时的状态快照
    let justFinishedTransformDrag = false; // 标记刚结束拖拽
    let scene, camera, renderer, controls, raycaster, mouse; // 声明核心 3D 对象
    let transformControl; // 变换控制器
    let parkMasterGroup; // 场景主组
    let selectedObject = null; // 当前选中对象
    let highlightHelper = null; // 高亮辅助框
    let targetCamPos = new THREE.Vector3(-859.7, 643.7, -134.8); // 相机目标位置(全景视角)
    let targetCamLookAt = new THREE.Vector3(0, 0, 0); // 相机注视目标中心
    let isFlying = false; // 相机飞行动画开关
    let importMode = 'replace'; // 导入模式：'replace' 重建场景 / 'append' 附加到现有场景
    // 保存对象的当前状态（用于撤回）
    function saveTransformState(object) { // 保存对象变换状态
        return { // 返回状态对象
            uuid: object.uuid, // 对象唯一标识
            position: object.position.clone(), // 克隆位置
            rotation: object.rotation.clone(), // 克隆旋转
            scale: object.scale.clone() // 克隆缩放
        };
    }
    // 推入新历史记录
    function pushHistory(oldState, newState) { // 压入历史记录
        // 如果在历史记录中间进行了新操作，则丢弃当前节点之后的历史
        if (historyIndex < historyStack.length - 1) { // 若处于历史中间
            historyStack = historyStack.slice(0, historyIndex + 1); // 截断后续历史
        }
        historyStack.push({ oldState, newState }); // 追加新历史节点
        historyIndex++; // 历史索引前进
        updateHistoryButtons(); // 更新按钮状态
    }
    // 更新撤销/重做按钮状态
    function updateHistoryButtons() { // 刷新历史按钮可用性
        const btnUndo = document.getElementById('btn-undo'); // 获取撤销按钮
        const btnRedo = document.getElementById('btn-redo'); // 获取重做按钮
        if (btnUndo) btnUndo.disabled = historyIndex < 0; // 无历史时禁用撤销
        if (btnRedo) btnRedo.disabled = historyIndex >= historyStack.length - 1; // 到末尾时禁用重做
    }
    // 应用特定状态到模型
    function applyTransformState(state) { // 应用历史状态
        const obj = scene.getObjectByProperty('uuid', state.uuid); // 按 uuid 查找对象
        if (obj) { // 若对象存在
            obj.position.copy(state.position); // 恢复位置
            obj.rotation.copy(state.rotation); // 恢复旋转
            obj.scale.copy(state.scale); // 恢复缩放
            // 更新高亮框适配
            if (highlightHelper && selectedObject && selectedObject.uuid === state.uuid) { // 若高亮框绑定当前对象
                highlightHelper.update(); // 更新高亮框
            }
        }
    }
    function undo() { // 撤销操作
        if (historyIndex >= 0) { // 存在可撤销历史
            applyTransformState(historyStack[historyIndex].oldState); // 应用旧状态
            historyIndex--; // 索引回退
            updateHistoryButtons(); // 更新按钮
        }
    }
    function redo() { // 重做操作
        if (historyIndex < historyStack.length - 1) { // 存在可重做历史
            historyIndex++; // 索引前进
            applyTransformState(historyStack[historyIndex].newState); // 应用新状态
            updateHistoryButtons(); // 更新按钮
        }
    }
    // 监听快捷键 Ctrl+Z 和 Ctrl+Y
    window.addEventListener('keydown', function(e) { // 绑定键盘快捷键
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { // 检测 Ctrl+Z
            if (e.shiftKey) redo(); // 加 Shift 为重做
            else undo(); // 否则撤销
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { // 检测 Ctrl+Y
            redo(); // 重做
        }
    });
    function init3D(buildSceneCallback) { // 初始化 3D 场景
        console.log('[ModelEditor] 初始化 3D 场景'); // 打印初始化日志
        const container = document.getElementById('canvas-container'); // 获取画布容器
        scene = new THREE.Scene(); // 创建场景
        scene.background = new THREE.Color(htmlEl.classList.contains('dark') ? 0x0a0f1d : 0xedf2f7); // 设置场景背景色
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 10000); // 创建透视相机(near=1/far=10000；near不宜过小，near/far比值越大深度缓冲精度越高)
        camera.position.copy(targetCamPos); // 设置相机初始位置
        renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('viewport'), antialias: true, logarithmicDepthBuffer: true }); // 创建渲染器（logarithmicDepthBuffer=true 使用对数深度缓冲，大幅提升远近深度精度，彻底改善Z-Fighting闪动）
        renderer.setSize(container.clientWidth, container.clientHeight); // 设置渲染尺寸
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 设置像素比
        renderer.shadowMap.enabled = true; // 开启阴影
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 设置软阴影类型
        renderer.outputEncoding = THREE.sRGBEncoding; // 设置输出色彩编码
        console.log('[ModelEditor] WebGLRenderer 创建完成'); // 打印渲染器日志
        controls = new THREE.OrbitControls(camera, renderer.domElement); // 创建轨道控制器
        controls.enableDamping = true; // 开启阻尼
        controls.dampingFactor = 0.05; // 阻尼系数
        controls.maxPolarAngle = Math.PI / 2.05; // 限制俯仰角度
        controls.target.copy(targetCamLookAt); // 设置控制器注视点
        controls.addEventListener('start', () => { isFlying = false; }); // 用户操作时取消飞行动画
        // Initialize TransformControls (附带历史记录监听)
        transformControl = new THREE.TransformControls(camera, renderer.domElement); // 创建变换控制器
        // 修复 three.js r128 TransformControls 回归问题：r128 中 translate/rotate 的 gizmo 固定按物体本地轴渲染
        // （源码 `this.mode === 'scale' ? this.space : 'local'` 三元顺序写反，r132 已改为 `? 'local' : this.space`），
        // 但默认 space='world' 时拖拽位移按世界轴计算，导致旋转过的物体“箭头方向与位移方向不一致”（如 Y 轴拖拽实际沿 X 轴）。
        // 将空间切换为 'local'，使位移与 gizmo 箭头方向完全一致（所见即所得）。
        transformControl.setSpace('local'); // 统一使用物体本地轴（与 r128 gizmo 渲染一致）
        transformControl.addEventListener('dragging-changed', function (event) { // 监听拖拽状态变化
            controls.enabled = !event.value; // 拖拽时禁用轨道控制
            if (event.value) { // 开始拖拽
                // 开始拖拽：记录初始状态
                if (selectedObject) { // 有选中对象
                    transformStartData = saveTransformState(selectedObject); // 记录初始状态
                    console.log('[Transform] 拖拽开始', { obj: selectedObject.name, mode: transformControl.mode, space: transformControl.space, axis: transformControl.axis, rot: `x:${(selectedObject.rotation.x*180/Math.PI).toFixed(1)} y:${(selectedObject.rotation.y*180/Math.PI).toFixed(1)} z:${(selectedObject.rotation.z*180/Math.PI).toFixed(1)}`, pos: `(${selectedObject.position.x.toFixed(2)}, ${selectedObject.position.y.toFixed(2)}, ${selectedObject.position.z.toFixed(2)})` }); // 打印拖拽诊断日志（轴错乱排查用）
                }
            } else { // 结束拖拽
                // 结束拖拽：比对并记录动作
                if (selectedObject && transformStartData) { // 有选中对象且存在初始状态
                    const currentData = saveTransformState(selectedObject); // 获取当前状态
                    if (!currentData.position.equals(transformStartData.position) || // 位置发生变化
                        !currentData.rotation.equals(transformStartData.rotation) || // 旋转发生变化
                        !currentData.scale.equals(transformStartData.scale)) { // 缩放发生变化
                        pushHistory(transformStartData, currentData); // 压入历史
                    }
                }
                justFinishedTransformDrag = true; // 标记拖拽刚结束
            }
        });
        scene.add(transformControl); // 将变换控制器加入场景
        raycaster = new THREE.Raycaster(); // 创建射线检测器
        mouse = new THREE.Vector2(); // 创建鼠标向量
        parkMasterGroup = new THREE.Group(); // 创建场景主组
        parkMasterGroup.name = "🏞️ 湖泊公园总场景"; // 设置主组名称
        scene.add(parkMasterGroup); // 主组加入场景
        if (buildSceneCallback) { // 存在构建回调
            console.log('[ModelEditor] 调用场景构建回调:', buildSceneCallback.name || 'anonymous'); // 打印回调名称
            buildSceneCallback(THREE, parkMasterGroup); // 调用场景构建函数
            cleanDuplicateLights(parkMasterGroup); // 加载后去除重复光照，只留一套光照
            console.log('[ModelEditor] 场景构建完成，子对象数:', parkMasterGroup.children.length); // 打印子对象数量
        }
        buildOutlinerTree(); // 构建大纲树
        // Click interaction logic
        let dragStartPos = { x: 0, y: 0 }; // 记录鼠标按下位置
        renderer.domElement.addEventListener('pointerdown', (e) => { // 绑定鼠标按下事件
            dragStartPos = { x: e.clientX, y: e.clientY }; // 记录按下坐标
        });
        renderer.domElement.addEventListener('pointerup', (e) => { // 绑定鼠标抬起事件
            if (transformControl.dragging) return; // 变换拖拽中忽略
            if (justFinishedTransformDrag) { justFinishedTransformDrag = false; return; } // 忽略刚结束的拖拽
            const dist = Math.hypot(e.clientX - dragStartPos.x, e.clientY - dragStartPos.y); // 计算拖动距离
            if (dist < 4) onCanvasClick(e); // 距离小于阈值视为点击
        });
        window.addEventListener('resize', onWindowResize); // 绑定窗口尺寸变化
        animate(); // 启动动画循环
    }
    function buildOutlinerTree() { // 构建场景大纲树
        const treeContainer = document.getElementById('outliner-tree'); // 获取树容器
        treeContainer.innerHTML = ''; // 清空容器
        let totalCount = 0; // 对象总数
        function renderNode(item, parentContainer) { // 递归渲染节点
            totalCount++; // 计数累加
            const isGroup = item.children && item.children.length > 0; // 判断是否为组
            const nodeWrapper = document.createElement('div'); // 创建节点包裹元素
            nodeWrapper.className = 'space-y-0.5'; // 设置包裹样式
            const header = document.createElement('div'); // 创建头部元素
            header.className = `tree-node group/item flex items-center justify-between px-2 py-1 rounded cursor-pointer text-slate-700 dark:text-slate-300 ${isGroup ? 'font-semibold' : ''}`; // 设置头部样式
            header.dataset.uuid = item.uuid; // 记录对象 uuid
            const itemName = item.name || '未命名对象'; // 获取对象名称
            const iconName = isGroup ? (item.children.some(c=>c.children?.length) ? 'folder-open' : 'layers') : 'box'; // 选择图标
            const iconColor = isGroup ? 'text-sky-500' : 'text-slate-400'; // 选择图标颜色
            header.innerHTML = `
                        <div class="flex items-center space-x-1.5 flex-1 min-w-0">
                            ${isGroup ? '<i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 transform transition-transform duration-200 toggle-arrow shrink-0"></i>' : '<span class="w-3.5"></span>'}
                            <i data-lucide="${iconName}" class="w-3.5 h-3.5 ${iconColor} shrink-0"></i>
                            <span class="truncate flex-1">${itemName} ${isGroup ? `(${item.children.length})` : ''}</span>
                        </div>
                        <button title="复制名称" onclick="event.stopPropagation(); copyToClipboard('${itemName.replace(/'/g, "\\'")}')" class="opacity-0 group-hover/item:opacity-100 hover:text-sky-500 p-0.5 rounded text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-opacity shrink-0">
                            <i data-lucide="copy" class="w-3 h-3"></i>
                        </button>
                    `; // 渲染节点头部 HTML
            header.addEventListener('click', (e) => { // 绑定节点点击事件
                if (e.target.closest && e.target.closest('.toggle-arrow')) return; // 点击展开/收起箭头时不触发选中
                e.stopPropagation(); // 阻止冒泡
                selectObject(item, true); // 选中对象并聚焦相机
            });
            nodeWrapper.appendChild(header); // 追加头部
            if (isGroup) { // 若是组
                const childList = document.createElement('div'); // 创建子列表
                childList.className = 'tree-child-list pl-3 space-y-0.5 border-l border-[var(--apple-border)] ml-2.5'; // 设置子列表样式
                item.children.forEach(child => renderNode(child, childList)); // 递归渲染子节点
                nodeWrapper.appendChild(childList); // 追加子列表
            }
            parentContainer.appendChild(nodeWrapper); // 追加节点到父容器
        }
        renderNode(parkMasterGroup, treeContainer); // 从主组开始渲染
        document.getElementById('tree-count-badge').innerText = `${totalCount} 个元素`; // 更新对象计数
        lucide.createIcons(); // 初始化图标
        // 事件委托处理箭头展开/收起：lucide.createIcons() 会用 <svg> 替换 <i>，导致原绑定在 <i> 上的点击监听器丢失，
        // 因此必须在容器上统一委托处理（仅绑定一次，避免 rebuildScene 重复调用时叠加监听器导致双击切换）。
        if (!treeContainer.dataset.arrowDelegated) { // 尚未绑定过委托
            treeContainer.dataset.arrowDelegated = '1'; // 标记已绑定
            treeContainer.addEventListener('click', (e) => { // 绑定容器点击委托
                const arrow = e.target.closest ? e.target.closest('.toggle-arrow') : null; // 查找命中的箭头
                if (!arrow) return; // 未命中箭头则忽略
                e.stopPropagation(); // 阻止冒泡
                const header = arrow.closest('.tree-node'); // 找到所在节点头
                const childList = header ? header.nextElementSibling : null; // 子列表是头部的下一个兄弟元素
                if (!childList) return; // 无子列表则忽略
                const isHidden = childList.style.display === 'none'; // 判断是否隐藏
                childList.style.display = isHidden ? 'block' : 'none'; // 切换显隐
                arrow.classList.toggle('-rotate-90', !isHidden); // 旋转箭头
            });
        }
    }
    function toggleAllTree(expand) { // 展开/折叠全部树节点
        document.querySelectorAll('.tree-child-list').forEach(list => { list.style.display = expand ? 'block' : 'none'; }); // 切换子列表显隐
        document.querySelectorAll('.toggle-arrow').forEach(arrow => { // 遍历箭头
            if (expand) arrow.classList.remove('-rotate-90'); // 展开时取消旋转
            else arrow.classList.add('-rotate-90'); // 折叠时旋转
        });
    }
    function filterTree(query) { // 大纲树搜索过滤
        const nodes = document.querySelectorAll('.tree-node'); // 获取所有节点
        const q = query.toLowerCase().trim(); // 规范化搜索词
        nodes.forEach(node => { // 遍历节点
            const text = node.innerText.toLowerCase(); // 获取节点文本
            node.style.display = text.includes(q) ? 'flex' : 'none'; // 按关键词显隐
        });
    }
    function onCanvasClick(event) { // 画布点击拾取
        const rect = renderer.domElement.getBoundingClientRect(); // 获取画布矩形
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1; // 计算归一化 x
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1; // 计算归一化 y
        raycaster.setFromCamera(mouse, camera); // 从相机发射射线
        const intersects = raycaster.intersectObjects([parkMasterGroup], true); // 检测相交对象
        if (intersects.length > 0) { // 命中对象
            let hitObj = intersects[0].object; // 取最近命中对象
            selectObject(hitObj, false); // 选中对象
        } else { // 未命中
            clearSelection(); // 取消选中
        }
    }
    function selectObject(obj, focusCamera = false) { // 选中对象
        clearSelection(); // 清除原有选中
        selectedObject = obj; // 记录选中对象
        highlightHelper = new THREE.BoxHelper(obj, 0x00f0ff); // 创建高亮框
        highlightHelper.material.linewidth = 3; // 设置线宽
        scene.add(highlightHelper); // 高亮框加入场景
        transformControl.attach(obj); // 变换控制器绑定对象
        const targetNode = document.querySelector(`[data-uuid="${obj.uuid}"]`); // 查找树节点
        if (targetNode) { // 节点存在
            targetNode.classList.add('selected'); // 高亮节点
            targetNode.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); // 滚动到可见区域
        }
        const name = obj.name || '未知对象'; // 获取对象名称
        document.getElementById('selected-info').innerHTML = `当前选中：<span class="text-sky-500 font-bold">${name}</span>`; // 更新选中信息
        const tInfo = document.getElementById('transform-info'); // 获取变换面板
        tInfo.classList.remove('hidden'); // 显示面板
        tInfo.classList.add('flex'); // 切换为弹性布局
        if (focusCamera) { // 需要聚焦相机
            const bbox = new THREE.Box3().setFromObject(obj); // 计算包围盒
            const center = bbox.getCenter(new THREE.Vector3()); // 获取中心
            const size = bbox.getSize(new THREE.Vector3()); // 获取尺寸
            const maxDim = Math.max(size.x, size.y, size.z, 2); // 取最大维度
            flyTo(center.x + maxDim * 1.8, center.y + maxDim * 1.8, center.z + maxDim * 1.8, center.x, center.y, center.z); // 飞行聚焦
        }
    }
    function clearSelection() { // 清除选中状态
        if (highlightHelper) { // 存在高亮框
            scene.remove(highlightHelper); // 移除高亮框
            highlightHelper.geometry.dispose(); // 释放几何体
            highlightHelper = null; // 置空引用
        }
        if (transformControl) transformControl.detach(); // 解除变换控制器绑定
        selectedObject = null; // 清空选中对象
        document.querySelectorAll('.tree-node.selected').forEach(node => node.classList.remove('selected')); // 移除节点高亮
        document.getElementById('selected-info').innerHTML = '当前选中：无'; // 重置选中信息
        const tInfo = document.getElementById('transform-info'); // 获取变换面板
        tInfo.classList.add('hidden'); // 隐藏面板
        tInfo.classList.remove('flex'); // 移除弹性布局
    }
    function setTransformMode(mode) { // 切换变换模式
        if (transformControl) transformControl.setMode(mode); // 设置变换模式
        document.getElementById('btn-translate').className = `btn btn-secondary !px-3 ${mode === 'translate' ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400' : ''}`; // 更新移动按钮样式
        document.getElementById('btn-rotate').className = `btn btn-secondary !px-3 ${mode === 'rotate' ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400' : ''}`; // 更新旋转按钮样式
        document.getElementById('btn-scale').className = `btn btn-secondary !px-3 ${mode === 'scale' ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400' : ''}`; // 更新缩放按钮样式
    }
    function flyTo(cx, cy, cz, tx, ty, tz) { // 相机飞行到指定位置
        targetCamPos.set(cx, cy, cz); // 设置目标位置
        targetCamLookAt.set(tx, ty, tz); // 设置注视点
        isFlying = true; // 开启飞行动画
    }
    function resetCamera() { // 复位相机视角
        clearSelection(); // 清除选中
        flyTo(-859.7, 643.7, -134.8, 0, 0, 0); // 飞行到全景视角
    }
    // 触发隐藏的文件选择器
    function importModel() { // 打开模型文件选择器（重建场景模式）
        importMode = 'replace'; // 设置导入模式为重建
        closeImportMenu(); // 关闭下拉菜单
        const fileInput = document.getElementById('model-file-input'); // 获取文件输入框
        if (fileInput) { // 输入框存在
            console.log('[模型导入] 打开文件选择器（重建场景）'); // 打印日志
            fileInput.click(); // 触发点击
        } else { // 输入框缺失
            console.error('[模型导入] 未找到文件选择器 #model-file-input'); // 打印错误
        }
    }
    // 附加导入：把新模型追加到现有场景，不清空当前场景
    function appendImportModel() { // 打开模型文件选择器（附加模式）
        importMode = 'append'; // 设置导入模式为附加
        closeImportMenu(); // 关闭下拉菜单
        const fileInput = document.getElementById('model-file-input'); // 获取文件输入框
        if (fileInput) { // 输入框存在
            console.log('[模型导入] 打开文件选择器（附加导入）'); // 打印日志
            fileInput.click(); // 触发点击
        } else { // 输入框缺失
            console.error('[模型导入] 未找到文件选择器 #model-file-input'); // 打印错误
        }
    }
    // 切换导入下拉菜单显隐
    function toggleImportMenu(event) { // 切换导入菜单
        if (event) event.stopPropagation(); // 阻止冒泡，避免触发外部关闭
        const menu = document.getElementById('import-menu'); // 获取菜单元素
        if (menu) menu.classList.toggle('hidden'); // 切换显隐
    }
    // 关闭导入下拉菜单
    function closeImportMenu() { // 关闭导入菜单
        const menu = document.getElementById('import-menu'); // 获取菜单元素
        if (menu) menu.classList.add('hidden'); // 隐藏菜单
    }
    // 导出当前场景为 GLB 模型文件
    function exportGLB() { // 导出 GLB 模型
        if (!parkMasterGroup || parkMasterGroup.children.length === 0) { // 场景为空时提示
            showToast('场景为空，无内容可导出'); // 显示空场景提示
            return; // 提前结束
        }
        try { // 开始导出
            const exporter = new THREE.GLTFExporter(); // 创建 GLTF 导出器
            const exportGroup = parkMasterGroup.clone(); // 克隆主组用于导出
            exporter.parse(exportGroup, function(gltf) { // 执行导出解析
                const blob = new Blob([gltf], { type: 'application/octet-stream' }); // 生成二进制 Blob
                const url = URL.createObjectURL(blob); // 创建临时下载链接
                const link = document.createElement('a'); // 创建下载链接元素
                link.href = url; // 设置链接地址
                link.download = 'scene.glb'; // 设置默认文件名
                document.body.appendChild(link); // 追加到页面
                link.click(); // 触发下载
                document.body.removeChild(link); // 移除链接元素
                URL.revokeObjectURL(url); // 释放对象 URL
                showToast('GLB 导出成功'); // 显示成功提示
            }, { binary: true }); // 指定导出为二进制 GLB 格式
        } catch (err) { // 导出过程出错
            console.error('[GLB 导出] 导出失败:', err); // 打印错误日志
            showToast('GLB 导出失败: ' + err.message); // 显示失败提示
        }
    }
    // 点击页面其他区域时关闭导入下拉菜单
    document.addEventListener('click', (e) => { // 绑定全局点击
        const menu = document.getElementById('import-menu'); // 获取菜单元素
        if (menu && !menu.classList.contains('hidden') && !e.target.closest('#import-menu') && !e.target.closest('[onclick="toggleImportMenu(event)"]')) { // 点击菜单外区域
            closeImportMenu(); // 关闭菜单
        }
    });
    // 用户选择 js 文件后：读取、执行脚本并重建/附加场景
    function handleModelFileSelected(file) { // 处理模型文件选择
        if (!file) return; // 无文件则返回
        console.log('[模型导入] 已选择文件:', file.name, '| 大小:', file.size, 'bytes', '| 模式:', importMode); // 打印文件信息
        const reader = new FileReader(); // 创建文件读取器
        reader.onload = (e) => { // 文件读取完成回调
            const code = e.target.result; // 获取文件代码文本
            console.log('[模型导入] 文件读取完成，代码长度:', code.length); // 打印代码长度
            try { // 开始执行
                // 记录导入前已存在的全局 build 函数，用于识别本次新增的构建函数
                const prevBuildKeys = Object.keys(window).filter(k => /^build/i.test(k)); // 收集已有 build 函数名
                console.log('[模型导入] 导入前已有 build 函数:', prevBuildKeys); // 打印已有函数
                // 清理残留的旧构建函数（不能用 delete：script 顶层函数声明在 window 上 configurable=false，delete 静默失败；改为赋 undefined 使 typeof 检查失效）
                ['buildMySchoolScene', 'buildMyParkScene'].forEach(n => { window[n] = undefined; }); // 清空默认场景函数
                // 使用内联 script 同步执行代码（避免 Blob URL 在 file:// 下加载失败或异步时序问题）
                const script = document.createElement('script'); // 创建内联脚本
                script.textContent = code; // 写入代码文本
                document.head.appendChild(script); // 追加到头部执行
                script.remove(); // 执行后移除
                console.log('[模型导入] 脚本执行完成'); // 打印执行完成日志
                const buildFn = findBuildFunction(prevBuildKeys, extractBuildFunctionNames(code)); // 查找构建函数
                if (buildFn) { // 找到构建函数
                    console.log('[模型导入] 匹配到构建函数:', buildFn.name); // 打印函数名
                    if (importMode === 'append') { // 附加模式
                        appendScene(buildFn); // 附加到现有场景
                        showToast(`附加导入成功: ${file.name} → ${buildFn.name}`); // 显示成功提示
                    } else { // 重建模式
                        rebuildScene(buildFn); // 重建场景
                        showToast(`导入成功: ${file.name} → ${buildFn.name}`); // 显示成功提示
                    }
                } else { // 未找到构建函数
                    console.warn('[模型导入] 未找到 (THREE, group) 签名的构建函数'); // 打印警告
                    showToast('导入失败: 未找到 (THREE, group) 签名的构建函数'); // 显示失败提示
                }
            } catch (err) { // 执行出错
                console.error('[模型导入] 执行脚本出错:', err); // 打印错误
                showToast('导入失败: ' + err.message); // 显示错误提示
            }
            // 重置 input 值，允许重复导入同一文件
            const fileInput = document.getElementById('model-file-input'); // 获取文件输入框
            if (fileInput) fileInput.value = ''; // 清空输入值
        };
        reader.onerror = (err) => { // 文件读取失败回调
            console.error('[模型导入] 文件读取失败:', err); // 打印错误
            showToast('导入失败: 文件读取错误'); // 显示错误提示
        };
        reader.readAsText(file); // 以文本方式读取文件
    }
    // 附加导入：把新构建函数生成的对象挂到现有主组下，不清空当前场景
    function appendScene(buildFn) { // 附加场景
        const appendGroup = new THREE.Group(); // 创建附加分组
        appendGroup.name = "📦 附加导入场景"; // 设置分组名称
        console.log('[模型导入] 调用构建函数（附加）:', buildFn.name); // 打印函数名
        buildFn(THREE, appendGroup); // 调用构建函数
        // 去除被导入模型自带的所有灯光（场景灯光由主场景统一管理，避免重复叠加）
        const lightsToRemove = []; // 收集待移除的灯光对象
        appendGroup.traverse((obj) => { // 遍历附加分组所有子对象
            if (obj.isLight) { // 灯光对象
                lightsToRemove.push(obj); // 记录灯光
            }
        });
        lightsToRemove.forEach((light) => { // 逐个移除灯光
            if (light.parent) light.parent.remove(light); // 从父节点移除
        });
        parkMasterGroup.add(appendGroup); // 附加分组挂到主组下
        // 统一关闭所有网格/线对象的视锥体裁切，防止缩小视角时大模型被误判剔除
        appendGroup.traverse((obj) => { // 遍历附加分组所有子对象
            if (obj.isMesh || obj.isLine) { // 网格或线对象
                obj.frustumCulled = false; // 关闭视锥体裁切
            }
        });
        clearSelection(); // 清除选中
        buildOutlinerTree(); // 重建大纲树
        console.log('[模型导入] 附加完成，主组子对象数:', parkMasterGroup.children.length); // 打印结果
    }
    // 从导入文件代码文本中提取 build 开头的函数名（优先匹配文件内声明的构建函数）
    function extractBuildFunctionNames(code) { // 提取文件内构建函数名
        const names = []; // 名称数组
        const re = /function\s+(build[A-Za-z0-9_]*)\s*\(/g; // 匹配函数声明正则
        let m; // 匹配结果
        while ((m = re.exec(code)) !== null) { // 循环匹配
            names.push(m[1]); // 记录函数名
        }
        return names; // 返回名称列表
    }
    // 查找模型构建函数：优先匹配文件内声明的函数，其次本次导入新增，再次已知名，最后兜底扫描
    function findBuildFunction(prevBuildKeys, fileBuildNames) { // 查找构建函数
        const prevKeys = prevBuildKeys || []; // 已有函数名列表
        // 0. 优先匹配文件内声明的 build 函数（最准确，解决重复导入误匹配）
        if (fileBuildNames && fileBuildNames.length) { // 存在文件内函数名
            for (const name of fileBuildNames) { // 遍历函数名
                const val = window[name]; // 获取全局函数
                if (typeof val === 'function' && val.length === 2) { // 校验双参函数
                    console.log('[模型导入] 文件内函数名匹配:', name); // 打印匹配日志
                    return val; // 返回函数
                }
            }
        }
        // 1. 本次导入新增的 build 函数（最准确）
        for (const key of Object.keys(window)) { // 遍历全局键
            if (prevKeys.includes(key)) continue; // 跳过已有函数
            const val = window[key]; // 获取函数值
            if (typeof val === 'function' && /^build/i.test(key) && val.length === 2) { // 校验新函数
                console.log('[模型导入] 匹配到本次新增函数:', key); // 打印匹配日志
                return val; // 返回函数
            }
        }
        // 2. 已知名（兜底：覆盖 school_model 全部模型构建函数）
        const knownNames = ['buildMySchoolScene', 'buildMyParkScene', 'buildMyVolleyballScene', 'buildGymnasiumModel', 'buildLibraryModel', 'buildCanteenModel', 'buildStadiumModel', 'buildFountainModel', 'buildTeachingBuildingModel']; // 已知构建函数清单
        for (const name of knownNames) { // 遍历已知名
            if (typeof window[name] === 'function') { // 校验函数存在
                console.log('[模型导入] 已知名匹配:', name); // 打印匹配日志
                return window[name]; // 返回函数
            }
        }
        // 3. 兜底扫描全部全局 build 双参函数
        for (const key of Object.keys(window)) { // 遍历全局键
            const val = window[key]; // 获取函数值
            if (typeof val === 'function' && /^build/i.test(key) && val.length === 2) { // 校验双参函数
                console.log('[模型导入] 兜底扫描匹配:', key); // 打印匹配日志
                return val; // 返回函数
            }
        }
        console.warn('[模型导入] 未扫描到任何 build 开头且双参的全局函数'); // 打印警告
        return null; // 返回空
    }
    function cleanDuplicateLights(targetGroup) { // 去除重复光照，只留一套光照
        const lightsSeen = {}; // 记录已保留的光照类型
        const lightsToRemove = []; // 待移除的重复光照对象
        targetGroup.traverse((obj) => { // 遍历所有子节点
            if (obj.isLight) { // 判断是否为光照对象
                const lightType = obj.type || 'Light'; // 获取光照类型
                if (lightsSeen[lightType]) { // 已存在该类型的光照
                    lightsToRemove.push(obj); // 记录待移除
                } else { // 首次遇到该类型光照
                    lightsSeen[lightType] = true; // 标记已保留
                }
            }
        });
        lightsToRemove.forEach((light) => { // 逐个移除重复光照
            console.log('[ModelEditor] 移除重复光照:', light.name || light.type); // 打印移除日志
            if (light.parent) light.parent.remove(light); // 从父组中移除
        });
    }
    function rebuildScene(buildFn) { // 重建场景
        if (parkMasterGroup) { // 存在旧主组
            console.log('[模型导入] 移除旧场景，子对象数:', parkMasterGroup.children.length); // 打印旧场景信息
            scene.remove(parkMasterGroup); // 移除旧主组
            parkMasterGroup.traverse((obj) => { // 遍历所有子对象
                if (obj.geometry) obj.geometry.dispose(); // 释放几何体
                if (obj.material) { // 存在材质
                    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]; // 归一化材质数组
                    mats.forEach(m => m.dispose()); // 释放材质
                }
            });
        }
        parkMasterGroup = new THREE.Group(); // 创建新主组
        parkMasterGroup.name = "🏞️ 场景主组"; // 设置主组名称
        scene.add(parkMasterGroup); // 加入场景
        if (buildFn) { // 存在构建函数
            console.log('[模型导入] 调用构建函数:', buildFn.name); // 打印函数名
            buildFn(THREE, parkMasterGroup); // 调用构建函数
            cleanDuplicateLights(parkMasterGroup); // 加载后去除重复光照，只留一套光照
            console.log('[模型导入] 构建完成，场景子对象数:', parkMasterGroup.children.length); // 打印构建结果
        }
        // 统一关闭所有网格/线对象的视锥体裁切，防止缩小视角时大模型被误判剔除
        parkMasterGroup.traverse((obj) => { // 遍历主组所有子对象
            if (obj.isMesh || obj.isLine) { // 网格或线对象
                obj.frustumCulled = false; // 关闭视锥体裁切
            }
        });
        clearSelection(); // 清除选中
        buildOutlinerTree(); // 重建大纲树
        resetCamera(); // 复位视角
    }
    function copyTransform(type) { // 复制变换数值
        if (!selectedObject) return; // 无选中对象则返回
        let text = ""; // 待复制文本
        if (type === 'pos') { // 位置类型
            text = `${selectedObject.position.x.toFixed(2)}, ${selectedObject.position.y.toFixed(2)}, ${selectedObject.position.z.toFixed(2)}`; // 格式化坐标
        } else if (type === 'rot') { // 旋转类型
            const rx = (selectedObject.rotation.x * 180 / Math.PI).toFixed(2); // 换算角度 x
            const ry = (selectedObject.rotation.y * 180 / Math.PI).toFixed(2); // 换算角度 y
            const rz = (selectedObject.rotation.z * 180 / Math.PI).toFixed(2); // 换算角度 z
            text = `${rx}, ${ry}, ${rz}`; // 格式化旋转值
        } else if (type === 'scale') { // 缩放类型
            text = `${selectedObject.scale.x.toFixed(2)}, ${selectedObject.scale.y.toFixed(2)}, ${selectedObject.scale.z.toFixed(2)}`; // 格式化缩放值
        }
        copyToClipboard(text); // 复制到剪贴板
    }
    function copyToClipboard(text) { // 复制文本到剪贴板
        const textarea = document.createElement('textarea'); // 创建临时文本框
        textarea.value = text; // 写入文本
        textarea.style.position = 'fixed'; // 固定定位
        textarea.style.opacity = '0'; // 透明不可见
        document.body.appendChild(textarea); // 追加到页面
        textarea.select(); // 全选文本
        try { // 执行复制
            document.execCommand('copy'); // 复制命令
            showToast(`已复制: "${text}"`); // 显示成功提示
        } catch (err) { // 复制失败
            showToast('复制失败'); // 显示失败提示
        }
        document.body.removeChild(textarea); // 移除临时文本框
    }
    function showToast(msg) { // 显示 Toast 提示
        const toast = document.getElementById('toast-notify'); // 获取 Toast 元素
        document.getElementById('toast-msg').innerText = msg; // 设置提示文本
        toast.classList.remove('opacity-0', 'translate-y-[-10px]', 'pointer-events-none'); // 移除隐藏类
        toast.classList.add('opacity-100', 'translate-y-0'); // 显示 Toast
        setTimeout(() => { // 定时隐藏
            toast.classList.remove('opacity-100', 'translate-y-0'); // 移除显示类
            toast.classList.add('opacity-0', 'translate-y-[-10px]', 'pointer-events-none'); // 恢复隐藏
        }, 2000); // 2 秒后隐藏
    }
    function onWindowResize() { // 窗口尺寸变化处理
        const container = document.getElementById('canvas-container'); // 获取画布容器
        camera.aspect = container.clientWidth / container.clientHeight; // 更新相机宽高比
        camera.updateProjectionMatrix(); // 更新投影矩阵
        renderer.setSize(container.clientWidth, container.clientHeight); // 更新渲染尺寸
    }
    const statusEl = document.getElementById('camera-status'); // 获取相机状态元素
    function animate() { // 动画循环
        requestAnimationFrame(animate); // 递归请求下一帧
        if (isFlying) { // 飞行动画进行中
            camera.position.lerp(targetCamPos, 0.06); // 位置插值
            controls.target.lerp(targetCamLookAt, 0.06); // 注视点插值
            if (camera.position.distanceTo(targetCamPos) < 0.1) isFlying = false; // 接近目标后停止
        }
        if (highlightHelper && selectedObject) { // 存在选中对象
            highlightHelper.update(); // 更新高亮框
            document.getElementById('pos-val').innerText = `${selectedObject.position.x.toFixed(2)}, ${selectedObject.position.y.toFixed(2)}, ${selectedObject.position.z.toFixed(2)}`; // 更新坐标显示
            const rx = (selectedObject.rotation.x * 180 / Math.PI).toFixed(2); // 换算旋转 x
            const ry = (selectedObject.rotation.y * 180 / Math.PI).toFixed(2); // 换算旋转 y
            const rz = (selectedObject.rotation.z * 180 / Math.PI).toFixed(2); // 换算旋转 z
            document.getElementById('rot-val').innerText = `${rx}°, ${ry}°, ${rz}°`; // 更新旋转显示
            document.getElementById('scale-val').innerText = `${selectedObject.scale.x.toFixed(2)}, ${selectedObject.scale.y.toFixed(2)}, ${selectedObject.scale.z.toFixed(2)}`; // 更新缩放显示
        }
        controls.update(); // 更新轨道控制器
        // 执行模型暴露的动态更新函数（如喷泉粒子动画）
        if (parkMasterGroup && parkMasterGroup.userData.updatables) { // 存在动态更新函数
            parkMasterGroup.userData.updatables.forEach(fn => fn()); // 逐个执行更新函数
        }
        renderer.render(scene, camera); // 渲染场景
        if (Math.random() > 0.95) { // 概率刷新相机状态
            statusEl.innerText = `视角坐标: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)})`; // 更新视角坐标显示
        }
    }
    init3D(buildSceneCallback); // 初始化 3D 场景
}
