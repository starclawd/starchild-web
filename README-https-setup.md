# 本地 HTTPS 开发环境配置指南

本指南将帮助你配置 mkcert + 本地域名 + HTTPS 本地服务器，用于测试谷歌登录等需要 HTTPS 的功能。

## 快速开始

### 1. 一键配置

运行以下命令自动完成所有配置：

```bash
yarn setup:https
```

这个命令会自动：

- 安装 mkcert（如果未安装）
- 生成 SSL 证书
- 配置 /etc/hosts 文件（需要输入密码）
- 添加 certs/ 到 .gitignore

### 2. 启动开发服务器

```bash
yarn start:https
```

### 3. 访问应用

在浏览器中打开：

```
https://starchild.dev:6066
```

## 详细说明

### 证书位置

生成的证书文件位于项目根目录的 `certs/` 文件夹：

- `certs/cert.pem` - SSL 证书
- `certs/key.pem` - 私钥

### hosts 文件配置

脚本会自动添加以下内容到 `/etc/hosts`：

```
127.0.0.1 starchild.dev
```

如果自动配置失败，请手动编辑：

```bash
sudo nano /etc/hosts
```

### 手动安装（如果自动脚本失败）

#### 1. 安装 mkcert

```bash
brew install mkcert
brew install nss # 如果使用 Firefox
```

#### 2. 安装本地 CA

```bash
mkcert -install
```

#### 3. 生成证书

```bash
mkdir -p certs
cd certs
mkcert starchild.dev localhost 127.0.0.1 ::1
mv starchild.dev+3.pem cert.pem
mv starchild.dev+3-key.pem key.pem
```

#### 4. 配置 hosts

```bash
echo "127.0.0.1 starchild.dev" | sudo tee -a /etc/hosts
```

## 常见问题

### Q: 浏览器提示证书不安全

**A:** 运行以下命令重新安装本地 CA：

```bash
mkcert -install
```

### Q: 无法访问 https://starchild.dev:6066

**A:** 检查以下几点：

1. 确认开发服务器正在运行
2. 确认 hosts 文件配置正确：`cat /etc/hosts | grep starchild`
3. 尝试刷新 DNS 缓存：`sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder`

### Q: 需要重新生成证书

**A:** 删除 certs 目录后重新运行配置脚本：

```bash
rm -rf certs
yarn setup:https
```

### Q: 在其他设备上测试（手机、平板等）

**A:** 需要进行额外配置：

1. 获取你的本地 IP：`ifconfig | grep "inet "`
2. 在其他设备上配置 DNS 或 hosts，将 starchild.dev 指向你的 IP
3. 在其他设备上安装 CA 证书（需要从开发机导出）

## 技术细节

### vite.config.ts 配置

项目的 `vite.config.ts` 已经配置好 HTTPS 支持：

```typescript
// HTTPS 配置
function getHttpsConfig() {
  const certPath = path.join(__dirname, 'certs/cert.pem')
  const keyPath = path.join(__dirname, 'certs/key.pem')

  if (existsSync(certPath) && existsSync(keyPath)) {
    return {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    }
  }

  return false
}

// 在 server 配置中使用
server: {
  https: getHttpsConfig(),
  allowedHosts: ['starchild.dev'],
  // ...
}
```

### 安全性说明

- 证书文件（`certs/`）已添加到 `.gitignore`，不会被提交到版本库
- mkcert 生成的证书仅在本地开发环境受信任
- 这些证书不应用于生产环境

## 谷歌登录配置

配置 HTTPS 后，需要在 Google Cloud Console 中添加授权来源：

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 选择你的项目
3. 进入 "APIs & Services" > "Credentials"
4. 编辑 OAuth 2.0 客户端 ID
5. 在 "Authorized JavaScript origins" 中添加：
   ```
   https://starchild.dev:6066
   ```
6. 在 "Authorized redirect URIs" 中添加（如果需要）：
   ```
   https://starchild.dev:6066/callback
   ```
7. 保存更改

## 参考资源

- [mkcert GitHub](https://github.com/FiloSottile/mkcert)
- [Vite HTTPS 配置](https://vitejs.dev/config/server-options.html#server-https)
