import React, { Component,useState, } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Tabs, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  MailOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { login ,mobileLogin} from "@redux/actions/login";
import {reqGetVerifyCode} from '@api/acl/oauth'
import "./index.less";

const { TabPane } = Tabs;
//antd中表单校验的第二种方式
//rule就是校验规则对象，value就是表单项中的值
//要求返回一个Promise，返回成功的Promise就校验通过，反之则不通过
const validator = (rule,value) =>{
  console.log(rule,value)
  return new Promise((resolve,reject)=>{
    value = value && value.trim()
    if(!value){
      return reject('请输入您的密码')
    }
    if(value.length < 4){
      return reject('密码长度不能小于4位')
    }
    if(value.length > 16){
      return reject('密码长度不能大于16位')
    }
    if(!/^[0-9A-Za-z_]+$/.test(value)){
      return reject('您输入的密码格式不对')
    }
    return resolve('请稍等，登陆验证中')
  })
}
// @withRouter
// @connect(null, {
//   login,
// })
//记录tab选中的是哪个
let tabFlag = 'user'
function LoginForm (props) {
  let [countDown,setCountDown] = useState(5)
  let [isShowBtn,setIsShowBtn] = useState(true)
  //form解构
  const [form] = Form.useForm()
  //点击按钮登录回调
  const onFinish = () => {
    //判断是用户密码登陆还是手机号登陆
    if(tabFlag === 'user'){
      form.validateFields(['username','password']).then(res=>{
        const { username, password } = res
        props.login(username, password).then((token) => {
        // 登录成功
        // console.log("登陆成功~");
        // 持久存储token
        localStorage.setItem("user_token", token);
        props.history.replace("/");
      })
    })
    }else{
      form.validateFields(['phone','verify']).then(res=>{
        const {phone,verify} = res
        props.mobileLogin(phone,verify).then(token=>{
          localStorage.setItem("user_token", token);
          props.history.replace("/");
        })
      })
    }
    // .catch(error => {
    //   notification.error({
    //     message: "登录失败",
    //     description: error
    //   });
    // });
  };
  //获取验证码的回调
  const getCode = () =>{
    form.validateFields(['phone']).then(async res=>{
      // console.log(res)
      await reqGetVerifyCode(res.phone)
      message.success('发送验证码成功')
      const timer = setInterval(() => {
        setCountDown(--countDown)
        setIsShowBtn(false)
        if(countDown <= 0){
          clearInterval(timer)
          setCountDown(5)
          setIsShowBtn(true)  
        }
      }, 1000);
    }).catch(err=>{

    })
  }
  const handleTabChange = (key) =>{
    tabFlag = key
  }
  //第三方登录
  const gitLogin = () =>{
    window.location.href = `https://github.com/login/oauth/authorize?client_id=1af32e21ad8460f0e181`
  }
    return (
      <>
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
          // onFinish={onFinish}
        >
          <Tabs
            defaultActiveKey="user"
            tabBarStyle={{ display: "flex", justifyContent: "center" }}
            onChange={handleTabChange}>
            <TabPane tab="账户密码登陆" key="user">
              <Form.Item name="username" rules={[
                {
                  required:true,
                  message:'请输入用户名'
                },{
                  max:16,
                  message:'字符长度不能超过16个字符'
                },{
                  min:4,
                  message:'字符长度不小于4个字符'
                },{
                  pattern:/^[0-9A-Za-z_]+$/,
                  message:'请输入正确的用户名'
                }
              ]}>
                <Input
                  prefix={<UserOutlined className="form-icon" />}
                  placeholder="用户名: admin"
                />
              </Form.Item>
              <Form.Item name="password" rules={[
                {validator}
              ]}>
                <Input
                  prefix={<LockOutlined className="form-icon" />}
                  type="password"
                  placeholder="密码: 111111"
                />
              </Form.Item>
            </TabPane>
            <TabPane tab="手机号登陆" key="phone">
              <Form.Item name="phone" rules={[
                {
                  required:true,
                  message:'请输入您的手机号码'
                },
                {
                  pattern:/^1[\d]{10}$/ ,
                  message:'请输入正确的手机号码'
                }
              ]}>
                <Input
                  prefix={<MobileOutlined className="form-icon" />}
                  placeholder="手机号"
                />
              </Form.Item>

              <Row justify="space-between">
                <Col span={16}>
                  <Form.Item name="verify" rules={[
                    {
                      required:true,
                      message:'请输入验证码'
                    },
                    {
                      pattern:/^\d{6}$/,
                      message:'您的验证码不正确'
                    }
                  ]}>
                    <Input
                      prefix={<MailOutlined className="form-icon" />}
                      placeholder="验证码"
                    />
                  </Form.Item>
                </Col>
                <Col span={7}>
                  <Button className="verify-btn" onClick={getCode} disabled={isShowBtn ? false : true}>
            {isShowBtn ?  '获取验证码':`${countDown}秒后发送`}
                  </Button>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
          <Row justify="space-between">
            <Col span={7}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>自动登陆</Checkbox>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Button type="link">忘记密码</Button>
            </Col>
          </Row>
          <Form.Item>
            <Button
              type="primary"
              // htmlType="submit"
              className="login-form-button"
              onClick={
                onFinish
              }
            >
              登陆
            </Button>
          </Form.Item>
          <Form.Item>
            <Row justify="space-between">
              <Col span={16}>
                <span>
                  其他登陆方式
                  <GithubOutlined className="login-icon" onClick={gitLogin}/>
                  <WechatOutlined className="login-icon" />
                  <QqOutlined className="login-icon" />
                </span>
              </Col>
              <Col span={3}>
                <Button type="link">注册</Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </>
    );
}

export default withRouter(connect(null,{login,mobileLogin})(LoginForm));
