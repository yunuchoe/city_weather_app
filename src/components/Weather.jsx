import React, { useEffect, useRef, useState } from "react"
import "./Weather.css"
import Favourites from "./Favourites";
import search_icon from "../assets/search.png"
import favourite_icon from "../assets/star.png"
import refresh_icon from "../assets/refresh.png"

import wind_icon from "../assets/wind.png"
import humidity_icon from "../assets/humidity.png"

const day_clear_sky_icon = "https://openweathermap.org/img/wn/01d@2x.png";
const night_clear_sky_icon = "https://openweathermap.org/img/wn/01n@2x.png";
const day_few_clouds_icon = "https://openweathermap.org/img/wn/02d@2x.png";
const night_few_clouds_icon = "https://openweathermap.org/img/wn/02n@2x.png";
const day_scattered_clouds_icon = "https://openweathermap.org/img/wn/03d@2x.png";
const night_scattered_clouds_icon = "https://openweathermap.org/img/wn/03n@2x.png";
const day_broken_clouds_icon = "https://openweathermap.org/img/wn/04d@2x.png";
const night_broken_clouds_icon = "https://openweathermap.org/img/wn/04n@2x.png";
const day_shower_rain_icon = "https://openweathermap.org/img/wn/09d@2x.png";
const night_shower_rain_icon = "https://openweathermap.org/img/wn/09n@2x.png";
const day_rain_icon = "https://openweathermap.org/img/wn/10d@2x.png";
const night_rain_icon = "https://openweathermap.org/img/wn/10n@2x.png";
const day_thunderstorm_icon = "https://openweathermap.org/img/wn/11d@2x.png";
const night_thunderstorm_icon = "https://openweathermap.org/img/wn/11n@2x.png";
const day_snow_icon = "https://openweathermap.org/img/wn/13d@2x.png";
const night_snow_icon = "https://openweathermap.org/img/wn/13n@2x.png";
const day_mist_icon = "https://openweathermap.org/img/wn/50d@2x.png";
const night_mist_icon = "https://openweathermap.org/img/wn/50n@2x.png";


