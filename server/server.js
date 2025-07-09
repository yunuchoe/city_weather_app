import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

// inital declaration
const app = express()

app.use(cors())
app.use(express.json());

// connect - dummy username and password
const db = mysql.createConnection({
    host: "localhost",
    user: 'root', 
    password: '',
    database: "weather_application"
})

// connect
db.connect(err => {
    if (err) { // error
        console.error('DB connection failed:', err);
        process.exit(1); // Exit if DB connection fails
    } else { // good to go!
        console.log('DB connected passed');
    }
});

// get favourites
app.get("/", (req, res) => {
    db.query("SELECT * FROM favourites", (err, data) => {
        if (err) return res.status(500).json(err);
        res.json(data);
    });
});

// post a favourite
app.post("/", (req, res) => {
    const { city, temperature } = req.body;
    const q = "INSERT INTO favourites (city, temperature) VALUES (?, ?)";
    db.query(q, [city, temperature], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId });
    });
});

// delete a favourite
app.delete("/:id", (req, res) => {
    const q = "DELETE FROM favourites WHERE id = ?";
    db.query(q, [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Deleted" });
    });
});


// listen to port 5000
app.listen(5000, () => {
    console.log("Listening"); // listening...
})