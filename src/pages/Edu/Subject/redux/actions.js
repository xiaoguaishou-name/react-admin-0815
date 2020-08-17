import {
  reqGetSubject,
  reqGetSecSubject
} from '@api/edu/subject'
import {
  GET_SUBJECT_LIST,
  GET_SEC_SUBJECT_LIST
} from './constants'
const getSubjectListSync = (list) => ({
  type: GET_SUBJECT_LIST,
  data:list
})
//获取一级课程分类
export const getSubjectList = ( page, limit ) => {
  return (dispatch) => {
    return reqGetSubject(
      page,limit
    ).then((response) => {
      dispatch(getSubjectListSync(response))
      return response.total
    })
  }
}
//获取二级课程分类
const getSecSubjectListSync = (list) => ({
  type: GET_SEC_SUBJECT_LIST,
  data: list
})
export const getSecSubjectList = (parentId) => {
  return (dispatch) => {
    return reqGetSecSubject(
      parentId
    ).then((response) => {
      dispatch(getSecSubjectListSync(response))
      return response.total
    })
  }
}