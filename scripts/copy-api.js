const fs = require('fs');
const path = require('path');

const services = ['story', 'payment', 'pdf', 'upload'];
const apiDir = path.join(__dirname, '..', 'api');
const publicDir = path.join(__dirname, '..', 'public');

// api 디렉토리 생성
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

// public 디렉토리 생성 및 .gitkeep 파일 추가 (Vercel 요구사항)
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
// .gitkeep 파일 생성 (빈 디렉토리 방지)
fs.writeFileSync(path.join(publicDir, '.gitkeep'), '');

// 각 서비스의 index.js를 api/{service}.js로 복사
services.forEach((service) => {
  const source = path.join(__dirname, '..', 'dist', 'services', service, 'api', 'index.js');
  const dest = path.join(apiDir, `${service}.js`);
  
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    console.log(`✓ Copied ${service}/api/index.js -> api/${service}.js`);
  } else {
    console.warn(`⚠ Source not found: ${source}`);
  }
});

console.log('✓ Build completed');