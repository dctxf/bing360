/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useLocalStorageState, useRequest } from 'ahooks';
import {
  QihuCategoryParams,
  getQihuCategory,
  getQihuCategoryDetail,
} from 'api/api';
import { useEffect, useMemo } from 'react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';

// 默认每页条数
const DEFAULT_PAGE_SIZE = 1;

function Hello() {
  const { data } = useRequest(getQihuCategory, {});
  // 获取具体分类
  const { run: getQihuCategoryDetailRun, data: categoryDetail } = useRequest(
    getQihuCategoryDetail,
    { manual: true }
  );

  const [selected, setSelected] = useLocalStorageState<QihuCategoryParams>(
    'selected-params',
    {
      defaultValue: {
        pageno: 1,
        count: DEFAULT_PAGE_SIZE,
        cids: '',
      },
    }
  );

  useEffect(() => {
    if (selected) {
      getQihuCategoryDetailRun(selected);
    }
  }, [getQihuCategoryDetailRun, selected]);

  const onSelect = (params: QihuCategoryParams) => {
    setSelected(params);
  };

  // 当前壁纸
  const currentWallpaper = useMemo(() => {
    return categoryDetail?.data.list[0].url;
  }, [categoryDetail?.data.list]);

  // 设置为壁纸
  const changeWallpaper = async () => {
    window.electron.ipcRenderer.sendMessage(
      'ipc-setWallpaper',
      currentWallpaper
    );
  };

  return (
    <div className="main">
      <div className="categoryList">
        {data?.data.map((i) => {
          return (
            <div
              className="categoryItem"
              key={i.category}
              onClick={() => {
                onSelect({
                  cids: i.old_id,
                  pageno: 1,
                  count: DEFAULT_PAGE_SIZE,
                });
              }}
              onKeyDown={() => {
                onSelect({
                  cids: i.old_id,
                  pageno: 1,
                  count: DEFAULT_PAGE_SIZE,
                });
              }}
            >
              <h2 className="categoryItem-title">{i.category}</h2>
              <img className="categoryItem-img" src={i.icon} alt="" />
            </div>
          );
        })}
      </div>
      <div className="screen">
        {categoryDetail?.data.list.map((i) => {
          return (
            <div key={i.id} className="screen-item">
              <img src={i.url} alt="" className="screen-img" />
            </div>
          );
        })}
      </div>
      <div className="pagination">
        <button
          type="button"
          onClick={() => {
            onSelect({
              ...selected!,
              pageno: selected!.pageno - 1,
            });
          }}
          disabled={selected!.pageno === 1}
        >
          上一页
        </button>
        <button
          type="button"
          onClick={() => {
            onSelect({
              ...selected!,
              pageno: selected!.pageno + 1,
            });
          }}
          disabled={selected!.pageno === categoryDetail?.data.total_page}
        >
          下一页
        </button>
        {/* 设置为壁纸 */}
        <button
          type="button"
          onClick={() => {
            changeWallpaper();
          }}
        >
          设置为壁纸
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
