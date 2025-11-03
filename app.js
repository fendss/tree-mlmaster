// 全局状态
const state = {
    competitions: [],
    currentCompetition: null,
    currentTree: null,
    selectedNode: null,
    isPlaying: false,
    playTimeout: null,
    currentNodeIndex: 0,
    nodeSequence: [],
    previousNode: null, // 记录上一个节点用于比较变化
    playbackSpeed: 1.0, // 播放速度倍数
    tabNavigationIndex: -1, // Tab键导航的当前节点索引（-1表示未开始）
    staticDFSSequence: [], // 静态模式下的DFS序列
    highlightedNodesSequence: [], // 高亮节点序列（metric大于所有祖先的节点）
    highlightedNavigationIndex: -1, // 高亮节点导航的当前索引（-1表示未开始）
    isHighlightView: false, // 是否显示简化树（只显示高亮节点和根节点的直接子节点）
    originalTree: null // 保存原始完整树
};

// DOM元素
const elements = {
    competitionSelector: document.getElementById('competition-selector'),
    treeViewer: document.getElementById('tree-viewer'),
    competitionGrid: document.getElementById('competition-grid'),
    searchInput: document.getElementById('search-input'),
    backBtn: document.getElementById('back-btn'),
    competitionTitle: document.getElementById('competition-title'),
    treeSvg: document.getElementById('tree-svg'),
    nodeDetails: document.getElementById('node-details'),
    resetViewBtn: document.getElementById('reset-view-btn'),
    fitScreenBtn: document.getElementById('fit-screen-btn'),
    playBtn: document.getElementById('play-btn'),
    playIcon: document.getElementById('play-icon'),
    pauseIcon: document.getElementById('pause-icon'),
    playbackPanel: document.getElementById('playback-panel'),
    playbackChanges: document.getElementById('playback-changes'),
    currentNodeIndicator: document.getElementById('current-node-indicator'),
    totalNodesIndicator: document.getElementById('total-nodes-indicator'),
    playbackSpeed: document.getElementById('playback-speed'),
    highlightViewBtn: document.getElementById('highlight-view-btn')
};

const DETAILS_PLACEHOLDER_HTML = `
    <div class="details-placeholder fancy">
        <div class="placeholder-orb"></div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M12 20c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8Z" opacity="0.4"/>
            <path d="M12 8v4l2.5 2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h3>尚未选择节点</h3>
        <p>在左侧树结构里点击任何节点，即可查看它的计划、代码与分析详情。</p>
    </div>
`;

// 初始化应用
async function init() {
    await loadCompetitions();
    renderCompetitionGrid(state.competitions);
    setupEventListeners();
    setupResizeHandle();
    resetNodeDetails();
}

// 加载所有比赛数据
async function loadCompetitions() {
    const filenames = [
        '3d-object-detection-for-autonomous-vehicles_nodes.json',
        'aerial-cactus-identification_nodes.json',
        'AI4Code_nodes.json',
        'alaska2-image-steganalysis_nodes.json',
        'aptos2019-blindness-detection_nodes.json',
        'billion-word-imputation_nodes.json',
        'bms-molecular-translation_nodes.json',
        'cassava-leaf-disease-classification_nodes.json',
        'cdiscount-image-classification-challenge_nodes.json',
        'chaii-hindi-and-tamil-question-answering_nodes.json',
        'champs-scalar-coupling_nodes.json',
        'denoising-dirty-documents_nodes.json',
        'detecting-insults-in-social-commentary_nodes.json',
        'dog-breed-identification_nodes.json',
        'dogs-vs-cats-redux-kernels-edition_nodes.json',
        'facebook-recruiting-iii-keyword-extraction_nodes.json',
        'freesound-audio-tagging-2019_nodes.json',
        'google-quest-challenge_nodes.json',
        'google-research-identify-contrails-reduce-global-warming_nodes.json',
        'h-and-m-personalized-fashion-recommendations_nodes.json',
        'herbarium-2020-fgvc7_nodes.json',
        'herbarium-2021-fgvc8_nodes.json',
        'herbarium-2022-fgvc9_nodes.json',
        'histopathologic-cancer-detection_nodes.json',
        'hms-harmful-brain-activity-classification_nodes.json',
        'hotel-id-2021-fgvc8_nodes.json',
        'hubmap-kidney-segmentation_nodes.json',
        'icecube-neutrinos-in-deep-ice_nodes.json',
        'imet-2020-fgvc7_nodes.json',
        'inaturalist-2019-fgvc6_nodes.json',
        'iwildcam-2019-fgvc6_nodes.json',
        'iwildcam-2020-fgvc7_nodes.json',
        'jigsaw-toxic-comment-classification-challenge_nodes.json',
        'jigsaw-unintended-bias-in-toxicity-classification_nodes.json',
        'kuzushiji-recognition_nodes.json',
        'leaf-classification_nodes.json',
        'learning-agency-lab-automated-essay-scoring-2_nodes.json',
        'lmsys-chatbot-arena_nodes.json',
        'mlsp-2013-birds_nodes.json',
        'multi-modal-gesture-recognition_nodes.json',
        'new-york-city-taxi-fare-prediction_nodes.json',
        'nfl-player-contact-detection_nodes.json',
        'nomad2018-predict-transparent-conductors_nodes.json',
        'osic-pulmonary-fibrosis-progression_nodes.json',
        'petfinder-pawpularity-score_nodes.json',
        'plant-pathology-2020-fgvc7_nodes.json',
        'plant-pathology-2021-fgvc8_nodes.json',
        'predict-volcanic-eruptions-ingv-oe_nodes.json',
        'random-acts-of-pizza_nodes.json',
        'ranzcr-clip-catheter-line-classification_nodes.json',
        'rsna-2022-cervical-spine-fracture-detection_nodes.json',
        'rsna-breast-cancer-detection_nodes.json',
        'rsna-miccai-brain-tumor-radiogenomic-classification_nodes.json',
        'siim-covid19-detection_nodes.json',
        'seti-breakthrough-listen_nodes.json',
        'siim-isic-melanoma-classification_nodes.json',
        'smartphone-decimeter-2022_nodes.json',
        'spooky-author-identification_nodes.json',
        'stanford-covid-vaccine_nodes.json',
        'statoil-iceberg-classifier-challenge_nodes.json',
        'tabular-playground-series-dec-2021_nodes.json',
        'tabular-playground-series-may-2022_nodes.json',
        'tensorflow-speech-recognition-challenge_nodes.json',
        'tensorflow2-question-answering_nodes.json',
        'text-normalization-challenge-english-language_nodes.json',
        'text-normalization-challenge-russian-language_nodes.json',
        'tgs-salt-identification-challenge_nodes.json',
        'the-icml-2013-whale-challenge-right-whale-redux_nodes.json',
        'tweet-sentiment-extraction_nodes.json',
        'us-patent-phrase-to-phrase-matching_nodes.json',
        'uw-madison-gi-tract-image-segmentation_nodes.json',
        'ventilator-pressure-prediction_nodes.json',
        'vesuvius-challenge-ink-detection_nodes.json',
        'vinbigdata-chest-xray-abnormalities-detection_nodes.json',
        'whale-categorization-playground_nodes.json'
    ];
    
    const competitions = await Promise.all(
        filenames.map(async (filename) => {
            try {
                const response = await fetch(`struct_out/${filename}`);
                const data = await response.json();
                const competitionId = data[0]?.[0]?.demo_id || filename.replace('_nodes.json', '');
                const nodeCount = data.flat().length;
                
                return {
                    id: competitionId,
                    filename: filename,
                    nodeCount: nodeCount,
                    displayName: formatCompetitionName(competitionId)
                };
            } catch (error) {
                console.error(`Error loading ${filename}:`, error);
                return null;
            }
        })
    );
    
    state.competitions = competitions.filter(c => c !== null).sort((a, b) => a.displayName.localeCompare(b.displayName));
}

// 格式化比赛名称
function formatCompetitionName(id) {
    return id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// 渲染比赛网格
function renderCompetitionGrid(competitions) {
    elements.competitionGrid.innerHTML = '';
    
    competitions.forEach(comp => {
        const card = document.createElement('div');
        card.className = 'competition-card';
        card.innerHTML = `
            <h3>${comp.displayName}</h3>
            <div class="card-meta">
                <span>📊 ${comp.nodeCount} nodes</span>
            </div>
        `;
        card.addEventListener('click', () => selectCompetition(comp));
        elements.competitionGrid.appendChild(card);
    });
}

// 选择比赛
async function selectCompetition(competition) {
    state.currentCompetition = competition;
    elements.competitionTitle.textContent = competition.displayName;
    
    // 停止任何正在进行的播放
    stopPlayback();
    
    // 重置视图模式
    state.isHighlightView = false;
    if (elements.highlightViewBtn) {
        elements.highlightViewBtn.classList.remove('active');
    }
    
    try {
        const response = await fetch(`struct_out/${competition.filename}`);
        const data = await response.json();
        state.originalTree = buildTreeStructure(data);
        state.currentTree = state.originalTree;
        
        resetNodeDetails();
        showPage('tree-viewer');
        setTimeout(() => renderTree(state.currentTree), 100);
    } catch (error) {
        console.error('Error loading competition data:', error);
        alert('Failed to load competition data');
    }
}

// 构建树结构
function buildTreeStructure(data) {
    const flatNodes = data.flat();
    const nodeMap = new Map();
    
    // 创建节点
    flatNodes.forEach(node => {
        if (!nodeMap.has(node.node_index)) {
            nodeMap.set(node.node_index, { ...node, children: [] });
        }
    });
    
    // 建立父子关系
    const roots = [];
    flatNodes.forEach(node => {
        const current = nodeMap.get(node.node_index);
        if (node.parent_index === null || node.parent_index === undefined || node.parent_index === 0) {
            if (!roots.includes(current)) roots.push(current);
        } else {
            const parent = nodeMap.get(node.parent_index);
            if (parent && !parent.children.includes(current)) {
                parent.children.push(current);
            }
        }
    });
    
    console.log(`✅ 加载 ${nodeMap.size} 节点, ${roots.length} 根节点`);
    
    // 多个根节点时创建虚拟根
    if (roots.length > 1) {
        return {
            node_index: 'root',
            demo_id: flatNodes[0].demo_id,
            children: roots,
            is_virtual: true
        };
    }
    
    return roots[0] || nodeMap.values().next().value;
}

// 构建简化树（只包含根节点和高亮节点，保留高亮节点之间的路径）
function buildHighlightTree(originalTree, highlightedNodeIndices) {
    if (!originalTree) return originalTree;
    
    const highlightedSet = new Set(highlightedNodeIndices || []);
    console.log('🔍 buildHighlightTree - highlighted nodes:', Array.from(highlightedSet));
    
    // 创建节点映射
    const nodeMap = new Map();
    function collectNodes(node) {
        if (!node) return;
        nodeMap.set(node.node_index, node);
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => collectNodes(child));
        }
    }
    collectNodes(originalTree);
    
    // 收集所有需要保留的节点：根节点 + 高亮节点 + 根节点的第一个非bug子节点
    const nodesToKeep = new Set();
    nodesToKeep.add(originalTree.node_index); // 根节点
    highlightedNodeIndices?.forEach(index => nodesToKeep.add(index)); // 高亮节点
    
    // 添加根节点的第一个非bug子节点
    if (originalTree.children && Array.isArray(originalTree.children) && originalTree.children.length > 0) {
        const firstNonBugChild = originalTree.children.find(child => {
            return child && (child.is_bug !== 'True' && child.is_bug !== true);
        });
        if (firstNonBugChild && !highlightedSet.has(firstNonBugChild.node_index)) {
            nodesToKeep.add(firstNonBugChild.node_index);
            console.log('✨ Added first non-bug child:', firstNonBugChild.node_index);
        }
    }
    
    console.log('📊 Nodes to keep:', Array.from(nodesToKeep));
    
    // 为每个保留节点找到其在简化树中的父节点（向上查找最近的保留节点）
    function findParentInSimplifiedTree(nodeIndex) {
        const node = nodeMap.get(nodeIndex);
        if (!node) return originalTree.node_index;
        
        // 从父节点开始向上查找（不包括自己）
        let currentNode = node;
        while (currentNode && currentNode.parent_index) {
            currentNode = nodeMap.get(currentNode.parent_index);
            if (!currentNode) break;
            
            // 如果是根节点，返回根节点
            if (currentNode.node_index === originalTree.node_index || currentNode.node_index === 'root') {
                return originalTree.node_index;
            }
            
            // 如果当前节点在保留集合中，返回该节点
            if (nodesToKeep.has(currentNode.node_index)) {
                return currentNode.node_index;
            }
        }
        
        return originalTree.node_index;
    }
    
    // 构建父子关系映射
    const parentMap = new Map();
    nodesToKeep.forEach(nodeIndex => {
        if (nodeIndex !== originalTree.node_index && nodeIndex !== 'root') {
            const parent = findParentInSimplifiedTree(nodeIndex);
            if (parent !== nodeIndex) {
                parentMap.set(nodeIndex, parent);
                console.log(`🔗 ${nodeIndex} -> ${parent}`);
            }
        }
    });
    
    console.log('🔗 Parent map:', Array.from(parentMap.entries()));
    
    // 构建简化树
    function buildSimplifiedNode(nodeIndex) {
        if (!nodesToKeep.has(nodeIndex)) return null;
        
        const node = nodeMap.get(nodeIndex);
        if (!node) return null;
        
        const simplifiedNode = { ...node, children: [] };
        
        // 找到所有以当前节点为父节点的子节点
        const childIndices = [];
        parentMap.forEach((parentIndex, childIndex) => {
            if (parentIndex === nodeIndex) {
                childIndices.push(childIndex);
            }
        });
        
        console.log(`📦 Node ${nodeIndex} has children:`, childIndices);
        
        // 递归构建子节点
        simplifiedNode.children = childIndices
            .map(childIndex => buildSimplifiedNode(childIndex))
            .filter(Boolean);
        
        return simplifiedNode;
    }
    
    const result = buildSimplifiedNode(originalTree.node_index || 'root');
    console.log('🌳 Result tree:', result);
    return result;
}

