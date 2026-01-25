---
name: deploy
description: 部署规则。当需要部署项目、发布版本、打 tag 时使用此技能。
---

# 部署规则

## ⚠️ 部署前必须确认

**如果用户没有说明部署环境，必须先询问：**

> 请确认要部署到哪个环境？
>
> 1. 测试网 (testnet)
> 2. 主网 (mainnet)

---

## 测试网部署

### 分支和 Tag 规则

| 项目       | 值                            |
| ---------- | ----------------------------- |
| 分支       | `test`                        |
| Tag 格式   | `test1.1.3-N`（N 为递增数字） |
| Dockerfile | `Dockerfile.testnet`          |

### 部署步骤

```bash
# 1. 切换到 test 分支并拉取最新代码
git checkout test
git pull origin test

# 2. 查看最新的测试网 tag
git tag -l "test*" --sort=-v:refname | head -5

# 3. 根据最新 tag +1 打新 tag
# 例如：最新是 test1.1.3-10，则打 test1.1.3-11
git tag test1.1.3-11

# 4. 推送 tag 到远程（触发自动部署）
git push origin test1.1.3-11
```

### 示例

```bash
# 查看最新 tag
$ git tag -l "test*" --sort=-v:refname | head -1
test1.1.3-10

# 打新 tag（+1）
$ git tag test1.1.3-11

# 推送
$ git push origin test1.1.3-11
```

---

## 主网部署

### 分支和 Tag 规则

| 项目       | 值                         |
| ---------- | -------------------------- |
| 分支       | `main`                     |
| Tag 格式   | `v1.1.3-N`（N 为递增数字） |
| Dockerfile | `Dockerfile`               |

### 部署步骤

```bash
# 1. 切换到 main 分支并拉取最新代码
git checkout main
git pull origin main

# 2. 查看最新的主网 tag
git tag -l "v*" --sort=-v:refname | head -5

# 3. 根据最新 tag +1 打新 tag
# 例如：最新是 v1.1.3-10，则打 v1.1.3-11
git tag v1.1.3-11

# 4. 推送 tag 到远程（触发自动部署）
git push origin v1.1.3-11
```

### 示例

```bash
# 查看最新 tag
$ git tag -l "v*" --sort=-v:refname | head -1
v1.1.3-10

# 打新 tag（+1）
$ git tag v1.1.3-11

# 推送
$ git push origin v1.1.3-11
```

---

## 自动化脚本

推送 tag 后，远程 CI/CD 会自动：

1. 根据 tag 前缀判断环境（`test*` → 测试网，`v*` → 主网）
2. 使用对应的 Dockerfile 构建镜像
3. 部署到对应环境

---

## Tag 命名对照表

| 环境   | 分支   | Tag 格式                              | 示例           |
| ------ | ------ | ------------------------------------- | -------------- |
| 测试网 | `test` | `test{major}.{minor}.{patch}-{build}` | `test1.1.3-11` |
| 主网   | `main` | `v{major}.{minor}.{patch}-{build}`    | `v1.1.3-11`    |

---

## ⚠️ 注意事项

1. **必须在正确的分支上打 tag**
   - 测试网：必须在 `test` 分支
   - 主网：必须在 `main` 分支

2. **Tag 数字只递增最后一位**
   - `test1.1.3-10` → `test1.1.3-11` ✅
   - `test1.1.3-10` → `test1.1.4-1` ❌（除非版本升级）

3. **推送前确认 tag 正确**

   ```bash
   git tag -l | tail -5  # 确认本地 tag
   ```

4. **权限要求**
   ```
   required_permissions: ["git_write", "network"]
   ```
