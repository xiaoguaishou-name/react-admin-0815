import {GET_ALL_COURSE} from './constants'
const initCourseList = []
export default function courseList(preState=initCourseList,action){
  switch(action.type){
    case GET_ALL_COURSE:
      return action.data
    default:
      return preState
      
  }
}