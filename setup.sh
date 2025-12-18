#!/bin/bash

# 🎓 EzySchool LMS - Setup Script
# This script automates the setup of the complete MERN stack project

set -e

echo "╔═══════════════════════════════════════╗"
echo "║  🚀 EzySchool LMS Setup Script        ║"
echo "╚═══════════════════════════════════════╝"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js installation
echo -e "${YELLOW}Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js v16+${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js version: $(node -v)${NC}"

# Check npm installation
echo -e "${YELLOW}Checking npm...${NC}"
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm version: $(npm -v)${NC}"

# Check MongoDB
echo -e "${YELLOW}Checking MongoDB...${NC}"
if command -v mongod &> /dev/null; then
    echo -e "${GREEN}✅ MongoDB found: $(mongod --version | head -n1)${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB not found. You'll need to either:${NC}"
    echo -e "   1. Install MongoDB locally from: https://www.mongodb.com/try/download/community"
    echo -e "   2. Use MongoDB Atlas (free tier): https://www.mongodb.com/cloud/atlas"
fi

# Setup Backend
echo ""
echo -e "${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please update backend/.env with your credentials${NC}"
    echo -e "   - MongoDB URI"
    echo -e "   - JWT Secret"
    echo -e "   - Cloudinary API keys"
    echo -e "   - HuggingFace API key"
fi

cd ..

# Setup Frontend Student
echo ""
echo -e "${YELLOW}Setting up Frontend (Student)...${NC}"
cd frontend-student

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo -e "${GREEN}✅ Frontend .env created${NC}"
fi

cd ..

# Setup Frontend Admin
echo ""
echo -e "${YELLOW}Setting up Admin Dashboard...${NC}"
cd frontend-admin

if [ ! -d "node_modules" ]; then
    echo "Installing admin dependencies..."
    npm install
    echo -e "${GREEN}✅ Admin dependencies installed${NC}"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "VITE_API_URL=http://localhost:5000/api" > .env
    echo -e "${GREEN}✅ Admin .env created${NC}"
fi

cd ..

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Setup Complete!                  ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"

echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "1. Update ${GREEN}backend/.env${NC} with your credentials"
echo -e "2. Start MongoDB locally or setup MongoDB Atlas"
echo -e ""
echo -e "${YELLOW}To run the application:${NC}"
echo -e "Terminal 1: ${GREEN}cd backend && npm run dev${NC}"
echo -e "Terminal 2: ${GREEN}cd frontend-student && npm run dev${NC}"
echo -e "Terminal 3: ${GREEN}cd frontend-admin && npm run dev${NC}"
echo ""
echo -e "${YELLOW}Access URLs:${NC}"
echo -e "Backend:   ${GREEN}http://localhost:5000${NC}"
echo -e "Student:   ${GREEN}http://localhost:3000${NC}"
echo -e "Admin:     ${GREEN}http://localhost:3001${NC}"
echo ""
echo -e "${GREEN}Happy Learning! 🚀📚${NC}"
