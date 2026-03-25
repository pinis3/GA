ReactDOM.createRoot(document.querySelector("#app")).render(<App />)

function App(){
    const [cars, setCars] = React.useState([])
    const [authenticated, setAuthenticated] = React.useState(false)
    const [email, setEmail] = React.useState("")

    React.useEffect(() => {
        checkAuth();
    }, [])

    async function checkAuth(){
        try {
            const res = await fetch("/status");
            const data = await res.json();
            setAuthenticated(data.authenticated);
            if (data.email) setEmail(data.email);
        } catch (err) {
            console.error("Auth check failed:", err);
        }
    }

    if (!authenticated) {
        return <Login setAuthenticated={setAuthenticated} setEmail={setEmail} />;
    }

    return(
       <>
        <Header email={email} setAuthenticated={setAuthenticated} setEmail={setEmail} />
        <main>
        <Home></Home>
        <Cars cars={cars} setCars={setCars}></Cars>
        <CreateCar setCars={setCars}></CreateCar>
        </main>
       </>
    )
}

function Login({ setAuthenticated, setEmail }){
    const [formData, setFormData] = React.useState({ email: "", password: "" })
    const [isRegistering, setIsRegistering] = React.useState(false)
    const [error, setError] = React.useState("")

    async function handleSubmit(e){
        e.preventDefault();
        setError("");
        
        const endpoint = isRegistering ? "/register" : "/login";
        
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                setAuthenticated(true);
                setEmail(data.email);
            } else {
                setError(data.error || "Authentication failed");
            }
        } catch (err) {
            setError("Server error");
        }
    }

    return(
        <div className="login">
            <h1>{isRegistering ? "Register" : "Login"}</h1>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required 
                />
                <button type="submit">{isRegistering ? "Register" : "Login"}</button>
            </form>
            <button onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
            }}>
                {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
            </button>
        </div>
    )
}

function Cars({cars, setCars}){
    React.useEffect(()=>{
        getCars();
    }, [])

    async function getCars(){
        try {
            const res = await fetch("/cars");
            if (res.status === 401) {
                alert("Session expired. Please login again.");
                return;
            }
            const data = await res.json();
            setCars(data);
        } catch (err) {
            console.error("Error fetching cars:", err);
        }
    }

    return(
        <main id = "cars" className="content">
            <h1>CARS</h1>
            {cars.map(c=> <Car car={c} setCars={setCars} key={c.id}></Car>)}
        </main>
    )
}

function Car({car, setCars}){
    const [isEditing, setIsEditing] = React.useState(false);
    const [formData, setFormData] = React.useState({
        brand: car.brand,
        model: car.model,
        price: car.price
    });

    async function delCar(id){
        const res = await fetch("/cars/"+id, {
            method:"DELETE"
        });
        if (res.status == 200)
            setCars(prev => prev.filter(c => c.id != id));
    }

    async function updateCar(){
        const res = await fetch("/cars/"+car.id, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        if(data.error) return;
        
        setCars(prev => prev.map(c => c.id === car.id ? data.car : c));
        setIsEditing(false);
    }

    if(isEditing){
        return(
            <div id={car.id} className="car editing">
                <input type="text" value={formData.brand} 
                    onChange={(e) => setFormData({...formData, brand: e.target.value})}
                    placeholder="Brand"/>
                <input type="text" value={formData.model}
                    onChange={(e) => setFormData({...formData, model: e.target.value})}
                    placeholder="Model"/>
                <input type="number" value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="Price"/>
                <button onClick={updateCar}>Spara</button>
                <button onClick={() => setIsEditing(false)}>Avbryt</button>
            </div>
        );
    }

    return(
        <div id={car.id} className="car">
            <h2>BRAND: {car.brand}</h2>
            <h3>Model: {car.model}</h3>
            <p><i>Price: {car.price}</i></p>
            <button onClick={() => setIsEditing(true)}>Redigera</button>
            <button onClick={() => delCar(car.id)}>Radera</button>
        </div>
    );
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

function Header({ email, setAuthenticated, setEmail }){
    async function logout(){
        await fetch("/logout", { method: "POST" });
        setAuthenticated(false);
        setEmail("");
    }

    return(
        <header>
            <nav>
                <a href="#home">HOME</a>
                <a href="#cars">CARS</a>
                <span>Welcome, {email}</span>
                <button onClick={logout}>Logout</button>
            </nav>
        </header>
    )
}