// 切换视图模式（完整树 vs 简化树）
function toggleHighlightView() {
    if (!state.originalTree) {
        console.warn('⚠️ No original tree available');
        return;
    }
    
    // 停止播放
    if (state.isPlaying) {
        stopPlayback();
    }
    
    // 切换视图模式
    state.isHighlightView = !state.isHighlightView;
    
    // 更新按钮状态
    if (elements.highlightViewBtn) {
        if (state.isHighlightView) {
            elements.highlightViewBtn.classList.add('active');
        } else {
            elements.highlightViewBtn.classList.remove('active');
        }
    }
    
    // 根据模式选择要渲染的树
    if (state.isHighlightView) {
        // 如果高亮节点序列还没有构建，先构建一次完整树来生成序列
        if (!state.highlightedNodesSequence || state.highlightedNodesSequence.length === 0) {
            console.log('⚠️ Highlighted nodes sequence not built yet, building it now...');
            // 先渲染一次完整树来构建高亮节点序列
            renderTree(state.originalTree);
            // 等待序列构建完成
            setTimeout(() => {
                const highlightedIndices = state.highlightedNodesSequence.map(n => n.node_index);
                state.currentTree = buildHighlightTree(state.originalTree, highlightedIndices);
                resetNodeDetails();
                setTimeout(() => renderTree(state.currentTree), 100);
            }, 200);
            return;
        }
        
        // 构建简化树
        const highlightedIndices = state.highlightedNodesSequence.map(n => n.node_index);
        console.log('✨ Building highlight tree with indices:', highlightedIndices);
        state.currentTree = buildHighlightTree(state.originalTree, highlightedIndices);
        console.log('✨ Switched to highlight view');
    } else {
        // 恢复完整树
        state.currentTree = state.originalTree;
        console.log('📋 Switched to full tree view');
    }
    
    // 重新渲染树
    resetNodeDetails();
    setTimeout(() => renderTree(state.currentTree), 100);
}

// 构建DFS遍历序列
function buildDFSSequence(root) {
    const sequence = [];
    
    function dfs(node) {
        if (!node) return;
        
        // 虚拟根节点也加入序列（作为第一个节点）
        sequence.push(node);
        
        // 继续遍历子节点
        if (node.children && Array.isArray(node.children)) {
            node.children.forEach(child => dfs(child));
        }
    }
    
    dfs(root);
    console.log(`🔍 DFS sequence: ${sequence.length} nodes`, sequence.map(n => n.node_index));
    return sequence;
}

// 停止播放
function stopPlayback() {
    if (state.playTimeout) {
        clearTimeout(state.playTimeout);
        state.playTimeout = null;
    }
    state.isPlaying = false;
    state.currentNodeIndex = 0;
    state.previousNode = null;
    
    // 隐藏播放面板
    if (elements.playbackPanel) {
        elements.playbackPanel.style.display = 'none';
        document.querySelector('.viewer-content')?.classList.remove('playback-active');
    }
    
    // 显示节点详情面板
    if (elements.nodeDetails) {
        elements.nodeDetails.style.display = 'flex';
    }
    
    // 清除所有节点的playing状态
    d3.select('#tree-svg').selectAll('.node').classed('playing', false);
    
    // 清除所有连线的高亮状态
    d3.select('#tree-svg').selectAll('.link').classed('link-flash', false);
    
    if (elements.playIcon && elements.pauseIcon) {
        elements.playIcon.style.display = 'block';
        elements.pauseIcon.style.display = 'none';
    }
    if (elements.playBtn) {
        elements.playBtn.classList.remove('playing');
    }
}

// 开始播放动画
function startPlayback() {
    console.log('🎬 startPlayback called');
    console.log('Current tree:', state.currentTree);
    
    if (!state.currentTree) {
        console.warn('❌ No current tree available');
        return;
    }
    
    // 如果已经在播放，则暂停
    if (state.isPlaying) {
        console.log('⏸️ Pausing playback');
        stopPlayback();
        return;
    }
    
    // 构建DFS序列
    state.nodeSequence = buildDFSSequence(state.currentTree);
    console.log(`📋 DFS sequence built: ${state.nodeSequence.length} nodes`);
    
    if (state.nodeSequence.length === 0) {
        console.warn('⚠️ No nodes to play');
        return;
    }
    
    state.isPlaying = true;
    state.currentNodeIndex = 0;
    state.previousNode = null;
    
    // 显示播放面板
    if (elements.playbackPanel) {
        elements.playbackPanel.style.display = 'block';
        document.querySelector('.viewer-content').classList.add('playback-active');
    }
    
    // 隐藏节点详情面板
    if (elements.nodeDetails) {
        elements.nodeDetails.style.display = 'none';
    }
    
    if (elements.totalNodesIndicator) {
        elements.totalNodesIndicator.textContent = state.nodeSequence.length;
    }
    
    if (elements.playIcon && elements.pauseIcon) {
        elements.playIcon.style.display = 'none';
        elements.pauseIcon.style.display = 'block';
    }
    if (elements.playBtn) {
        elements.playBtn.classList.add('playing');
    }
    
    console.log('🔄 Rendering tree for playback...');
    // 先渲染整个树（隐藏所有节点）
    renderTreeForPlayback(state.currentTree);
    
    // 开始播放序列
    console.log('▶️ Starting playback sequence...');
    
    // 先跟踪根节点（第一个节点）
    if (state.nodeSequence.length > 0) {
        const rootNode = state.nodeSequence[0];
        const rootNodeIndex = rootNode.node_index;
        console.log('📍 Tracking root node: ' + rootNodeIndex);
        
        // 延迟一小段时间，确保树已经渲染完成
        setTimeout(() => {
            const rootNodeGroup = d3.select(`#tree-svg [data-node-index="${rootNodeIndex}"]`);
            if (!rootNodeGroup.empty()) {
                const rootNodeData = rootNodeGroup.datum();
                trackNodeToCenter(rootNodeIndex, rootNodeData);
                
                // 显示根节点
                rootNodeGroup.transition()
                    .duration(400)
                    .style('opacity', 1);
                rootNodeGroup.select('text')
                    .transition()
                    .delay(200)
                    .duration(300)
                    .style('opacity', 0.95);
                rootNodeGroup.classed('playing', true);
            }
        }, 500);
    }
    
    const initialDelay = Math.round(800 / state.playbackSpeed);
    setTimeout(() => playNextNode(), initialDelay + 1000); // 延迟更长时间，确保根节点已经跟踪完成
}

