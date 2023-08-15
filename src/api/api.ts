import ky from 'ky';
/**
 * 360和bing壁纸接口
 */

const qihuBaseURL = 'http://wp.birdpaper.com.cn';
const bingBaseURL = 'https://cn.bing.com';

// 请求实例
const apiByQihu = ky.create({ prefixUrl: qihuBaseURL });
const apiByBing = ky.create({ prefixUrl: bingBaseURL });

// 360壁纸接口
// "http://wp.birdpaper.com.cn/intf/GetListByCategory?cids={cid}&pageno={start}&count={count}"
// 获取360壁纸分类
export type QihuCategoryParams = {
  cids: string;
  pageno: number;
  count: number;
};
export type QihuCategoryTag = {
  icon: string;
  show_tag: string;
  tag: string;
};
export type QihuCategoryItem = {
  category: string;
  hot_tag: QihuCategoryTag[];
  icon: string;
  old_id: string;
  position: string;
  show_name: string;
};
export type QihuCategoryResponse = {
  data: QihuCategoryItem[];
  msg: string;
};
export const getQihuCategory = (
  params: QihuCategoryParams = {
    pageno: 1,
    count: 10,
    cids: '',
  }
) =>
  apiByQihu
    .get('intf/getCategory', {
      searchParams: params,
    })
    .json() as Promise<QihuCategoryResponse>;

// 360分类详情
export type QihuCategoryDetailItem = {
  id: string;
  category: string;
  tag: string;
  url: string;
  status: string;
  live_open: boolean;
  class_id: string;
};
export type QihuCategoryDetailResponse = {
  data: {
    total_count: number;
    total_page: number;
    pageno: number;
    count: number;
    list: QihuCategoryDetailItem[];
  };
  msg: string;
};
// 360壁纸最新壁纸接口

export const getQihuNewest = (searchParams?: QihuCategoryParams) =>
  apiByQihu
    .get('intf/newestList', { searchParams })
    .json() as Promise<QihuCategoryDetailResponse>;

export const getQihuCategoryDetail = (searchParams?: QihuCategoryParams) => {
  if (!searchParams?.cids) {
    return getQihuNewest(searchParams);
  }
  return apiByQihu
    .get('intf/GetListByCategory', { searchParams })
    .json() as Promise<QihuCategoryDetailResponse>;
};

// bing 壁纸接口
// "https://cn.bing.com/HPImageArchive.aspx?format=js&idx=1&n=10"
export type BingWallpaperParams = {};
export type BingWallpaperItem = {};
export const getBingWallpaper = (searchParams: BingWallpaperParams) =>
  apiByBing.get('HPImageArchive.aspx', { searchParams }).json();

export default {
  getQihuCategory,
  getQihuCategoryDetail,
  getQihuNewest,
  getBingWallpaper,
};
