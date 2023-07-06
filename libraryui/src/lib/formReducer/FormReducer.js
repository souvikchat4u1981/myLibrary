const formReducer = (state, action) => {
  switch (action.type) {
    case "HANDLE INPUT TEXT":
      return {
        ...state,
        [action.field]: action.payload,
      };
    case "SET INITIAL VALUE":
      return action.payload;
    default:
      return state;
  }
};

export default formReducer;
