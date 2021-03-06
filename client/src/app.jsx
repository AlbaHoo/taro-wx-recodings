import Taro, { Component } from '@tarojs/taro'
import IndexPage from './pages/IndexPage'

import './app.scss'
import './assets/fonts/iconfont/iconfont.css'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/HomePage/index',
      'pages/LoginPage/index',
      'pages/IndexPage/index',
      'pages/TypesPage/index',
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount () {
    Taro.cloud.init({
      env: 'alba-schedule-10p18'
    });
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <IndexPage />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
