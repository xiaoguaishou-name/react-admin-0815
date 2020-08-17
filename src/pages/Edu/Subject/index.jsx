import React, { Component } from "react";
import { Button, Table,Tooltip } from 'antd'
import { PlusOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { connect } from 'react-redux'
import { getSubjectList, getSecSubjectList } from "./redux";
import './index.less'

const columns = [
  /**
   * title: 表示这一列的标题
   * dataIndex: 表示这一列中要展示data数据的中哪一项值
   * key: 唯一id
   */
  { title: "分类名称", dataIndex: "title", key: "name" },
  {
    title: "操作",
    // 注意: 如果这一列不展示data中的数据,那么就可以不写dataIndex,或者是值为空的字符串
    // dataIndex: "",
    key: "x",
    render: () => (
      <>
        <Tooltip placement="topLeft" title="更新课程" arrowPointAtCenter>
          <Button
            type="primary"
            icon={<FormOutlined />}
            style={{ marginRight: 20, width: 40 }}
          ></Button>
        </Tooltip>
        <Tooltip placement="topLeft" title="删除课程" arrowPointAtCenter>
          <Button
            icon={<DeleteOutlined />}
            type="danger"
            style={{ width: 40 }}
          ></Button>
        </Tooltip>
      </>
    ),
    width: 200,
  },
];

const data = [
  {
    key: 1,
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    description:
      "My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.",
  },
  {
    key: 2,
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    description:
      "My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.",
  },
  {
    key: 3,
    name: "Rose",
    age: 29,
    address: "Jiangsu No. 1 Lake Park",
    description: "This not expandable",
  },
  {
    key: 4,
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    description:
      "My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.",
  },
];

@connect((state) => ({ subjectList: state.subjectList }), {
  getSubjectList,
  getSecSubjectList,
})
class Subject extends Component {
  //页面创建好后请求数据
  componentDidMount() {
    this.props.getSubjectList(1, 5);
  }
  //页码发生变化时触发的回调函数
  handleChange = (page, pageSize) => {
    console.log(111);
    this.props.getSubjectList(page, pageSize);
  };
  //一页展示的数据条数发生变化时触发的回调函数
  handleShowSizeChange = (page, pageSize) => {
    console.log(222);
    this.props.getSubjectList(1, pageSize);
  };
  handleExpand = (expanded, record) => {
    if (expanded) {
      this.props.getSecSubjectList(record._id);
    }
  };
  render() {
    return (
      <div className="subject">
        <Button type="primary" icon={<PlusOutlined />} className="subject-btn">
          新建
        </Button>
        <Table
          columns={columns}
          expandable={{
            // expandedRowRender: (record) => (
            //   <p style={{ margin: 0 }}>{record.description}</p>
            // ),
            // rowExpandable: (record) => record.name !== "Not Expandable",
            onExpand: this.handleExpand,
          }}
          dataSource={this.props.subjectList.items}
          rowKey="_id"
          pagination={{
            total: this.props.subjectList.total,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "15"],
            showQuickJumper: true,
            defaultPageSize: 5,
            onChange: this.handleChange,
            onShowSizeChange: this.handleShowSizeChange,
          }}
        />
      </div>
    );
  }
}
export default Subject
