import {
  GET_SUBJECT_LIST,
  GET_SEC_SUBJECT_LIST
} from './constants'
const initSubjectList = {
  total: 0,
  items:[]
}
export default function subjectList(prevState = initSubjectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST:
      action.data.items.forEach(item => {
        item.children = []
      })
      return action.data
    case GET_SEC_SUBJECT_LIST:
      const SecItems = action.data.items
      const FisItems = prevState.items
      SecItems.length && FisItems.forEach(item => {
        if (item._id === SecItems[0].parentId) {
          item.children = SecItems
        }
      })
      return {
        ...prevState,
        items:FisItems
      }
    default:
      return prevState
  }
}