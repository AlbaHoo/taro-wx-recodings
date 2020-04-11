import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { F2Canvas } from "taro-f2";
import F2 from "@antv/f2";
import { fixF2 } from 'taro-f2/dist/weapp/common/f2-tool.ts';
import store from '@/src/utils/store.js';
import BarChart from '@/src/components/BarChart';
import PieChart from '@/src/components/PieChart';
import LineChart from '@/src/components/LineChart';
import { AtNavBar,  AtModal, AtModalHeader, AtModalContent, AtModalAction, AtCalendar } from 'taro-ui';

import './style.scss';
import 'taro-ui/dist/style/components/nav-bar.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/modal.scss';
import 'taro-ui/dist/style/components/calendar.scss';

class IndexPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isDatePickerOpen: false,
      selectedDate: ''
    }
  }

  config = {
    navigationBarTitleText: '统计'
  }

  componentDidMount() {
  }

  handleReset = () => {
    Taro.showModal({
      title: '警告',
      content: "重置会删除全部的历史\n时间记录，是否确认?",
    }).then(res => {
      if (res.confirm) {
        store.clearAll().then(() => {
          Taro.redirectTo({url: '../HomePage/index'});
        });
      }
    })
  }

  handleChooseDate = () => {
    this.setState({isDatePickerOpen: true});
  }

  handleCancel = () => {
    this.setState({isDatePickerOpen: false});
  }

  handleDateSelected = (date) => {
    this.setState({selectedDate: date.value.start});
  }

  renderModel = () => {
    const { isDatePickerOpen } = this.state;
    return (
      <AtModal
        isOpened={isDatePickerOpen}
      >
        <AtModalHeader>选择日期</AtModalHeader>
        <AtModalContent>
          <AtCalendar onSelectDate={this.handleDateSelected} onDayClick={this.handleCancel}/>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={this.handleCancel}>取消</Button>
         </AtModalAction>
      </AtModal>
    );
  }

  render () {
    const { isDatePickerOpen, selectedDate } = this.state;
    console.log(selectedDate);
    const data = selectedDate ? store.dateSummary(selectedDate) : store.summary();
    return (
      <View className="IndexPage">
        {this.renderModel()}
        <View>
          <AtNavBar
            onClickRgIconNd={this.handleChooseDate}
            onClickRgIconSt={this.handleReset}
            color='#000'
            title="分析与重置"
            rightFirstIconType='repeat-play'
            rightSecondIconType='calendar'
          />
        </View>

        <Text>{selectedDate || "总"}时间统计</Text>
        <PieChart data={data} hide={isDatePickerOpen}/>
        <Text>前7天统计(分钟)</Text>
        <LineChart data={store.lineSummary()} hide={isDatePickerOpen}/>
      </View>
    )
  }
}

export default IndexPage;
