#!/bin/bash

# 🔒 Git提交前安全检查脚本
# 使用方法: ./scripts/pre-commit-check.sh

echo "🔍 开始安全检查..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查结果计数
ERRORS=0
WARNINGS=0

echo ""
echo "📋 检查清单："

# 1. 检查敏感信息
echo "1. 🔍 检查敏感信息..."
SENSITIVE_PATTERNS=(
    "api\.shupapa\.top"
    "password\s*[:=]"
    "secret\s*[:=]"
    "token\s*[:=]"
    "localhost:[0-9]+"
    "127\.0\.0\.1"
    "192\.168\."
)

for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if grep -r -E "$pattern" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude="*.example.*" --exclude="pre-commit-check.sh" > /dev/null 2>&1; then
        echo -e "   ${RED}❌ 发现敏感信息: $pattern${NC}"
        grep -r -E "$pattern" . --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude="*.example.*" --exclude="pre-commit-check.sh" | head -3
        ERRORS=$((ERRORS + 1))
    fi
done

if [ $ERRORS -eq 0 ]; then
    echo -e "   ${GREEN}✅ 未发现敏感信息${NC}"
fi

# 2. 检查环境变量文件
echo ""
echo "2. 📁 检查环境变量文件..."

# 检查是否存在不应该提交的文件
FORBIDDEN_FILES=(
    ".env"
    ".env.local"
    ".env.development"
    ".env.production"
)

for file in "${FORBIDDEN_FILES[@]}"; do
    if git ls-files --error-unmatch "$file" > /dev/null 2>&1; then
        echo -e "   ${RED}❌ 不应该提交的文件: $file${NC}"
        ERRORS=$((ERRORS + 1))
    fi
done

# 检查是否存在应该提交的模板文件
REQUIRED_FILES=(
    ".env.example"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "   ${YELLOW}⚠️  缺少模板文件: $file${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "   ${GREEN}✅ 模板文件存在: $file${NC}"
    fi
done

# 3. 检查.gitignore
echo ""
echo "3. 🚫 检查.gitignore配置..."

GITIGNORE_PATTERNS=(
    "\.env$"
    "\.env\.local"
    "\.env\.development"
    "\.env\.production"
)

if [ ! -f ".gitignore" ]; then
    echo -e "   ${RED}❌ .gitignore文件不存在${NC}"
    ERRORS=$((ERRORS + 1))
else
    for pattern in "${GITIGNORE_PATTERNS[@]}"; do
        if ! grep -E "$pattern" .gitignore > /dev/null 2>&1; then
            echo -e "   ${YELLOW}⚠️  .gitignore中缺少规则: $pattern${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
    done
    
    if [ $WARNINGS -eq 0 ]; then
        echo -e "   ${GREEN}✅ .gitignore配置正确${NC}"
    fi
fi

# 4. 检查package.json中的敏感信息
echo ""
echo "4. 📦 检查package.json..."

if [ -f "package.json" ]; then
    if grep -E "(password|secret|token|key)" package.json > /dev/null 2>&1; then
        echo -e "   ${RED}❌ package.json中可能包含敏感信息${NC}"
        ERRORS=$((ERRORS + 1))
    else
        echo -e "   ${GREEN}✅ package.json检查通过${NC}"
    fi
fi

# 5. 检查构建配置
echo ""
echo "5. ⚙️  检查构建配置..."

if [ -f "vite.config.js" ]; then
    if grep -E "https?://[^/]*\.(com|cn|top|net)" vite.config.js | grep -v "your-" > /dev/null 2>&1; then
        echo -e "   ${YELLOW}⚠️  vite.config.js中可能包含硬编码的URL${NC}"
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "   ${GREEN}✅ vite.config.js检查通过${NC}"
    fi
fi

# 总结
echo ""
echo "📊 检查结果总结："
echo "================================"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 所有检查通过！可以安全提交代码。${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  发现 $WARNINGS 个警告，建议修复后再提交。${NC}"
    echo ""
    echo "是否继续提交？(y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo -e "${GREEN}✅ 用户确认继续提交${NC}"
        exit 0
    else
        echo -e "${RED}❌ 用户取消提交${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ 发现 $ERRORS 个错误和 $WARNINGS 个警告，必须修复后才能提交！${NC}"
    echo ""
    echo "🔧 修复建议："
    echo "1. 移除或替换敏感信息"
    echo "2. 确保敏感文件在.gitignore中"
    echo "3. 使用环境变量替代硬编码配置"
    echo "4. 检查模板文件是否完整"
    exit 1
fi