const express = require('express');
const app = express();
const session = require('express-session');
const bcrypt = require('bcryptjs');


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
  }));

let cars = [
  { id: 1, brand: "Toyota", model: "Corolla", price: 22000 },
  { id: 2, brand: "Honda", model: "Civic", price: 24000 },
  { id: 3, brand: "Ford", model: "Mustang", price: 36000 },
  { id: 4, brand: "Chevrolet", model: "Camaro", price: 38000 },
  { id: 5, brand: "BMW", model: "3 Series", price: 42000 },
  { id: 6, brand: "Mercedes-Benz", model: "C-Class", price: 45000 },
  { id: 7, brand: "Audi", model: "A4", price: 44000 },
  { id: 8, brand: "Tesla", model: "Model 3", price: 41000 },
  { id: 9, brand: "Hyundai", model: "Elantra", price: 21000 },
  { id: 10, brand: "Volkswagen", model: "Golf", price: 23000 }
];

let users = [];

// Middleware för att hantera json-data i post-requests
app.use(express.json());

app.use(express.static("client"));

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.auth) {
        next();
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
}

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log("Server running on http://localhost:" + port);
});



// AUTH ROUTES

app.post("/register", (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: "User already exists" });
    }
    
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: "user-" + Date.now(),
        email,
        password: hashedPassword,
        type: "customer"
    };
    
    users.push(newUser);
    
    // Auto login after registration
    req.session.auth = true;
    req.session.email = email;
    req.session.type = newUser.type;
    
    res.status(201).json({ message: "User registered and logged in", email });
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password required" });
    }
    
    const user = users.find(u => u.email === email);
    
    if (!user) {
        return res.status(401).json({ error: "User not found" });
    }
    
    const passwordMatch = bcrypt.compareSync(password, user.password);
    
    if (!passwordMatch) {
        return res.status(401).json({ error: "Incorrect password" });
    }
    
    req.session.auth = true;
    req.session.email = email;
    req.session.type = user.type;
    
    res.json({ message: "Logged in successfully", email });
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ error: "Could not log out" });
        res.json({ message: "Logged out" });
    });
});

app.get("/status", (req, res) => {
    if (req.session.auth) {
        res.json({ authenticated: true, email: req.session.email });
    } else {
        res.json({ authenticated: false });
    }
});

// CAR API ROUTES

app.get("/cars", (req, res) => {
    res.json(cars);
});
app.post("/createcar", isAuthenticated, (req, res) => {
    const car = {}
    car.id = "id_"+Date.now();
    car.brand = req.body.brand || "no_brand";
    car.model = req.body.model || "no_model";
    car.price = req.body.price || 0;
    cars.push(car);
    res.status(201).json({message: "Car created", car: car});
});
app.delete("/cars/:id", isAuthenticated, (req, res) => {
    let filteredCars = cars.filter(c => c.id != req.params.id);
    if (filteredCars.length == cars.length){
        res.status(400).json({error: "Nothing deleted"});
    }
    cars = [...filteredCars];
    res.status(200).json({message: "Car deleted"});
});

app.put("/cars/:id", isAuthenticated, (req, res) => {
    const car = cars.find(c => c.id == req.params.id);
    if (!car) {
        return res.status(404).json({error: "Car not found"});
    }
    
    car.brand = req.body.brand || car.brand;
    car.model = req.body.model || car.model;
    car.price = req.body.price || car.price;
    
    res.status(200).json({message: "Car updated", car: car});
});

