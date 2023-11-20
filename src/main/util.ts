import fs from 'fs';
import os from 'os';
import path from 'path';
import { URL } from 'url';

import { exec } from 'child_process';
import { randomUUID } from 'node:crypto';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function isRGBHex(value: string | undefined) {
  if (typeof value !== 'string') {
    return false;
  }

  return /^#?([a-f\d]{3}([a-f\d]{3})?)$/i.test(value);
}

export function isUrl(string: string, { lenient = false } = {}) {
  if (typeof string !== 'string') {
    throw new TypeError('Expected a string');
  }

  // eslint-disable-next-line no-param-reassign
  string = string.trim();
  if (string.includes(' ')) {
    return false;
  }

  try {
    new URL(string); // eslint-disable-line no-new
    return true;
  } catch {
    if (lenient) {
      return isUrl(`https://${string}`);
    }

    return false;
  }
}

export async function tempfile(options = {}) {
  // TODO: Remove this for v6.
  if (typeof options === 'string') {
    throw new TypeError(
      'You must now pass in the file extension as an object.'
    );
  }

  let { extension } = options;

  if (typeof extension === 'string') {
    extension = extension.startsWith('.') ? extension : `.${extension}`;
  }
  // const tempDirectory = fs.realpathSync(os.tmpdir(), {
  //   encoding: 'utf-8',
  // });
  // 不同平台的图片目录
  const tempDirectory = fs.realpathSync(os.homedir(), {
    encoding: 'utf-8',
  });

  return path.join(tempDirectory, randomUUID() + (extension ?? ''));
}

export const getPicturePath = (options = {}) => {
  // 不同平台的图片目录
  const tempDirectory = fs.realpathSync(os.homedir(), {
    encoding: 'utf-8',
  });
  let picturePath = '';
  if (process.platform === 'darwin') {
    picturePath = 'Pictures';
  } else if (process.platform === 'win32') {
    picturePath = 'Pictures';
  } else {
    picturePath = 'Pictures';
  }

  let { extension } = options;

  if (typeof extension === 'string') {
    extension = extension.startsWith('.') ? extension : `.${extension}`;
  }

  return path.join(
    tempDirectory,
    picturePath,
    'wallpaper',
    randomUUID() + (extension ?? '')
  );
};

// 设置为壁纸
// export const setWallpaperWith = async (input: string) => {
//   // 判断平台
//   let wallpaper = null;
//   if (process.platform === 'darwin') {
//     wallpaper = macos;
//   } else if (process.platform === 'win32') {
//     wallpaper = windows;
//   } else {
//     wallpaper = linux;
//   }

//   const { setWallpaper } = wallpaper;
//   if (isUrl(input)) {
//     // 缓存远程图片到本地
//     // 获取input后缀
//     const extension = path.extname(input);
//     // 本地缓存目录 系统的缓存目录
//     // 缓存到系统的图片文件夹
//     const file = getPicturePath({ extension });
//     // 文件夹不存在则新建
//     if (!fs.existsSync(path.dirname(file))) {
//       fs.mkdirSync(path.dirname(file), { recursive: true });
//     }
//     // 获取远程图片
//     const response = await net.fetch(input);
//     if (response.ok && response.body) {
//       // 将chunk转换成stream
//       const reader = await response.body.getReader();
//       // reader to string
//       const { value } = await reader.read();
//       const buffer = Buffer.from(value!);
//       // 写入文件
//       fs.writeFileSync(file, buffer);
//       await setWallpaper(file);
//     }
//   } else if (isRGBHex(input)) {
//     // await setSolidColorWallpaper(input);
//   } else {
//     await setWallpaper(input);
//   }
// };

export const setWallpaperWith = async (input: string) => {
  const wallpaperBin = path.join(
    __dirname,
    '../../node_modules/.bin/wallpaper'
  );
  exec(`${wallpaperBin} ${input}`);
};
