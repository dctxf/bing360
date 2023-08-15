import { execSync } from 'child_process';
import path from 'path';

// 设置为壁纸
export const setWallpaper = async (img?: string) => {
  // 执行命令
  const binUrl = path.resolve(__dirname, '../../node_modules/.bin/wallpaper');
  execSync(`${binUrl} ${img}`);
};
