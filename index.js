const express = require('express');
const app = express();

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



const port = process.env.port || 3000;

app.listen(port, () => {
    console.log("Server running on http://localhost:" + port);
});

// Middleware för att hantera json-data i post-requests
app.use(express.json());

app.use(express.static("client"));



// API-routes

app.get("/cars", (req, res) => {
    res.json(cars);
});

app.delete("/cars/:id", (req, res) => {
    let filteredCars = cars.filter(c => c.id != req.params.id);
    if (filteredCars.length == cars.length){
        res.status(400).json({error: "Nothing deleted"});
    }
    cars = [...filteredCars];
    res.status(200).json({message: "Car deleted"});
});



