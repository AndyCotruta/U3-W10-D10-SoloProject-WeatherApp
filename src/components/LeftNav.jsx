import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";

const LeftNav = () => {
  const [deleteButtons, setDeleteButtons] = useState(false);

  const genericLocations = useSelector(
    (state) => state.genericLocations.cityNames
  );

  const favouriteLocations = useSelector(
    (state) => state.genericLocations.favourites
  );

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(favouriteLocations);
  }, [favouriteLocations]);

  const showDelete = () => {
    deleteButtons ? setDeleteButtons(false) : setDeleteButtons(true);
    console.log("buttons rendered");
  };

  return (
    <div className="leftNav">
      <h1>Left Nav</h1>
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
        {genericLocations.map((location, i) => (
          <li key={location}>
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
            {i + 1}.{location}
          </li>
        ))}

        <Button onClick={() => showDelete()}>Manage Locations</Button>
      </ul>
    </div>
  );
};

export default LeftNav;
