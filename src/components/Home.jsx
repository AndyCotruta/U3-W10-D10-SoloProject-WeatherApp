import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseISO, format } from "date-fns";
import { AiOutlineMenu } from "react-icons/ai";

const Home = ({ showMobileNav, setShowMobileNav }) => {
  const [input, setInput] = useState(" ");
  const [searchedLocations, setSearchedLocations] = useState([]);
  const dispatch = useDispatch();
  const selectedLocation = useSelector(
    (state) => state.genericLocations.selectedLocation
  );

  useEffect(() => {
    fetchLatAndLon(input);
    setSearchedLocations([]);
  }, [input]);

  const fetchLatAndLon = async (inputValue) => {
    if (input !== "") {
      let response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=5&appid=278512eae969bda7b3bc376fb984ec0b`
      );
      if (response.ok) {
        let data = await response.json();

        setSearchedLocations(data);
      }
    }
  };

  const fetchData = async (lon, lat) => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=278512eae969bda7b3bc376fb984ec0b&units=metric`
    );
    let secondResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=278512eae969bda7b3bc376fb984ec0b&units=metric`
    );
    let thirdResponse = await fetch(
      `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=278512eae969bda7b3bc376fb984ec0b`
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

  const selectedLocationAir = useSelector(
    (state) => state.genericLocations.selectedLocationAir
  );

  return (
    <div className="home d-flex flex-column text-white ">
      <div
        className={showMobileNav ? "mobile-menu-moved" : "mobile-menu"}
        onClick={() => {
          setShowMobileNav(!showMobileNav);
        }}
      >
        <AiOutlineMenu />
      </div>

      <input
        className="inputField"
        placeholder="Search"
        type="text"
        onChange={(e) => setInput(e.target.value)}
      />
      {searchedLocations.length !== 0 && (
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
      )}

      {selectedLocation === undefined && (
        <div className="welcomeText">
          <div className="wContent">
            {" "}
            <h1>Welcome</h1>
            <div>Please select or search for a location</div>
          </div>
        </div>
      )}

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
                  {Math.round(selectedLocation.main.temp)}°
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
            <div className="d-flex forecastWeather mt-5">
              {selectedLocationForecast !== undefined &&
                selectedLocationForecast.list.slice(0, 9).map((loc, i) => (
                  <div
                    className="d-flex flex-column align-items-center"
                    key={i}
                  >
                    <div className="text-center">
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
            <div className="d-flex justify-content-between fivedayForecast mt-5">
              {selectedLocationForecast !== undefined &&
                [
                  selectedLocationForecast.list[0],
                  selectedLocationForecast.list[7],
                  selectedLocationForecast.list[15],
                  selectedLocationForecast.list[23],
                  selectedLocationForecast.list[31],
                ].map((loc, i) => (
                  <div
                    className="d-flex flex-column align-items-center"
                    key={i}
                  >
                    <div className="text-center">
                      {format(parseISO(loc.dt_txt), "do MMMM")}
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
            <div className="location-values my-5">
              {selectedLocationAir !== undefined && (
                <div className="airQuality">
                  <div className="AQ">Air Quality</div>

                  <div className="airQualityLi">
                    Humidity{" "}
                    <span className="airValues">
                      {selectedLocation.main.humidity}
                    </span>
                  </div>
                  <div className="airQualityLi">
                    Pressure{" "}
                    <span className="airValues">
                      {selectedLocation.main.pressure}
                    </span>
                  </div>
                  <div className="airQualityLi">
                    AQI{" "}
                    <span className="airValues">
                      {selectedLocationAir.list[0].main.aqi}
                    </span>
                  </div>
                  <div className="airQualityLi">
                    Co{" "}
                    <span className="airValues">
                      {selectedLocationAir.list[0].components.co}
                    </span>
                  </div>
                  <div className="airQualityLi">
                    Pm 2.5{" "}
                    <span className="airValues">
                      {selectedLocationAir.list[0].components.pm2_5}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
