import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { F2Canvas } from "taro-f2";
import F2 from "@antv/f2";
import { fixF2 } from 'taro-f2/dist/weapp/common/f2-tool.ts';
import store from '@/src/utils/store.js';

import './style.scss';

class PieChart extends Component {
  drawBar(canvas, width, height){

    // ⚠️ 别忘了这行
    // 为了兼容微信与支付宝的小程序，你需要通过这个命令为F2打补丁
    // https://github.com/antvis/F2/blob/3.1/demos/pie-01.html
    fixF2(F2);

    const data = this.props.data;

    const findLabel = (name) => {
      const item = data.find(item => item.name === name);
      return item.label || item.value || '(missing)';
    }

    const chart = new F2.Chart({
      el: canvas,
      width,
      height
    });
    chart.source(data);
    chart.legend({
      position: 'right',
      itemFormatter(val) {
        return val + '  ' + findLabel(val);
      }
    });
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.6,
      radius: 0.8
    });
    chart.axis(false);
    chart.interval()
      .position('a*value')
      .color('name', [ '#1890FF', '#13C2C2', '#2FC25B', '#FACC14', '#F04864', '#8543E0' ])
      .adjust('stack')
      .style({
        lineWidth: 1,
        stroke: '#fff'
      });
    chart.tooltip(false);
    chart.render();
  }

  render () {
    const hide = this.props.hide;
    return (
      <View className="PieChart">
        <View style='width:90%;height:150px'>
           {!hide && <F2Canvas onCanvasInit={this.drawBar.bind(this)} />}
        </View>
      </View>
    )
  }
}

export default PieChart;
