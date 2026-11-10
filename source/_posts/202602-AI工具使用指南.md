---
title: AI工具使用指南（持续更新）
date: 2026-02-18 07:45:23
categories: 开发
tags: 公用
---

# 前言

本篇博客用于记录我使用新发行的各种AI工具的详细教程，比如前面的claude code， open code以及openclaw，这篇同样会持续更新，以便我跟上AI时代的节奏。

# 一、claude code

## （1）开始结束指令

## claude code

开始：claude

## claude code router

开始：ccr start/ccr code 结束：ccr stop

## （2）Config配置（Router）

### 1.Qwen3:

```prolog
{

  "Providers": [

    {

      "name": "modelscope",

      "api_base_url": "https://api-inference.modelscope.cn/v1/chat/completions",

      "api_key": "ms-34e5e90e-6d2b-46ec-828a-444ff05b175c",

      "models": ["Qwen/Qwen3-Coder-480B-A35B-Instruct", "Qwen/Qwen3-235B-A22B-Thinking-2507"],

      "transformer": {

        "use": [

          [

            "maxtoken",

            {

              "max_tokens": 65536

            }

          ],

          "enhancetool"

        ],

        "Qwen/Qwen3-235B-A22B-Thinking-2507": {

          "use": ["reasoning"]

        }

      }

    }

  ],

  "Router": {

    "default": "modelscope,Qwen/Qwen3-Coder-480B-A35B-Instruct"

  }

}
```

### 2.其他

```prolog
{
  "APIKEY": "your-secret-key",
  "PROXY_URL": "http://127.0.0.1:7890",
  "LOG": true,
  "API_TIMEOUT_MS": 600000,
  "NON_INTERACTIVE_MODE": false,
  "Providers": [
    {
      "name": "openrouter",
      "api_base_url": "https://openrouter.ai/api/v1/chat/completions",
      "api_key": "sk-xxx",
      "models": [
        "google/gemini-2.5-pro-preview",
        "anthropic/claude-sonnet-4",
        "anthropic/claude-3.5-sonnet",
        "anthropic/claude-3.7-sonnet:thinking"
      ],
      "transformer": {
        "use": ["openrouter"]
      }
    },
    {
      "name": "deepseek",
      "api_base_url": "https://api.deepseek.com/chat/completions",
      "api_key": "sk-xxx",
      "models": ["deepseek-chat", "deepseek-reasoner"],
      "transformer": {
        "use": ["deepseek"],
        "deepseek-chat": {
          "use": ["tooluse"]
        }
      }
    },
    {
      "name": "ollama",
      "api_base_url": "http://localhost:11434/v1/chat/completions",
      "api_key": "ollama",
      "models": ["qwen2.5-coder:latest"]
    },
    {
      "name": "gemini",
      "api_base_url": "https://generativelanguage.googleapis.com/v1beta/models/",
      "api_key": "sk-xxx",
      "models": ["gemini-2.5-flash", "gemini-2.5-pro"],
      "transformer": {
        "use": ["gemini"]
      }
    },
    {
      "name": "volcengine",
      "api_base_url": "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
      "api_key": "sk-xxx",
      "models": ["deepseek-v3-250324", "deepseek-r1-250528"],
      "transformer": {
        "use": ["deepseek"]
      }
    },
    {
      "name": "modelscope",
      "api_base_url": "https://api-inference.modelscope.cn/v1/chat/completions",
      "api_key": "",
      "models": ["Qwen/Qwen3-Coder-480B-A35B-Instruct", "Qwen/Qwen3-235B-A22B-Thinking-2507"],
      "transformer": {
        "use": [
          [
            "maxtoken",
            {
              "max_tokens": 65536
            }
          ],
          "enhancetool"
        ],
        "Qwen/Qwen3-235B-A22B-Thinking-2507": {
          "use": ["reasoning"]
        }
      }
    },
    {
      "name": "dashscope",
      "api_base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      "api_key": "",
      "models": ["qwen3-coder-plus"],
      "transformer": {
        "use": [
          [
            "maxtoken",
            {
              "max_tokens": 65536
            }
          ],
          "enhancetool"
        ]
      }
    },
    {
      "name": "aihubmix",
      "api_base_url": "https://aihubmix.com/v1/chat/completions",
      "api_key": "sk-",
      "models": [
        "Z/glm-4.5",
        "claude-opus-4-20250514",
        "gemini-2.5-pro"
      ]
    }
  ],
  "Router": {
    "default": "deepseek,deepseek-chat",
    "background": "ollama,qwen2.5-coder:latest",
    "think": "deepseek,deepseek-reasoner",
    "longContext": "openrouter,google/gemini-2.5-pro-preview",
    "longContextThreshold": 60000,
    "webSearch": "gemini,gemini-2.5-flash"
  }
}
```

## （3）使用

### 1./init

生成claude.md文件

### 2./compact

压缩上下文

### 3./clear

清除记录

### 4.思维链长度

think/think hard/think harder/ultrathink

### 5.“!”

不用新开窗口而直接执行临时命令

### 6.“#”

记忆模式，输入的内容会被作为记忆记录

### 7./ide

链接到常用的ide

### 8./permissions

权限管理

### 9. ccr code –dangerous-skip-permissions

所有权限放开

### 10.自定义命令

.claude/commands/新建文件.md

### 11./resume

历史对话

### 12./export

导出对话

# 二、openclaw

## （1）基础命令

- openclaw onboard 初始化

## （2）飞书配置

### 1.权限：

![f725644fedc6914c4692222fabf5b6ba.jpg](https://work-1321607658.cos.ap-guangzhou.myqcloud.com/f725644fedc6914c4692222fabf5b6ba.jpg)

### 2.命令

![b49bb3aa4e6e14a6b5643a19af97e2dc.jpg](https://work-1321607658.cos.ap-guangzhou.myqcloud.com/b49bb3aa4e6e14a6b5643a19af97e2dc.jpg)

## （3）discord配置

openclaw pairing approve discord <代码>

# 三、opencode

## （1）原生功能

- 1./models 切换模型

- 2./connect 连接模型供应商

- 3./sessions 多进程及切换

- 4./share 分享当前session

- 5./unsh 取消分享

- 6./export 导出为文件

- 7./timeline 检查点

- 8./init 总结项目

- 9./compact 压缩上下文

## （2）on-my-opencode

- ulw 自动调度智能体

- /ralph-loop 强制循环

## （3）自定义命令

C:\Users\Lenovo.config\opencode下新建一个command文件夹

![eeb02ecf63a97e897a45986c3be0bf8e.jpg](https://work-1321607658.cos.ap-guangzhou.myqcloud.com/eeb02ecf63a97e897a45986c3be0bf8e.jpg)

## （4）自定义智能体

C:\Users\Lenovo.config\opencode下新建一个agent文件夹

创建md文档

可以选：primary/subagent

![55c28937c361de4dfbb89972ab87c4c9.jpg](https://work-1321607658.cos.ap-guangzhou.myqcloud.com/55c28937c361de4dfbb89972ab87c4c9.jpg)
