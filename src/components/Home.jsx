import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const Home = () => {
  const [input, setInput] = useState(" ");
  const [searchedLocations, setSearchedLocations] = useState([]);

  useEffect(() => {
    fetchData();
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

  const fetchData = async () => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=450012164dc0af029847cca85c8d17c1&units=metric`
    );
    try {
      if (response.ok) {
        let data = await response.json();
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
          <li key={i}>
            {i + 1}.{location.name},{location.country},{location.state}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
