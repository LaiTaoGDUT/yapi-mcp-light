# Yapi MCP Light

一个用于 YApi 的 Model Context Protocol (MCP) 服务器，让你能够在 Cursor 等 AI 编程工具中直接操作 YApi 接口文档。

## 致谢

本项目代码基于以下开源项目：
- **[[cross-request-master](https://github.com/leeguooooo/cross-request-master)]**

感谢原作者！

## 项目简介

Yapi MCP Light 是一个基于 [Model Context Protocol](https://modelcontextprotocol.io/) 的服务器，专为 YApi 接口管理平台设计。它允许你在 Cursor、Claude Desktop 等支持 MCP 的 AI 工具中直接：

- 🔍 **搜索和查看** YApi 项目中的接口文档
- ✏️ **创建和更新** 接口定义
- 📋 **管理项目和分类** 结构
- 🔗 **无缝集成** AI 编程工作流
- 🛠 **支持多个 YApi Project配置**

通过 MCP 协议，AI 助手可以理解你的 YApi 接口结构，在编程过程中提供更准确的建议和代码生成。

它是基于 **[[cross-request-master](https://github.com/leeguooooo/cross-request-master)]** 设计的轻量简单版本，只保留核心Yapi MCP能力，简化了工具配置和使用流程，即配即用，无需额外初始化操作。

## 主要功能

### 🔍 接口查询和搜索

- **yapi_search_apis**: 按名称、路径、标签等条件搜索接口
- **yapi_get_api_desc**: 获取特定接口的详细信息（请求/响应结构、参数等）
- **yapi_project_get**: 获取项目详情（对应 `/api/project/get`）
- **yapi_project_search**: 搜索项目（对应 `/api/project/search`）
- **yapi_list_projects**: 列出所有可访问的项目
- **yapi_get_categories**: 获取项目下的接口分类和接口列表（支持只返回分类/或包含接口列表）
- **yapi_update_token**: 全局模式登录下，刷新本地登录态 Cookie（只在遇到登陆验证失败时，手动调用`yapi_update_token(true)`尝试强制刷新）

**仅`yapi-toolset=full`可用:**
- **yapi_interface_get**: 获取接口原始数据（对应 `/api/interface/get`）
- **yapi_interface_list**: 获取接口列表（对应 `/api/interface/list`）
- **yapi_interface_list_cat**: 获取分类下接口列表（对应 `/api/interface/list_cat`）
- **yapi_interface_list_menu**: 获取接口菜单列表（对应 `/api/interface/list_menu`）
- **yapi_interface_get_cat_menu**: 获取分类菜单（对应 `/api/interface/getCatMenu`）


### ✏️ 接口管理

**仅`yapi-toolset=full`可用:**
- **yapi_save_api**: 创建新接口或更新现有接口
  - 支持完整的接口定义（路径、方法、参数、请求体、响应等）
  - 支持 JSON Schema 和表单数据格式
  - 自动处理接口状态和分类管理
  - 建议把「枚举值/中文备注/示例」优先写在 `req_params` / `req_query` / `req_headers` / `req_body_*` / `res_body`，`desc` 只写一句话简介；更新接口时未提供的字段会尽量保留原值
- **yapi_interface_add_cat**: 新增接口分类（对应 `/api/interface/add_cat`）
- **yapi_interface_add**: 新增接口（对应 `/api/interface/add`）
- **yapi_interface_up**: 更新接口（对应 `/api/interface/up`）
- **yapi_interface_save**: 新增或更新接口（对应 `/api/interface/save`）
- **yapi_open_import_data**: 服务端数据导入（对应 `/api/open/import_data`）

### 🎯 智能特性

- **多项目支持**: 同时查询和管理账号内所有 YApi 项目
- **详细日志**: 便于调试和监控
- **灵活配置**: 支持环境变量和命令行参数

## 快速开始


### 手动方式：使用 npx（无需安装）

你可以选择两种模式：

1) **项目 Token 模式**

```json
{
  "mcpServers": {
    "yapi-mcp-light": {
      "command": "npx",
      "args": [
        "-y",
        "yapi-mcp-light",
        "--stdio",
        "--yapi-base-url=https://your-yapi-domain.com",
        "--yapi-token=projectId:your_token_here,projectId2:your_yapi_token2_here"
      ]
    }
  }
}
```

2) **全局模式**（配置账号密码，使用登录态 Cookie 调用账户下所有yapi接口）

```json
{
  "mcpServers": {
    "yapi-mcp-light": {
      "command": "npx",
      "args": [
        "-y",
        "yapi-mcp-light",
        "--stdio",
        "--yapi-base-url=https://yapi.example.com",
        "--yapi-email=your_email",
        "--yapi-password=your_password"
      ]
    }
  }
}
```

全局模式下，会把登录态 Cookie 缓存到本地 `~/.yapi-mcp-light/auth-*.json`（已尽量使用 `0600` 权限落盘），请不要提交到仓库或分享给他人。

## 安装配置

### 方式一：npx 直接使用（推荐）

无需本地安装，通过 npx 直接运行：

```json
{
  "mcpServers": {
    "yapi-mcp-light": {
      "command": "npx",
      "args": [
        "-y",
        "yapi-mcp-light",
        "--stdio",
        "--yapi-base-url=https://yapi.example.com",
        "--yapi-token=projectId:token1,projectId2:token2",
      ]
    }
  }
}
```

### 方式二：使用环境变量

在 MCP 配置中定义环境变量：

```json
{
  "mcpServers": {
    "yapi-mcp-light": {
      "command": "npx",
      "args": [
        "-y",
        "yapi-mcp-light",
        "--stdio"
      ],
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_TOKEN": "projectId:token1,projectId2:token2"
      }
    }
  }
}
```

全局模式对应环境变量：

```json
{
  "mcpServers": {
    "yapi-mcp-light": {
      "command": "npx",
      "args": ["-y", "yapi-mcp-light", "--stdio"],
      "env": {
        "YAPI_BASE_URL": "https://yapi.example.com",
        "YAPI_EMAIL": "your_email@example.com",
        "YAPI_PASSWORD": "your_password"
      }
    }
  }
}
```

### 方式三：本地开发模式

适合需要修改代码或调试的场景：

1. **克隆和安装**：

```bash
git clone <repository-url>
cd yapi-mcp-light
pnpm install
```

2. **配置环境变量**（在项目根目录创建 `.env` 文件）：

```env
# YApi 基础配置
YAPI_BASE_URL=https://your-yapi-domain.com
YAPI_TOKEN=projectId:your_token_here,projectId2:your_token2_here

# 服务器配置
PORT=3388

# 可选配置
YAPI_LOG_LEVEL=info
YAPI_HTTP_TIMEOUT_MS=15000
```

3. **启动服务**：

**SSE 模式**（HTTP 服务）：

```bash
pnpm run dev
```

然后在 Cursor 中配置：

```json
{
  "mcpServers": {
    "yapi-mcp-light": {
      "url": "http://localhost:3388/sse"
    }
  }
}
```

**Stdio 模式**：

```bash
pnpm run build
```

然后在 Cursor 中配置：

```json
{
  "mcpServers": {
    "yapi-mcp-test": {
      "command": "node",
      "args": [
        "your_repository_dir/dist/index.js",
        "--stdio",
        "--yapi-base-url=https://yapi.example.com",
        "--yapi-email=your_email",
        "--yapi-password=your_password"
      ]
    }
  }
}
```

## 使用指南

### 获取 YApi Token

如果你使用的是 **全局模式**（`--yapi-auth-mode=global` / `YAPI_AUTH_MODE=global`），直接配置邮箱和密码，可获取所有项目接口，不需要手动配置项目 token。

1. 登录你的 YApi 平台
2. 进入项目设置页面
3. 在 Token 配置中生成或查看 Token


![Token 获取示例](./images/token.png)

Token 格式说明：

- 单项目：`projectId:token`
- 多项目：`projectId1:token1,projectId2:token2`

### 使用示例

配置完成后，你可以在 Cursor 中这样使用：

![使用示例](./images/demo1.png)

**常用操作示例**：

1. **搜索接口**：

   > "帮我找一下用户登录相关的接口"

2. **查看接口详情**：

   > "显示用户注册接口的详细信息"

3. **创建新接口**：

   > "帮我创建一个获取用户列表的接口，路径是 /api/users，使用 GET 方法"

4. **更新接口**：
   > "更新用户登录接口，添加验证码参数"

## 高级配置

### 配置参数详解

| 参数               | 描述                          | 示例                                       | 默认值 |
| ------------------ | ----------------------------- | ------------------------------------------ | ------ |
| `--yapi-base-url`  | YApi 服务器基础 URL           | `--yapi-base-url=https://yapi.example.com` | -      |
| `--yapi-token`     | YApi 项目 Token（支持多项目） | `--yapi-token=projectId1:token1,projectId1:token2`     | -      |
| `--yapi-auth-mode` | 鉴权模式：`token` 或 `global` | `--yapi-auth-mode=global`                  | token  |
| `--yapi-email`     | 全局模式登录邮箱              | `--yapi-email=a@b.com`                     | -      |
| `--yapi-password`  | 全局模式登录密码              | `--yapi-password=******`                   | -      |
| `--yapi-toolset`   | 工具集：`basic` 或 `full`（包含底层接口封装工具）      | `--yapi-toolset=basic`                     | basic  |
| `--yapi-log-level` | 日志级别                      | `--yapi-log-level=info`                    | info   |
| `--port`           | HTTP 服务端口（SSE 模式）     | `--port=3388`                              | 3388   |
| `--stdio`          | 启用 stdio 模式（MCP 必需）   | `--stdio`                                  | -      |

### 日志级别说明

- **debug**: 输出所有日志，包括详细的调试信息
- **info**: 输出信息、警告和错误日志（默认）
- **warn**: 只输出警告和错误日志
- **error**: 只输出错误日志
- **none**: 不输出任何日志
