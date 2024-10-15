import request from "@/utils/request";
export const TsaveBarrage = (data) => {
  if (data.table === '' || data.barrage === '') {
    ElNotification.error("请选择分栏或输入烂梗");
  } else {
    request.post('/machine/addUnaudit', {
      ip: localStorage.getItem('ip'),
      table: data.table,
      barrage: data.barrage
    }).then(res => {
      data.dialogFormVisible = false;
      data.barrage = '';
      if (res.code === '200') {
        ElNotification.success("投稿成功，待审核(一天内)");
      } else {
        ElNotification.error("请求失败");
      }
    });
  }
};

export const TqueryBarrage = (searchQuery, data) => {
  return new Promise((resolve, reject) => {
    request.post('/machine/Query', {
      QueryBarrage: searchQuery
    }).then(res => {
      data.isInput = true;
      data.loading = false;
      data.filteredItems = res.data || [];
      resolve({
        isInput: data.isInput,
        loading: data.loading,
        filteredItems: data.filteredItems
      });
    });
  })
};

export const TgetRandOne = (data) => {
  return new Promise((resolve, reject) => {
    request.get('/machine/getRandOne')
      .then(res => {
        data.tableData = [res.data];
        resolve(true); // 返回 1
      })
      .catch(err => {
        console.error("随机失败");
        reject(err); // 捕获错误并拒绝 Promise
      });
  });
};

export const TcopyText = (row) => {
  const currentTime = new Date().getTime();
  const currentMousePosition = {
    x: event.clientX,
    y: event.clientY
  };

  if (lastMousePosition && lastMousePosition.x === currentMousePosition.x && lastMousePosition.y === currentMousePosition.y) {
    mousePositionCnt++;
    console.log(mousePositionCnt);
    if (mousePositionCnt > 4) {
      ElMessageBox.alert('😡😡😡你在刷次数😡😡😡', '请勿使用连点器', {
        confirmButtonText: '好吧，我错了',
      });
    }
  } else {
    mousePositionCnt = 0;
  }

  if (currentTime - lastCallTime < 1500) {
    ElNotification({
      title: '请勿刷次数',
      message: '复制成功，但次数没有增加',
      type: 'warning',
    });

    const textToCopy = row.barrage;
    let tempInput = document.createElement('input');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('Copy');
    } catch (err) {
      ElNotification({
        title: '复制失败',
        message: '复制操作失败，请稍后重试',
        type: 'error',
      });
      console.error('复制失败:', err);
    }
    document.body.removeChild(tempInput);

    lastCallTime = currentTime;
    lastMousePosition = currentMousePosition;
    return;
  }

  lastMousePosition = currentMousePosition;
  lastCallTime = currentTime;

  const textToCopy = row.barrage;
  let tempInput = document.createElement('input');
  tempInput.value = textToCopy;
  document.body.appendChild(tempInput);
  tempInput.select();
  try {
    document.execCommand('Copy');
    open2();
    console.log('内容已复制到剪贴板');
    request.post('/machine/addCnt', {
      PageNum: data.currentPage,
      table: 'allbarrage',
      id: row.id
    }).then(() => {
      setTimeout(() => load(data.currentPage), 50);
    });
  } catch (err) {
    ElNotification({
      title: '复制失败',
      message: '复制操作失败，请稍后重试',
      type: 'error',
    });
    console.error('复制失败:', err);
    open4();
  }
  document.body.removeChild(tempInput);
};

export const TcalculateCountdown = (TxServerDate, ServerDate) => {
  const now = new Date();
  const diffTime3 = TxServerDate - now;
  ServerDate.value = Math.ceil(diffTime3 / (1000 * 60 * 60 * 24));
};

export const TonSearchQueryChange = (searchQuery, data) => {
  data.filteredItems = [];
  data.isInput = false;
};