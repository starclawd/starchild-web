#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== 开始配置本地 HTTPS 开发环境 ===${NC}\n"

# 检查是否安装了 mkcert
if ! command -v mkcert &> /dev/null
then
    echo -e "${YELLOW}mkcert 未安装，正在安装...${NC}"
    if command -v brew &> /dev/null
    then
        brew install mkcert
        brew install nss # 如果使用 Firefox
    else
        echo -e "${RED}请先安装 Homebrew: https://brew.sh/${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✓ mkcert 已安装${NC}"
fi

# 安装本地 CA
echo -e "\n${YELLOW}正在安装本地 CA...${NC}"
mkcert -install

# 创建证书目录
CERT_DIR="$(pwd)/certs"
mkdir -p "$CERT_DIR"

# 生成证书
echo -e "\n${YELLOW}正在为 starchild.dev 生成 SSL 证书...${NC}"
cd "$CERT_DIR"
mkcert starchild.dev localhost 127.0.0.1 ::1

# 重命名证书文件为更简洁的名称
if [ -f "starchild.dev+3.pem" ]; then
    mv starchild.dev+3.pem cert.pem
fi
if [ -f "starchild.dev+3-key.pem" ]; then
    mv starchild.dev+3-key.pem key.pem
fi

echo -e "\n${GREEN}✓ SSL 证书生成成功！${NC}"
echo -e "${GREEN}证书位置: $CERT_DIR${NC}"

# 配置 hosts 文件
echo -e "\n${YELLOW}正在配置 /etc/hosts...${NC}"
HOSTS_LINE="127.0.0.1 starchild.dev"

if grep -q "starchild.dev" /etc/hosts; then
    echo -e "${GREEN}✓ hosts 文件已配置${NC}"
else
    echo -e "${YELLOW}需要添加以下内容到 /etc/hosts:${NC}"
    echo -e "${GREEN}$HOSTS_LINE${NC}"
    echo ""
    echo -e "${YELLOW}请输入你的密码以修改 hosts 文件:${NC}"
    echo "$HOSTS_LINE" | sudo tee -a /etc/hosts > /dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ hosts 文件配置成功${NC}"
    else
        echo -e "${RED}✗ hosts 文件配置失败，请手动添加:${NC}"
        echo -e "${GREEN}$HOSTS_LINE${NC}"
    fi
fi

# 创建 .gitignore 条目（如果不存在）
GITIGNORE_FILE="$(dirname "$CERT_DIR")/.gitignore"
if ! grep -q "certs/" "$GITIGNORE_FILE" 2>/dev/null; then
    echo -e "\n# Local SSL certificates" >> "$GITIGNORE_FILE"
    echo "certs/" >> "$GITIGNORE_FILE"
    echo -e "${GREEN}✓ 已将 certs/ 添加到 .gitignore${NC}"
fi

echo -e "\n${GREEN}=== 配置完成！===${NC}"
echo -e "\n${YELLOW}使用方法：${NC}"
echo -e "1. 运行开发服务器: ${GREEN}yarn start:https${NC}"
echo -e "2. 在浏览器中访问: ${GREEN}https://starchild.dev:6066${NC}"
echo -e "\n${YELLOW}注意事项：${NC}"
echo -e "- 如果浏览器提示证书不安全，请重新运行 ${GREEN}mkcert -install${NC}"
echo -e "- 证书文件已自动添加到 .gitignore，不会提交到版本库"
echo -e "- 如需重新生成证书，删除 certs 目录后重新运行此脚本即可\n"

