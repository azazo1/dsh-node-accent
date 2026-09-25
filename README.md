# dsh-node-accent

给 DSH Web 会话行的图标和标题文字上色, 按事件类别或具体工具名区分颜色.

Recolor only the icon and title text of DSH web conversation rows, per tool or
per event category, without rails or background tints.

## 它解决什么

会话流里 bash, 思考, read, write, edit 这些行在视觉上是同一副样子. 想要一眼
分辨, 又不想让每行都多出一条色条和一层底色.

这个插件只改一件事: 把行首图标和标题文字的 `color` 换成配置好的强调色. 行高,
间距, 对齐, hover, 展开折叠, 流式运行的 sweep 动画全部保持官方行为.

## 效果

- 工具行按类别上色: 联网搜索, 智能体, 命令执行, 文件操作, 任务与作业, 目标与
  计划, 提问, 交付与展示, 技能, 以及兜底的其他工具.
- 节点行按类型上色: 斜杠命令节点, 思考行, 上下文注入行, 系统提示卡, 上下文
  压缩行, 非人工触发的回合通知行.
- 摘要文字 (标题后面那截), 展开后的正文, 以及工具失败时的红点 / 中断时的黄点
  保持原生颜色不动.

已知边界: `developer-message` 和未知节点在 dsh 里落到通用的 JSON 回退行, 没有
图标与标题结构, 不在着色范围内. 第三方插件带来的工具不进类别表, 需要单独上色
时用 "按工具名覆盖".

## 安装

Web 端装进 `web` profile:

```shell
dsh plugin --profile web add azazo1/dsh-node-accent
```

装完重启 `dsh web`, 浏览器里刷新一次页面.

桌面端装进 `desktop` profile. 它由 Electron 应用独占管理, `dsh plugin` 会拒绝 `--profile desktop`, 所以要用应用内的插件管理器: 在插件页的安装入口填上面命令里对应的包名或本地目录. 装上后重启应用, 窗口刷新一次.

引擎版本线要求 `@deepseek-ai/dsh-*` 不低于 `0.1.7-rc.2`, 且仍在 `0.1.x` 上 (peerDependencies 与 devDependencies 都写作 `>=0.1.7-rc.2 <0.2.0`). 更早的引擎线装不上这个版本.

web 与 desktop 两个 profile 跑的是同一套 Web 应用, 桌面端只是多起一个 Host 子进程并给 `<html>` 打上平台标记, 所以同一份包在两边通用, 不需要分别构建.

## 配置

设置 → 插件 → "节点着色". 改动即时生效, 写入 `$DSH_HOME/settings.yaml` 的
`node-accent` 段.

| 字段 | 说明 |
|---|---|
| `paintIcon` | 是否给行首图标上色, 默认开 |
| `paintTitle` | 是否给标题文字上色, 默认开 |
| `colors` | 每个类别一个颜色, 工具类别与节点类别各一段 |
| `toolColors` | 按 wire 工具名逐个覆盖, 优先级高于类别色; 任何工具名都有效, 插件带来的工具也算 |

类别与默认色 (前 10 个按工具名匹配, 后 6 个按会话节点匹配):

| 类别 | 覆盖的工具或行 | 默认色 |
|---|---|---|
| `search` | `web_search`, `web_fetch` | `#3b82f6` |
| `agent` | `subagent`, `subagent_fork`, `send_message`, `list_agents` 等 | `#a855f7` |
| `execute` | `bash`, `pwsh`, `run_code`, `terminal_*` 等 | `#f59e0b` |
| `file` | `read`, `write`, `edit`, `grep`, `glob` 等 | `#22c55e` |
| `task` | `todo_write`, `job_*`, `schedule_*` 等 | `#ec4899` |
| `goal` | `create_goal`, `get_goal`, `update_goal`, `exit_plan_mode` | `#14b8a6` |
| `ask` | `ask_user_question` | `#06b6d4` |
| `deliver` | `present` | `#84cc16` |
| `skill` | `skill` | `#d946ef` |
| `other` | 未在上面列出的工具 | `#64748b` |
| `command` | 斜杠命令节点 | `#f97316` |
| `thinking` | 思考行 | `#c4b5fd` |
| `context` | 上下文注入行 | `#8a9bb5` |
| `system` | 系统提示卡 | `#38bdf8` |
| `compaction` | 模型历史压缩标记行, 含 `/compact` | `#94a3b8` |
| `trigger` | 由定时 / 子智能体 / 插件等非人工来源开启的回合通知行 | `#fb7185` |

颜色值只接受 `#rgb` / `#rrggbb` / `#rrggbbaa` 和 `rgb()` / `hsl()` /
`oklch()` 一类颜色函数; 非法值回落到该类别的默认色, 不会把一条坏规则拼进样式表.

只写了 `colors` 的话, 想改某个具体工具 (例如让 `write` 和 `read` 分开, 或者给
插件带来的 `chrome_open` 一个颜色), 在 "按工具名覆盖" 里加一条工具名到颜色的
映射即可, 优先级高于类别色.

## 与 dsh-node-appearance 互斥

`@max-null/dsh-node-appearance` 做的是同一件事的不同画法 (左侧 3px 色条 +
淡色底). 两个一起装会对同一批行各自施加样式. 换过来之前先摘掉它:

```shell
dsh plugin --profile web remove @max-null/dsh-node-appearance
```

## 实现说明

浏览器半区不改 React 树, 只维护一张
`<style data-plugin-css="dsh-node-accent/rules">`, 内容由当前 settings 快照生成.
选择器全部走官方硬编码的 `data-` 属性:

- `[data-chat-flow-kind="tool-call"] [data-tool]` : ToolRow / PresentRow 根节点,
  另外每个已知工具名一条精确规则声明颜色, 这样插件工具也能被按工具名覆盖.
- `[data-variant="think"]` : ReasoningRow 根节点.
- `[data-chat-flow-kind="command"]` / `"context"` / `"system-prompt"` /
  `"compaction"` / `"manual-compaction"` / `"turn-trigger"` : 节点外层.
- `[data-disclosure-row] > :first-child` / `> span:nth-child(2)` : 图标和标题
  在 DisclosureRow 里的固定位置.
- `[data-compaction-icon] svg` / `[data-turn-trigger] > button > span:nth-child(1|2)` :
  压缩行和触发通知行是自绘结构, 走它们自己的标记与位置.
- `[data-tool="skill"] > div > span:nth-child(1) svg:first-child` 与
  `> div > span:nth-child(2|3)` : skill 行不走 DisclosureRow, 图标是行首 span 里
  第一个 svg (排除折叠箭头), 标题位置随无障碍状态文本在 2 或 3.

图标用 `svg:not([data-state])` 圈定, 这样工具行在 error / stopped 状态下换上的
StateDot 不会被染色.

## 开发

```shell
just install      # 安装依赖
just typecheck    # 类型检查
just build        # 构建 Host ESM 和 Client bundle
just test         # 逻辑测试
just check-client # Client loader 注册检查
just verify       # 上面全部 + 打包预览
```

`lib/` 是发布内容, 已提交进仓库, 从 git 安装不需要本地构建.

改完源码跑 `just build`, 再用隔离子实例验证:

```shell
cd ~/.dsh/skills/dsh-instance-test
bun prepare.ts <target> /path/to/dsh-node-accent
bun start.ts <target>
```
