import Taro, { Component } from "@tarojs/taro";
import { View, Button, Image } from "@tarojs/components";
import store from '@/src/utils/store.js';

import './style.scss';

export default class LoginPage extends Component {
  state = {
    oauthBtnStatus: true, // 授权按钮是否显示 默认为显示
    userInfo: null, // 用户信息
    btnText: '微信授权登录'
  }
  componentWillMount() {
    // 获取用户当前授权状态
    // this.login();
    Taro.getSetting().then(res => {
      // console.log(res)
      if (Object.keys(res.authSetting).length === 0 || !res.authSetting['scope.userInfo']) {
        // 用户信息无授权
        // console.log(res.authSetting);
        console.log('用户无授权信息')
      } else if (store.getString('openid')) {
        // 用户允许授权获取用户信息
        // 隐藏授权按钮
        // 获取用户信息
        this.initialise();
      }
    }).catch(console.log);
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  // 获取用户信息
  setUserInfo = async () => {
    const userInfo = await this.getUserInfo();
    this.setState({
      userInfo: res.userInfo
    });
  }

  getUserInfo = async () => {
    const res = await Taro.getUserInfo({
      lang: 'zh_CN'
    });
    // 获取成功
    return res.userInfo;
  }

  initialise = async () => {
    const openid = store.getString('openid');
    const userInfo = await this.getUserInfo();
    userInfo.openid = openid;
    await store.addUserToCloud(userInfo); // only if openid not exist yet
    Taro.redirectTo({
      url: '../HomePage/index'
    });
  }

  // 用户授权操作后按钮回调
  onGotUserInfo = res => {
    const userInfo = res.detail.userInfo;
    if (userInfo) {
      // 返回的信息中包含用户信息则证明用户允许获取信息授权
      console.log('授权成功');
      this.login();
      // this.initialise();
    } else {
      // 用户取消授权，进行提示，促进重新授权
      Taro.showModal({
        title: '温馨提示',
        content: '简单的信任，是你我俩故事的开始',
        showCancel: false // 不展示取消按钮
      }).then(ModalRes => {
        if(ModalRes.confirm){ // 点击确定按钮
          this.setState({btnText:'重新授权登录'})
        }
      });
    }
  }

  login = () => {
    const that = this;
    Taro.login({
      success (res) {
        if (res.code) {
          Taro.cloud.callFunction({
            name:'getOpenId',
            success: res => {
              console.log(res);
              Taro.setStorageSync('openid', res.result.userInfo.openId);
              that.initialise();
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
          that.setState({btnText: res.errMsg});
        }
      }
    })
  }

  render() {
    const { oauthBtnStatus, userInfo, btnText } = this.state;
    return (
      <View className='LoginPage'>
        <View className='text'>用于记录平日里个人一些事情的使用时间，比如，学习，弹琴，运动，并且可以查看用时趋势，提高做事情的效率</View>
        { oauthBtnStatus ? <Button className='login-btn' openType='getUserInfo' onGetUserInfo={this.onGotUserInfo}>{btnText}</Button> : ''}
        { userInfo ? JSON.stringify(userInfo) : ''}
        { userInfo ? <Image src={userInfo.avatarUrl} /> : ''}
      </View>
    )
  }
}

