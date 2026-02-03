#!/bin/bash

echo "🔧 正在安装 Git Hooks..."

# 创建 .git/hooks 目录（如果不存在）
mkdir -p .git/hooks

# 复制 hooks 到 .git/hooks 目录
cp .githooks/* .git/hooks/ 2>/dev/null || true

# 设置执行权限
chmod +x .git/hooks/pre-push 2>/dev/null || true

echo "✅ Git Hooks 安装完成！"
echo "📋 已安装的 hooks:"
ls -la .git/hooks/ | grep -E "\.(sh|bash)$" || echo "  暂无 hooks 文件"
