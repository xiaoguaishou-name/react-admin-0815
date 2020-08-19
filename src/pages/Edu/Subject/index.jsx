import React, { Component } from "react";
import { Button, Table, Tooltip, Input, message, Modal } from "antd";
import { PlusOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import {
  getSubjectList,
  getSecSubjectList,
  updateSubjectList,
  delSubjectList,
} from "./redux";
import "./index.less";
import { reqUpdateSubject } from "@api/edu/subject";

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
  updateSubjectList,
  delSubjectList,
})
class Subject extends Component {
  page = 1
  state = {
    sbujectid: "",
    title: "",
  };
  //页面创建好后请求数据
  componentDidMount() {
    this.props.getSubjectList(1, 5);
  }
  //页码发生变化时触发的回调函数
  handleChange = (page, pageSize) => {
    // console.log(111);
    this.page = page
    this.props.getSubjectList(page, pageSize);
  };
  //一页展示的数据条数发生变化时触发的回调函数
  handleShowSizeChange = (page, pageSize) => {
    // console.log(222);
    this.props.getSubjectList(page, pageSize);
  };
  handleExpand = (expanded, record) => {
    if (expanded) {
      this.props.getSecSubjectList(record._id);
    }
  };
  //点击跳转到新增课程分类组件
  handleAdd = () => {
    this.props.history.push("/edu/subject/add");
  };
  //更新按钮的触发事件
  handleUpdate = ({ _id, title }) => () => {
    //console.log(_id)
    this.setState({
      subjectid: _id,
      title: title,
    });
    //记录旧的标题名称
    this.title = title;
  };
  //更改课程分类标题受控组件的事件处理回调
  handleUpdateChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };
  //点击取消按钮
  handleCancle = () => {
    this.setState({
      subjectid: "",
      title: "",
    });
  };
  //点击确认按钮
  handleConfirm = async () => {
    //如果输入框是空的，就不更新
    if (!this.state.title.trim()) {
      message.warn("课程名称不能为空");
      return;
    }
    console.log(this.title);
    //判断新的标题是否与旧的一致.如果是就没必要再发请求
    if (this.state.title === this.title) {
      // message.warn('编辑更改的内容不能与之前重复')
      return;
    }
    let id = this.state.subjectid;
    let title = this.state.title;
    // await reqUpdateSubject(id, title);
    await this.props.updateSubjectList(id, title);
    message.success("数据更新成功");
    this.setState({
      subjectid: "",
      title: "",
    });
    // 重新请求一级菜单数据;
    // this.props.getSubjectList(1, 5);
    // if (this.state.title === this.title) {
    //   let id = this.state.subjectid;
    //   let title = this.state.title;
    //   await reqUpdateSubject(id, title);
    //   message.success("数据更新成功");
    //   this.setState({
    //     subjectid: "",
    //     title: "",
    //   });
    // } else {
    //   let id = this.state.subjectid;
    //   let title = this.state.title;
    //   await reqUpdateSubject(id, title);
    //   message.success("数据更新成功");
    //   this.setState({
    //     subjectid: "",
    //     title: "",
    //   });
    //   //重新请求一级菜单数据
    //   this.props.getSubjectList(1, 5);
    // }
  };
  //删除课程分类的事件回调
  handleDel = (record) =>() => {
    Modal.confirm({
      title: (
        <>
          你确定要删除 <span style={{color:'pink',margin:'0 10px'}}>{record.title}</span>吗？
        </>
      ),
      onOk: async () => {
        await this.props.delSubjectList(record._id);
        message.success("数据删除成功");
        //如果当前删除的是一级才请求一级课程分类
        if (record.parentId === "0") {
          //判断：如果当前页不是第一页，那么本页数据删除后就请求上一页的数据
          if (
            this.page > 1 &&
            this.props.subjectList.items.length <= 0 &&
            record.parentId === "0"
          ){
            this.props.getSubjectList(--this.page, 5);
            return;
          }
          this.props.getSubjectList(this.page, 5);
        } 
      },
    }); 
  };
  render() {
    const columns = [
      /**
       * title: 表示这一列的标题
       * dataIndex: 表示这一列中要展示data数据的中哪一项值
       * key: 唯一id
       */
      {
        title: "分类名称",
        // dataIndex: "title",
        key: "name",
        render: (record) => {
          if (this.state.subjectid === record._id) {
            return (
              <Input
                style={{ width: 200 }}
                value={this.state.title}
                onChange={this.handleUpdateChange}
              ></Input>
            );
          }
          return record.title;
        },
      },
      {
        title: "操作",
        // 注意: 如果这一列不展示data中的数据,那么就可以不写dataIndex,或者是值为空的字符串
        // dataIndex: "",
        key: "x",
        render: (record) => {
          if (this.state.subjectid === record._id) {
            return (
              <>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={this.handleConfirm}
                >
                  确认
                </Button>
                <Button type="danger" onClick={this.handleCancle}>
                  取消
                </Button>
              </>
            );
          } else {
            return (
              <>
                <Tooltip
                  placement="topLeft"
                  title="更新课程"
                  arrowPointAtCenter
                >
                  <Button
                    type="primary"
                    icon={<FormOutlined />}
                    style={{ marginRight: 20, width: 40 }}
                    onClick={this.handleUpdate(record)}
                  ></Button>
                </Tooltip>
                <Tooltip
                  placement="topLeft"
                  title="删除课程"
                  arrowPointAtCenter
                >
                  <Button
                    icon={<DeleteOutlined />}
                    type="danger"
                    style={{ width: 40 }}
                    onClick={this.handleDel(record)}
                  ></Button>
                </Tooltip>
              </>
            );
          }
        },
        width: 200,
      },
    ];
    return (
      <div className="subject">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="subject-btn"
          onClick={this.handleAdd}
        >
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
export default Subject;
