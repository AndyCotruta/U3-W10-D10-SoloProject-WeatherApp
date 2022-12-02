const initialState = {
  genericLocations: {
    cityNames: ["Hamburg", "Bucharest", "London", "New York", "Amsterdam"],
    content: [],
    currentTemperatures: [],
    selectedLocation: undefined,
    favourites: [],
  },
};

const mainReducer = (state = initialState, action) => {
  if (
    action.type === "ADD_TO_FAVOURITES" &&
    state.genericLocations.favourites.includes(action.payload)
  )
    return state;

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

    case "SET_SELECTED_LOCATION":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          selectedLocation: action.payload,
        },
      };

    case "ADD_TO_FAVOURITES":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          favourites: [...state.genericLocations.favourites, action.payload],
        },
      };

    case "DELETE_FAVOURITE_LOCATION":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          favourites: state.genericLocations.favourites.filter(
            (location, i) => {
              return i !== action.payload;
            }
          ),
        },
      };

    default:
      return state;
  }
};

export default mainReducer;
