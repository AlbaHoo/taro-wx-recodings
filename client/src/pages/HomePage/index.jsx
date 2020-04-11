import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button, Radio, Navigator } from '@tarojs/components'
import { AtNavBar, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui';
import PieChart from '@/src/components/PieChart';
import store from '@/src/utils/store.js';

import './style.scss'
import 'taro-ui/dist/style/components/nav-bar.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/modal.scss';

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      currentState: {},
      list: [],
      selected: '',
      startSeconds: null
    }
  }

  componentDidMount() {
    const openid = store.getString('openid');
    const offline = store.getString('mode') === 'offline';
    console.log(offline);
    if (!openid && !offline) {
      Taro.showModal({
        title: '登陆微信账号保留数据',
        content: "点击取消体验离线模式\n删除小程序将导致数据丢失",
      }).then(res => {
        if (res.confirm) {
          Taro.redirectTo({
             url: '../LoginPage/index'
          });
        }
        if (res.cancel) {
          Taro.setStorageSync('mode', 'offline');
          this.initialise();
        }
      })
    } else {
      this.initialise();
    }
  }
  initialise = () => {
    const current = store.currentState();
    this.setState({
      currentState: current,
      list: store.getTypes(),
      selected: current.type,
      startSeconds: store.getStartedSeconds()
    });
    if (current.status === 'started') {
      this.interval = setInterval(this.updateSeconds, 1000);
    }
  }

  updateSeconds = () => {
    const current = store.currentState();
    this.setState({
      startSeconds: store.getStartedSeconds()
    });
  }

  config = {
    navigationBarTitleText: '记录'
  }

  handleStart = () => {
    console.log('start');
    this.interval = setInterval(this.updateSeconds, 1000);
    store.setStart(this.state.selected);
    this.setState({
      startSeconds: 0,
      currentState: store.currentState()
    });
  }

  handleStop = () => {
    console.log('stop');
    Taro.showModal({
      title: '结束本次活动',
      content: "确定吗",
    }).then(res => {
      if (res.confirm) {
        clearInterval(this.interval);
        store.setStop();
        this.setState({
          currentState: store.currentState()
        });
      }
    })
  }

  handleSelect = (e) => {
    this.setState({selected: e.target.value});
  }

  handleClick = () => {
    Taro.redirectTo({
      url: '../HomePage/index'
    });
  }

  componentWillMount () {
    console.log('page loaded');

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleAdd = () => {
    Taro.redirectTo({
      url: '../TypesPage/index'
    });
  }

  handleLogin = () => {
    Taro.redirectTo({
      url: '../LoginPage/index'
    });
  }

  handleAnalytics = () => {
    Taro.navigateTo({
      url: '../IndexPage/index'
    });
  }

  renderList = (list, type, disabled) => {
    return (
      <RadioGroup onChange={this.handleSelect}>
        {list.map((item, i) => {
          return (
            <Label className='radio-list__label' for={i} key={i}>
              <Radio className='radio-list__radio' value={item} checked={item === type} disabled={disabled}>{item}</Radio>
            </Label>
          )
        })}
      </RadioGroup>
    );
  }

  // weird onChange not working, have to use onInput
  render () {
    const { currentState, selected, startSeconds, list } = this.state;

    const { type, start, end, status } = currentState;
    const started = status === 'started';
    return (
      <View className="HomePage">
        <Head title='Radio' />
        <View>
          <AtNavBar
            onClickLeftIcon={this.handleLogin}
            onClickRgIconNd={this.handleAdd}
            onClickRgIconSt={this.handleAnalytics}
            color='#000'
            leftText={store.loggedIn() ? '已登陆' : '登陆'}
            rightFirstIconType='analytics'
            rightSecondIconType='add-circle'
          />
        </View>
        <View className='pageBody'>
          <View className='pageSection'>
            <Radio value='选中' checked disabled>选中</Radio>
            <Radio style='margin-left: 20rpx' value='未选中' disabled>未选中</Radio>
          </View>
          <View className='pageSection'>
            <Text>选择现在要干嘛？</Text>
            <View className='radioList'>
              {list.length > 0
                ? this.renderList(list, type, started)
                : <Navigator className="link inline" url="../TypesPage/index" openType="redirect">添加新的计时类型</Navigator>
              }
            </View>
          </View>
        </View>

        <AtModal
          isOpened={started}
        >
          <AtModalHeader>正在努力</AtModalHeader>
          <AtModalContent>
            <View>事件类型：{type}</View>
            <View>开始时间: {store.getHumanTime(start)}</View>
            <View>已经进行了: {startSeconds}</View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.handleStop}>结束</Button>
           </AtModalAction>
        </AtModal>
        { started
            ? <Button type='warn' onClick={this.handleStop}>结束</Button>
            : <Button type='primary' onClick={this.handleStart} disabled={selected === ''}> 开始</Button>
        }
        <View className="title">
          <Text className="inline">今天统计。 </Text>
          <Navigator className="link inline" url="../IndexPage/index" openType="redirect">查看更多统计...</Navigator>
        </View>
        <PieChart data={store.todaySummary()} hide={status === 'started'} />
      </View>
    )
  }
}
export default HomePage;
