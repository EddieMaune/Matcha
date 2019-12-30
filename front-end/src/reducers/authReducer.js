import {
    SET_CURRENT_USER,
    USER_LOADING
  } from "../actions/types";
  // const isEmpty = require("is-empty");
  const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
  };

function isEmpty(payload) {
  let i = 0;

  for(let x in payload) {
    i++;
  }
  return i == 0;
}

  export default function(state = initialState, action) {
    console.log("PAYLOAD");
    console.log(action.payload);
    switch (action.type) {
      case SET_CURRENT_USER:
        return {
          ...state,
          isAuthenticated: !isEmpty(action.payload),
          user: action.payload
        };
      case USER_LOADING:
        return {
          ...state,
          loading: true
        };
      default:
        return state;
    }
  }