// 为播放模式渲染树（初始隐藏所有节点）
function renderTreeForPlayback(root) {
    const svg = d3.select('#tree-svg');
    svg.selectAll('*').remove();

    const rect = elements.treeSvg.getBoundingClientRect();
    const width = rect.width || elements.treeSvg.clientWidth || 960;
    const height = rect.height || elements.treeSvg.clientHeight || 620;

    const defs = svg.append('defs');

    const gradient = defs.append('linearGradient')
        .attr('id', 'tree-link-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', width)
        .attr('y2', 0); // 改回水平渐变
    gradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(96,165,250,0.75)');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(129,140,248,0.65)');
    
    // 高亮路径的渐变（更亮的紫色）
    const highlightGradient = defs.append('linearGradient')
        .attr('id', 'tree-link-gradient-highlight')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', width)
        .attr('y2', 0);
    highlightGradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(167,139,250,0.9)');
    highlightGradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(196,181,253,0.85)');

    const glow = defs.append('filter')
        .attr('id', 'node-glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    glow.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '4')
        .attr('result', 'coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const shadow = defs.append('filter')
        .attr('id', 'node-shadow')
        .attr('x', '-40%')
        .attr('y', '-40%')
        .attr('width', '200%')
        .attr('height', '200%');
    shadow.append('feDropShadow')
        .attr('dx', 0)
        .attr('dy', 4)
        .attr('stdDeviation', 4)
        .attr('flood-color', 'rgba(15,23,42,0.75)');

    const g = svg.append('g').attr('class', 'tree-root');

    // 先创建hierarchy来分析树的大小
    const hierarchyRoot = d3.hierarchy(root);
    
    // 分析树的大小：节点数量、最大深度、叶子节点数量
    const nodes = hierarchyRoot.descendants();
    const nodeCount = nodes.length;
    const maxDepth = d3.max(nodes, d => d.depth) || 0;
    const leafCount = nodes.filter(d => !d.children || d.children.length === 0).length;
    
    // 根据树的大小自适应计算间距
    // 水平间距（长度）：根据深度和节点数量调整，基础值220px，根据深度增加
    const baseHorizontalSpacing = 220;
    const depthMultiplier = Math.max(1, Math.min(1.5, maxDepth / 5)); // 深度影响系数
    const nodeMultiplier = Math.max(1, Math.min(1.3, nodeCount / 30)); // 节点数量影响系数
    const horizontalSpacing = Math.round(baseHorizontalSpacing * depthMultiplier * nodeMultiplier);
    
    // 垂直间距（宽度）：根据叶子节点数量调整，基础值120px（继续增大间距）
    const baseVerticalSpacing = 120;
    const leafMultiplier = Math.max(0.8, Math.min(1.5, leafCount / 10)); // 叶子节点影响系数
    const verticalSpacing = Math.round(baseVerticalSpacing * leafMultiplier);
    
    console.log(`🌳 Tree stats: ${nodeCount} nodes, depth ${maxDepth}, ${leafCount} leaves`);
    console.log(`📐 Spacing: horizontal ${horizontalSpacing}px, vertical ${verticalSpacing}px`);

    // 创建紧凑的树布局，自然下垂效果（水平布局）
    const treeLayout = d3.tree()
        .nodeSize([verticalSpacing, horizontalSpacing]) // 交换：垂直间距在前，水平间距在后
        .separation((a, b) => {
            // 自定义分离函数：让树更自然
            // 如果是兄弟节点，间距适中
            if (a.parent === b.parent) {
                // 根据深度调整：越深越紧凑，但不要太紧凑
                const depth = a.depth || 0;
                return 0.75 + (depth * 0.05); // 0.75-0.95之间，更自然
            }
            // 其他情况使用默认值
            return 1;
        });
    treeLayout(hierarchyRoot);
    const links = hierarchyRoot.links();

    const minX = d3.min(nodes, d => d.x) ?? 0;
    const maxX = d3.max(nodes, d => d.x) ?? 0;
    const minY = d3.min(nodes, d => d.y) ?? 0;
    const maxY = d3.max(nodes, d => d.y) ?? 0;

    const treeWidth = Math.max(1, maxY - minY); // 水平布局：宽度是y方向
    const treeHeight = Math.max(1, maxX - minX); // 水平布局：高度是x方向
    const availableWidth = Math.max(240, width - 240);
    const availableHeight = Math.max(200, height - 200);
    // 播放模式下使用更大的初始缩放，确保树足够大
    const initialScale = Math.min(4.0, Math.max(1.5, Math.min(availableWidth / treeWidth, availableHeight / treeHeight) * 1.8));

    const translateX = width / 2 - ((minY + treeWidth / 2) * initialScale); // 水平布局：y居中
    const translateY = height / 2 - ((minX + treeHeight / 2) * initialScale); // 水平布局：x居中

    const linkGenerator = d3.linkHorizontal() // 改回horizontal
        .x(d => d.y)  // 水平布局：x是y
        .y(d => d.x); // 水平布局：y是x

    // 为每个hierarchy节点添加高亮标记
    nodes.forEach(node => {
        node.isHighlighted = isMetricBetterThanAllAncestors(node);
    });
    
    // 找到所有高亮节点，并标记从根到这些节点的路径
    const highlightedNodes = nodes.filter(node => node.isHighlighted);
    const pathNodeIndices = new Set(); // 存储路径上所有节点的索引
    const pathLinkPairs = new Set(); // 存储路径上的连线对 (sourceIndex-targetIndex)
    
    // 对于每个高亮节点，找到从根到它的路径
    highlightedNodes.forEach(highlightedNode => {
        let currentNode = highlightedNode;
        // 从当前节点向上遍历到根节点
        while (currentNode) {
            pathNodeIndices.add(currentNode.data.node_index);
            // 如果有父节点，记录父子连线
            if (currentNode.parent) {
                const parentIndex = currentNode.parent.data.node_index;
                const childIndex = currentNode.data.node_index;
                pathLinkPairs.add(`${parentIndex}-${childIndex}`);
            }
            currentNode = currentNode.parent;
        }
    });

    // 渲染所有链接（初始隐藏）
    const linkSelection = g.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', d => {
            const sourceIndex = d.source.data.node_index;
            const targetIndex = d.target.data.node_index;
            const linkKey = `${sourceIndex}-${targetIndex}`;
            // 如果连线在路径上，添加path-highlight类
            if (pathLinkPairs.has(linkKey)) {
                return 'link path-highlight';
            }
            return 'link';
        })
        .attr('stroke', d => {
            const sourceIndex = d.source.data.node_index;
            const targetIndex = d.target.data.node_index;
            const linkKey = `${sourceIndex}-${targetIndex}`;
            // 如果连线在路径上，使用高亮渐变色
            if (pathLinkPairs.has(linkKey)) {
                return 'url(#tree-link-gradient-highlight)';
            }
            return 'url(#tree-link-gradient)';
        })
        .attr('stroke-width', d => {
            const sourceIndex = d.source.data.node_index;
            const targetIndex = d.target.data.node_index;
            const linkKey = `${sourceIndex}-${targetIndex}`;
            // 如果连线在路径上，使用更粗的线条
            if (pathLinkPairs.has(linkKey)) {
                return '4px';
            }
            return '3px';
        })
        .attr('stroke-linecap', 'round')
        .attr('d', linkGenerator)
        .style('opacity', 0)
        .attr('stroke-dasharray', function() {
            const totalLength = this.getTotalLength();
            return `${totalLength} ${totalLength}`;
        })
        .attr('stroke-dashoffset', function() {
            return this.getTotalLength();
        });

    // 渲染所有节点（初始隐藏）
    const nodeSelection = g.selectAll('.node')
        .data(nodes, d => `${d.data.node_index}-${d.depth}`)
        .enter()
        .append('g')
        .attr('class', d => {
            let classes = [];
            if (d.data.is_virtual) {
                classes.push('node', 'virtual', 'root-node');
            } else {
                classes.push('node');
                if (d.data.is_bug === 'True' || d.data.is_bug === true) {
                    classes.push('bug');
                } else if (d.data.metric !== null && d.data.metric !== undefined) {
                    classes.push('success');
                } else {
                    classes.push('normal');
                }
                // 如果是高亮节点（metric大于所有祖先），添加metric-highlight类
                if (d.isHighlighted) {
                    classes.push('metric-highlight');
                }
                // 如果节点在路径上，添加path-highlight类
                if (pathNodeIndices.has(d.data.node_index)) {
                    classes.push('path-highlight');
                }
            }
            return classes.join(' ');
        })
        .attr('transform', d => `translate(${d.y},${d.x})`) // 水平布局：y是x，x是y
        .attr('data-node-index', d => d.data.node_index)
        .style('opacity', 0)
        .on('click', (event, d) => {
            if (!state.isPlaying) {
                event.stopPropagation();
                selectNode(event.currentTarget, d);
            }
        });

    nodeSelection.append('circle')
        .attr('class', 'node-halo')
        .attr('r', d => (d.data.is_virtual ? 10 : 14)); // 虚拟节点也有光环，但稍小

    nodeSelection.append('circle')
        .attr('r', d => (d.data.is_virtual ? 6 : 8)) // 虚拟节点也有圆形，但稍小
        .attr('filter', d => (d.data.is_virtual ? null : 'url(#node-shadow)'))
        .attr('fill', d => {
            if (d.data.is_virtual) return 'rgba(96, 165, 250, 0.9)'; // 虚拟节点用蓝色
            return null; // 其他节点使用CSS类
        });

    nodeSelection.append('text')
        .attr('dy', -18)
        .attr('text-anchor', 'middle')
        .text(d => {
            if (d.data.is_virtual) return 'Root';
            return `Node ${d.data.node_index}`;
        })
        .style('opacity', 0);

    svg.style('cursor', 'grab')
        .on('mousedown', () => svg.style('cursor', 'grabbing'))
        .on('mouseup mouseleave', () => svg.style('cursor', 'grab'));

    const zoom = d3.zoom()
        .scaleExtent([0.2, 10.0]) // 增大最大缩放限制，支持更大的缩放
        .on('zoom', (event) => {
            // 如果正在播放，限制手动缩放，确保跟踪功能正常工作
            if (state.isPlaying) {
                // 允许缩放，但会在下一个节点时强制跟踪
                g.attr('transform', event.transform);
            } else {
                g.attr('transform', event.transform);
            }
        });

    svg.call(zoom);

    const initialTransform = d3.zoomIdentity.translate(translateX, translateY).scale(initialScale);
    svg.call(zoom.transform, initialTransform);
    
    // 保存zoom行为到state，供跟踪时使用
    state.zoomBehavior = zoom;

    elements.resetViewBtn.onclick = () => {
        // 如果正在播放，先停止播放
        if (state.isPlaying) {
            stopPlayback();
        }
        
        // 显示完整的树：所有节点和连线都可见
        d3.select('#tree-svg').selectAll('.node')
            .transition()
            .duration(400)
            .style('opacity', 1);
        
        d3.select('#tree-svg').selectAll('.node text')
            .transition()
            .duration(400)
            .style('opacity', 0.95);
        
        d3.select('#tree-svg').selectAll('.link')
            .transition()
            .duration(400)
            .style('opacity', 1)
            .attr('stroke-dashoffset', 0);
        
        // 清除所有节点的选中和高亮状态
        d3.select('#tree-svg').selectAll('.node').classed('selected', false).classed('playing', false);
        d3.select('#tree-svg').selectAll('.link').classed('link-flash', false);
        
        // 重置节点详情
        resetNodeDetails();
        
        // 计算根节点位置并居中显示
        if (state.currentTree && state.nodeSequence && state.nodeSequence.length > 0) {
            const rootNode = state.nodeSequence[0];
            const rootNodeIndex = rootNode.node_index;
            const rootNodeGroup = d3.select(`#tree-svg [data-node-index="${rootNodeIndex}"]`);
            
            if (!rootNodeGroup.empty()) {
                const rootNodeData = rootNodeGroup.datum();
                
                // 等待节点和连线显示完成后，跟踪根节点到中央
                setTimeout(() => {
                    // 计算合适的缩放比例，使整个树可见
                    const rect = elements.treeSvg.getBoundingClientRect();
                    const width = rect.width || elements.treeSvg.clientWidth || 960;
                    const height = rect.height || elements.treeSvg.clientHeight || 620;
                    
                    // 获取树的边界框
                    const g = d3.select('#tree-svg g');
                    const box = g.node().getBBox();
                    
                    // 计算合适的缩放比例，使整个树可见，但不要太小
                    const scale = Math.min(
                        (width - 200) / box.width,
                        (height - 160) / box.height,
                        2.0 // 最大缩放限制
                    );
                    
                    // 计算平移量，使根节点在中央
                    const nodeX = rootNodeData.y !== undefined ? rootNodeData.y : box.x + box.width / 2;
                    const nodeY = rootNodeData.x !== undefined ? rootNodeData.x : box.y + box.height / 2;
                    
                    const translateX = width / 2 - nodeX * scale;
                    const translateY = height / 2 - nodeY * scale;
                    
                    const transform = d3.zoomIdentity
                        .translate(translateX, translateY)
                        .scale(scale);
                    
                    // 平滑过渡到新视图
                    svg.transition()
                        .duration(800)
                        .ease(d3.easeCubicOut)
                        .call(zoom.transform, transform);
                }, 450); // 等待节点和连线显示动画完成
            }
        } else {
            // 如果没有根节点信息，使用初始变换
            svg.transition()
                .duration(650)
                .ease(d3.easeCubicOut)
                .call(zoom.transform, initialTransform);
        }
    };

    elements.fitScreenBtn.onclick = () => {
        const box = g.node().getBBox();
        const scale = Math.min(
            (width - 200) / box.width,
            (height - 160) / box.height
        );
        const transform = d3.zoomIdentity
            .translate(
                width / 2 - (box.x + box.width / 2) * scale,
                height / 2 - (box.y + box.height / 2) * scale
            )
            .scale(scale);

        svg.transition()
            .duration(650)
            .ease(d3.easeCubicOut)
            .call(zoom.transform, transform);
    };

    svg.on('click', () => {
        if (!state.isPlaying) {
            state.selectedNode = null;
            d3.select('#tree-svg').selectAll('.node').classed('selected', false);
            resetNodeDetails();
        }
    });
    
    // 保存节点选择器到state，供播放时使用
    state.nodeSelection = nodeSelection;
    state.linkSelection = linkSelection;
    
    // zoom行为已经在上面保存到state.zoomBehavior了，无需重复保存
}

// 跟踪节点到屏幕中央（可复用的函数）
function trackNodeToCenter(nodeIndex, nodeData) {
    if (!nodeData) {
        console.warn('⚠️ trackNodeToCenter: No nodeData provided');
        return;
    }
    
    console.log('🎯 Tracking node ' + nodeIndex + ' to center...');
    const svg = d3.select('#tree-svg');
    
    if (svg.empty()) {
        console.error('❌ SVG element not found!');
        return;
    }
    
    // 使用getBoundingClientRect获取实际可视区域尺寸（考虑播放面板的影响）
    const rect = elements.treeSvg.getBoundingClientRect();
    const width = rect.width || elements.treeSvg.clientWidth || 960;
    const height = rect.height || elements.treeSvg.clientHeight || 620;
    
    console.log('📍 SVG container size: ' + rect.width + 'x' + rect.height + ', Using: ' + width + 'x' + height);
    
    // 节点在树布局中的坐标（水平布局：x是y，y是x）
    // 确保从nodeData中正确获取坐标
    const nodeX = nodeData.y !== undefined ? nodeData.y : 0; // 水平布局：x坐标是y
    const nodeY = nodeData.x !== undefined ? nodeData.x : 0; // 水平布局：y坐标是x
    
    console.log('📍 Node position in tree: (x=' + nodeX + ', y=' + nodeY + ')');
    
    // 使用固定但合理的缩放比例，确保节点足够大且可见
    const targetScale = 1.8; // 适当缩小，从4.5倍改为3.5倍
    
    // 计算平移量，使节点精确居中到屏幕中央（镜头跟踪效果）
    // translateX = 屏幕中心X - 节点X坐标 * 缩放比例
    const translateX = width / 2 - nodeX * targetScale;
    const translateY = height / 2 - nodeY * targetScale;
    
    console.log('📐 Transform: translate(' + translateX.toFixed(2) + ', ' + translateY.toFixed(2) + '), scale(' + targetScale + ')');
    
    // 创建新的变换矩阵，确保节点在屏幕中央
    const newTransform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(targetScale);
    
    // 使用state中保存的zoom行为（在renderTreeForPlayback中保存）
    const zoomBehavior = state.zoomBehavior;
    
    if (!zoomBehavior) {
        console.error('❌ Zoom behavior not found! Cannot track node.');
        return;
    }
    
    // 平滑过渡到新位置（镜头跟随效果）
    svg.transition()
        .duration(800)
        .ease(d3.easeCubicInOut)
        .call(zoomBehavior.transform, newTransform)
        .on('end', function() {
            // 验证节点是否真的在中心
            const currentTransform = d3.zoomTransform(svg.node());
            if (currentTransform) {
                const nodeScreenX = nodeX * currentTransform.k + currentTransform.x;
                const nodeScreenY = nodeY * currentTransform.k + currentTransform.y;
                const centerX = width / 2;
                const centerY = height / 2;
                const offsetX = Math.abs(nodeScreenX - centerX);
                const offsetY = Math.abs(nodeScreenY - centerY);
                
                console.log('✅ Node ' + nodeIndex + ' tracked. Screen position: (' + nodeScreenX.toFixed(2) + ', ' + nodeScreenY.toFixed(2) + '), Center: (' + centerX + ', ' + centerY + '), Offset: (' + offsetX.toFixed(2) + ', ' + offsetY.toFixed(2) + ')');
                
                if (offsetX > 50 || offsetY > 50) {
                    console.warn('⚠️ Node may not be centered properly! Retrying...');
                    // 如果偏移太大，重新跟踪（最多重试一次）
                    if (!nodeData._retryCount) {
                        nodeData._retryCount = 1;
                        setTimeout(() => {
                            trackNodeToCenter(nodeIndex, nodeData);
                        }, 300);
                    }
                } else {
                    // 重置重试计数
                    nodeData._retryCount = 0;
                }
            } else {
                console.error('❌ Failed to get current transform!');
            }
        });
}

