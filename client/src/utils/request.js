import Taro from '@tarojs/taro';
import config from '@/src/config.js';

const handleSuccess = (res, callback) => {
  const { statusCode, data } = res;
  console.log(res);
  if (statusCode === 401) {
    console.error('Unauthorized request');
    Taro.redirectTo({
      url: '../LoginPage/index'
    });
  } else if (statusCode === 500) {
    console.error('Server is down');
  } else if (!(data && data.data)) {
    console.error('No data in response');
  } else {
    // success
    callback(data.data);
  }
};

const handleError = (error, callback) => {
  console.log(JSON.stringify(error));
  if (error && error.errMsg.includes('request:fail')) {
    console.log('Server cannot be connected');
    Taro.redirectTo({
      url: '../LoginPage/index'
    }).then(() => {
      Taro.showToast({
        title: '无法连接服务器，请检查网络',
        icon: 'none',
        duration: 2000
      });
    });
  } else {
    callback(error);
  };
  Taro.hideLoading();
};

const request = ({ path, method, data, header, success, fail }) => {
  Taro.request({
    url: `${config.apiUrl}${path}`,
    method: method || 'GET',
    data,
    header,
    success: (res) => {
      handleSuccess(res, success);
    },
    fail: (error) => {
      console.log('error');
      handleError(error, fail);
    }
  });
};

export default request;
