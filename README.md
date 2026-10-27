# sub.kortin.cn

一个用于生成多客户端订阅链接的轻量 Web 工具。支持合并多条订阅或节点、选择远程配置、精细筛选节点，并生成可直接导入客户端的订阅地址。

[在线体验](https://sub.kortin.cn) · [GitHub](https://github.com/kortin99/sub.kortin.cn) · [问题反馈](https://github.com/kortin99/sub.kortin.cn/issues)

![订阅转换页面](./docs/preview.png)

## 功能

- 支持多订阅链接、节点链接混合输入。
- 支持 Clash、ClashR、V2Ray、Quantumult、Quantumult X、Surge、Surfboard、SS、SSR、Loon、Sing-box 等目标客户端。
- 支持默认后端和自定义 Subconverter 后端地址。
- 支持预设远程配置和自定义远程配置地址。
- 支持按地区、关键字和正则表达式筛选节点。
- 支持 Emoji、UDP、节点排序、规则展开、Node List、DoH 等高级参数。
- 支持自定义查询参数、订阅文件名和节点类型输出。
- 支持一键复制订阅链接和生成短链接。
- 历史记录默认关闭。打开历史抽屉阅读本地存储与密钥提示并主动开启后，使用浏览器 `localStorage` 保存最近 20 条生成记录，支持按日期分组查看、复制、删除和载入配置重新生成。
- 提供桌面端与移动端响应式界面，并适配减少动态效果的系统设置。

### 高级设置

![高级转换设置](./docs/advanced-options.png)

## 工作方式

本项目是纯前端应用，本身不执行订阅转换：

1. 浏览器根据用户输入在本地生成 Subconverter 请求链接。
2. 订阅转换由配置的 `apiUrl` 后端完成。
3. 生成短链接时，转换后的长链接会被 Base64 编码并提交给配置的短链接服务。

请只使用你信任的后端和短链接服务。

## 技术栈

| 技术 | 用途 |
| --- | --- |
| Vue 3 | 页面与交互 |
| TypeScript | 类型约束 |
| Vite | 开发服务器与生产构建 |
| Vue Router | 路由 |
| Naive UI | 表单与反馈组件 |
| Axios | 短链接请求 |
| pnpm | 包管理 |

## 本地开发

建议使用 Node.js 22 或更高版本。

```bash
git clone git@github.com:kortin99/sub.kortin.cn.git
cd sub.kortin.cn
pnpm install
pnpm dev
```

开发服务器默认运行在：

```text
http://localhost:8080
```

生产构建：

```bash
pnpm build
pnpm preview
```

构建产物位于 `dist/`。

## 配置

站点配置位于 [public/conf/config.js](./public/conf/config.js)。

```js
window.config = {
  siteName: `kortin's 订阅转换`,
  apiUrl: 'http://127.0.0.1:25500',
  shortUrl: 'https://s.kortin.cn',
  menuItem: [],
  remoteConfigOptions: [],
}
```

| 字段 | 说明 |
| --- | --- |
| `siteName` | 页面左上角显示的站点名称 |
| `apiUrl` | Subconverter 后端地址，默认使用本地 `25500` 端口 |
| `shortUrl` | 短链接服务地址；不使用时仍会生成长订阅链接 |
| `menuItem` | 顶部导航菜单，可配置标题、链接和打开方式 |
| `remoteConfigOptions` | 可选远程配置列表，每项包含 `value` 和 `text` |

修改配置后刷新页面即可生效。

### 短链接接口

前端会向 `${shortUrl}/short` 发起 `POST` 请求：

```text
Content-Type: multipart/form-data
longUrl=<Base64 编码后的订阅链接>
```

成功响应格式：

```json
{
  "Code": 1,
  "ShortUrl": "https://example.com/abc"
}
```

## Docker 部署

镜像内置 Subconverter 与 Nginx。

快速启动：

```bash
docker run -d --name subweb --restart always \
  -p 18080:80 \
  kortin99/sub.kortin.cn:latest
```

访问 `http://127.0.0.1:18080`。

挂载自定义配置：

```bash
docker run -d --name subweb --restart always \
  -p 18080:80 \
  -v /path/to/public/conf:/usr/share/nginx/html/conf \
  kortin99/sub.kortin.cn:latest
```

也可以通过环境变量覆盖后端地址和短链接地址：

```bash
docker run -d --name subweb --restart always \
  -p 18080:80 \
  -e API_URL=https://sub.example.com \
  -e SHORT_URL=https://s.example.com \
  kortin99/sub.kortin.cn:latest
```

站点名称、导航和远程配置列表请通过挂载 `config.js` 修改。生产环境建议使用 Nginx 或其他反向代理提供服务。

自行构建镜像：

```bash
docker build --no-cache -t kortin99/sub.kortin.cn:latest .
```

### docker 发布
```shell
docker push kortin99/sub.kortin.cn:latest
docker push kortin99/sub.kortin.cn:v0.0.1
```

### 删除本地镜像
```shell
docker images | grep sub.kortin.cn
docker rmi kortin99/sub.kortin.cn
```

## 项目结构

```text
.
├── docs/                         # README 截图
├── public/
│   └── conf/config.js            # 站点配置
├── src/
│   ├── assets/                   # 全局样式
│   ├── components/               # 通用组件与业务组件
│   ├── composables/              # 订阅转换、反馈和导航逻辑
│   ├── layouts/                  # 页面布局
│   ├── network/                  # HTTP 请求封装
│   ├── router/                   # 路由配置
│   └── views/                    # 页面
├── Dockerfile
├── vite.config.ts
└── package.json
```

## 安全提示

- 普通订阅链接只在浏览器本地生成，不会由本项目主动上传。
- 生成短链接时，长链接会提交到配置的短链接服务。
- 历史记录只保存在浏览器 `localStorage`，不会上传到服务器。记录可能包含订阅密钥，请避免在公用设备上启用，并及时清理。
- “跳过证书验证”会降低连接安全性，仅在确认需要时开启。
- 建议自建或使用可信的 Subconverter 后端。

## 许可

本项目使用 [GNU General Public License v3.0](./LICENSE)。
