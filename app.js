// 全局状态
const state = {
    competitions: [],
    currentCompetition: null,
    currentTree: null,
    selectedNode: null
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
    fitScreenBtn: document.getElementById('fit-screen-btn')
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
    
    try {
        const response = await fetch(`struct_out/${competition.filename}`);
        const data = await response.json();
        state.currentTree = buildTreeStructure(data);
        
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

// 渲染树
function renderTree(root) {
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
        .attr('y2', 0);
    gradient.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(96,165,250,0.45)');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(129,140,248,0.35)');

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

    const treeLayout = d3.tree().nodeSize([48, 240]);
    const hierarchyRoot = d3.hierarchy(root);
    treeLayout(hierarchyRoot);

    const nodes = hierarchyRoot.descendants();
    const links = hierarchyRoot.links();

    const minX = d3.min(nodes, d => d.x) ?? 0;
    const maxX = d3.max(nodes, d => d.x) ?? 0;
    const minY = d3.min(nodes, d => d.y) ?? 0;
    const maxY = d3.max(nodes, d => d.y) ?? 0;

    const treeWidth = Math.max(1, maxY - minY);
    const treeHeight = Math.max(1, maxX - minX);
    const availableWidth = Math.max(240, width - 240);
    const availableHeight = Math.max(200, height - 200);
    const initialScale = Math.min(2.6, Math.max(0.35, Math.min(availableWidth / treeWidth, availableHeight / treeHeight)));

    const translateX = width / 2 - ((minY + treeWidth / 2) * initialScale);
    const translateY = height / 2 - ((minX + treeHeight / 2) * initialScale);

    const linkGenerator = d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x);

    const linkSelection = g.selectAll('.link')
        .data(links)
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('stroke', 'url(#tree-link-gradient)')
        .attr('stroke-linecap', 'round')
        .attr('d', d => {
            const origin = { x: d.source.x, y: d.source.y };
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
            if (d.data.is_virtual) return 'node virtual';
            if (d.data.is_bug === 'True' || d.data.is_bug === true) return 'node bug';
            if (d.data.metric !== null && d.data.metric !== undefined) return 'node success';
            return 'node normal';
        })
        .attr('transform', d => {
            const start = d.parent || d;
            return `translate(${start.y},${start.x})`;
        })
        .style('opacity', 0)
        .on('click', (event, d) => {
            event.stopPropagation();
            selectNode(event.currentTarget, d);
        });

    nodeSelection.append('circle')
        .attr('class', 'node-halo')
        .attr('r', d => (d.data.is_virtual ? 0 : 14));

    nodeSelection.append('circle')
        .attr('r', d => (d.data.is_virtual ? 0 : 8))
        .attr('filter', d => (d.data.is_virtual ? null : 'url(#node-shadow)'));

    nodeSelection.append('text')
        .attr('dy', -18)
        .attr('text-anchor', 'middle')
        .text(d => (d.data.is_virtual ? '' : `Node ${d.data.node_index}`))
        .style('opacity', 0);

    nodeSelection.transition()
        .duration(750)
        .ease(d3.easeCubicOut)
        .attr('transform', d => `translate(${d.y},${d.x})`)
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
        .scaleExtent([0.2, 3.5])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    svg.call(zoom);

    const initialTransform = d3.zoomIdentity.translate(translateX, translateY).scale(initialScale);
    svg.call(zoom.transform, initialTransform);

    elements.resetViewBtn.onclick = () => {
        svg.transition()
            .duration(650)
            .ease(d3.easeCubicOut)
            .call(zoom.transform, initialTransform);
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
}

// 渲染节点详情
function renderNodeDetails(node) {
    if (node.is_virtual) return;

    const sections = [
        { id: 'overview', label: 'Overview', icon: '📊' },
        { id: 'plan', label: 'Plan', icon: '📋' },
        { id: 'code', label: 'Code', icon: '💻' },
        { id: 'analysis', label: 'Analysis', icon: '🔍' },
        { id: 'node_level_analysis', label: 'Node Analysis', icon: '🔬' },
        { id: 'insights_from_parent', label: 'Changes', icon: '💡' }
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
    const insightsHtml = node.insights_from_parent && node.insights_from_parent.length > 0
        ? `<div class="list-section"><ul>${node.insights_from_parent.map(item => `<li><div class="highlight-block"><span class="highlight-block-value">${escapeHtml(item)}</span></div></li>`).join('')}</ul></div>`
        : '<div class="text-block muted"><div class="text-block-content"><p>No changes have been logged for this iteration yet.</p></div></div>';

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
                <div id="section-overview" class="page-section active">
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="highlight-block">
                                <span class="highlight-block-label">Competition</span>
                                <span class="highlight-block-value">${competitionLabel}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="highlight-block">
                                <span class="highlight-block-label">Parent</span>
                                <span class="highlight-block-value">${escapeHtml(String(parentLabel))}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="highlight-block">
                                <span class="highlight-block-label">Children</span>
                                <span class="highlight-block-value">${childCount}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="highlight-block">
                                <span class="highlight-block-label">Metric</span>
                                <span class="highlight-block-value">${metricText}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="highlight-block">
                                <span class="highlight-block-label">Status</span>
                                <span class="highlight-block-value">${node.is_bug === 'True' || node.is_bug === true ? 'Bug flagged' : 'Healthy'}</span>
                            </div>
                        </div>
                        <div class="info-item">
                            <div class="highlight-block">
                                <span class="highlight-block-label">Node Index</span>
                                <span class="highlight-block-value">${node.node_index}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-plan" class="page-section"><div class="text-block">${planHtml}</div></div>
                <div id="section-code" class="page-section"><pre class="code-block"><code class="language-python">${codeHtml}</code></pre></div>
                <div id="section-analysis" class="page-section"><div class="text-block">${analysisHtml}</div></div>
                <div id="section-node_level_analysis" class="page-section"><div class="text-block">${nodeAnalysisHtml}</div></div>
                <div id="section-insights_from_parent" class="page-section">${insightsHtml}</div>
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
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const sectionId = tab.dataset.section;
            sectionsDom.forEach(section => {
                section.classList.toggle('active', section.id === `section-${sectionId}`);
            });
            
            // 如果切换到代码标签，重新高亮
            if (sectionId === 'code') {
                setTimeout(() => {
                    const codeElement = elements.nodeDetails.querySelector('code.language-python');
                    if (codeElement && typeof Prism !== 'undefined') {
                        Prism.highlightElement(codeElement);
                    }
                }, 50);
            }
        });
    });

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
        showPage('competition-selector');
        state.selectedNode = null;
        resetNodeDetails();
        d3.select('#tree-svg').selectAll('*').remove();
    });
}

// 启动
init();
