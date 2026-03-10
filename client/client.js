ReactDOM.createRoot(document.querySelector("#app")).render(<App />)

function App(){
    const [cars, setCars] = React.useState([])
    return(
       <>
        <Header/>
        <main>
        <Home></Home>
        <Cars cars={cars} setCars={setCars}></Cars>
        <CreateCar setCars={setCars}></CreateCar>
        </main>
       </>
    )
}

function Cars({cars, setCars}){
    React.useEffect(()=>{
        getCars();
    }, [])

    async function getCars(){
        const res = await fetch("/cars");
        const data = await res.json();
        setCars(data)
    }

    return(
        <main id = "cars" className="content">
            <h1>CARS</h1>
            {cars.map(c=> <Car car={c} setCars={setCars} key={c.id}></Car>)}
        </main>
    )
}

function Car({car, setCars}){
    async function delCar(id){
        const res = await fetch("/cars/"+id,{
            method:"DELETE"
        });
        if (res.status == 200)
            setCars(prev=> prev.filter(c=> c.id != id));
    }
    return(
        <div id = {car.id} className="car">
            <h2>BRAND: {car.brand}</h2>
            <h3>Model: {car.model}</h3>
            <p><i>Price: {car.price}</i></p>
            <button onClick={() => delCar(car.id)}>Delete</button>
        </div>

    )

}

function CreateCar({setCars}){

    async function saveCar(e){
        e.preventDefault();

        const formData = new FormData(e.target);
        const car = {
            brand: formData.get("brand"),
            model: formData.get("model"),
            price: formData.get("price")
        };

        const res = await fetch("/createcar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(car)
        });
        
        const data = await res.json();
        if(data.error) return;
        setCars(prev => [...prev, data.car]);
        e.target.reset();
    }

    return(
        <div className="create">
            <form onSubmit={saveCar}>
            <input type="text" name="brand" placeholder="Brand" required />
            <input type="text" name="model" placeholder="Model" required />
            <input type="number" name="price" placeholder="Price" required />
            <input type="submit" value="Create Car" />
            </form>
        </div>
    )

}

function Home(){

    return(
        <main id = "home" className="content">
            <h1>HOME</h1>
        </main>
    )

}

function Header(){

    return(
        <header>
            <nav>
                <a href="#home">HOME</a>
                <a href="#cars">CARS</a>
            </nav>
        </header>
    )

}