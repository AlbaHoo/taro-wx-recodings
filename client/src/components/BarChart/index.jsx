import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { F2Canvas } from "taro-f2";
import F2 from "@antv/f2";
import { fixF2 } from 'taro-f2/dist/weapp/common/f2-tool.ts';
import store from '@/src/utils/store.js';

import './style.scss';

class BarChart extends Component {
  drawBar(canvas, width, height){

    // ⚠️ 别忘了这行
    // 为了兼容微信与支付宝的小程序，你需要通过这个命令为F2打补丁
    fixF2(F2);

    const data = this.props.data;
    const chart = new F2.Chart({
      el: canvas,
      pixelRatio: 10,
      width,
      height
    });
    chart.source(data);
    chart.interval()
      .position('name*value')
      .color('name', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0' ])
    chart.render();
  }

  render () {
    return (
      <View className="PieChart">
        <View style='width:200px;height:200px'>
          <F2Canvas onCanvasInit={this.drawBar.bind(this)} />
        </View>
      </View>
    )
  }
}

export default BarChart;