// 播放下一个节点
function playNextNode() {
    console.log(`🎯 playNextNode: index=${state.currentNodeIndex}, total=${state.nodeSequence.length}, isPlaying=${state.isPlaying}`);
    
    if (!state.isPlaying || state.currentNodeIndex >= state.nodeSequence.length) {
        console.log('✅ Playback finished');
        stopPlayback();
        return;
    }
    
    const currentNode = state.nodeSequence[state.currentNodeIndex];
    const nodeIndex = currentNode.node_index;
    console.log(`📍 Processing node ${nodeIndex}`);
    
    // 在SVG中找到对应的节点
    const nodeGroup = d3.select(`#tree-svg [data-node-index="${nodeIndex}"]`);
    
    if (nodeGroup.empty()) {
        console.warn(`⚠️ Node ${nodeIndex} not found in SVG, skipping...`);
        // 如果找不到节点，继续下一个
        state.currentNodeIndex++;
        state.playTimeout = setTimeout(() => playNextNode(), 100);
        return;
    }
    
    console.log(`✅ Found node ${nodeIndex} in SVG`);
    
    // 显示节点及其到父节点的链接
    const nodeData = nodeGroup.datum();
    
    // 更新进度指示器
    if (elements.currentNodeIndicator) {
        elements.currentNodeIndicator.textContent = `Node ${nodeIndex}`;
    }
    
    // 如果是第一个节点（根节点），直接显示节点和变化
    if (state.currentNodeIndex === 0) {
        // 显示根节点
        nodeGroup.transition()
            .duration(300)
            .ease(d3.easeCubicOut)
            .style('opacity', 1);
        
        nodeGroup.select('text')
            .transition()
            .delay(150)
            .duration(250)
            .style('opacity', 0.95);
        
        // 高亮当前节点
        nodeGroup.classed('playing', true);
        
        // 跟踪根节点
        trackNodeToCenter(nodeIndex, nodeData);
        
        // 延迟显示变化
        setTimeout(() => {
            renderPlaybackChanges(currentNode, null);
        }, 500);
        
        // 保存当前节点并继续下一个
        state.previousNode = currentNode;
        state.currentNodeIndex++;
        const baseDelay = currentNode.insights_from_parent && currentNode.insights_from_parent.length > 0 ? 4000 : 2500;
        const delay = Math.round(baseDelay / state.playbackSpeed);
        state.playTimeout = setTimeout(() => playNextNode(), delay);
        return;
    }
    
    // 非根节点：先完整播放连线动画，再显示新节点，最后显示变化
    if (nodeData && nodeData.parent) {
        // 确保父节点已显示
        const parentNodeGroup = d3.select(`#tree-svg [data-node-index="${nodeData.parent.data.node_index}"]`);
        if (!parentNodeGroup.empty()) {
            parentNodeGroup.transition()
                .duration(200)
                .style('opacity', 1);
            parentNodeGroup.select('text')
                .transition()
                .duration(200)
                .style('opacity', 0.95);
        }
        
        // 找到父节点到当前节点的连线
        // 改进连线查找逻辑：支持虚拟根节点和普通节点
        const parentLink = d3.selectAll(`#tree-svg .link`)
            .filter(function() {
                const linkData = d3.select(this).datum();
                if (!linkData || !linkData.source || !linkData.target) return false;
                
                const sourceIndex = linkData.source.data.node_index;
                const targetIndex = linkData.target.data.node_index;
                const parentIndex = nodeData.parent ? nodeData.parent.data.node_index : null;
                
                // 匹配：父节点是source，当前节点是target
                return sourceIndex === parentIndex && targetIndex === nodeIndex;
            });
        
        console.log(`🔍 Looking for link: parent=${nodeData.parent ? nodeData.parent.data.node_index : 'none'}, current=${nodeIndex}, found=${!parentLink.empty()}`);
        
        if (!parentLink.empty()) {
            // 先开始跟踪到新节点位置（连线动画开始时镜头就开始移动）
            trackNodeToCenter(nodeIndex, nodeData);
            
            // 先播放连线动画（完整的动画）
            parentLink.classed('link-flash', true);
            
            // 初始状态：连线不可见
            parentLink.style('opacity', 0);
            
            // 动画显示连线（从父节点到新节点的位置）
            parentLink.transition()
                .duration(600)
                .ease(d3.easeCubicOut)
                .style('opacity', 1)
                .attr('stroke-dashoffset', 0)
                .on('end', function() {
                    // 连线动画完成后，闪烁效果（只闪烁一次）
                    const link = d3.select(this);
                    let flashCount = 0;
                    const flashInterval = setInterval(() => {
                        flashCount++;
                        link.style('stroke-width', flashCount % 2 === 0 ? '5px' : '3px');
                        if (flashCount >= 2) {
                            clearInterval(flashInterval);
                            link.style('stroke-width', '3px');
                            link.classed('link-flash', false);
                            
                            // 闪烁完成后，显示新节点
                            nodeGroup.transition()
                                .duration(300)
                                .ease(d3.easeCubicOut)
                                .style('opacity', 1);
                            
                            nodeGroup.select('text')
                                .transition()
                                .delay(150)
                                .duration(250)
                                .style('opacity', 0.95);
                            
                            // 高亮新节点
                            nodeGroup.classed('playing', true);
                            
                            // 取消之前节点的高亮
                            if (state.currentNodeIndex > 0) {
                                const prevNode = state.nodeSequence[state.currentNodeIndex - 1];
                                const prevNodeGroup = d3.select(`#tree-svg [data-node-index="${prevNode.node_index}"]`);
                                if (!prevNodeGroup.empty()) {
                                    prevNodeGroup.classed('playing', false);
                                }
                            }
                            
                            // 确保节点在中央（再次跟踪，确保精确居中）
                            setTimeout(() => {
                                trackNodeToCenter(nodeIndex, nodeData);
                                
                                // 节点显示完成后，延迟显示变化内容
                                setTimeout(() => {
                                    renderPlaybackChanges(currentNode, state.previousNode);
                                    
                                    // 变化内容显示后，保存状态并继续下一个节点
                                    state.previousNode = currentNode;
                                    state.currentNodeIndex++;
                                    
                                    // 延迟播放下一个节点（根据changes数量调整延迟）
                                    const baseDelay = currentNode.insights_from_parent && currentNode.insights_from_parent.length > 0 ? 4000 : 2500;
                                    const delay = Math.round(baseDelay / state.playbackSpeed);
                                    state.playTimeout = setTimeout(() => playNextNode(), delay);
                                }, 400);
                            }, 100);
                        }
                    }, 150);
                });
            
            // 不在这里执行状态更新，等待连线动画完成
            return;
        } else {
            // 如果找不到连线，直接显示节点和变化
            nodeGroup.transition()
                .duration(300)
                .ease(d3.easeCubicOut)
                .style('opacity', 1);
            
            nodeGroup.select('text')
                .transition()
                .delay(150)
                .duration(250)
                .style('opacity', 0.95);
            
            nodeGroup.classed('playing', true);
            
            if (state.currentNodeIndex > 0) {
                const prevNode = state.nodeSequence[state.currentNodeIndex - 1];
                const prevNodeGroup = d3.select(`#tree-svg [data-node-index="${prevNode.node_index}"]`);
                if (!prevNodeGroup.empty()) {
                    prevNodeGroup.classed('playing', false);
                }
            }
            
            trackNodeToCenter(nodeIndex, nodeData);
            
            setTimeout(() => {
                renderPlaybackChanges(currentNode, state.previousNode);
                
                // 保存状态并继续下一个节点
                state.previousNode = currentNode;
                state.currentNodeIndex++;
                
                const baseDelay = currentNode.insights_from_parent && currentNode.insights_from_parent.length > 0 ? 4000 : 2500;
                const delay = Math.round(baseDelay / state.playbackSpeed);
                state.playTimeout = setTimeout(() => playNextNode(), delay);
            }, 500);
        }
    } else {
        // 如果没有父节点，直接显示节点和变化
        nodeGroup.transition()
            .duration(300)
            .ease(d3.easeCubicOut)
            .style('opacity', 1);
        
        nodeGroup.select('text')
            .transition()
            .delay(150)
            .duration(250)
            .style('opacity', 0.95);
        
        nodeGroup.classed('playing', true);
        
        if (state.currentNodeIndex > 0) {
            const prevNode = state.nodeSequence[state.currentNodeIndex - 1];
            const prevNodeGroup = d3.select(`#tree-svg [data-node-index="${prevNode.node_index}"]`);
            if (!prevNodeGroup.empty()) {
                prevNodeGroup.classed('playing', false);
            }
        }
        
        trackNodeToCenter(nodeIndex, nodeData);
        
        setTimeout(() => {
            renderPlaybackChanges(currentNode, state.previousNode);
            
            // 保存状态并继续下一个节点
            state.previousNode = currentNode;
            state.currentNodeIndex++;
            
            const baseDelay = currentNode.insights_from_parent && currentNode.insights_from_parent.length > 0 ? 4000 : 2500;
            const delay = Math.round(baseDelay / state.playbackSpeed);
            state.playTimeout = setTimeout(() => playNextNode(), delay);
        }, 500);
    }
    
    // 显示所有连接到已显示节点的其他连线（非当前播放的连线）
    d3.selectAll('#tree-svg .link').each(function() {
        const linkData = d3.select(this).datum();
        if (linkData && linkData.source && linkData.target) {
            const sourceIndex = linkData.source.data.node_index;
            const targetIndex = linkData.target.data.node_index;
            
            // 跳过当前正在播放的连线
            if (nodeData && nodeData.parent && 
                sourceIndex === nodeData.parent.data.node_index && 
                targetIndex === nodeIndex) {
                return;
            }
            
            // 检查源节点和目标节点是否都已显示
            const sourceNode = d3.select(`#tree-svg [data-node-index="${sourceIndex}"]`);
            const targetNode = d3.select(`#tree-svg [data-node-index="${targetIndex}"]`);
            
            const sourceVisible = !sourceNode.empty() && sourceNode.style('opacity') !== '0' && parseFloat(sourceNode.style('opacity')) > 0;
            const targetVisible = !targetNode.empty() && targetNode.style('opacity') !== '0' && parseFloat(targetNode.style('opacity')) > 0;
            
            // 如果两个节点都已显示，显示连线
            if (sourceVisible && targetVisible) {
                const linkElement = d3.select(this);
                const currentOpacity = parseFloat(linkElement.style('opacity')) || 0;
                if (currentOpacity < 0.5) {
                    linkElement.transition()
                        .duration(400)
                        .ease(d3.easeCubicOut)
                        .style('opacity', 1)
                        .attr('stroke-dashoffset', 0);
                }
            }
        }
    });
}

