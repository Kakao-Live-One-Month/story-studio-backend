const fs = require('fs');
const path = require('path');

const services = ['story', 'payment', 'pdf', 'upload'];
const apiDir = path.join(__dirname, '..', 'api');

// api 디렉토리 생성
if (!fs.existsSync(apiDir)) {
  fs.mkdirSync(apiDir, { recursive: true });
}

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