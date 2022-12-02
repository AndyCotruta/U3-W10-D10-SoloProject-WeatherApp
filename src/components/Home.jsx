import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const [input, setInput] = useState(" ");
  const [searchedLocations, setSearchedLocations] = useState([]);
  const dispatch = useDispatch();
  const selectedLocation = useSelector(
    (state) => state.genericLocations.selectedLocation
  );

  useEffect(() => {
    fetchLatAndLon(input);
  }, [input]);

  const fetchLatAndLon = async (inputValue) => {
    if (input !== "") {
      let response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=450012164dc0af029847cca85c8d17c1`
      );
      if (response.ok) {
        let data = await response.json();

        setSearchedLocations(data);
      }
    }
  };

  const fetchData = async (lon, lat) => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=450012164dc0af029847cca85c8d17c1&units=metric`
    );
    try {
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        dispatch({
          type: "SET_SELECTED_LOCATION",
          payload: data,
        });
        setSearchedLocations([]);
        setInput([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="d-flex flex-column">
      <h1>Weather App</h1>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <ul className="locationsUL">
        {searchedLocations.map((location, i) => (
          <li key={i} onClick={() => fetchData(location.lon, location.lat)}>
            {i + 1}.{location.name},{location.country},{location.state}
          </li>
        ))}
      </ul>
      {selectedLocation !== undefined && (
        <>
          <div className="weatherInfo">
            <div>
              Location: {selectedLocation.name},{" "}
              {selectedLocation.weather[0].description}
            </div>
            <div>Temperature: {selectedLocation.main.temp}°C</div>
            <div>Feels Like: {selectedLocation.main.feels_like}°C</div>
            <div>Max. Temperature: {selectedLocation.main.temp_max}°C</div>
            <div>Min. Temperature: {selectedLocation.main.temp_min}°C</div>
            <div>Humidity: {selectedLocation.main.humidity}</div>
            <div>Pressure: {selectedLocation.main.pressure}</div>
            <Button
              onClick={() =>
                dispatch({
                  type: "ADD_TO_FAVOURITES",
                  payload: selectedLocation,
                })
              }
            >
              Add to favourites
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
