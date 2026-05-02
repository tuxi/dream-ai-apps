# 部署文档

本文档记录 dreamlog.com 官网的完整部署流程，换服务器时照此操作即可。

## 架构概览

```
GitHub (master 分支)
  │
  └─ GitHub Actions
       ├─ 构建 Docker 镜像 (apps/site-web)
       ├─ 推送到 GitHub Container Registry (ghcr.io)
       └─ SSH 部署到云服务器
              │
              └─ Ubuntu 服务器 (62.234.138.193)
                   ├─ Docker 容器: dreamlog-site (port 3000)
                   └─ Nginx 反向代理 (port 80/443)
```

每次 push 代码到 master 且改动涉及 `apps/site-web/` 时，GitHub Actions 自动触发构建和部署，无需手动操作服务器。

---

## 一、服务器初始化

### 1.1 安装 Docker

```bash
ssh ubuntu@<服务器 IP>

curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu

# 退出重新登录使 docker 权限生效
exit
ssh ubuntu@<服务器 IP>

# 验证
docker --version
```

### 1.2 安装 Nginx

```bash
sudo apt update && sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## 二、SSL 证书

每个域名单独申请证书，证书存放在 `/etc/nginx/ssl/`。

### 2.1 申请证书（阿里云免费 DV 证书）

1. 进入阿里云控制台 → **SSL 证书** → **免费证书**
2. 点「立即购买」→ 选「免费版 DV」→ 数量 1 张 → 0 元购买
3. 购买后点「申请」→ 填写域名（如 `dreamlog.com`）→ 验证方式选「DNS 验证」
4. 按提示在域名解析里加一条 TXT 记录，等审核通过（一般几分钟）
5. 下载证书，格式选 **Nginx**，解压得到两个文件：
   - `dreamlog.com.pem`（证书）
   - `dreamlog.com.key`（私钥）

> 注意：`dreamlog.com` 和 `www.dreamlog.com` 是两个不同的域名，需要分别申请证书。

### 2.2 上传证书到服务器

在本地执行（以 dreamlog.com 为例，www 同理）：

```bash
sudo mkdir -p /etc/nginx/ssl

scp dreamlog.com.pem ubuntu@<服务器 IP>:/home/ubuntu/
scp dreamlog.com.key ubuntu@<服务器 IP>:/home/ubuntu/
```

SSH 进服务器：

```bash
sudo mv /home/ubuntu/dreamlog.com.pem /etc/nginx/ssl/
sudo mv /home/ubuntu/dreamlog.com.key /etc/nginx/ssl/
sudo chmod 600 /etc/nginx/ssl/dreamlog.com.key

# www 证书同理
sudo mv /home/ubuntu/www.dreamlog.com.pem /etc/nginx/ssl/
sudo mv /home/ubuntu/www.dreamlog.com.key /etc/nginx/ssl/
sudo chmod 600 /etc/nginx/ssl/www.dreamlog.com.key
```

> 阿里云免费证书有效期 3 个月，到期前需重新申请并替换证书文件，然后 `sudo systemctl reload nginx`。

---

## 三、Nginx 配置

```bash
sudo tee /etc/nginx/sites-available/dreamlog.com > /dev/null << 'EOF'
# HTTP 全部跳 HTTPS
server {
    listen 80;
    server_name dreamlog.com www.dreamlog.com;
    return 301 https://$host$request_uri;
}

# www → 主域名（301 跳转，SEO 友好）
server {
    listen 443 ssl http2;
    server_name www.dreamlog.com;

    ssl_certificate     /etc/nginx/ssl/www.dreamlog.com.pem;
    ssl_certificate_key /etc/nginx/ssl/www.dreamlog.com.key;
    ssl_protocols       TLSv1.2 TLSv1.3;

    return 301 https://dreamlog.com$request_uri;
}

