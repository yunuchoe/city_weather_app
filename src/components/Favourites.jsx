import React, { useEffect, useState } from "react";
import "./Favourites.css";

const Favourites = ({refreshToggle}) => {

    // inital declaration
    const [favorites, setFavorites] = useState([]);

    // fetch cities
    useEffect(() => {
        fetch("http://localhost:5000/")
            .then((res) => res.json())
            .then((data) => {
                setFavorites(data);
            })
        .catch((error) => { // error check
            console.error("Error:", error);
        });
    }, [refreshToggle]); // allows for refresh

    return (
        <div className = "favourite">
            <h2>Favourites</h2>
            {favorites.length === 0 ? (
                <p>No favorites cities...</p>
            ):(
                favorites.map((fav) => (
                <div key={fav.id} className = "favourite-cities">
                    <span className = "city">{fav.city}</span>{" "}
                    <span className = "temperature">{fav.temperature}°C</span>
                </div>
                ))
            )}
        </div>
    )
};

export default Favourites;