#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 检测当前操作系统
const currentOS = os.platform();
console.log(`🖥️ 当前操作系统: ${currentOS}`);

// 创建bin目录
const binDir = path.join(__dirname, 'bin');
if (!fs.existsSync(binDir)) {
  fs.mkdirSync(binDir);
}

// 定义根据当前OS可构建的平台和架构
let platforms = [];

// macOS可以构建macOS和Windows二进制文件，但有些Linux架构可能有问题
if (currentOS === 'darwin') {
  platforms = [
    { 
      name: 'win', 
      targets: ['x64', 'x86', 'arm64'],
      ext: '.exe'
    },
    { 
      name: 'macos', 
      targets: ['x64', 'arm64'],
      ext: ''
    },
    // 在macOS上，只尝试构建Linux x64架构
    { 
      name: 'linux', 
      targets: ['x64'],
      ext: ''
    }
  ];
} 
// Linux通常可以构建所有Linux变体以及Windows
else if (currentOS === 'linux') {
  platforms = [
    { 
      name: 'win', 
      targets: ['x64', 'x86', 'arm64'],
      ext: '.exe'
    },
    { 
      name: 'linux', 
      targets: ['x64', 'arm64', 'armv7'],
      ext: ''
    }
  ];
} 
// Windows通常只能构建Windows
else if (currentOS === 'win32') {
  platforms = [
    { 
      name: 'win', 
      targets: ['x64', 'x86', 'arm64'],
      ext: '.exe'
    }
  ];
}

console.log('🚀 正在为所有兼容平台构建二进制文件...');
console.log('⚠️ 注意: 跨平台构建受限于当前操作系统。某些目标可能需要在其他操作系统上构建。');

// 为每个平台和架构构建
let successCount = 0;
let failCount = 0;
const allTargets = platforms.reduce((count, p) => count + p.targets.length, 0);

platforms.forEach(platform => {
  platform.targets.forEach(arch => {
    const outputName = `app_${platform.name}_${arch}${platform.ext}`;
    const outputPath = path.join(binDir, outputName);
    
    console.log(`📦 构建 ${platform.name}-${arch}...`);
    
    try {
      execSync(
        `pkg . -t node14-${platform.name}-${arch} -C GZip -o ${outputPath} --no-bytecode`,
        { stdio: 'inherit' }
      );
      console.log(`✅ 成功构建 ${outputName}`);
      successCount++;
    } catch (error) {
      console.error(`❌ 构建 ${outputName} 失败:`, error.message);
      failCount++;
    }
  });
});

console.log(`\n🎉 构建过程完成! 成功: ${successCount}/${allTargets}, 失败: ${failCount}/${allTargets}`);

if (failCount > 0) {
  console.log('\n⚠️ 提示:');
  console.log('- 某些平台需要在目标系统上构建');
  console.log('- 在Linux上构建可获得最完整的Linux二进制文件');
  console.log('- 在macOS上构建可获得macOS和部分跨平台二进制文件');
  console.log('- 在Windows上构建通常只能构建Windows二进制文件');
} 