# 🚀 GitHub Pages 部署指南

## 快速部署步骤

### 1. 初始化 Git 仓库

```bash
git init
git add .
git commit -m "Initial commit: ML Evolution Visualization"
```

### 2. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 创建新仓库（例如：`TreeAnalysis-deploy`）
3. **不要**勾选 "Initialize with README"（因为我们已经有了）

### 3. 推送到 GitHub

```bash
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

将 `YOUR_USERNAME` 和 `YOUR_REPO_NAME` 替换为你的实际信息。

### 4. 启用 GitHub Pages

1. 进入仓库的 **Settings**（设置）
2. 在左侧菜单找到 **Pages**（页面）
3. 在 **Source**（源）下选择 **GitHub Actions**
4. 保存设置

### 5. 等待部署完成

- 进入 **Actions**（操作）标签页
- 等待 "Deploy to GitHub Pages" 工作流完成（通常需要 1-2 分钟）
- 部署成功后，你的网站将在以下地址可用：
  ```
  https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
  ```

## 更新部署

每次推送代码到 `main` 分支时，GitHub Actions 会自动重新部署：

```bash
git add .
git commit -m "Update: description of changes"
git push
```

## 故障排除

### 如果部署失败

1. 检查 **Actions** 标签页中的错误信息
2. 确保所有文件都已提交（包括 `struct_out/` 目录）
3. 确保 `.github/workflows/deploy.yml` 文件存在

### 检查文件结构

确保以下文件存在：
- ✅ `index.html`
- ✅ `style.css`
- ✅ `app.js`
- ✅ `struct_out/` 目录及其所有 JSON 文件
- ✅ `.github/workflows/deploy.yml`

### 手动触发部署

如果自动部署未触发，可以手动触发：
1. 进入 **Actions** 标签页
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow" 按钮

## 📝 注意事项

- GitHub Pages 部署可能需要几分钟时间
- 首次部署可能需要更长时间
- 确保你的仓库是公开的（Public），或者升级到 GitHub Pro 以使用私有仓库的 Pages
- 文件路径区分大小写，确保大小写正确

## 🎉 完成！

部署成功后，你的 ML Evolution Visualization 应用就可以在线访问了！

