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
        `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=bad7396c2c27abfb92fe787b53ac8263`
      );
      if (response.ok) {
        let data = await response.json();

        setSearchedLocations(data);
      }
    }
  };

  const fetchData = async (lon, lat) => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bad7396c2c27abfb92fe787b53ac8263&units=metric`
    );
    let secondResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=bad7396c2c27abfb92fe787b53ac8263&units=metric`
    );
    try {
      if (response.ok) {
        let data = await response.json();
        let secondData = await secondResponse.json();
        console.log(data);
        console.log(secondData);
        dispatch({
          type: "SET_SELECTED_LOCATION",
          payload: data,
        });
        dispatch({
          type: "SET_SELECTED_LOCATION_FORECAST",
          payload: secondData,
        });
        setSearchedLocations([]);
        setInput([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectedLocationForecast = useSelector(
    (state) => state.genericLocations.selectedLocationForecast
  );

  return (
    <div className="home d-flex flex-column text-white ">
      <input
        className="inputField"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <ul className="locationsUL searchResults">
        {searchedLocations.map((location, i) => (
          <li key={i} onClick={() => fetchData(location.lon, location.lat)}>
            {i + 1}.{location.name},{location.country},{location.state}
          </li>
        ))}
      </ul>
      {selectedLocation !== undefined && (
        <div
          className={`weather-background ${selectedLocation.weather[0].main}`}
        >
          <div className="weatherInfo">
            <div>
              Location: {selectedLocation.name},{" "}
              {selectedLocation.weather[0].description}
            </div>
            <img
              src={`http://openweathermap.org/img/wn/${selectedLocation.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
            <div>Temperature: {selectedLocation.main.temp}°C</div>
            <div>Feels Like: {selectedLocation.main.feels_like}°C</div>
            <div>Max. Temperature: {selectedLocation.main.temp_max}°C</div>
            <div>Min. Temperature: {selectedLocation.main.temp_min}°C</div>
            <div>Humidity: {selectedLocation.main.humidity}</div>
            <div>Pressure: {selectedLocation.main.pressure}</div>
            <div className=""></div>
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
            {selectedLocationForecast !== undefined &&
              selectedLocationForecast.list
                .slice(0, 5)
                .map((loc) => <div>Temp: {loc.main.temp}</div>)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
