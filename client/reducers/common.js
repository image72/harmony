import {
  GET_USER
} from 'actions/common';

const initialState = {
  user: []
}
export default function common(state = initialState, action = {}) {
  switch(action.type) {
    case GET_USER:
      const user = action.payload.data.Data;
      return {
        ...state,
        user
      }
      break;
    default:
      return state;
  }
}