const Weather = () => {

    // inital declaration
    let default_city = "Vancouver" // default city for now (not sure if Victoria, Canada is in the database)
    let favourite_cities_count = 0;

    const inputRef = useRef()

    const [weatherData, setWeatherData] = useState(false);
    const [favourites, setfavourites] = useState([]);
    const [refreshToggle, setRefreshToggle] = useState(false);

    const allIcons = { // icons from OpenWeather - see above
        "01d": day_clear_sky_icon,
        "01n": night_clear_sky_icon,
        "02d": day_few_clouds_icon,
        "02n": night_few_clouds_icon,
        "03d": day_scattered_clouds_icon,
        "03n": night_scattered_clouds_icon,
        "04d": day_broken_clouds_icon,
        "04n": night_broken_clouds_icon,
        "09d": day_shower_rain_icon,
        "09n": night_shower_rain_icon,
        "10d": day_rain_icon,
        "10n": night_rain_icon,
        "11d": day_thunderstorm_icon,
        "11n": night_thunderstorm_icon,
        "13d": day_snow_icon,
        "13n": night_snow_icon,
        "50d": day_mist_icon,
        "50n": night_mist_icon,
    }

    // search function
    const search = async (city) => {

        if(city === ""){ // check for valid input
            alert("Please enter a valid city name");
            return;
        }

        try {
            // begin fetching data from OpenWeather
            const key = import.meta.env.VITE_API_KEY // record key
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`; // complete the URL
            const response = await fetch(url); // fetch
            const data = await response.json(); // seperate data

            if(!response.ok){ // confirm reponse came through
                alert(data.message);
                return;
            }

            // default icon logic
            let icon;
            if(data.dt >= data.sys.sunrise && data.dt < data.sys.sunset){ // check if day or night to see what default picture should be
                icon = allIcons[data.weather[0].icon] || day_clear_sky_icon; // "|| clear" ensures a blank data will have clear weather status
            }else{
                icon = allIcons[data.weather[0].icon] || night_clear_sky_icon; 
            }


            // time calculations
            const currentTime = Date.now(); // get current time in ms
            const timeDifference = data.timezone * 1000; // timzone difference given in seconds -> convert to ms
            const localTime = new Date(currentTime + timeDifference); // add difference in time to current system time to get local time

            const formattedDate = localTime.toLocaleDateString("en-US", { // formatting style for date
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
                timeZone: "UTC",
            });
            const formattedTime = localTime.toLocaleTimeString("en-US", { // formatting style for time
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "UTC",
            });

            // description of weather along with upper funtion for style
            const desc = data.weather[0].description;
            const capDescription = desc.charAt(0).toUpperCase() + desc.slice(1);
        
            // finally, set value from what we read/calculated
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                windDirection: data.wind.deg+90, // picture is offset by 90 degress facing north
                description: capDescription,
                temperature: Math.floor(data.main.temp), // Math.floor rounds down to ensure nice even numbers
                temperatureMin: Math.floor(data.main.temp_min),
                temperatureMax: Math.floor(data.main.temp_max),
                location: data.name,
                icon: icon,
                date: formattedDate,
                time: formattedTime,
            });

        } catch (error) { // catch
            setWeatherData(false) // something went wrong...
            console.error("Caught an error...") // message
        }
    }

    // refresh function
    const refreshApp = async () => {
       // limitation of free OpenWeather plan means this likely cant be implemented yet
       // idea is to refresh saved cities information 
    }

    // favourite function
    // Check if current city is favorited
    const isFavorite = weatherData && favourites.some(fav => fav.city === weatherData.location);

    const toggleFavorite = async () => {
    if (!weatherData){
        return; // no city loaded yet 
    }

        if (isFavorite){ // favourite city - thus must be removed
            // Remove from favourites
            const favToRemove = favourites.find(fav => fav.city === weatherData.location);
            await fetch(`http://localhost:5000/${favToRemove.id}`, { method: "DELETE" });
            setfavourites(favourites.filter(fav => fav.id !== favToRemove.id));

            favourite_cities_count-1; // dec
        } else { // not a favourite city - thus must be added
            // first check if limit has been reached
            if (favourite_cities_count > 17) { // 17 fits about the size of the card
                alert('Limit of 16 cities reached');
                return;
            }

            const res = await fetch("http://localhost:5000/", { // final local host set as 5000
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ // only care about city name and temp (not enough space for anything else)
                    city: weatherData.location,
                    temperature: weatherData.temperature
                }),
            });
            const newFav = await res.json();
            setfavourites([...favourites, { id: newFav.id, city: weatherData.location, temperature: weatherData.temperature }]);

            favourite_cities_count+1; // inc
        }
        console.log(favourite_cities_count); // debugging
        setRefreshToggle(prev => !prev); // refresh
    }


    // use effect
    useEffect(() => {
        search(default_city);
    }, [])


    // output
    return (
        <div className = "weather-parent">
            
            <div className = "favourites"> 
                <Favourites refreshToggle={refreshToggle} />
            </div>

            <div className = "weather">
                <div className = "search-bar">
                    <input ref = {inputRef} type = "text" placeholder = "Search"                 
                        onKeyDown={(e) => { // enter key as a possible control for searching
                            if (e.key === "Enter") {
                                search(inputRef.current.value);
                            }
                        }}
                    />
                    <img src = {search_icon} alt = "" onClick = {() => search(inputRef.current.value)}/> 
                    <img src = {refresh_icon} alt = "" onClick = {() => refreshApp()}/> 
                </div>

                {weatherData?<>
                    <div className = "dateTime">
                        <p className = "localDate">{weatherData.date}</p>
                        <p className = "localTime">{weatherData.time}</p>
                    </div>

                    <p className = "location">{weatherData.location}                 
                        <img src = {favourite_icon} alt = "" onClick = {toggleFavorite} style={{filter: isFavorite ? "none" : "grayscale(100%)"}}/> 
                    </p>

                    <img src = {weatherData.icon} alt = "" className = "weather-icon"/>
                    <p className = "description">{weatherData.description}</p>

                    <p className = "temperature">{weatherData.temperature}°</p>
                    <div className = "tempRange">
                        <p className = "tempMin">↓:{weatherData.temperatureMin}°</p>
                        <p className = "tempMax">↑:{weatherData.temperatureMax}°</p>
                    </div>

                    <div className = "weather-data">

                        <div className = "column">
                            <img src = {humidity_icon} alt = "" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>    
                            </div>
                        </div>

                        <div className="column">
                            <img src={wind_icon} alt = "" style={{
                                    transform: `rotate(${weatherData.windDirection}deg)`, // rotates wind in given directions
                                    transformOrigin: 'center center'
                                }}
                            />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>    
                            </div>
                        </div>
                    </div>
                </>:<></>}
            </div>
        </div>
    )
}

export default Weather