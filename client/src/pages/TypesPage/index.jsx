import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button, Radio, Navigator } from '@tarojs/components'
import { AtNavBar, AtInput, AtList, AtListItem, AtSwipeAction, AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"
import store from '@/src/utils/store.js';

import './style.scss'
import 'taro-ui/dist/style/components/list.scss';
import 'taro-ui/dist/style/components/swipe-action.scss';
import 'taro-ui/dist/style/components/modal.scss';
import 'taro-ui/dist/style/components/input.scss';
import 'taro-ui/dist/style/components/nav-bar.scss';
import 'taro-ui/dist/style/components/icon.scss';

class TypesPage extends Component {
  constructor (props) {
    super(props)
    this.state = {
      list: [],
      selected: '',
      newName: '',
      isOpen: false,
      addNewOpen: false
    }
  }

  componentDidMount() {
    this.setState({
      list: store.getTypes(),
    });
  }

  config = {
    navigationBarTitleText: '事件管理'
  }

  handleOperation = (btnInfo, index, text) => {
    // second option, delete
    if (index === 1) {
      Taro.showModal({
        title: '警告',
        content: "只是删除事件类型，\n历史数据不会删除，\n是否确认?",
      }).then(res => {
        if (res.confirm) {
          store.removeType(text);
          const newTypes = store.getTypes();
          this.setState({list: newTypes});
        }
      })
    }
    if (index === 0) {
      this.setState({
        selected: text,
        isOpen: true
      });
    }
  }

  renderItem(text) {
    return (
      <AtSwipeAction onClick={(target, index) => this.handleOperation(target, index, text) }options={[
        {
          text: '重命名',
          style: {
            backgroundColor: '#6190E8'
          }
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#FF4949'
          }
        }
      ]}>
        <AtListItem className='itemText' title={text} />
      </AtSwipeAction>
    );
  }

  handleRename = () => {
    const { selected, newName } = this.state;
    store.renameType(selected, newName);
    const newTypes = store.getTypes();
    this.setState({
      list: newTypes,
      selected: '',
      addNewOpen: false,
      isOpen: false
    });
  }

  handleAddNew = () => {
    const { newName } = this.state;
    store.addType(newName);
    const newTypes = store.getTypes();
    if (newTypes.length < 5) {
      this.setState({
        list: newTypes,
        selected: '',
        newName: '',
        addNewOpen: false,
        isOpen: false
      });
    } else {
      Taro.showModal({
        title: '最多支持5个',
        content: '别贪心，不好统计的',
      })
    }
  }

  handleCancel = () => {
    this.setState({
      isOpen: false,
      addNewOpen: false,
      selected: '',
      newName: ''
    });
  }

  handleChange = (text) => {
    this.setState({
      newName: text
    });
  }

  render () {
    const {selected, isOpen, addNewOpen, newName, list} = this.state;
    return (
      <View className="TypesPage">
        <View>
          <AtNavBar
            onClickRgIconSt={() => this.setState({addNewOpen: true})}
            color='#000'
            rightFirstIconType='add-circle'
          />
        </View>
        <AtModal
          isOpened={isOpen}
        >
          <AtModalHeader>重命名</AtModalHeader>
          <AtModalContent>
            <AtInput
              name='event'
              title=''
              type='text'
              placeholder='单行文本'
              value={newName || selected}
              onChange={this.handleChange}
            />
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.handleCancel}>取消</Button>
            <Button onClick={this.handleRename}>确定</Button>
           </AtModalAction>
        </AtModal>
        <AtModal
          isOpened={addNewOpen}
        >
          <AtModalHeader>新添加（最多5个）</AtModalHeader>
          <AtModalContent>
            <AtInput
              name='event'
              title=''
              type='text'
              placeholder='事件名字'
              value={newName}
              onChange={this.handleChange}
            />
          </AtModalContent>
          <AtModalAction>
            <Button onClick={this.handleCancel}>取消</Button>
            <Button onClick={this.handleAddNew}>添加</Button>
           </AtModalAction>
        </AtModal>
        <Text>所有事件类型(左滑操作)</Text>
        <AtList>
          {this.state.list.map(item => this.renderItem(item))}
        </AtList>
      </View>
    )
  }
}
export default TypesPage;