// 渲染播放时的变化对比
function renderPlaybackChanges(currentNode, previousNode) {
    if (!elements.playbackChanges) return;
    
    // 使用正则表达式过滤changes中包含"不变"、"不xx改变"、"沿用"、"保持"的条目
    const filteredInsights = currentNode.insights_from_parent && Array.isArray(currentNode.insights_from_parent)
        ? currentNode.insights_from_parent.filter(item => {
            const text = String(item || '').trim();
            if (!text) return false;
            
            // 过滤掉包含以下关键词的条目：不变、不改变、沿用、保持、无
            const patterns = [
                /不变/,                          // 匹配"不变"
                /不[^变]*改变/,                    // 匹配"不改变"、"不xx改变"等
                /沿用/,                          // 匹配"沿用"
                /保持/,                          // 匹配"保持"
                /无/                             // 匹配所有包含"无"的条目
            ];
            
            // 如果匹配到任何一个模式，则过滤掉
            return !patterns.some(pattern => pattern.test(text));
        })
        : [];
    
    let changesHtml = '';
    
    if (previousNode) {
        // 显示对比信息
        const prevMetric = previousNode.metric !== null && previousNode.metric !== undefined
            ? (typeof previousNode.metric === 'number' ? previousNode.metric.toFixed(4) : previousNode.metric)
            : 'N/A';
        const currMetric = currentNode.metric !== null && currentNode.metric !== undefined
            ? (typeof currentNode.metric === 'number' ? currentNode.metric.toFixed(4) : currentNode.metric)
            : 'N/A';
        
        const metricChange = currentNode.metric !== null && previousNode.metric !== null && 
                            typeof currentNode.metric === 'number' && typeof previousNode.metric === 'number'
            ? (currentNode.metric - previousNode.metric).toFixed(4)
            : null;
        
        changesHtml = `
            <div class="playback-comparison">
                <div class="comparison-header">
                    <div class="node-info">
                        <span class="node-badge">Node ${currentNode.node_index}</span>
                        ${previousNode ? `<span class="from-node">← Node ${previousNode.node_index}</span>` : ''}
                    </div>
                </div>
                
                ${metricChange !== null ? `
                    <div class="metric-comparison">
                        <div class="metric-item">
                            <span class="metric-label">Previous Metric</span>
                            <span class="metric-value">${escapeHtml(String(prevMetric))}</span>
                        </div>
                        <div class="metric-arrow">→</div>
                        <div class="metric-item">
                            <span class="metric-label">Current Metric</span>
                            <span class="metric-value ${metricChange >= 0 ? 'improved' : 'degraded'}">${escapeHtml(String(currMetric))}</span>
                        </div>
                        <div class="metric-change ${metricChange >= 0 ? 'improved' : 'degraded'}">
                            ${metricChange >= 0 ? '+' : ''}${metricChange}
                        </div>
                    </div>
                ` : ''}
                
                ${filteredInsights.length > 0 ? `
                    <div class="changes-list">
                        <h4>Key Changes</h4>
                        <ul>
                            ${filteredInsights.map((item, idx) => `
                                <li class="change-item animate-in-delay" style="animation-delay: ${idx * 0.15}s">
                                    <div class="change-badge">${idx + 1}</div>
                                    <div class="change-text">${escapeHtml(item)}</div>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    } else {
        // 第一个节点，显示初始信息
        changesHtml = `
            <div class="playback-comparison">
                <div class="comparison-header">
                    <div class="node-info">
                        <span class="node-badge">Node ${currentNode.node_index}</span>
                        <span class="from-node">Starting Node</span>
                    </div>
                </div>
                <div class="initial-info">
                    <p>🎯 Starting evolution tracking from root node</p>
                    ${currentNode.metric !== null && currentNode.metric !== undefined ? `
                        <div class="metric-display">
                            <span class="metric-label">Initial Metric:</span>
                            <span class="metric-value">${escapeHtml(String(typeof currentNode.metric === 'number' ? currentNode.metric.toFixed(4) : currentNode.metric))}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    elements.playbackChanges.innerHTML = changesHtml;
}

// 为播放模式渲染节点详情（自动切换到Plan & Changes并高亮changes）
function renderNodeDetailsForPlayback(node) {
    if (node.is_virtual) return;

    const sections = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'plan_changes', label: 'Plan & Changes', icon: '📋' },
        { id: 'code', label: 'Code', icon: '💻' },
        { id: 'analysis', label: 'Analysis', icon: '🔍' },
        { id: 'node_level_analysis', label: 'Node Analysis', icon: '🔬' }
    ];

    const metricText = node.metric !== null && node.metric !== undefined
        ? (typeof node.metric === 'number' ? node.metric.toFixed(4) : node.metric)
        : 'N/A';
    const parentLabel = node.parent_index === null || node.parent_index === undefined ? 'Root' : node.parent_index;
    const childCount = Array.isArray(node.children) ? node.children.length : 0;
    const competitionLabel = escapeHtml(state.currentCompetition?.displayName || node.demo_id || 'N/A');
    const planHtml = formatRichText(node.plan);
    const analysisHtml = formatRichText(node.analysis);
    const nodeAnalysisHtml = formatNodeAnalysis(node.node_level_analysis);
    const codeHtml = escapeHtml(node.code || '// No code available');
    
    // 使用正则表达式过滤changes中包含"不变"、"不xx改变"、"沿用"、"保持"的条目
    const filteredInsights = node.insights_from_parent && Array.isArray(node.insights_from_parent)
        ? node.insights_from_parent.filter(item => {
            const text = String(item || '').trim();
            if (!text) return false;
            
            // 过滤掉包含以下关键词的条目：不变、不改变、沿用、保持、无
            const patterns = [
                /不变/,                          // 匹配"不变"
                /不[^变]*改变/,                    // 匹配"不改变"、"不xx改变"等
                /沿用/,                          // 匹配"沿用"
                /保持/,                          // 匹配"保持"
                /无/                             // 匹配所有包含"无"的条目
            ];
            
            // 如果匹配到任何一个模式，则过滤掉
            return !patterns.some(pattern => pattern.test(text));
        })
        : [];
    
    // 如果changes为空，则不显示changes部分
    const changesHtml = filteredInsights.length > 0
        ? `<div class="list-section"><ul>${filteredInsights.map(item => `<li><div class="highlight-block playing-change"><span class="highlight-block-value">${escapeHtml(item)}</span></div></li>`).join('')}</ul></div>`
        : '';
    
    // 合并plan和changes（如果changes为空，只显示plan）
    const planChangesHtml = `
        <div class="plan-changes-container">
            <div class="plan-section">
                <h3 class="section-title">Plan</h3>
                <div class="text-block">${planHtml}</div>
            </div>
            ${changesHtml ? `
            <div class="changes-section">
                <h3 class="section-title">Changes</h3>
                ${changesHtml}
            </div>
            ` : ''}
        </div>
    `;

    const detailsHtml = `
        <div class="details-pages">
            <div class="pages-header">
                <div class="header-meta">
                    <span class="node-pill">Node ${node.node_index}</span>
                    <div class="node-badges">
                        ${node.is_bug === 'True' || node.is_bug === true
                            ? '<span class="badge error">Bug</span>'
                            : '<span class="badge success">Success</span>'}
                        ${node.metric !== null && node.metric !== undefined
                            ? `<span class="badge info">Metric · ${metricText}</span>`
                            : ''}
                    </div>
                </div>
                <p class="header-subtitle">${competitionLabel}</p>
            </div>

            <div class="page-tabs">
                ${sections.map((s, i) => `
                    <button class="page-tab ${i === 1 ? 'active' : ''}" data-section="${s.id}">
                        ${s.icon} ${s.label}
                    </button>
                `).join('')}
            </div>

            <div class="page-content">
                <div id="section-overview" class="page-section"></div>
                <div id="section-plan_changes" class="page-section active">${planChangesHtml}</div>
                <div id="section-code" class="page-section"><pre class="code-block"><code class="language-python">${codeHtml}</code></pre></div>
                <div id="section-analysis" class="page-section"><div class="text-block">${analysisHtml}</div></div>
                <div id="section-node_level_analysis" class="page-section"><div class="text-block">${nodeAnalysisHtml}</div></div>
            </div>
        </div>
    `;

    elements.nodeDetails.classList.remove('details-active');
    const contentDiv = elements.nodeDetails.querySelector('.node-details-content');
    if (contentDiv) {
        contentDiv.innerHTML = detailsHtml;
    } else {
        elements.nodeDetails.innerHTML = '<div class="node-details-resize-handle" id="resize-handle"></div><div class="node-details-content">' + detailsHtml + '</div>';
        setupResizeHandle();
    }

    const tabs = elements.nodeDetails.querySelectorAll('.page-tab');
    const sectionsDom = elements.nodeDetails.querySelectorAll('.page-section');
    
    state.currentSectionIndex = 1; // Plan & Changes
    
    function switchSection(index) {
        if (index < 0 || index >= tabs.length) return;
        
        tabs.forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });
        
        sectionsDom.forEach((section, i) => {
            section.classList.toggle('active', i === index);
        });
        
        state.currentSectionIndex = index;
    }
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            if (!state.isPlaying) {
                switchSection(index);
            }
        });
    });
    
    state.switchSection = switchSection;

    requestAnimationFrame(() => {
        elements.nodeDetails.classList.add('details-active');
    });
    
    // 添加changes高亮动画
    setTimeout(() => {
        const changeBlocks = elements.nodeDetails.querySelectorAll('.playing-change');
        changeBlocks.forEach((block, index) => {
            setTimeout(() => {
                block.classList.add('animate-in');
            }, index * 200);
        });
    }, 300);
}

// 判断metric是high is better还是low is better
function isHighIsBetter(demoId, metricName) {
    // 根据demo_id或metric名称判断
    // 常见的low is better指标
    const lowIsBetterPatterns = [
        /mae/i,      // Mean Absolute Error
        /mse/i,      // Mean Squared Error
        /rmse/i,     // Root Mean Squared Error
        /loss/i,     // Loss
        /error/i,    // Error
        /cost/i      // Cost
    ];
    
    // 如果metric名称匹配low is better模式，返回false
    if (metricName) {
        if (lowIsBetterPatterns.some(pattern => pattern.test(metricName))) {
            return false;
        }
    }
    
    // 默认high is better（大多数Kaggle比赛都是这样）
    return true;
}

// 检查节点的metric是否比所有祖先节点更好（根据better方向）
function isMetricBetterThanAllAncestors(hierarchyNode) {
    if (!hierarchyNode || !hierarchyNode.data) return false;
    
    const currentNodeMetric = hierarchyNode.data.metric;
    // 如果当前节点没有metric，返回false
    if (currentNodeMetric === null || currentNodeMetric === undefined || typeof currentNodeMetric !== 'number') {
        return false;
    }
    
    // 判断是high is better还是low is better
    const demoId = hierarchyNode.data.demo_id || '';
    const highIsBetter = isHighIsBetter(demoId, null);
    
    // 遍历所有祖先节点
    let ancestor = hierarchyNode.parent;
    while (ancestor) {
        const ancestorMetric = ancestor.data.metric;
        // 如果祖先节点有metric
        if (ancestorMetric !== null && ancestorMetric !== undefined && typeof ancestorMetric === 'number') {
            if (highIsBetter) {
                // High is better: 如果祖先节点metric >= 当前节点，返回false
                if (ancestorMetric >= currentNodeMetric) {
                    return false;
                }
            } else {
                // Low is better: 如果祖先节点metric <= 当前节点，返回false
                if (ancestorMetric <= currentNodeMetric) {
                    return false;
                }
            }
        }
        ancestor = ancestor.parent;
    }
    
    // 所有祖先节点的metric都比当前节点差，返回true
    return true;
}

// 渲染树
function renderTree(root) {
    const svg = d3.select('#tree-svg');
    svg.selectAll('*').remove();

    // 构建静态模式下的DFS序列，用于Tab键导航
    // 先创建hierarchy，然后基于hierarchy节点进行DFS遍历
    const hierarchyRoot = d3.hierarchy(root);
    
    // 使用DFS递归遍历构建序列（确保是真正的深度优先搜索顺序）
    const dfsSequence = [];
    const highlightedSequence = []; // 高亮节点序列
    
    function dfsTraverse(node) {
        if (!node) return;
        
        // 检查是否是高亮节点（metric比所有祖先更好）
        const isHighlighted = isMetricBetterThanAllAncestors(node);
        
        // 将当前节点加入序列
        const nodeInfo = {
            node_index: node.data.node_index,
            data: node.data,
            isHighlighted: isHighlighted
        };
        dfsSequence.push(nodeInfo);
        
        // 如果是高亮节点，加入高亮序列
        if (isHighlighted) {
            highlightedSequence.push(nodeInfo);
        }
        
        // 递归遍历子节点（深度优先）
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => dfsTraverse(child));
        }
    }
    dfsTraverse(hierarchyRoot);
    
    state.staticDFSSequence = dfsSequence;
    state.highlightedNodesSequence = highlightedSequence;
    state.tabNavigationIndex = -1; // 重置Tab导航索引
    state.highlightedNavigationIndex = -1; // 重置高亮节点导航索引
    console.log(`📋 Static DFS sequence built: ${state.staticDFSSequence.length} nodes`, state.staticDFSSequence.map(n => n.node_index));
    console.log(`✨ Highlighted nodes: ${state.highlightedNodesSequence.length} nodes`, state.highlightedNodesSequence.map(n => n.node_index));

    const rect = elements.treeSvg.getBoundingClientRect();
    const width = rect.width || elements.treeSvg.clientWidth || 960;
    const height = rect.height || elements.treeSvg.clientHeight || 620;

    const defs = svg.append('defs');

    const gradient = defs.append('linearGradient')
        .attr('id', 'tree-link-gradient')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', width)
        .attr('y2', 0); // 改回水平渐变
    gradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(96,165,250,0.75)');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(129,140,248,0.65)');
    
    // 高亮路径的渐变（更亮的紫色）
    const highlightGradient = defs.append('linearGradient')
        .attr('id', 'tree-link-gradient-highlight')
        .attr('gradientUnits', 'userSpaceOnUse')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', width)
        .attr('y2', 0);
    highlightGradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(167,139,250,0.9)');
    highlightGradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(196,181,253,0.85)');

    const glow = defs.append('filter')
        .attr('id', 'node-glow')
        .attr('x', '-50%')
        .attr('y', '-50%')
        .attr('width', '200%')
        .attr('height', '200%');
    glow.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '4')
        .attr('result', 'coloredBlur');
    const feMerge = glow.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const shadow = defs.append('filter')
        .attr('id', 'node-shadow')
        .attr('x', '-40%')
        .attr('y', '-40%')
        .attr('width', '200%')
        .attr('height', '200%');
    shadow.append('feDropShadow')
        .attr('dx', 0)
        .attr('dy', 4)
        .attr('stdDeviation', 4)
        .attr('flood-color', 'rgba(15,23,42,0.75)');

    const g = svg.append('g').attr('class', 'tree-root');

    // 复用之前创建的hierarchyRoot来分析树的大小
    
    // 分析树的大小：节点数量、最大深度、叶子节点数量
    const nodes = hierarchyRoot.descendants();
    const nodeCount = nodes.length;
    const maxDepth = d3.max(nodes, d => d.depth) || 0;
    const leafCount = nodes.filter(d => !d.children || d.children.length === 0).length;
    
    // 根据树的大小自适应计算间距
    // 水平间距（长度）：根据深度和节点数量调整，基础值220px，根据深度增加
    const baseHorizontalSpacing = 220;
    const depthMultiplier = Math.max(1, Math.min(1.5, maxDepth / 5)); // 深度影响系数
    const nodeMultiplier = Math.max(1, Math.min(1.3, nodeCount / 30)); // 节点数量影响系数
    const horizontalSpacing = Math.round(baseHorizontalSpacing * depthMultiplier * nodeMultiplier);
    
    // 垂直间距（宽度）：根据叶子节点数量调整，基础值120px（继续增大间距）
    const baseVerticalSpacing = 120;
    const leafMultiplier = Math.max(0.8, Math.min(1.5, leafCount / 10)); // 叶子节点影响系数
    const verticalSpacing = Math.round(baseVerticalSpacing * leafMultiplier);
    
    console.log(`🌳 Tree stats: ${nodeCount} nodes, depth ${maxDepth}, ${leafCount} leaves`);
    console.log(`📐 Spacing: horizontal ${horizontalSpacing}px, vertical ${verticalSpacing}px`);

    // 创建紧凑的树布局，自然下垂效果（水平布局）
    const treeLayout = d3.tree()
        .nodeSize([verticalSpacing, horizontalSpacing]) // 交换：垂直间距在前，水平间距在后
        .separation((a, b) => {
            // 自定义分离函数：让树更自然
            // 如果是兄弟节点，间距适中
            if (a.parent === b.parent) {
                // 根据深度调整：越深越紧凑，但不要太紧凑
                const depth = a.depth || 0;
                return 0.75 + (depth * 0.05); // 0.75-0.95之间，更自然
            }
            // 其他情况使用默认值
            return 1;
        });
    treeLayout(hierarchyRoot);
    const links = hierarchyRoot.links();

    const minX = d3.min(nodes, d => d.x) ?? 0;
    const maxX = d3.max(nodes, d => d.x) ?? 0;
    const minY = d3.min(nodes, d => d.y) ?? 0;
    const maxY = d3.max(nodes, d => d.y) ?? 0;

    const treeWidth = Math.max(1, maxY - minY); // 水平布局：宽度是y方向
    const treeHeight = Math.max(1, maxX - minX); // 水平布局：高度是x方向
    const availableWidth = Math.max(240, width - 240);
    const availableHeight = Math.max(200, height - 200);
    // 播放模式下使用更大的初始缩放，确保树足够大
    const initialScale = Math.min(4.0, Math.max(1.5, Math.min(availableWidth / treeWidth, availableHeight / treeHeight) * 1.8));

    const translateX = width / 2 - ((minY + treeWidth / 2) * initialScale); // 水平布局：y居中
    const translateY = height / 2 - ((minX + treeHeight / 2) * initialScale); // 水平布局：x居中

    const linkGenerator = d3.linkHorizontal() // 改回horizontal
        .x(d => d.y)  // 水平布局：x是y
        .y(d => d.x); // 水平布局：y是x

    // 为每个hierarchy节点添加高亮标记
    nodes.forEach(node => {
        node.isHighlighted = isMetricBetterThanAllAncestors(node);
    });
    
    // 找到所有高亮节点，并标记从根到这些节点的路径
    const highlightedNodes = nodes.filter(node => node.isHighlighted);
    const pathNodeIndices = new Set(); // 存储路径上所有节点的索引
    const pathLinkPairs = new Set(); // 存储路径上的连线对 (sourceIndex-targetIndex)
    
    // 对于每个高亮节点，找到从根到它的路径
    highlightedNodes.forEach(highlightedNode => {
        let currentNode = highlightedNode;
        // 从当前节点向上遍历到根节点
        while (currentNode) {
            pathNodeIndices.add(currentNode.data.node_index);
            // 如果有父节点，记录父子连线
            if (currentNode.parent) {
                const parentIndex = currentNode.parent.data.node_index;
                const childIndex = currentNode.data.node_index;
                pathLinkPairs.add(`${parentIndex}-${childIndex}`);
            }
            currentNode = currentNode.parent;
        }
    });

    const linkSelection = g.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', d => {
            const sourceIndex = d.source.data.node_index;
            const targetIndex = d.target.data.node_index;
            const linkKey = `${sourceIndex}-${targetIndex}`;
            // 如果连线在路径上，添加path-highlight类
            if (pathLinkPairs.has(linkKey)) {
                return 'link path-highlight';
            }
            return 'link';
        })
        .attr('stroke', d => {
            const sourceIndex = d.source.data.node_index;
            const targetIndex = d.target.data.node_index;
            const linkKey = `${sourceIndex}-${targetIndex}`;
            // 如果连线在路径上，使用高亮渐变色
            if (pathLinkPairs.has(linkKey)) {
                return 'url(#tree-link-gradient-highlight)';
            }
            return 'url(#tree-link-gradient)';
        })
        .attr('stroke-width', d => {
            const sourceIndex = d.source.data.node_index;
            const targetIndex = d.target.data.node_index;
            const linkKey = `${sourceIndex}-${targetIndex}`;
            // 如果连线在路径上，使用更粗的线条
            if (pathLinkPairs.has(linkKey)) {
                return '4px';
            }
            return '3px';
        })
        .attr('stroke-linecap', 'round')
        .attr('d', d => {
            const origin = { x: d.source.y, y: d.source.x }; // 水平布局：交换x和y
            return linkGenerator({ source: origin, target: origin });
        });

    linkSelection.transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .attr('d', linkGenerator)
        .on('end', function () {
            const totalLength = this.getTotalLength();
            d3.select(this)
                .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(650)
                .ease(d3.easeCubicOut)
                .attr('stroke-dashoffset', 0);
        });
    
    const nodeSelection = g.selectAll('.node')
        .data(nodes, d => `${d.data.node_index}-${d.depth}`)
        .enter()
        .append('g')
        .attr('class', d => {
            let classes = [];
            if (d.data.is_virtual) {
                classes.push('node', 'virtual', 'root-node');
            } else {
                classes.push('node');
                if (d.data.is_bug === 'True' || d.data.is_bug === true) {
                    classes.push('bug');
                } else if (d.data.metric !== null && d.data.metric !== undefined) {
                    classes.push('success');
                } else {
                    classes.push('normal');
                }
                // 如果是高亮节点（metric大于所有祖先），添加metric-highlight类
                if (d.isHighlighted) {
                    classes.push('metric-highlight');
                }
                // 如果节点在路径上，添加path-highlight类
                if (pathNodeIndices.has(d.data.node_index)) {
                    classes.push('path-highlight');
                }
            }
            return classes.join(' ');
        })
        .attr('transform', d => `translate(${d.y},${d.x})`) // 水平布局：y是x，x是y
        .attr('data-node-index', d => d.data.node_index) // 添加data-node-index属性，用于Tab导航查找节点
        .style('opacity', 0)
        .on('click', (event, d) => {
            event.stopPropagation();
            selectNode(event.currentTarget, d);
        });

    nodeSelection.append('circle')
        .attr('class', 'node-halo')
        .attr('r', d => (d.data.is_virtual ? 10 : 14)); // 虚拟节点也有光环，但稍小

    nodeSelection.append('circle')
        .attr('r', d => (d.data.is_virtual ? 6 : 8)) // 虚拟节点也有圆形，但稍小
        .attr('filter', d => (d.data.is_virtual ? null : 'url(#node-shadow)'))
        .attr('fill', d => {
            if (d.data.is_virtual) return 'rgba(96, 165, 250, 0.9)'; // 虚拟节点用蓝色
            return null; // 其他节点使用CSS类
        });

    nodeSelection.append('text')
        .attr('dy', -18)
        .attr('text-anchor', 'middle')
        .text(d => {
            if (d.data.is_virtual) return 'Root';
            return `Node ${d.data.node_index}`;
        })
        .style('opacity', 0);

    nodeSelection.transition()
        .duration(750)
        .ease(d3.easeCubicOut)
        .attr('transform', d => `translate(${d.y},${d.x})`) // 水平布局：y是x，x是y
        .style('opacity', 1);

    nodeSelection.select('text')
        .transition()
        .delay(220)
        .duration(500)
        .ease(d3.easeCubicOut)
        .style('opacity', 0.95);

    svg.style('cursor', 'grab')
        .on('mousedown', () => svg.style('cursor', 'grabbing'))
        .on('mouseup mouseleave', () => svg.style('cursor', 'grab'));

    const zoom = d3.zoom()
        .scaleExtent([0.2, 10.0]) // 增大最大缩放限制，支持更大的缩放
        .on('zoom', (event) => {
            // 如果正在播放，限制手动缩放，确保跟踪功能正常工作
            if (state.isPlaying) {
                // 允许缩放，但会在下一个节点时强制跟踪
                g.attr('transform', event.transform);
            } else {
                g.attr('transform', event.transform);
            }
        });

    svg.call(zoom);

    const initialTransform = d3.zoomIdentity.translate(translateX, translateY).scale(initialScale);
    svg.call(zoom.transform, initialTransform);
    
    // 保存zoom行为到state，供跟踪时使用
    state.zoomBehavior = zoom;

    elements.resetViewBtn.onclick = () => {
        // 如果正在播放，先停止播放
        if (state.isPlaying) {
            stopPlayback();
        }
        
        // 显示完整的树：所有节点和连线都可见
        d3.select('#tree-svg').selectAll('.node')
            .transition()
            .duration(400)
            .style('opacity', 1);
        
        d3.select('#tree-svg').selectAll('.node text')
            .transition()
            .duration(400)
            .style('opacity', 0.95);
        
        d3.select('#tree-svg').selectAll('.link')
            .transition()
            .duration(400)
            .style('opacity', 1)
            .attr('stroke-dashoffset', 0);
        
        // 清除所有节点的选中和高亮状态
        d3.select('#tree-svg').selectAll('.node').classed('selected', false).classed('playing', false);
        d3.select('#tree-svg').selectAll('.link').classed('link-flash', false);
        
        // 重置节点详情
        resetNodeDetails();
        
        // 计算根节点位置并居中显示
        if (state.currentTree && state.nodeSequence && state.nodeSequence.length > 0) {
            const rootNode = state.nodeSequence[0];
            const rootNodeIndex = rootNode.node_index;
            const rootNodeGroup = d3.select(`#tree-svg [data-node-index="${rootNodeIndex}"]`);
            
            if (!rootNodeGroup.empty()) {
                const rootNodeData = rootNodeGroup.datum();
                
                // 等待节点和连线显示完成后，跟踪根节点到中央
                setTimeout(() => {
                    // 计算合适的缩放比例，使整个树可见
                    const rect = elements.treeSvg.getBoundingClientRect();
                    const width = rect.width || elements.treeSvg.clientWidth || 960;
                    const height = rect.height || elements.treeSvg.clientHeight || 620;
                    
                    // 获取树的边界框
                    const g = d3.select('#tree-svg g');
                    const box = g.node().getBBox();
                    
                    // 计算合适的缩放比例，使整个树可见，但不要太小
                    const scale = Math.min(
                        (width - 200) / box.width,
                        (height - 160) / box.height,
                        2.0 // 最大缩放限制
                    );
                    
                    // 计算平移量，使根节点在中央
                    const nodeX = rootNodeData.y !== undefined ? rootNodeData.y : box.x + box.width / 2;
                    const nodeY = rootNodeData.x !== undefined ? rootNodeData.x : box.y + box.height / 2;
                    
                    const translateX = width / 2 - nodeX * scale;
                    const translateY = height / 2 - nodeY * scale;
                    
                    const transform = d3.zoomIdentity
                        .translate(translateX, translateY)
                        .scale(scale);
                    
                    // 平滑过渡到新视图
                    svg.transition()
                        .duration(800)
                        .ease(d3.easeCubicOut)
                        .call(zoom.transform, transform);
                }, 450); // 等待节点和连线显示动画完成
            }
        } else {
            // 如果没有根节点信息，使用初始变换
            svg.transition()
                .duration(650)
                .ease(d3.easeCubicOut)
                .call(zoom.transform, initialTransform);
        }
    };

    elements.fitScreenBtn.onclick = () => {
        const box = g.node().getBBox();
        const scale = Math.min(
            (width - 200) / box.width,
            (height - 160) / box.height
        );
        const transform = d3.zoomIdentity
            .translate(
                width / 2 - (box.x + box.width / 2) * scale,
                height / 2 - (box.y + box.height / 2) * scale
            )
            .scale(scale);

        svg.transition()
            .duration(650)
            .ease(d3.easeCubicOut)
            .call(zoom.transform, transform);
    };

    svg.on('click', () => {
        state.selectedNode = null;
        d3.select('#tree-svg').selectAll('.node').classed('selected', false);
        resetNodeDetails();
    });
}

// 选择节点
function selectNode(target, node) {
    state.selectedNode = node;
    d3.select('#tree-svg').selectAll('.node').classed('selected', false);
    d3.select(target).classed('selected', true);
    renderNodeDetails(node.data);
    
    // 更新Tab导航索引到当前节点
    if (state.staticDFSSequence && state.staticDFSSequence.length > 0) {
        const nodeIndex = node.data.node_index;
        const index = state.staticDFSSequence.findIndex(n => n.node_index === nodeIndex);
        if (index !== -1) {
            state.tabNavigationIndex = index;
        }
    }
}

// 在静态模式下居中显示节点
function centerNodeInView(nodeData, targetScale = 1.8) {
    if (!nodeData) {
        console.warn('⚠️ centerNodeInView: No nodeData provided');
        return;
    }
    
    const svg = d3.select('#tree-svg');
    if (svg.empty()) {
        console.error('❌ SVG element not found!');
        return;
    }
    
    // 使用getBoundingClientRect获取实际可视区域尺寸
    const rect = elements.treeSvg.getBoundingClientRect();
    const width = rect.width || elements.treeSvg.clientWidth || 960;
    const height = rect.height || elements.treeSvg.clientHeight || 620;
    
    // 节点在树布局中的坐标（水平布局：x是y，y是x）
    const nodeX = nodeData.y !== undefined ? nodeData.y : 0;
    const nodeY = nodeData.x !== undefined ? nodeData.x : 0;
    
    // 计算平移量，使节点精确居中到屏幕中央
    const translateX = width / 2 - nodeX * targetScale;
    const translateY = height / 2 - nodeY * targetScale;
    
    // 创建新的变换矩阵
    const newTransform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(targetScale);
    
    // 使用state中保存的zoom行为
    const zoomBehavior = state.zoomBehavior;
    if (!zoomBehavior) {
        console.error('❌ Zoom behavior not found! Cannot center node.');
        return;
    }
    
    // 平滑过渡到新位置
    svg.transition()
        .duration(600)
        .ease(d3.easeCubicInOut)
        .call(zoomBehavior.transform, newTransform);
}

// Tab键导航到下一个节点（DFS序）- 带惊艳动画效果
function navigateToNextNode() {
    // 只在静态模式下工作（不在播放模式）
    if (state.isPlaying) {
        console.log('⚠️ Tab navigation disabled during playback');
        return;
    }
    
    // 检查是否有DFS序列
    if (!state.staticDFSSequence || state.staticDFSSequence.length === 0) {
        console.warn('⚠️ No DFS sequence available for Tab navigation');
        return;
    }
    
    // 保存上一个节点的索引（用于清除高亮）
    const prevIndex = state.tabNavigationIndex;
    
    // 如果还没有开始导航，从第一个节点开始；否则移动到下一个节点
    if (state.tabNavigationIndex < 0) {
        state.tabNavigationIndex = 0;
    } else {
        state.tabNavigationIndex = (state.tabNavigationIndex + 1) % state.staticDFSSequence.length;
    }
    
    const currentNode = state.staticDFSSequence[state.tabNavigationIndex];
    const nodeIndex = currentNode.node_index;
    
    console.log(`🔍 Tab navigation: index=${state.tabNavigationIndex}, node=${nodeIndex}`);
    
    // 在SVG中找到对应的节点
    const nodeGroup = d3.select(`#tree-svg [data-node-index="${nodeIndex}"]`);
    
    if (nodeGroup.empty()) {
        console.warn(`⚠️ Node ${nodeIndex} not found in SVG, skipping...`);
        // 如果找不到节点，尝试下一个
        if (state.tabNavigationIndex < state.staticDFSSequence.length - 1) {
            state.tabNavigationIndex++;
            navigateToNextNode();
        }
        return;
    }
    
    // 获取节点数据
    const nodeData = nodeGroup.datum();
    
    // 清除之前节点的选中和高亮状态
    d3.select('#tree-svg').selectAll('.node').classed('selected', false).classed('tab-navigating', false);
    
    // 如果是第一个节点（根节点），直接显示动画
    if (state.tabNavigationIndex === 0) {
        // 先居中显示节点
        centerNodeInView(nodeData, 1.8);
        
        // 节点出现动画
        nodeGroup.transition()
            .duration(400)
            .ease(d3.easeCubicOut)
            .style('opacity', 1);
        
        nodeGroup.select('text')
            .transition()
            .delay(200)
            .duration(300)
            .ease(d3.easeCubicOut)
            .style('opacity', 0.95);
        
        // 高亮当前节点
        nodeGroup.classed('selected', true).classed('tab-navigating', true);
        
        // 节点脉冲动画
        setTimeout(() => {
            nodeGroup.classed('tab-navigating', false);
        }, 800);
        
        // 显示节点详情
        state.selectedNode = nodeData;
        if (!nodeData.data.is_virtual) {
            renderNodeDetails(nodeData.data);
        } else {
            resetNodeDetails();
        }
        
        return;
    }
    
    // 非根节点：先播放连线动画，再显示节点
    if (nodeData && nodeData.parent) {
        // 确保父节点已显示并高亮
        const parentNodeGroup = d3.select(`#tree-svg [data-node-index="${nodeData.parent.data.node_index}"]`);
        if (!parentNodeGroup.empty()) {
            parentNodeGroup.transition()
                .duration(200)
                .style('opacity', 1);
            parentNodeGroup.select('text')
                .transition()
                .duration(200)
                .style('opacity', 0.95);
        }
        
        // 找到父节点到当前节点的连线
        const parentLink = d3.selectAll(`#tree-svg .link`)
            .filter(function() {
                const linkData = d3.select(this).datum();
                if (!linkData || !linkData.source || !linkData.target) return false;
                
                const sourceIndex = linkData.source.data.node_index;
                const targetIndex = linkData.target.data.node_index;
                const parentIndex = nodeData.parent ? nodeData.parent.data.node_index : null;
                
                return sourceIndex === parentIndex && targetIndex === nodeIndex;
            });
        
        if (!parentLink.empty()) {
            // 先开始跟踪到新节点位置（连线动画开始时镜头就开始移动）
            centerNodeInView(nodeData, 1.8);
            
            // 播放连线动画
            parentLink.classed('link-flash', true);
            
            // 获取连线总长度，用于动画
            const totalLength = parentLink.node().getTotalLength();
            
            // 初始状态：连线不可见（使用stroke-dasharray动画）
            parentLink
                .attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .style('opacity', 1);
            
            // 动画显示连线（从父节点到新节点的位置）
            parentLink.transition()
                .duration(600)
                .ease(d3.easeCubicOut)
                .attr('stroke-dashoffset', 0)
                .on('end', function() {
                    // 连线动画完成后，闪烁效果（只闪烁一次）
                    const link = d3.select(this);
                    let flashCount = 0;
                    const flashInterval = setInterval(() => {
                        flashCount++;
                        link.style('stroke-width', flashCount % 2 === 0 ? '5px' : '3px');
                        if (flashCount >= 2) {
                            clearInterval(flashInterval);
                            link.style('stroke-width', '3px');
                            link.classed('link-flash', false);
                            
                            // 闪烁完成后，显示新节点（惊艳的出现动画）
                            nodeGroup.transition()
                                .duration(400)
                                .ease(d3.easeCubicOut)
                                .style('opacity', 1)
                                .on('start', function() {
                                    // 节点出现时添加高亮效果
                                    nodeGroup.classed('selected', true).classed('tab-navigating', true);
                                });
                            
                            nodeGroup.select('text')
                                .transition()
                                .delay(200)
                                .duration(300)
                                .ease(d3.easeCubicOut)
                                .style('opacity', 0.95);
                            
                            // 节点脉冲动画持续一段时间后取消
                            setTimeout(() => {
                                nodeGroup.classed('tab-navigating', false);
                            }, 800);
                            
                            // 显示节点详情
                            state.selectedNode = nodeData;
                            if (!nodeData.data.is_virtual) {
                                renderNodeDetails(nodeData.data);
                            } else {
                                resetNodeDetails();
                            }
                        }
                    }, 150);
                });
        } else {
            // 如果没有找到连线，直接显示节点
            centerNodeInView(nodeData, 1.8);
            
            nodeGroup.transition()
                .duration(400)
                .ease(d3.easeCubicOut)
                .style('opacity', 1)
                .on('start', function() {
                    nodeGroup.classed('selected', true).classed('tab-navigating', true);
                });
            
            nodeGroup.select('text')
                .transition()
                .delay(200)
                .duration(300)
                .ease(d3.easeCubicOut)
                .style('opacity', 0.95);
            
            setTimeout(() => {
                nodeGroup.classed('tab-navigating', false);
            }, 800);
            
            state.selectedNode = nodeData;
            if (!nodeData.data.is_virtual) {
                renderNodeDetails(nodeData.data);
            } else {
                resetNodeDetails();
            }
        }
    } else {
        // 没有父节点的情况（应该是根节点，但已经在上面处理了）
        centerNodeInView(nodeData, 1.8);
        nodeGroup.classed('selected', true).classed('tab-navigating', true);
        
        setTimeout(() => {
            nodeGroup.classed('tab-navigating', false);
        }, 800);
        
        state.selectedNode = nodeData;
        if (!nodeData.data.is_virtual) {
            renderNodeDetails(nodeData.data);
        } else {
            resetNodeDetails();
        }
    }
}

// J键导航到下一个高亮节点（DFS序）
function navigateToNextHighlightedNode() {
    // 只在静态模式下工作（不在播放模式）
    if (state.isPlaying) {
        console.log('⚠️ Highlighted node navigation disabled during playback');
        return;
    }
    
    // 检查是否有高亮节点序列
    if (!state.highlightedNodesSequence || state.highlightedNodesSequence.length === 0) {
        console.warn('⚠️ No highlighted nodes available for navigation');
        return;
    }
    
    // 如果还没有开始导航，从第一个高亮节点开始；否则移动到下一个节点
    if (state.highlightedNavigationIndex < 0) {
        state.highlightedNavigationIndex = 0;
    } else {
        state.highlightedNavigationIndex = (state.highlightedNavigationIndex + 1) % state.highlightedNodesSequence.length;
    }
    
    const currentNode = state.highlightedNodesSequence[state.highlightedNavigationIndex];
    const nodeIndex = currentNode.node_index;
    
    console.log(`✨ J navigation: index=${state.highlightedNavigationIndex}, node=${nodeIndex}`);
    
    // 在SVG中找到对应的节点
    const nodeGroup = d3.select(`#tree-svg [data-node-index="${nodeIndex}"]`);
    
    if (nodeGroup.empty()) {
        console.warn(`⚠️ Node ${nodeIndex} not found in SVG, skipping...`);
        // 如果找不到节点，尝试下一个
        if (state.highlightedNavigationIndex < state.highlightedNodesSequence.length - 1) {
            state.highlightedNavigationIndex++;
            navigateToNextHighlightedNode();
        }
        return;
    }
    
    // 获取节点数据
    const nodeData = nodeGroup.datum();
    
    // 清除之前节点的选中状态
    d3.select('#tree-svg').selectAll('.node').classed('selected', false);
    
    // 居中显示节点
    centerNodeInView(nodeData, 1.8);
    
    // 节点出现动画
    nodeGroup.transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .style('opacity', 1);
    
    nodeGroup.select('text')
        .transition()
        .delay(200)
        .duration(300)
        .ease(d3.easeCubicOut)
        .style('opacity', 0.95);
    
    // 高亮当前节点
    nodeGroup.classed('selected', true);
    
    // 显示节点详情
    state.selectedNode = nodeData;
    if (!nodeData.data.is_virtual) {
        renderNodeDetails(nodeData.data);
    } else {
        resetNodeDetails();
    }
}

// B键导航到上一个高亮节点（DFS序）
function navigateToPreviousHighlightedNode() {
    // 只在静态模式下工作（不在播放模式）
    if (state.isPlaying) {
        console.log('⚠️ Highlighted node navigation disabled during playback');
        return;
    }
    
    // 检查是否有高亮节点序列
    if (!state.highlightedNodesSequence || state.highlightedNodesSequence.length === 0) {
        console.warn('⚠️ No highlighted nodes available for navigation');
        return;
    }
    
    // 如果还没有开始导航，从最后一个高亮节点开始；否则移动到上一个节点
    if (state.highlightedNavigationIndex < 0) {
        state.highlightedNavigationIndex = state.highlightedNodesSequence.length - 1;
    } else {
        state.highlightedNavigationIndex = (state.highlightedNavigationIndex - 1 + state.highlightedNodesSequence.length) % state.highlightedNodesSequence.length;
    }
    
    const currentNode = state.highlightedNodesSequence[state.highlightedNavigationIndex];
    const nodeIndex = currentNode.node_index;
    
    console.log(`✨ B navigation: index=${state.highlightedNavigationIndex}, node=${nodeIndex}`);
    
    // 在SVG中找到对应的节点
    const nodeGroup = d3.select(`#tree-svg [data-node-index="${nodeIndex}"]`);
    
    if (nodeGroup.empty()) {
        console.warn(`⚠️ Node ${nodeIndex} not found in SVG, skipping...`);
        // 如果找不到节点，尝试上一个
        if (state.highlightedNavigationIndex > 0) {
            state.highlightedNavigationIndex--;
            navigateToPreviousHighlightedNode();
        }
        return;
    }
    
    // 获取节点数据
    const nodeData = nodeGroup.datum();
    
    // 清除之前节点的选中状态
    d3.select('#tree-svg').selectAll('.node').classed('selected', false);
    
    // 居中显示节点
    centerNodeInView(nodeData, 1.8);
    
    // 节点出现动画
    nodeGroup.transition()
        .duration(400)
        .ease(d3.easeCubicOut)
        .style('opacity', 1);
    
    nodeGroup.select('text')
        .transition()
        .delay(200)
        .duration(300)
        .ease(d3.easeCubicOut)
        .style('opacity', 0.95);
    
    // 高亮当前节点
    nodeGroup.classed('selected', true);
    
    // 显示节点详情
    state.selectedNode = nodeData;
    if (!nodeData.data.is_virtual) {
        renderNodeDetails(nodeData.data);
    } else {
        resetNodeDetails();
    }
}

// 渲染节点详情
function renderNodeDetails(node) {
    if (node.is_virtual) return;

    const sections = [
        { id: 'plan_changes', label: 'Plan & Changes', icon: '📋' },
        { id: 'code', label: 'Code', icon: '💻' },
        { id: 'analysis', label: 'Analysis', icon: '🔍' },
        { id: 'node_level_analysis', label: 'Node Analysis', icon: '🔬' }
    ];

    const metricText = node.metric !== null && node.metric !== undefined
        ? (typeof node.metric === 'number' ? node.metric.toFixed(4) : node.metric)
        : 'N/A';
    const parentLabel = node.parent_index === null || node.parent_index === undefined ? 'Root' : node.parent_index;
    const childCount = Array.isArray(node.children) ? node.children.length : 0;
    const competitionLabel = escapeHtml(state.currentCompetition?.displayName || node.demo_id || 'N/A');
    const planHtml = formatRichText(node.plan);
    const analysisHtml = formatRichText(node.analysis);
    const nodeAnalysisHtml = formatNodeAnalysis(node.node_level_analysis);
    const codeHtml = escapeHtml(node.code || '// No code available');
    
    // 使用正则表达式过滤changes中包含"不变"、"不xx改变"、"沿用"、"保持"的条目
    const filteredInsights = node.insights_from_parent && Array.isArray(node.insights_from_parent)
        ? node.insights_from_parent.filter(item => {
            const text = String(item || '').trim();
            if (!text) return false;
            
            // 过滤掉包含以下关键词的条目：不变、不改变、沿用、保持、无
            const patterns = [
                /不变/,                          // 匹配"不变"
                /不[^变]*改变/,                    // 匹配"不改变"、"不xx改变"等
                /沿用/,                          // 匹配"沿用"
                /保持/,                          // 匹配"保持"
                /无/                             // 匹配所有包含"无"的条目
            ];
            
            // 如果匹配到任何一个模式，则过滤掉
            return !patterns.some(pattern => pattern.test(text));
        })
        : [];
    
    // 如果changes为空，则不显示changes部分
    const changesHtml = filteredInsights.length > 0
        ? `<div class="list-section"><ul>${filteredInsights.map(item => `<li><div class="highlight-block"><span class="highlight-block-value">${escapeHtml(item)}</span></div></li>`).join('')}</ul></div>`
        : '';
    
    // 合并plan和changes（如果changes为空，只显示plan）
    const planChangesHtml = `
        <div class="plan-changes-container">
            <div class="plan-section">
                <h3 class="section-title">Plan</h3>
                <div class="text-block">${planHtml}</div>
            </div>
            ${changesHtml ? `
            <div class="changes-section">
                <h3 class="section-title">Changes</h3>
                ${changesHtml}
            </div>
            ` : ''}
        </div>
    `;

    const detailsHtml = `
        <div class="details-pages">
            <div class="pages-header">
                <div class="header-meta">
                    <span class="node-pill">Node ${node.node_index}</span>
                    <div class="node-badges">
                        ${node.is_bug === 'True' || node.is_bug === true
                            ? '<span class="badge error">Bug</span>'
                            : '<span class="badge success">Success</span>'}
                        ${node.metric !== null && node.metric !== undefined
                            ? `<span class="badge info">Metric · ${metricText}</span>`
                            : ''}
                    </div>
                </div>
                <p class="header-subtitle">${competitionLabel}</p>
            </div>

            <div class="page-tabs">
                ${sections.map((s, i) => `
                    <button class="page-tab ${i === 0 ? 'active' : ''}" data-section="${s.id}">
                        ${s.icon} ${s.label}
                    </button>
                `).join('')}
            </div>

            <div class="page-content">
                <div id="section-plan_changes" class="page-section active">${planChangesHtml}</div>
                <div id="section-code" class="page-section"><pre class="code-block"><code class="language-python">${codeHtml}</code></pre></div>
                <div id="section-analysis" class="page-section"><div class="text-block">${analysisHtml}</div></div>
                <div id="section-node_level_analysis" class="page-section"><div class="text-block">${nodeAnalysisHtml}</div></div>
            </div>
        </div>
    `;

    elements.nodeDetails.classList.remove('details-active');
    const contentDiv = elements.nodeDetails.querySelector('.node-details-content');
    if (contentDiv) {
        contentDiv.innerHTML = detailsHtml;
    } else {
        elements.nodeDetails.innerHTML = '<div class="node-details-resize-handle" id="resize-handle"></div><div class="node-details-content">' + detailsHtml + '</div>';
        setupResizeHandle();
    }

    const tabs = elements.nodeDetails.querySelectorAll('.page-tab');
    const sectionsDom = elements.nodeDetails.querySelectorAll('.page-section');
    
    // 存储当前选中的section索引，用于键盘导航（默认显示Plan & Changes）
    state.currentSectionIndex = 0;
    
    function switchSection(index) {
        if (index < 0 || index >= tabs.length) return;
        
        tabs.forEach((t, i) => {
            t.classList.toggle('active', i === index);
        });
        
        sectionsDom.forEach((section, i) => {
            section.classList.toggle('active', i === index);
        });
        
        state.currentSectionIndex = index;
        
        // 如果切换到代码标签，重新高亮
        const sectionId = tabs[index].dataset.section;
        if (sectionId === 'code') {
            setTimeout(() => {
                const codeElement = elements.nodeDetails.querySelector('code.language-python');
                if (codeElement && typeof Prism !== 'undefined') {
                    Prism.highlightElement(codeElement);
                }
            }, 50);
        }
    }
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            switchSection(index);
        });
    });
    
    // 保存switchSection函数到state，供键盘事件使用
    state.switchSection = switchSection;

    requestAnimationFrame(() => {
        elements.nodeDetails.classList.add('details-active');
        
        // 高亮代码
        const codeElement = elements.nodeDetails.querySelector('code.language-python');
        if (codeElement && typeof Prism !== 'undefined') {
            Prism.highlightElement(codeElement);
        }
    });
}

