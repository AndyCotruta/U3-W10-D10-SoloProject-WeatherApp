import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { GrLocation } from "react-icons/gr";

const LeftNav = () => {
  const [deleteButtons, setDeleteButtons] = useState(false);
  const [lats, setLats] = useState([]);
  const [currentLat, setCurrentLat] = useState("");
  const [currentLon, setCurrentLon] = useState("");
  const [currentLocationData, setCurrentLocationData] = useState([]);
  const [clickedIndex, setClickedIndex] = useState("");
  const [finLatLon, setFinLatLon] = useState(false);

  const curLocData = useSelector((state) => state.genericLocations.curLocData);

  const genericLocations = useSelector(
    (state) => state.genericLocations.cityNames
  );

  const favouriteLocations = useSelector(
    (state) => state.genericLocations.favourites
  );

  const dispatch = useDispatch();

  const showDelete = () => {
    deleteButtons ? setDeleteButtons(false) : setDeleteButtons(true);
    console.log("buttons rendered");
  };

  const getRecommendedLatandLon = async (gen) => {
    let arrayOfPromises = gen.map(async (location) => {
      let response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=278512eae969bda7b3bc376fb984ec0b`
      );
      let data = await response.json();
      return data[0];
    });
    let results = await Promise.all(arrayOfPromises);
    console.log("RESULTS", results);
    setLats(results);
    setFinLatLon(true);
  };

  useEffect(() => {
    getRecommendedLatandLon(genericLocations);
  }, [genericLocations]);

  const fetchRecommendedData = (lats) => {
    lats.map(async (lat) => {
      let response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat.lat}&lon=${lat.lon}&appid=278512eae969bda7b3bc376fb984ec0b&units=metric`
      );
      try {
        if (response.ok) {
          let data = await response.json();
          dispatch({
            type: "ADD_REC_LOC_DATA",
            payload: data,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    fetchRecommendedData(lats);
  }, [finLatLon]);

  const recState = useSelector(
    (state) => state.genericLocations.recommendedLocationsData
  );

  useEffect(() => {
    console.log(recState);
  }, [recState]);

  const fetchLatAndLon = async (location, i) => {
    let response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=278512eae969bda7b3bc376fb984ec0b`
    );

    try {
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        fetchData(data[0].lat, data[0].lon);
        setClickedIndex(i);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async (lat, lon) => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=278512eae969bda7b3bc376fb984ec0b&units=metric`
    );
    let secondResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=278512eae969bda7b3bc376fb984ec0b&units=metric`
    );
    let thirdResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=278512eae969bda7b3bc376fb984ec0b`
    );
    try {
      if (response.ok) {
        let data = await response.json();
        let secondData = await secondResponse.json();
        let thirdData = await thirdResponse.json();
        console.log(data);
        console.log(secondData);
        console.log(thirdData);
        dispatch({
          type: "SET_SELECTED_LOCATION",
          payload: data,
        });
        dispatch({
          type: "SET_SELECTED_LOCATION_FORECAST",
          payload: secondData,
        });
        dispatch({
          type: "SET_SELECTED_LOCATION_AIR",
          payload: thirdData,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      console.log("Available");
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentLat(position.coords.latitude);
        console.log(position.coords.latitude);
        setCurrentLon(position.coords.longitude);
        console.log(position.coords.longitude);
      });
    } else {
      console.log("Not Available");
    }
  }, []);

  const fetchCurLocData = async (lat, lon) => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=278512eae969bda7b3bc376fb984ec0b&units=metric`
    );
    try {
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        dispatch({
          type: "ADD_CUR_LOC_DATA",
          payload: data,
        });
        setCurrentLocationData(data);
        console.log(curLocData);
        console.log(currentLocationData);
        setClickedIndex(curLocData.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(currentLocationData);
  }, [currentLocationData]);

  return (
    <div className="leftNav">
      <div className="currentLocation">Current Location</div>
      {currentLocationData.length === 0 ? (
        <div
          className="leftLi leftLiClicked"
          onClick={() => fetchCurLocData(currentLat, currentLon)}
        >
          <div className="d-flex align-items-center">
            {" "}
            <GrLocation />
            Please click to locate
          </div>
        </div>
      ) : (
        <div
          className={
            clickedIndex === setCurrentLocationData.id
              ? "leftLi leftLiClicked"
              : "leftLi"
          }
          onClick={() => fetchData(currentLat, currentLon)}
        >
          <div className="leftNavLocations">{currentLocationData.name}</div>
          {
            <img
              className="leftNavIcon"
              src={`https://openweathermap.org/img/wn/${currentLocationData.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
          }
          <div className="leftTempValue d-flex align-items-center">
            {Math.round(currentLocationData.main.temp)}°C
          </div>
        </div>
      )}

      {favouriteLocations.length === 0 ? (
        <>
          <div className="addFav">Add your favourite locations</div>
          <div className="leftLi">Currently empty</div>
        </>
      ) : (
        <>
          <div className="addFav">Favourite Locations</div>
          <ul className="locationsUL">
            {favouriteLocations.map((location, i) => (
              <li
                className={
                  clickedIndex === location.id
                    ? "leftLi leftLiClicked"
                    : "leftLi"
                }
                onClick={() => fetchLatAndLon(location.name, location.id)}
                key={i}
              >
                <div className="leftNavLocations">{location.name}</div>

                {
                  <img
                    className="leftNavIcon"
                    src={`https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />
                }
                <div className="leftTempValue d-flex align-items-center">
                  {Math.round(location.main.temp)}°C
                  {deleteButtons && (
                    <FaTrashAlt
                      onClick={() => {
                        console.log("delete");
                        dispatch({
                          type: "DELETE_FAVOURITE_LOCATION",
                          payload: i,
                        });
                      }}
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="addFav">Recommended for you</div>
      <ul className="locationsUL">
        {recState.map((location, i) => (
          <li
            className={
              clickedIndex === location.id ? "leftLi leftLiClicked" : "leftLi"
            }
            onClick={() => fetchLatAndLon(location.name, location.id)}
            key={location.id}
          >
            {" "}
            <div className="leftNavLocations">{location.name}</div>
            {
              <img
                className="leftNavIcon"
                src={`https://openweathermap.org/img/wn/${location.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            }
            <div className="d-flex align-items-center">
              <div className="leftTempValue d-flex align-items-center">
                {" "}
                {Math.round(location.main.temp)}°C
                {deleteButtons && (
                  <FaTrashAlt
                    onClick={() => {
                      console.log("delete");
                      dispatch({
                        type: "DELETE_GENERIC_LOCATION",
                        payload: i,
                      });
                    }}
                  />
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="d-flex flex-column">
        {" "}
        <Button className="mt-2" onClick={() => showDelete()}>
          Manage Locations
        </Button>
      </div>
    </div>
  );
};

export default LeftNav;
