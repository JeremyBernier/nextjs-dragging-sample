import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunkMiddleware from 'redux-thunk'

const INITIAL_STATE = {
  moduleMap: {/* moduleId: {moduleData} */},
  moduleList: [/* moduleId */],
  /*lessonMap: [],*/
  lessonsByModuleId: {/* moduleId: [lessonId]]*/},

  draggedItem: undefined, // id of dragged item
  draggedItemModuleId: undefined, // module Id of dragged item
}

export const actionTypes = {
  RECEIVE_MODULE_DATA: 'RECEIVE_MODULE_DATA',
  TOGGLE_MODULE_ACTIVE: 'TOGGLE_MODULE_ACTIVE',
  FETCH_FAILED: 'FETCH_FAILED',
  UPDATE_LESSONS_ORDER: 'UPDATE_LESSONS_ORDER',

  UPDATE_DRAGGED_ITEM: 'UPDATE_DRAGGED_ITEM'
}

// REDUCERS
export const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.RECEIVE_MODULE_DATA:
      return {
        ...state,
        moduleMap: action.moduleMap,
        moduleList: action.moduleList,
        lessonsByModuleId: action.lessonsByModuleId
      }

    case actionTypes.TOGGLE_MODULE_ACTIVE: {
      const { moduleMap } = state
      const { moduleId } = action
      return {
        ...state,
        moduleMap: {
          ...moduleMap,
          [moduleId]: {
            ...moduleMap[moduleId],
            isActive: !moduleMap[moduleId].isActive
          }
        }
      }
    }

    case actionTypes.UPDATE_LESSONS_ORDER: {
      const lesson1 = state.draggedItem
      if ((state.draggedItem == null) /* somehow this occasionally happens */
        || (lesson1 === action.lesson2)) {
        // abort
        return state
      }


      const lesson1ModuleId = state.draggedItemModuleId
      const lesson1ModulesAllLessons = state.lessonsByModuleId[lesson1ModuleId]
      const lesson1Data = lesson1ModulesAllLessons.find((lessonObj) => {
        return lessonObj.id === lesson1
      })  // not the most efficient

      let newLessonsArr = state.lessonsByModuleId[action.moduleId].slice(0)
      const lessonIds = newLessonsArr.map((lesson) => lesson.id)
      const lesson2Index = lessonIds.indexOf(action.lesson2)

      if (lesson1ModuleId === action.moduleId) {
        // we want to swap lesson1 and lesson2

        const lesson1Index = lessonIds.indexOf(lesson1)

        arraySwap(newLessonsArr, lesson1Index, lesson2Index)

        return {
          ...state,
          lessonsByModuleId: {
            ...state.lessonsByModuleId,
            [action.moduleId]: newLessonsArr,
          }
        }
      } else {
        // Dragging into new module, so we'll insert

/*        if (newLessonsArr.find((elem) => elem.id === lesson1)) {
          console.error('this should not happen')
          return state
        }
*/
        newLessonsArr.splice(lesson2Index, 0, lesson1Data)

        const newState = {
          ...state,
          lessonsByModuleId: {
            ...state.lessonsByModuleId,
            [lesson1ModuleId]: lesson1ModulesAllLessons.filter((lesson) => lesson.id !== lesson1),
            [action.moduleId]: newLessonsArr
          },
          draggedItemModuleId: action.moduleId
        }

        return newState
      }
    }

    case actionTypes.UPDATE_DRAGGED_ITEM: {
      return {
        ...state,
        draggedItem: action.itemId,
        draggedItemModuleId: action.moduleId,
      }
    }

    default:
      return state
  }
}

// ACTIONS
function receiveModuleData(json) {
  let moduleMap = {}
    , lessonsByModuleId = {}
    , lessonMap = {}

  json.modules.forEach((module) => {
    moduleMap[module.id] = {...module}
    const sortedLessons = module.lessons.slice(0)
      .sort((a, b) => a.order - b.order)
    lessonsByModuleId[module.id] = sortedLessons // doesn't have to be sorted
  })


  let sortedModules = json.modules.slice(0)
  sortedModules.sort((a, b) => a.order - b.order)
  const moduleList = sortedModules.map(module => module.id)

  return {
    type: actionTypes.RECEIVE_MODULE_DATA,
    moduleMap,
    moduleList,
    lessonsByModuleId,
    lessonMap
  }
}

function fetchFailed(err) {
  console.error('An error has occured', err)
  return {
    type: actionTypes.FETCH_FAILED
  }
}

export function fetchModuleData() {
  return function(dispatch) {
    dispatch({ type: 'FETCHING_MODULES' })

    return fetch('https://sifivelearn-production.s3-us-west-1.amazonaws.com/samples/fe-developer.json')
      .then((res) => res.json())
      .then((json) => dispatch(receiveModuleData(json)))
      .catch((err) => dispatch(fetchFailed))
  }
}

export function toggleModuleActive(moduleId) {
  return {
    type: actionTypes.TOGGLE_MODULE_ACTIVE,
    moduleId
  }
}

export function updateLessonsOrder(lesson2, moduleId) {
  return {
    type: actionTypes.UPDATE_LESSONS_ORDER,
    lesson2,
    moduleId
  }
}

export function updateDraggedItem(itemId, moduleId) {
  return {
    type: actionTypes.UPDATE_DRAGGED_ITEM,
    itemId,
    moduleId
  }
}

/*export async function fetchModuleData () {
  const res = await fetch('https://sifivelearn-production.s3-us-west-1.amazonaws.com/samples/fe-developer.json')
  const json = await res.json()
  return { type: actionTypes.RECEIVE_MODULE_DATA, modules: json.modules }
}*/

export function initializeStore (initialState = INITIAL_STATE) {
  return createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  )
}

function arraySwap (arr, a, b) {
  const temp = arr[a]
  arr[a] = arr[b]
  arr[b] = temp
}