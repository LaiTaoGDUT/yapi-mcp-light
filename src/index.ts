import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { YapiMcpServer } from "./server";
import { getServerConfig } from "./config";
import { Logger } from "./services/yapi/logger";

// 导出 YApi 服务相关类型和工具
export * from "./services/yapi/types";
export * from "./services/yapi/api";
export * from "./services/yapi/logger";

export async function startServer(): Promise<void> {
  const config = getServerConfig();
  
  // 创建日志实例
  const logger = new Logger("StartServer", config.yapiLogLevel);
  
  // 创建 YapiMcpServer 实例，使用配置中的所有参数
  const server = new YapiMcpServer(
    config.yapiBaseUrl, 
    config.yapiToken, 
    config.yapiLogLevel,
    {
      mode: config.yapiAuthMode,
      email: config.yapiEmail,
      password: config.yapiPassword,
    },
    { timeoutMs: config.yapiHttpTimeoutMs },
    { toolset: config.yapiToolset },
  );

  // Check if we're running in stdio mode (e.g., via CLI)
  const isStdioMode = process.env.NODE_ENV === "cli" || process.argv.includes("--stdio");

  if (isStdioMode) {
    logger.info("Initializing Yapi MCP Server in stdio mode...");
    const transport = new StdioServerTransport();
    await server.connect(transport);
  } else {
    logger.info(`Initializing Yapi MCP Server in HTTP mode on port ${config.port}...`);
    await server.startHttpServer(config.port);
  }
}

// If this file is being run directly, start the server
if (require.main === module) {
  // 仅在作为入口执行时加载 .env，避免库代码污染宿主环境
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { resolve } = require("path");
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { config } = require("dotenv");
    config({ path: resolve(process.cwd(), ".env") });
  } catch {
    // ignore
  }
  startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
}
