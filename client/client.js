ReactDOM.createRoot(document.querySelector("#app")).render(<App />)

function App(){

    return(
       <>

        <Header />
        <Home></Home>
        <Cars></Cars>


       </>
    )
}

function Cars(){

    const [cars, setCars] = React.useState([])

    React.useEffect(()=>{
        getCars();
    }, [])

    

    async function getCars(){

        const res = await fetch("/cars");
        const cars = await res.json();
        setCars(cars)
        console.log(cars);
    }
    



    return(
        <main id = "cars" className="content">
            <h1>CARS</h1>

            {cars.map(c=> <Car car={c} setCars = {setCars}key = {c.id} ></Car>)}

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