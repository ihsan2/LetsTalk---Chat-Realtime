const initialState = {
  friends: [],
  tes: 'das',
};

const friends = (state = initialState, action) => {
  switch (action.type) {
    case 'FRIENDS':
      return {
        ...state,
        friends: [...state.friends, action.payload],
      };

    default:
      return state;
  }
};

export default friends;
