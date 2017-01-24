import axios from 'axios';

export const GET_USER = 'GET_USER';

export function getUser(params) {
  return {
    type: GET_USER,
    payload: {
      promise: axios.get('/api/users', {params})
    }
  }
}
