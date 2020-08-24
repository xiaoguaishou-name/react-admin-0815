//
import request from "@utils/request";

const BASE_URL = "/admin/edu/subject";

//
// const MOCK_URL = 'http://localhost:8888/admin/edu/subject'

// 获取一级课程分类
export function reqGetSubject(page,limit) {
  return request({
    //
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
  });
}

//获取二级课程分类
export function reqGetSecSubject(parentId) {
  return request({
    //
    url: `${BASE_URL}/get/${parentId}`,
    method: "GET",
  });
}

//新增课程分类
export function reqAddSubject(title, parentId) {
  return request({
    url: `${BASE_URL}/save`,
    method: 'POST',
    data: {
      title,
      parentId
    }
  })
}
//更新课程分类
export function reqUpdateSubject(id,title) {
  return request({
    url: `${BASE_URL}/update`,
    method: 'PUT',
    data: {
      id,
      title
    }
  })
}
//删除课程分类
export function reqDelSubject(id) {
  return request({
    url: `${BASE_URL}/remove/${id}`,
    method: 'DELETE',
  })
}

//获取所有课程分类数据
export function reqAllSubjectList(){
  return request({
    url:BASE_URL,
    method:'GET'
  })
}