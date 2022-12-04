import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";

const LeftNav = () => {
  const [deleteButtons, setDeleteButtons] = useState(false);
  const lats = [];
  const [currentLat, setCurrentLat] = useState("");
  const [currentLon, setCurrentLon] = useState("");
  const [currentLocationData, setCurrentLocationData] = useState([]);

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

  const getRecommendedLatandLon = () => {
    genericLocations.map(async (location) => {
      let response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=bad7396c2c27abfb92fe787b53ac8263`
      );
      let data = await response.json();
      lats.push(data[0]);
      console.log(lats);
    });
  };

  const fetchRecommendedData = () => {
    lats.map(async (lat) => {
      let response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat.lat}&lon=${lat.lon}&appid=bad7396c2c27abfb92fe787b53ac8263&units=metric`
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

  const recState = useSelector(
    (state) => state.genericLocations.recommendedLocationsData
  );

  useEffect(() => {
    console.log(recState);
  }, [recState]);

  const fetchLatAndLon = async (location) => {
    let response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=bad7396c2c27abfb92fe787b53ac8263`
    );
    try {
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        fetchData(data[0].lat, data[0].lon);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async (lat, lon) => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bad7396c2c27abfb92fe787b53ac8263&units=metric`
    );
    try {
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        dispatch({
          type: "SET_SELECTED_LOCATION",
          payload: data,
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
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bad7396c2c27abfb92fe787b53ac8263&units=metric`
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
      <h1>Left Nav</h1>
      <div
        className="currentLocation"
        onClick={() => fetchCurLocData(currentLat, currentLon)}
      >
        Current Location
      </div>
      {currentLocationData.length === 0 ? (
        <div>Please click to locate</div>
      ) : (
        <div
          className="currentLocationData"
          onClick={() => fetchLatAndLon(currentLocationData.name)}
        >
          {currentLocationData.name}
          {currentLocationData.main.temp}°C
        </div>
      )}

      {favouriteLocations.length === 0 ? (
        <div>Add sth to favourites</div>
      ) : (
        <>
          <div>Favourite Locations</div>
          <ul className="locationsUL">
            {favouriteLocations.map((location, i) => (
              <li key={i}>
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
                {i + 1}.{location.name}
              </li>
            ))}
          </ul>
        </>
      )}

      <div>Recommended for you</div>
      <ul className="locationsUL">
        {recState.map((location, i) => (
          <li onClick={() => fetchLatAndLon(location.name)} key={location.id}>
            {" "}
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
            {i + 1}.{location.name}
            {location.main.temp}°C
          </li>
        ))}
      </ul>
      <div className="d-flex flex-column">
        {" "}
        <Button className="mt-2" onClick={() => showDelete()}>
          Manage Locations
        </Button>
        <Button className="mt-2" onClick={() => getRecommendedLatandLon()}>
          getRecommendedLatandLon
        </Button>
        <Button className="mt-2" onClick={() => fetchRecommendedData()}>
          fetchRecommendedData
        </Button>
      </div>
    </div>
  );
};

export default LeftNav;
