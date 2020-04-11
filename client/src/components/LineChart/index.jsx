import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { F2Canvas } from "taro-f2";
import F2 from "@antv/f2";
import { fixF2 } from 'taro-f2/dist/weapp/common/f2-tool.ts';
import store from '@/src/utils/store.js';

import './style.scss';

class LineChart extends Component {
  drawBar(canvas, width, height){

    // ⚠️ 别忘了这行
    // 为了兼容微信与支付宝的小程序，你需要通过这个命令为F2打补丁
    // https://github.com/antvis/F2/blob/3.1/demos/pie-01.html
    fixF2(F2);

    const data = this.props.data;
    //const data = [
    //{ value: 63.4, type: 'New York', date: '2011-10-01' },
    //{ value: 62.7, type: 'San Francisco', date: '2011-10-01' },
    //{ value: 72.2, type: 'Austin', date: '2011-10-01' },
    //{ value: 58, type: 'New York', date: '2011-10-02' },
    //{ value: 59.9, type: 'San Francisco', date: '2011-10-02' },
    //{ value: 67.7, type: 'Austin', date: '2011-10-02' },
    //{ value: 53.3, type: 'New York', date: '2011-10-03' },
    //{ value: 59.1, type: 'San Francisco', date: '2011-10-03' },
    //{ value: 69.4, type: 'Austin', date: '2011-10-03' },
    //{ value: 55.7, type: 'New York', date: '2011-10-04' },
    //{ value: 58.8, type: 'San Francisco', date: '2011-10-04' },
    //{ value: 68, type: 'Austin', date: '2011-10-04' },
    //{ value: 64.2, type: 'New York', date: '2011-10-05' },
    //{ value: 58.7, type: 'San Francisco', date: '2011-10-05' },
    //{ value: 72.4, type: 'Austin', date: '2011-10-05' },
    //{ value: 58.8, type: 'New York', date: '2011-10-06' },
    //{ value: 57, type: 'San Francisco', date: '2011-10-06' },
    //{ value: 77, type: 'Austin', date: '2011-10-06' },
    //{ value: 57.9, type: 'New York', date: '2011-10-07' },
    //{ value: 56.7, type: 'San Francisco', date: '2011-10-07' },
    //{ value: 82.3, type: 'Austin', date: '2011-10-07' },
    //{ value: 61.8, type: 'New York', date: '2011-10-08' },
    //{ value: 56.8, type: 'San Francisco', date: '2011-10-08' },
    //{ value: 78.9, type: 'Austin', date: '2011-10-08' },
    //{ value: 69.3, type: 'New York', date: '2011-10-09' },
    //{ value: 56.7, type: 'San Francisco', date: '2011-10-09' },
    //{ value: 68.8, type: 'Austin', date: '2011-10-09' },
    //{ value: 71.2, type: 'New York', date: '2011-10-10' },
    //{ value: 60.1, type: 'San Francisco', date: '2011-10-10' },
    //{ value: 68.7, type: 'Austin', date: '2011-10-10' },
    //{ value: 68.7, type: 'New York', date: '2011-10-11' },
    //{ value: 61.1, type: 'San Francisco', date: '2011-10-11' },
    //{ value: 70.3, type: 'Austin', date: '2011-10-11' },
    //{ value: 61.8, type: 'New York', date: '2011-10-12' },
    //{ value: 61.5, type: 'San Francisco', date: '2011-10-12' },
    //{ value: 75.3, type: 'Austin', date: '2011-10-12' },
    //{ value: 63, type: 'New York', date: '2011-10-13' },
    //{ value: 64.3, type: 'San Francisco', date: '2011-10-13' },
    //{ value: 76.6, type: 'Austin', date: '2011-10-13' },
    //{ value: 66.9, type: 'New York', date: '2011-10-14' },
    //{ value: 67.1, type: 'San Francisco', date: '2011-10-14' },
    //{ value: 66.6, type: 'Austin', date: '2011-10-14' },
    //{ value: 61.7, type: 'New York', date: '2011-10-15' },
    //{ value: 64.6, type: 'San Francisco', date: '2011-10-15' },
    //{ value: 68, type: 'Austin', date: '2011-10-15' },
    //{ value: 61.8, type: 'New York', date: '2011-10-16' },
    //{ value: 61.6, type: 'San Francisco', date: '2011-10-16' },
    //{ value: 70.6, type: 'Austin', date: '2011-10-16' },
    //{ value: 62.8, type: 'New York', date: '2011-10-17' },
    //{ value: 61.1, type: 'San Francisco', date: '2011-10-17' },
    //{ value: 71.1, type: 'Austin', date: '2011-10-17' },
    //{ value: 60.8, type: 'New York', date: '2011-10-18' },
    //{ value: 59.2, type: 'San Francisco', date: '2011-10-18' },
    //{ value: 70, type: 'Austin', date: '2011-10-18' },
    //{ value: 62.1, type: 'New York', date: '2011-10-19' },
    //{ value: 58.9, type: 'San Francisco', date: '2011-10-19' },
    //{ value: 61.6, type: 'Austin', date: '2011-10-19' },
    //{ value: 65.1, type: 'New York', date: '2011-10-20' },
    //{ value: 57.2, type: 'San Francisco', date: '2011-10-20' },
    //{ value: 57.4, type: 'Austin', date: '2011-10-20' },
    //{ value: 55.6, type: 'New York', date: '2011-10-21' },
    //{ value: 56.4, type: 'San Francisco', date: '2011-10-21' },
    //{ value: 64.3, type: 'Austin', date: '2011-10-21' },
    //{ value: 54.4, type: 'New York', date: '2011-10-22' },
    //{ value: 60.7, type: 'San Francisco', date: '2011-10-22' },
    //{ value: 72.4, type: 'Austin', date: '2011-10-22' },
    //{ value: 54.4, type: 'New York', date: '2011-10-23' },
    //{ value: 65.1, type: 'San Francisco', date: '2011-10-23' },
    //{ value: 72.4, type: 'Austin', date: '2011-10-23' },
    //{ value: 54.8, type: 'New York', date: '2011-10-24' },
    //{ value: 60.9, type: 'San Francisco', date: '2011-10-24' },
    //{ value: 72.5, type: 'Austin', date: '2011-10-24' },
    //{ value: 57.9, type: 'New York', date: '2011-10-25' },
    //{ value: 56.1, type: 'San Francisco', date: '2011-10-25' },
    //{ value: 72.7, type: 'Austin', date: '2011-10-25' },
    //{ value: 54.6, type: 'New York', date: '2011-10-26' },
    //{ value: 54.6, type: 'San Francisco', date: '2011-10-26' },
    //{ value: 73.4, type: 'Austin', date: '2011-10-26' },
    //{ value: 54.4, type: 'New York', date: '2011-10-27' },
    //{ value: 56.1, type: 'San Francisco', date: '2011-10-27' },
    //{ value: 70.7, type: 'Austin', date: '2011-10-27' },
    //{ value: 42.5, type: 'New York', date: '2011-10-28' },
    //{ value: 58.1, type: 'San Francisco', date: '2011-10-28' },
    //{ value: 56.8, type: 'Austin', date: '2011-10-28' },
    //{ value: 40.9, type: 'New York', date: '2011-10-29' },
    //{ value: 57.5, type: 'San Francisco', date: '2011-10-29' },
    //{ value: 51, type: 'Austin', date: '2011-10-29' },
    //{ value: 38.6, type: 'New York', date: '2011-10-30' },
    //{ value: 57.7, type: 'San Francisco', date: '2011-10-30' },
    //{ value: 54.9, type: 'Austin', date: '2011-10-30' },
    //{ value: 44.2, type: 'New York', date: '2011-10-31' },
    //{ value: 55.1, type: 'San Francisco', date: '2011-10-31' },
    //{ value: 58.8, type: 'Austin', date: '2011-10-31' },
    //{ value: 49.6, type: 'New York', date: '2011-11-01' },
    //{ value: 57.9, type: 'San Francisco', date: '2011-11-01' },
    //{ value: 62.6, type: 'Austin', date: '2011-11-01' },
    //{ value: 47.2, type: 'New York', date: '2011-11-02' },
    //{ value: 64.6, type: 'San Francisco', date: '2011-11-02' },
    //{ value: 71, type: 'Austin', date: '2011-11-02' },
    //{ value: 50.1, type: 'New York', date: '2011-11-03' }
    //];

    const findLabel = (name) => {
      const item = data.find(item => item.name === name);
      return item.label || item.value || '(missing)';
    }

    const chart = new F2.Chart({
      el: canvas,
      width,
      height
    });
    chart.source(data, {
      date: {
        range: [ 0, 1 ],
        type: 'timeCat',
        mask: 'DD'
      },
      value: {
        tickCount: 5
      }
    });
    chart.tooltip(false);
    chart.axis('date', {
      label(text, index, total) {
        const textCfg = {};
        if (index === 0) {
          textCfg.textAlign = 'left';
        }
        if (index === total - 1) {
          textCfg.textAlign = 'right';
        }
        return textCfg;
      }
    });
    chart.line().position('date*value').color('type');
    chart.render();
  }

  render () {
    const hide = this.props.hide;
    return (
      <View className="LineChart">
        <View style='width:90%;height:150px'>
           {!hide && <F2Canvas onCanvasInit={this.drawBar.bind(this)} />}
        </View>
      </View>
    )
  }
}

export default LineChart;