// 工具函数
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatRichText(text) {
    if (!text || !text.trim()) {
        return '<div class="text-block-content"><p class="muted">No data available.</p></div>';
    }

    const content = text
        .trim()
        .split(/(?:\r?\n){2,}/)
        .map(block => {
            const lines = block
                .split(/\r?\n/)
                .map(line => escapeHtml(line.trim()))
                .filter(Boolean);
            if (!lines.length) return '';
            return `<p>${lines.join('<br/>')}</p>`;
        })
        .filter(Boolean)
        .join('');
    
    return `<div class="text-block-content">${content}</div>`;
}

// 格式化Node Analysis文本（处理"标题: 内容"格式）
function formatNodeAnalysis(text) {
    if (!text || !text.trim()) {
        return '<div class="text-block-content"><p class="muted">No data available.</p></div>';
    }

    const lines = text.trim().split(/\r?\n/).filter(line => line.trim());
    const blocks = [];
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        // 检查是否是"标题: 内容"格式
        const colonIndex = trimmed.indexOf(':');
        if (colonIndex > 0 && colonIndex < trimmed.length - 1) {
            const title = trimmed.substring(0, colonIndex).trim();
            const content = trimmed.substring(colonIndex + 1).trim();
            
            if (title && content) {
                blocks.push(`
                    <div class="highlight-block">
                        <span class="highlight-block-label">${escapeHtml(title)}</span>
                        <span class="highlight-block-value">${escapeHtml(content)}</span>
                    </div>
                `);
                continue;
            }
        }
        
        // 如果不是标准格式，作为普通段落处理
        blocks.push(`<div class="highlight-block"><span class="highlight-block-value">${escapeHtml(trimmed)}</span></div>`);
    }
    
    return `<div class="text-block-content">${blocks.join('')}</div>`;
}

