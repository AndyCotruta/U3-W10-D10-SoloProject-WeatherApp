import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseISO, format } from "date-fns";

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
        placeholder="Search"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <ul className="locationsUL searchResults">
        {searchedLocations.map((location, i) => (
          <li
            className="searchLi"
            key={i}
            onClick={() => fetchData(location.lon, location.lat)}
          >
            {location.name},{location.country},{location.state}
          </li>
        ))}
      </ul>
      {selectedLocation !== undefined && (
        <div
          className={`weather-background ${selectedLocation.weather[0].main}`}
        >
          <div className="weatherInfo">
            <div className="mainWeatherInfo">{selectedLocation.name}</div>
            <div className="d-flex align-items-center">
              <img
                src={`http://openweathermap.org/img/wn/${selectedLocation.weather[0].icon}@2x.png`}
                alt="weather icon"
              />{" "}
              <div className="d-flex flex-column">
                {" "}
                <div className="mainTemp">
                  {Math.round(selectedLocation.main.temp)}°C
                </div>
              </div>
            </div>
            <div>
              Feels Like:{" "}
              <span className="feelsLike">
                {Math.round(selectedLocation.main.feels_like)}°C
              </span>
            </div>
            <div className="weatherDescription">
              {selectedLocation.weather[0].description}
            </div>
            <div className="d-flex">
              {" "}
              <div className="px-2">
                H:{" "}
                <span className="HL">
                  {Math.round(selectedLocation.main.temp_max)}°C
                </span>
              </div>
              <div className="px-2">
                L:{" "}
                <span className="HL">
                  {Math.round(selectedLocation.main.temp_min)}°C
                </span>
              </div>
            </div>

            {/* <div>Humidity: {selectedLocation.main.humidity}</div>
            <div>Pressure: {selectedLocation.main.pressure}</div> */}
            <div className=""></div>
            <div
              className="addButton"
              onClick={() =>
                dispatch({
                  type: "ADD_TO_FAVOURITES",
                  payload: selectedLocation,
                })
              }
            >
              Add
            </div>
            <div className="d-flex">
              {selectedLocationForecast !== undefined &&
                selectedLocationForecast.list.slice(0, 9).map((loc, i) => (
                  <div
                    className="d-flex flex-column align-items-center"
                    key={i}
                  >
                    <div className="text-center mt-5">
                      {format(parseISO(loc.dt_txt), "HH:mm")}
                    </div>
                    <img
                      className="hourlyIcon"
                      src={`http://openweathermap.org/img/wn/${loc.weather[0].icon}@2x.png`}
                      alt="weather icon"
                    />
                    <div>
                      <span className="hourlyTemp">
                        {Math.round(loc.main.temp)}°C
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
