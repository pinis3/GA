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
    React.useEffect(()=>{
        getCars();
    }, [])

    const [cars, setCars] = React.useState([])

    async function getCars(){

        const res = await fetch("/cars");
        const cars = await res.json();
        setCars(cars)
        console.log(cars);}
        return(
        <main id = "cars" className="content">
            <h1>CARS</h1>

            {cars.map(c=> <Car car={c} key = {c.id} />)}

        </main>
    )

}
function Car({car}){

    return(
        <div id = {car.id} className="car">
            <h2>BRAND: {car.brand}</h2>
            <h3>Model: {car.model}</h3>
            <p><i>Price: {car.price}</i></p>
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