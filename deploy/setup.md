# 部署配置说明

## 1. 服务器初始化（首次操作）

SSH 进入服务器：

```bash
ssh ubuntu@62.234.138.193
```

安装 Docker：

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu
# 退出重新登录使 docker 权限生效
exit
```

安装 Nginx：

```bash
sudo apt update && sudo apt install -y nginx
```

配置 Nginx：

```bash
sudo cp /path/to/deploy/nginx.conf /etc/nginx/sites-available/dreamlog.com
sudo ln -s /etc/nginx/sites-available/dreamlog.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

申请 SSL 证书（Let's Encrypt）：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d dreamlog.com -d www.dreamlog.com
```

---

## 2. GitHub Secrets 配置

进入 GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret

需要添加以下 7 个 Secrets：

### SSH_HOST
```
62.234.138.193
```

### SSH_USER
```
ubuntu
```

### SSH_PRIVATE_KEY
在本地生成一对专用于 GitHub Actions 的 SSH 密钥（不要用你平时的个人密钥）：

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

将公钥追加到服务器的授权列表：

```bash
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub ubuntu@62.234.138.193
# 或者手动将公钥内容追加到服务器的 ~/.ssh/authorized_keys
```

Secret 的值填私钥内容（`~/.ssh/github_actions_deploy` 文件的完整内容，包含 `-----BEGIN...` 和 `-----END...`）。

### GHCR_TOKEN
用于服务器从 GitHub Container Registry 拉取镜像。

1. 访问 GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token，勾选 `read:packages` 权限
3. 将生成的 token 填入此 Secret

### NEXT_PUBLIC_SITE_API_BASE_URL
```
https://api.dreamlog.com/api/v1
```

### NEXT_PUBLIC_OSS_HOST
```
https://dreamlog.oss-cn-beijing.aliyuncs.com
```

---

## 3. 验证部署

Secrets 配置完成后，推送任意代码到 master 分支（修改 `apps/site-web/` 下的文件），
GitHub Actions 会自动触发，可在仓库的 Actions 页面查看进度。

部署完成后访问：
- https://dreamlog.com → 首页
- https://dreamlog.com/privacy → 隐私政策
- https://dreamlog.com/terms → 用户协议

---

## 4. 后续更新

只需要 push 代码到 master，GitHub Actions 自动完成构建和部署，无需手动操作服务器。
