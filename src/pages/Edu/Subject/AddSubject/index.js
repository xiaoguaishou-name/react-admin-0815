import React, { Component } from 'react'
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Divider,
  message
} from 'antd'
import {
  ArrowLeftOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import {
  reqGetSubject,
  reqAddSubject
} from '@api/edu/subject'
//表单布局属性
const layout = {
  // antd把一个宽度分为24份
  // 表单文字描述部分
  labelCol: {
    span: 2
  },
  // 表单项部分
  wrapperCol: {
    span: 6
  }
}
// 获取Option组件
const Option = Select.Option

export default class index extends Component {
  page = 1 //存储要获取第几页
  state = {
    total: 0,
    items:[]
  }
  async componentDidMount() {
    const res = await reqGetSubject(this.page++, 10)
    this.setState({
      total: res.total,
      items:res.items
    })
  }
  //点击加载更多数据
   handleGetSubject = async () => {
    const res = await reqGetSubject(this.page++, 10)
    const newItems = [...this.state.items, ...res.items]
    this.setState({
      items:newItems
    })
  }
  //点击提交按钮触发事件
  onFinish = async(value) => {
    console.log(value)
    await reqAddSubject(value.subjectname, value.parentid)
    message.success('添加成功')
    this.props.history.push('/edu/subject/list')
  }
  render() {
    return (
      <Card title={<>
        <Link to='/edu/subject/add'>
          < ArrowLeftOutlined 
           > </ArrowLeftOutlined> 
        </Link>
        <span style={{marginLeft:10}}>新增课程</span>
      </>}>
        <Form
        {...layout}
        name='subject'
        onFinish={this.onFinish}
        // onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label='课程分类名称'
          name='subjectname'
          rules={[
            {
              required: true,
              message: '请输入课程分类!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label='父级分类id'
          name='parentid'
          rules={[
            {
              required: true,
              message: '请选择分类id'
            }
          ]}
        >
            <Select dropdownRender={(menu) => {
              return (
                <div>
                  {menu}
                  <Divider style={{margin:'4px 0'}}></Divider>
                  {this.state.total <= this.state.items.length?<div style={{marginLeft:10}}>没有更多数据了</div>:<Button type="link" onClick={this.handleGetSubject}>点击添加更多</Button>}
                </div>
              )
          }}>
              <Option  value={0} key={0}>
                {'一级菜单'}
              </Option>
              {this.state.items.map(item =><Option  value={item._id} key={item._id}>
                {item.title}
              </Option>)}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
      </Card>
    )
  }
}

