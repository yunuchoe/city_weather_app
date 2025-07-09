USE weather_application;

CREATE TABLE favourites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(255) NOT NULL,
  temperature INT NOT NULL
);