# ML Evolution Visualization

A modern, elegant web application for visualizing the evolution paths of Kaggle competition solutions.

## ✨ Features

- 🎯 **Competition Selection** - Browse and select from 76 Kaggle competitions
- 🌳 **Interactive Tree Visualization** - D3.js-based tree rendering with smooth drag and zoom
- 🔍 **Search Functionality** - Quickly find specific competitions
- 📊 **Detailed Node Information** - View all node properties in a tabbed interface
- 🎨 **Modern Dark Theme** - Bold purple accents with excellent readability
- 💻 **Code Highlighting** - Syntax-highlighted code blocks (Prism.js)
- 📱 **Responsive Layout** - Works on desktop and mobile devices
- 🎯 **Resizable Sidebar** - Drag to adjust detail panel width (up to 50% screen width)
- 📝 **Markdown-style Blocks** - Clean text blocks with highlight cards

## 🎨 Design

The application uses a modern dark theme:
- Deep dark backgrounds with subtle gradients
- Bold purple/violet accents (#8B5CF6, #A78BFA)
- High contrast text for excellent readability
- Code blocks with dark theme and syntax highlighting
- Highlight blocks with gradient borders and glow effects

## 🚀 Getting Started

### Prerequisites

You need a local web server to run this application (due to browser security restrictions on loading JSON files).

### Installation & Running

#### Option 1: Python (Recommended)

**Windows:**
```bash
# Double-click start.bat
# OR run manually:
python -m http.server 8000
```

**Mac/Linux:**
```bash
# Make executable (first time only)
chmod +x start.sh

# Run
./start.sh

# OR run manually:
python3 -m http.server 8000
```

Then visit: http://localhost:8000

#### Option 2: Node.js

```bash
npx http-server -p 8000
```

Then visit: http://localhost:8000

#### Option 3: VS Code Live Server

1. Install the "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

## 📖 Usage Guide

### 1. Browse Competitions

- View all 76 available competitions in a card grid
- Use the search box to filter by name
- Click any card to explore its evolution tree

### 2. Explore the Tree

**Navigation:**
- **Drag**: Click and drag the background to pan
- **Zoom**: Use mouse wheel to zoom in/out
- **Reset**: Click the reset button to return to initial view
- **Fit**: Click the fit button to auto-fit the tree to screen

**Node Colors:**
- 🟢 **Green** - Success nodes (have metrics)
- 🔴 **Red** - Bug nodes
- 🟡 **Yellow** - Other nodes

**Interactions:**
- **Hover**: Node highlights on hover
- **Click**: Select node to view details

### 3. View Node Details

The right panel shows comprehensive information in tabs:

- **📊 Overview** - Node metadata (index, parent, metric, status)
- **📋 Plan** - Solution approach and strategy
- **💻 Code** - Implementation code with syntax highlighting
- **🔍 Analysis** - Execution results and analysis
- **🔬 Node Analysis** - Detailed technical breakdown
- **💡 Changes** - Key improvements from parent node

### 4. Navigate Between Tabs

- Click any tab to switch views
- Each section uses appropriate formatting:
  - Code: Dark theme with syntax highlighting
  - Text: Clean, readable formatting
  - Lists: Organized with visual separators

## 📁 Project Structure

```
.
├── index.html              # Main HTML structure
├── style.css              # Anthropic-inspired styles
├── app.js                 # Canvas rendering & logic
├── struct_out/            # Competition data
│   └── *_nodes.json       # Individual competition files
├── start.bat              # Windows launch script
├── start.sh               # Mac/Linux launch script
└── README.md              # This file
```

## 🔧 Technical Details

### Data Format

Each node contains:
- `demo_id`: Competition identifier
- `node_index`: Unique node number
- `parent_index`: Parent node reference
- `metric`: Performance metric (if available)
- `plan`: Solution strategy
- `code`: Implementation code
- `analysis`: Execution results
- `is_bug`: Bug indicator
- `node_level_analysis`: Technical breakdown
- `insights_from_parent`: Improvement insights

### Technologies

- **D3.js** - Interactive tree visualization and layouts
- **Vanilla JavaScript** - Core application logic
- **Prism.js** - Code syntax highlighting
- **CSS3** - Modern styling with custom properties and animations
- **Inter & JetBrains Mono** - Beautiful typography

### Performance Features

- SVG-based rendering for smooth interactions
- High-DPI display support
- Efficient D3.js tree layout algorithm
- Lazy loading of competition data
- Optimized for large trees
- Smooth transitions and animations

## 🎯 Node Color Legend

| Color | Meaning | Criteria |
|-------|---------|----------|
| 🟢 Green | Success | Node has a metric value |
| 🔴 Red | Error | Node is marked as bug |
| 🟡 Yellow | Pending | Other states |

## 💡 Tips & Tricks

1. **Large Trees**: Use fit-to-screen for better overview
2. **Code Reading**: Click tabs to switch between plan, code, and analysis
3. **Navigation**: Drag to explore, zoom for details
4. **Comparison**: Select different nodes to compare approaches
5. **Search**: Filter competitions by name or topic

## 🌐 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with Canvas support

## 🎓 Use Cases

- **Learning**: Study ML solution evolution
- **Research**: Analyze approach improvements
- **Teaching**: Demonstrate iterative development
- **Debugging**: Trace bug fixes and improvements

## 🔍 Example Workflows

### Studying a Competition

1. Search for the competition name
2. Click to open tree view
3. Start from root node (usually first attempt)
4. Follow successful branches (green nodes)
5. Read insights to understand improvements

### Comparing Approaches

1. Select a node to view its approach
2. Note the metric and strategy
3. Click child nodes to see variations
4. Compare insights to understand evolution

### Understanding Failures

1. Find red (bug) nodes in the tree
2. Read the analysis to see what went wrong
3. Check child nodes to see how it was fixed
4. Learn from the debugging process

## 🛠️ Customization

### Colors

Edit CSS custom properties in `style.css`:

```css
:root {
    --primary-color: #CC785C;
    --bg-primary: #F4EDE4;
    /* ... more variables */
}
```

### Tree Layout

Adjust spacing in `app.js`:

```javascript
const nodeSpacing = 150;  // Horizontal spacing
const levelHeight = 100;  // Vertical spacing
```

## 📦 Deployment

### GitHub Pages 部署

📖 **完整部署教程请查看：[DEPLOY.md](DEPLOY.md)**

快速步骤：
1. 推送代码到 GitHub（公开仓库）
2. Settings → Pages → 选择 "Deploy from a branch" → main 分支
3. 等待 1-2 分钟，访问你的网站

## 📝 License

This project is for educational and research purposes.

---

**Enjoy exploring ML evolution paths!** 🚀
