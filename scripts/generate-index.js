const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '../assets/fluent-emoji');
const OUTPUT_FILE = path.join(__dirname, '../data/emoji-index.json');

function generateIndex() {
  console.log('🔍 扫描 emoji 资源...');

  const emojis = [];
  const categories = new Set();

  // 读取 assets 目录下的所有文件夹
  const folders = fs.readdirSync(ASSETS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`📁 找到 ${folders.length} 个 emoji 文件夹`);

  folders.forEach((folder, index) => {
    const metadataPath = path.join(ASSETS_DIR, folder, 'metadata.json');

    if (fs.existsSync(metadataPath)) {
      try {
        const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));

        // 检查可用的样式 - 动态扫描实际存在的子文件夹
        const styles = {};
        const stylesDir = path.join(ASSETS_DIR, folder);

        // 读取实际存在的子文件夹
        const subDirs = fs.readdirSync(stylesDir, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        subDirs.forEach(styleDir => {
          const stylePath = path.join(stylesDir, styleDir);
          const files = fs.readdirSync(stylePath).filter(f => !f.startsWith('.'));

          if (files.length > 0) {
            // 标准化样式名称作为 key
            const styleKey = styleDir.toLowerCase().replace(/\s+/g, '-');
            // 使用实际的文件夹名称构建路径
            styles[styleKey] = `assets/${folder}/${styleDir}/${files[0]}`;
          }
        });

        // 检查是否有 default 子文件夹（深浅色主题支持）
        const defaultDir = path.join(stylesDir, 'default');
        if (fs.existsSync(defaultDir)) {
          const defaultSubDirs = fs.readdirSync(defaultDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

          defaultSubDirs.forEach(styleDir => {
            const stylePath = path.join(defaultDir, styleDir);
            const files = fs.readdirSync(stylePath).filter(f => !f.startsWith('.'));

            if (files.length > 0) {
              // 为深浅色主题添加特殊的样式键
              const styleKey = `${styleDir.toLowerCase().replace(/\s+/g, '-')}-default`;
              styles[styleKey] = `assets/${folder}/default/${styleDir}/${files[0]}`;
            }
          });
        }

        const emoji = {
          id: folder,
          name: metadata.cldr || folder,
          glyph: metadata.glyph || '',
          group: metadata.group || 'Other',
          keywords: metadata.keywords || [],
          unicode: metadata.unicode || '',
          tts: metadata.tts || '',
          styles: styles,
        };

        emojis.push(emoji);
        categories.add(emoji.group);

        if ((index + 1) % 100 === 0) {
          console.log(`  处理进度: ${index + 1}/${folders.length}`);
        }
      } catch (error) {
        console.error(`❌ 处理 ${folder} 时出错:`, error.message);
      }
    }
  });

  // 按分类组织
  const emojisByCategory = {};
  categories.forEach(cat => {
    emojisByCategory[cat] = emojis.filter(e => e.group === cat);
  });

  const data = {
    emojis: emojis,
    categories: Array.from(categories).sort(),
    emojisByCategory: emojisByCategory,
    totalCount: emojis.length,
    generatedAt: new Date().toISOString(),
  };

  // 确保 data 目录存在
  const dataDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 写入文件
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));

  console.log(`✅ 索引生成完成！`);
  console.log(`   总计: ${emojis.length} 个 emoji`);
  console.log(`   分类: ${categories.size} 个`);
  console.log(`   输出: ${OUTPUT_FILE}`);
}

generateIndex();

