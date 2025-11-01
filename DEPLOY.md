# 🚀 GitHub Pages 部署教程 - 完整步骤

## 准备工作

确保你的项目包含以下文件：
- ✅ `index.html`
- ✅ `style.css`
- ✅ `app.js`
- ✅ `struct_out/` 目录（包含所有 JSON 文件）
- ✅ `README.md`

## 步骤 1：初始化 Git 仓库

在项目目录下打开终端（PowerShell 或 CMD），执行：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: ML Evolution Visualization"
```

## 步骤 2：创建 GitHub 仓库

1. 打开浏览器，访问：**https://github.com/new**

2. 填写仓库信息：
   - **Repository name**: 输入仓库名称（例如：`tree-analysis`）
   - **Description**: （可选）描述你的项目
   - **Visibility**: 选择 **Public** ⚠️（必须公开才能免费使用 Pages）
   - **不要勾选** "Add a README file"（我们已经有了）

3. 点击 **Create repository**（创建仓库）

## 步骤 3：连接到 GitHub 并推送代码

创建仓库后，GitHub 会显示推送命令。复制并执行：

```bash
# 设置主分支为 main
git branch -M main

# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送代码到 GitHub
git push -u origin main
```

**示例**：
如果你的 GitHub 用户名是 `john`，仓库名是 `tree-analysis`，命令是：
```bash
git remote add origin https://github.com/john/tree-analysis.git
git push -u origin main
```

## 步骤 4：启用 GitHub Pages

1. 进入你的 GitHub 仓库页面

2. 点击仓库右上角的 **Settings**（设置）按钮

3. 在左侧菜单中，找到并点击 **Pages**（页面）

4. 在 **Build and deployment**（构建和部署）部分：
   - **Source**: 选择 **Deploy from a branch**
   - **Branch**: 
     - 选择 **main**
     - 文件夹选择 **/ (root)**
   - 点击 **Save**（保存）

5. 等待几秒钟，页面会显示部署地址

## 步骤 5：访问你的网站

部署完成后（通常需要 1-2 分钟），你的网站地址格式为：

```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

**示例**：
- 用户名：`john`
- 仓库名：`tree-analysis`
- 网站地址：`https://john.github.io/tree-analysis/`

## 步骤 6：验证部署

1. 访问你的网站地址
2. 如果看到你的应用界面，说明部署成功！
3. 如果显示 404，等待 2-5 分钟后再试

## 🔄 更新网站

每次修改代码后，推送更新：

```bash
git add .
git commit -m "Update: 描述你的更改"
git push
```

GitHub Pages 会自动重新部署（等待 1-2 分钟）。

## ❓ 常见问题

### 问题 1：找不到 Pages 选项

**原因**：仓库可能是私有的

**解决**：
1. 进入 Settings
2. 滚动到最下方
3. 找到 "Danger Zone"
4. 点击 "Change visibility"
5. 改为 "Make public"

### 问题 2：页面显示 404

**解决**：
- 等待 2-5 分钟让部署完成
- 检查 Settings → Pages 是否有绿色成功提示
- 确认文件路径正确

### 问题 3：推送代码时出错

**解决**：
```bash
# 如果提示需要认证，使用个人访问令牌
# 或者使用 GitHub Desktop 客户端
```

### 问题 4：想使用私有仓库

**选项**：
- 升级到 GitHub Pro（付费）
- 或使用 Vercel/Netlify（免费支持私有仓库）

## 🎉 完成！

部署成功后，你的 ML Evolution Visualization 应用就可以在线访问了！

记得将网站地址添加到 README.md 中，方便其他人访问。

