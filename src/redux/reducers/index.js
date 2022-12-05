const initialState = {
  genericLocations: {
    curLocData: [],
    cityNames: ["Hamburg", "Seoul", "London", "New York", "Amsterdam"],
    cityLats: [],
    recommendedLocationsData: [],
    selectedLocation: undefined,
    selectedLocationForecast: undefined,
    selectedLocationAir: undefined,
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
    case "DELETE_GENERIC_LOCATION":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          recommendedLocationsData:
            state.genericLocations.recommendedLocationsData.filter(
              (location, i) => {
                return i !== action.payload;
              }
            ),
        },
      };

    case "ADD_CUR_LOC":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          curLoc: [...state.genericLocations.curLoc, action.payload],
        },
      };

    case "ADD_CUR_LOC_DATA":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          curLocData: [...state.genericLocations.curLocData, action.payload],
        },
      };

    case "ADD_LATS":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          cityLats: [...state.genericLocations.cityLats, action.payload],
        },
      };

    case "ADD_REC_LOC_DATA":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          recommendedLocationsData: [
            ...state.genericLocations.recommendedLocationsData,
            action.payload,
          ],
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
    case "SET_SELECTED_LOCATION_FORECAST":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          selectedLocationForecast: action.payload,
        },
      };

    case "SET_SELECTED_LOCATION_AIR":
      return {
        ...state,
        genericLocations: {
          ...state.genericLocations,
          selectedLocationAir: action.payload,
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