function resetNodeDetails() {
    elements.nodeDetails.classList.remove('details-active');
    const contentDiv = elements.nodeDetails.querySelector('.node-details-content') || document.createElement('div');
    contentDiv.className = 'node-details-content';
    contentDiv.innerHTML = DETAILS_PLACEHOLDER_HTML;
    if (!elements.nodeDetails.querySelector('.node-details-content')) {
        elements.nodeDetails.innerHTML = '<div class="node-details-resize-handle" id="resize-handle"></div>';
        elements.nodeDetails.appendChild(contentDiv);
        setupResizeHandle();
    }
}

// 设置调整大小功能
function setupResizeHandle() {
    const resizeHandle = document.getElementById('resize-handle');
    const nodeDetails = elements.nodeDetails;
    
    if (!resizeHandle || !nodeDetails) return;
    
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;
    
    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = nodeDetails.offsetWidth;
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        const diff = startX - e.clientX; // 向左拖动是增加宽度
        const newWidth = startWidth + diff;
        const minWidth = 520;
        const maxWidth = window.innerWidth * 0.5; // 屏幕宽度的50%
        
        if (newWidth >= minWidth && newWidth <= maxWidth) {
            nodeDetails.style.width = `${newWidth}px`;
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    // 如果切换到tree-viewer页面，确保play按钮事件已绑定
    if (pageId === 'tree-viewer') {
        setTimeout(() => {
            setupPlayButton();
        }, 100);
    }
}

// 设置Play按钮事件监听
function setupPlayButton() {
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    
    // 更新elements引用
    if (playBtn) elements.playBtn = playBtn;
    if (playIcon) elements.playIcon = playIcon;
    if (pauseIcon) elements.pauseIcon = pauseIcon;
    
    if (elements.playBtn) {
        // 直接添加事件监听器，不克隆节点（避免重复绑定）
        // 先移除所有可能存在的旧监听器
        const newBtn = elements.playBtn.cloneNode(true);
        elements.playBtn.parentNode.replaceChild(newBtn, elements.playBtn);
        elements.playBtn = newBtn;
        
        // 重新获取图标引用
        elements.playIcon = document.getElementById('play-icon');
        elements.pauseIcon = document.getElementById('pause-icon');
        
        console.log('✅ Play button found, adding event listener');
        
        // 使用多种方式确保事件绑定
        elements.playBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Play button clicked! (onclick)');
            startPlayback();
            return false;
        };
        
        elements.playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🖱️ Play button clicked! (addEventListener)');
            startPlayback();
            return false;
        }, true);
    } else {
        console.warn('⚠️ Play button not found!');
    }
}

