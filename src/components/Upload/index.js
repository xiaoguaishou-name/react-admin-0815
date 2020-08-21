import React, { Component } from "react";
import {
  Button,
  Upload,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {reqGetUpdateToken} from '@api/edu/lesson'
import * as qiniu from 'qiniu-js'
import {nanoid} from 'nanoid'
export default class MyUpload extends Component {
  constructor(){
    super()
    //从本地缓存中获取token
    const jsonStr = localStorage.getItem('uploadToken')
    if(jsonStr){
      this.tokenObj = JSON.parse(jsonStr)
      return
    }
    this.tokenObj = {}
  }
  beforeUpload = (file,fileList) =>{
    // console.log(file)
    //最大视频不能超过20M
    const MAX_SIZE = 20*1024*1024
    return new Promise(async(res,rej)=>{
      if(file.size > MAX_SIZE){
        rej()
      }
      //给本地发请求（获取token）
      if(this.tokenObj.expires && this.tokenObj.expires > Date.now()){
        res()
        return
      }
      const result = await reqGetUpdateToken()
      console.log(Date.now())
      result.expires = Date.now() + result.expires * 1000 - 2*60*1000  //后面这个是我们发请求到获取的时间，需要减去（模拟大概的）
      this.tokenObj = result
      const jsonStr = JSON.stringify(result)
      localStorage.setItem('uploadToken',jsonStr)
      return res()
    })
  }

  handleCustomRequest = ({file,onProgress ,onError,onSuccess})=>{
    // console.log(options,x)
    const observer = {
      next(res){
        onProgress({percent:res.total.percent})
      },
      error(err){
        onError(err)
      },
      complete:(res)=>{
        onSuccess(res)
        //在这里调用form.item传过来的onchange事件就可以解决表单验证不通过的bug
        this.props.onChange('http://qfekzkjt3.hn-bkt.clouddn.com/' + res.key)
      }
    }

    // const file = options.file
    const key = nanoid(10)
    const token = this.tokenObj.uploadToken
    const config = {
      useCdnDomain: true,
      region: qiniu.region.z2
    };
    const putExtra = {
      mimeType: "video/*",
    };
    const observable = qiniu.upload(file, key, token, putExtra, config)
    this.subscription = observable.subscribe(observer) // 上传开始
  }
  componentWillUnmount(){
    //前面代码this.subscription解决什么都不上传直接返回控制台报的bug（unsubscribe is not defined）
    this.subscription && this.subscription.unsubscribe()  //上传取消
  }
  //解决删除视频后还能通过表单验证的bug
  onRemove = () =>{
    this.props.onChange('')
  }
  render() {
    return (
      <Upload 
      beforeUpload={this.beforeUpload} 
      customRequest={this.handleCustomRequest}
      onRemove={this.onRemove}>
        <Button>
          <UploadOutlined /> 上传视频
        </Button>
      </Upload>
    );
  }
}
