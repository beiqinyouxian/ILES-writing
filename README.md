# 雅思写作练习桌面应用（Electron + Vite + React + TS）

面向 6.5 分的离线 IELTS Writing 学习与练习工具。现已提供：
- Lesson 1（考试概览 + 动态图）
- Lesson 2（静态图 + 流程/地图）
- Lesson 3（Task 2 结构 + 三七开：同意与否 / 利弊）

功能包含：
- 课程概览（要点提炼，不是 PDF 墙）
- 改写填空练习（Lesson 1 动态图；Lesson 2 静态图 + 流程/地图；Lesson 3 Task 2 结构 + 三七开）
- 聚焦同步提示面板（当前空格或段落类型 → 对应句式与词汇提示）

数据内容来自本地 JSON（`content/`），可离线使用。

## 一、快速开始（开发模式）
（Windows、macOS、Linux 通用）

```bash
npm install
npm run dev
```

- 启动后会自动打开 Electron 窗口；左侧选课 → 课程概览 / 练习。
- 练习时，光标聚焦到某个空格，右侧会展示对应的 6.5 级别句式提示。

## 二、打包为 Windows 可执行文件（.exe）

建议在 Windows 环境执行（免去交叉编译依赖）：

```bash
npm install
npm run dist:win
```

生成的安装包位于 `dist/` 下（NSIS 安装器）。如需绿色版，可在 `package.json > build > win.target` 中改为 `portable`。

> 说明：在 Linux 上交叉打包 Windows 需要 `wine`/`mono` 等工具，若本机无相关依赖，推荐直接在 Windows 机器打包。

## 三、项目结构

```
electron/         # Electron 主进程入口（生产环境加载 dist/index.html）
src/              # 前端源代码（React + Vite + TS）
  ui/             # UI 组件
  utils/          # 类型定义等
content/          # 课程与练习数据（JSON，本地离线）
index.html        # Vite 入口
package.json      # 脚本与打包配置（electron-builder）
```

## 四、内容与范围
- Lesson 1：考试概览、动态图写法、常用词、五大趋势句型、改写填空
- Lesson 2：静态图结构与比较/比例表达；流程/地图顺序与被动表达；2–3 道改写填空
- Lesson 3：Task 2 类型与结构；三七开用于同意与否/利弊；2–3 道改写/翻译式练习；提示面板按 intro/body/conclusion/agree/advantage 等联动
- Lesson 4-5：导航可用（预告），可按需在 `content/` 追加

## 五、二次扩展（可选建议）
- 在 `content/lesson1.json`、`content/lesson2.json` 中追加更多改写/翻译练习块
- 为每个空格配置更细的 `focusTag`，丰富提示面板
- 记录练习进度到本地（`localStorage`）

## 六、常见问题
- 字数和词汇：本应用定位 6.5 分，刻意避免过度高级/生僻词
- 运行白屏：请确保 `npm run dev` 正常启动（Vite 5173 端口）且 Electron 成功连接

---
Copyright © 本地自学用途。内容提炼自讲义，仅做结构化与交互化以便复习。实际考试请以最新官方要求为准。