// 设置事件监听器
function setupEventListeners() {
    elements.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = state.competitions.filter(c => 
            c.displayName.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)
        );
        renderCompetitionGrid(filtered);
    });
    
    elements.backBtn.addEventListener('click', () => {
        stopPlayback(); // 停止播放
        showPage('competition-selector');
        state.selectedNode = null;
        resetNodeDetails();
        d3.select('#tree-svg').selectAll('*').remove();
    });
    
    // 播放速度控制
    if (elements.playbackSpeed) {
        elements.playbackSpeed.addEventListener('change', (e) => {
            state.playbackSpeed = parseFloat(e.target.value);
            console.log(`🎛️ Playback speed changed to ${state.playbackSpeed}x`);
        });
    }
    
    // Play按钮事件监听（在页面显示时绑定）
    setupPlayButton();
    
    // 高亮视图切换按钮
    if (elements.highlightViewBtn) {
        elements.highlightViewBtn.addEventListener('click', () => {
            toggleHighlightView();
        });
    }
    
    // 键盘导航支持
    document.addEventListener('keydown', (e) => {
        // 只在tree-viewer页面时响应
        if (!elements.treeViewer.classList.contains('active')) {
            return;
        }
        
        // 检查是否在输入框中（避免在搜索时触发）
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // Tab键导航到下一个节点（DFS序）
        if (e.key === 'Tab') {
            e.preventDefault(); // 阻止默认的Tab行为（切换焦点）
            navigateToNextNode();
            return;
        }
        
        // J键导航到下一个高亮节点（DFS序）
        if (e.key === 'j' || e.key === 'J') {
            e.preventDefault();
            navigateToNextHighlightedNode();
            return;
        }
        
        // B键导航到上一个高亮节点（DFS序）
        if (e.key === 'b' || e.key === 'B') {
            e.preventDefault();
            navigateToPreviousHighlightedNode();
            return;
        }
        
        // 左右箭头键切换section（仅在已选择节点时）
        if (state.selectedNode && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            e.preventDefault();
            
            if (!state.switchSection) return;
            
            const currentIndex = state.currentSectionIndex || 0;
            const tabs = elements.nodeDetails.querySelectorAll('.page-tab');
            const totalSections = tabs.length;
            
            if (e.key === 'ArrowRight') {
                // 下一个section
                const nextIndex = (currentIndex + 1) % totalSections;
                state.switchSection(nextIndex);
            } else {
                // 上一个section
                const prevIndex = (currentIndex - 1 + totalSections) % totalSections;
                state.switchSection(prevIndex);
            }
        }
    });
}

// 启动
init();
