const initialState = {
  genericLocations: {
    cityNames: ["Hamburg", "Bucharest", "London", "New York", "Amsterdam"],
    content: [],
    currentTemperatures: [],
  },
  selectedCity: {
    content: [],
  },
};

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RENDER_GENERIC_LOCATIONS":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          content: [...state.genericLocations.content, action.payload],
        },
      };

    case "DELETE_GENERIC_LOCATION":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          cityNames: state.genericLocations.cityNames.filter((location, i) => {
            return i !== action.payload;
          }),
        },
      };

    default:
      return state;
  }
};

export default mainReducer;
