---
name: https
description: HTTPS 本地开发配置。当需要配置 HTTPS、本地域名、SSL 证书、谷歌登录时使用此技能。
---

# HTTPS 本地开发配置

> 详细文档：[README-https-setup.md](../../../README-https-setup.md)

## 快速配置

```bash
# 一键配置（安装 mkcert + 生成证书 + 配置 hosts）
yarn setup:https

# 启动 HTTPS 服务
yarn start:https
```

访问地址：`https://starchild.dev:6066`

## 证书位置

```
certs/
├── cert.pem   # SSL 证书
└── key.pem    # 私钥
```

## 手动配置（如自动脚本失败）

```bash
# 1. 安装 mkcert
brew install mkcert
mkcert -install

# 2. 生成证书
mkdir -p certs && cd certs
mkcert starchild.dev localhost 127.0.0.1 ::1
mv starchild.dev+3.pem cert.pem
mv starchild.dev+3-key.pem key.pem

# 3. 配置 hosts
echo "127.0.0.1 starchild.dev" | sudo tee -a /etc/hosts
```

## 常见问题

| 问题 | 解决方案 |
| ---- | -------- |
| 证书不安全 | `mkcert -install` |
| 无法访问 | 检查 `cat /etc/hosts \| grep starchild` |
| 重新生成 | `rm -rf certs && yarn setup:https` |
| 代理导致无法访问 | 见下方「代理绕过配置」 |

## 代理绕过配置

如果使用代理软件（ClashX、Surge 等），访问 `https://starchild.dev:6066` 可能失败。

### 方案：macOS 系统代理排除（推荐）

1. 打开 **系统设置** → **网络** → 选择当前网络（Wi-Fi）
2. 点击 **详细信息** → **代理**
3. 在「**忽略这些主机与域的代理设置**」中添加：
   ```
   starchild.dev, starchild.local, localhost, 127.0.0.1
   ```
4. 点击「好」保存

### 备选方案：终端环境变量

在 `~/.zshrc` 中添加：

```bash
export no_proxy="localhost,127.0.0.1,starchild.dev,starchild.local"
export NO_PROXY="localhost,127.0.0.1,starchild.dev,starchild.local"
```

> 注意：终端环境变量只对命令行生效，浏览器需要使用系统代理排除。

## 谷歌登录配置

在 Google Cloud Console 添加授权来源：
- Authorized JavaScript origins: `https://starchild.dev:6066`
- Authorized redirect URIs: `https://starchild.dev:6066/callback`
