---
name: permissions
description: 执行权限规则。当需要执行终端命令、安装依赖、遇到权限问题时使用此技能。
---

# 执行权限规则

执行终端命令时，**必须请求完整权限**以避免沙盒环境的权限限制。

## 权限配置

| 命令类型     | 权限配置                                    |
| ------------ | ------------------------------------------- |
| 所有终端命令 | `required_permissions: ["all"]`             |
| Git 操作     | `required_permissions: ["git_write", "network"]` |
| 网络请求     | `required_permissions: ["network"]`         |

> ⚠️ 不要使用默认的沙盒权限执行命令，否则可能会遇到权限错误。

## 安装依赖必须使用完整权限

```
yarn install        → required_permissions: ["all"]
yarn add <pkg>      → required_permissions: ["all"]
yarn add -D <pkg>   → required_permissions: ["all"]
```

**原因：** 沙盒环境会限制 node_modules 的写入权限，导致安装失败。