# 主站
server {
    listen 443 ssl http2;
    server_name dreamlog.com;

    ssl_certificate     /etc/nginx/ssl/dreamlog.com.pem;
    ssl_certificate_key /etc/nginx/ssl/dreamlog.com.key;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Next.js 静态资源长缓存
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # 反向代理到 Next.js 容器
    location / {
        proxy_pass         http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        proxy_connect_timeout 10s;
    }

    access_log /var/log/nginx/dreamlog.access.log;
    error_log  /var/log/nginx/dreamlog.error.log;
}
EOF

# 启用配置
sudo ln -s /etc/nginx/sites-available/dreamlog.com /etc/nginx/sites-enabled/

# 验证并重载
sudo nginx -t && sudo systemctl reload nginx
```

---

## 四、DNS 解析

在阿里云域名控制台添加以下解析记录：

| 记录类型 | 主机记录 | 记录值 |
|---|---|---|
| A | @ | 服务器 IP |
| A | www | 服务器 IP |

---

## 五、GitHub Actions 自动部署配置

### 5.1 GitHub Secrets

进入 GitHub 仓库 → **Settings → Secrets and variables → Actions**，添加以下 6 个 Secret：

| Secret 名称 | 说明 | 示例值 |
|---|---|---|
| `SSH_HOST` | 服务器 IP | `62.234.138.193` |
| `SSH_USER` | SSH 用户名 | `ubuntu` |
| `SSH_PRIVATE_KEY` | SSH 私钥（见下方生成方法） | `-----BEGIN OPENSSH...` |
| `GHCR_TOKEN` | GitHub PAT，用于服务器拉取镜像（见下方） | `ghp_xxxx` |
| `NEXT_PUBLIC_SITE_API_BASE_URL` | 后端 API 地址 | `https://api.dreamlog.com/api/v1` |
| `NEXT_PUBLIC_OSS_HOST` | 阿里云 OSS 公开访问地址 | `https://dreamlog.oss-cn-beijing.aliyuncs.com` |

### 5.2 生成 SSH 部署密钥

在本地生成一对专用密钥（不要复用个人密钥）：

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

将公钥追加到服务器：

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub ubuntu@<服务器 IP>
```

将私钥内容（`~/.ssh/github_actions_deploy` 文件完整内容）填入 `SSH_PRIVATE_KEY` Secret。

### 5.3 生成 GHCR_TOKEN

1. GitHub 右上角头像 → **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. 点 **Generate new token (classic)**
3. 勾选 `write:packages` 权限，Expiration 选 No expiration
4. 生成后将 token 填入 `GHCR_TOKEN` Secret

### 5.4 触发部署

Secrets 配置完成后，push 任意改动到 master（涉及 `apps/site-web/` 下的文件），GitHub Actions 自动构建并部署。进度可在仓库的 **Actions** 页面查看。

---

## 六、环境变量说明

`NEXT_PUBLIC_*` 前缀的变量在 **构建时** 打包进前端代码，必须通过 `--build-arg` 在 `docker build` 时传入，运行时修改无效。

本项目的 `apps/site-web/.env.example` 列出了所有环境变量，参考此文件配置 GitHub Secrets。

如需本地开发，复制为 `.env.local` 并填入本地后端地址：

```bash
cp apps/site-web/.env.example apps/site-web/.env.local
# 编辑 .env.local，将 API 地址改为 http://localhost:12210/api/v1
```

---

## 七、常用运维命令

```bash
# 查看容器状态
docker ps

# 查看容器日志
docker logs dreamlog-site

# 手动重启容器
docker restart dreamlog-site

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/dreamlog.error.log

# 证书到期后替换（上传新证书文件后执行）
sudo nginx -t && sudo systemctl reload nginx
```

---

## 八、证书续期提醒

阿里云免费证书有效期 **3 个月**，到期前需：

1. 在阿里云控制台重新申请新证书
2. 下载新证书（Nginx 格式）
3. 上传到服务器 `/etc/nginx/ssl/` 覆盖旧文件
4. 执行 `sudo systemctl reload nginx`

建议在日历上设置每 80 天的提醒，避免证书过期导致网站不可访问。
