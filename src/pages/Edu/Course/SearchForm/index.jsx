import React, { useState,useEffect } from "react";
import { Form, Input, Select, Cascader, Button } from "antd";
import {reqAllSubjectList,reqGetSecSubject} from '@api/edu/subject'
import {reqGetAllTeacherList} from '@api/edu/teacher'
//国际化的组件和hooks
import { FormattedMessage, useIntl } from 'react-intl'
import {getAllCourse} from '../redux/actions'
import {connect} from 'react-redux'
import "./index.less";

const { Option } = Select;

function SearchForm(props) {
  const [form] = Form.useForm();
  //获得一个国际化对象
  const intl = useIntl()
  const [subject,setSubjects] = useState([])
  const [teachers,setTeachers] = useState([])
  const [options,setOptions] = useState([])
  //模拟挂载的生命周期钩子函数
  useEffect(() => {
     async function fetchData(){
      //执行完第一次请求才会执行第二次，效率慢
      // await reqAllSubjectList()
      // await reqGetAllTeacherList()
      const [subject,teacher] =await(Promise.all([reqAllSubjectList(),reqGetAllTeacherList()])) 
      setSubjects(subject)
      setTeachers(teacher)
      const optionList = subject.map(item=>{
        return {
          value:item._id,
          label:item.title,       
          isLeaf:false  //有没有子节点，false代表有
        }
      })
      setOptions(optionList)
    }
    fetchData()
  }, [])
  // const [options, setOptions] = useState([
  //   {
  //     value: "zhejiang",
  //     label: "Zhejiang",
  //     isLeaf: false
  //   },
  //   {
  //     value: "jiangsu",
  //     label: "Jiangsu",
  //     isLeaf: false
  //   }
  // ]);

 
  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  const loadData = async selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    //发送异步请求获取数据
    const res = await reqGetSecSubject(targetOption.value)
    targetOption.loading = false //请求完后隐藏加载效果
    console.log(res)
    //判断：有数据就添加，没有就把isLeaf的值改为true
    if(res.items.length){
      targetOption.children = res.items.map(item=>{
        return{
          value:item._id,
          label:item.title,
          //不写isLeaf默认值就是true
        }
      })
    }else{
      targetOption.isLeaf = true
    }
    //修改options，让视图重新渲染
    setOptions([...options])
  };

  const resetForm = () => {
    form.resetFields();
  };
  //查询课程列表的回调
  const onFinish = () =>{
    props.getAllCourse()
  }
  return (
    <Form layout="inline" form={form} onFinish={onFinish}>
      <Form.Item name="title" label={<FormattedMessage id='title'></FormattedMessage>}>
        <Input placeholder={intl.formatMessage({
          id:'title'
        })} style={{ width: 250, marginRight: 20 }} />
      </Form.Item>
      <Form.Item name="teacherId" label={<FormattedMessage id="teacher"></FormattedMessage>}>
        <Select
          allowClear
          placeholder={intl.formatMessage({
            id:'teacher'
          })}
          style={{ width: 250, marginRight: 20 }}
        >
          {/* <Option value="lucy1">Lucy1</Option>
          <Option value="lucy2">Lucy2</Option>
          <Option value="lucy3">Lucy3</Option> */}
          {teachers.map(item => {
            return (<Option value={item._id} key={item._id}>{item.name}</Option>)
          })}
        </Select>
      </Form.Item>
      <Form.Item name="subject" label={<FormattedMessage id="subject"></FormattedMessage>}>
        <Cascader
          style={{ width: 250, marginRight: 20 }}
          options={options}
          loadData={loadData}
          onChange={onChange}
          changeOnSelect
          placeholder={intl.formatMessage({
            id:'subject'
          })}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          <FormattedMessage id="searchBtn"></FormattedMessage>
        </Button>
        <Button onClick={resetForm}><FormattedMessage id="resetBtn"></FormattedMessage></Button>
      </Form.Item>
    </Form>
  );
}

export default connect(null,{getAllCourse})(SearchForm)
