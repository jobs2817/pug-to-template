'use strict';
const path = require('path');
const fs = require('fs');
const { Controller } = require('egg');
const { spawnSync } = require('child_process');
const zlib = require('zlib');
const compressing = require('compressing');

function createGzip(Path, ctx, uuid) {
  // 创建压缩流（gzip压缩）
  // const gzip = zlib.createGzip();
  // // 创建写入流
  // const writeStream = fs.createWriteStream(path.join(__dirname, `../public/zip/${uuid}.zip`));
  return new Promise((resolve, reject) => {
    compressing.zip.compressDir(Path, path.join(__dirname, `../public/zip/${uuid}.zip`))
      .then(() => {
        resolve()
        console.log('success');
      })
      .catch(err => {
      })
    // fs.readdir(Path, (err, files) => {
    //   if (err) {
    //     console.error('err--->', err);
    //     return;
    //   };

    //   files.forEach(file => {
    //     console.log(file, '<-------filefilefile');
    //     // 创建读取流
    //     const filePath = path.join(Path, file);
    //     const readStream = fs.createReadStream(filePath);
    //     readStream.pipe(gzip).pipe(writeStream);
    //   });
    //   // 在管道完成时打印成功信息
    //   writeStream.on('finish', () => {
    //     resolve();
    //     console.log('文件压缩成功！');
    //   });
  });
}

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const files = ctx.request.files;

    const uuid = `_${+new Date().setMilliseconds(10)}`;
    const uploadBasePath = '../public/uploadForFile';
    const dir = path.join(__dirname, uploadBasePath, uuid);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileData = fs.readFileSync(file.filepath, { encoding: 'utf-8' });

      // 文件重命名
      const filename = file.filename;
      const filepath = path.join(dir, filename);

      // 判断是否存在该文件夹，不存在则创建。
      try {
        fs.writeFileSync(filepath, fileData, { encoding: 'utf-8' });
        const scriptPath = path.join(__dirname, '../script/index.js');
        const result = spawnSync('node', [ `${scriptPath}`, `${filepath}` ], { encoding: 'utf-8' });

      } catch (e) {
        console.log(e, '<------e');
        ctx.status = 500;
        ctx.body = { msg: '上传文件失败' };
      }
    }

    await createGzip(dir, ctx, uuid);

    ctx.status = 200;
    ctx.body = {
      filename: '',
      url: `/public/uploadForFile`,
    };

    // 指定上传路径
    // try {
    //   // const data = fs.readFileSync(file.filepath, 'utf8');
    //   // console.log('文件内容:', data);
    //   // ctx.body = data;
    //   // 或者使用 execSync 执行脚本
    //   // console.log(fs.existsSync('/private/tmp/egg-multipart-tmp/vue-transform-html/2023/10/07/16/'), '<------fs.existsSync(filePath)');
    //   const scriptPath = path.join(__dirname, '../bin/index.js');
    //   const result = spawnSync('command', [ `${scriptPath}`, `${path.resolve('', '/tmp/egg-multipart-tmp/vue-transform-html/2023/10/07/16/')}` ], { encoding: 'utf-8' });
    //   console.log(result.stdout, '<-----result.stdout');
    //   // const output = execSync(`node ${scriptPath} ${path.resolve('', '/private/tmp/egg-multipart-tmp/vue-transform-html/2023/10/07/16/')}`);
    //   // console.log(output.toString(), '<----output.toString');
    // } catch (err) {
    //   console.error('文件读取失败:', err);
    // }
  }
}

module.exports = HomeController;
