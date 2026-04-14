# Dokumentation FM
## GA 2026

### Projektstruktur

```
GA webbb/
├── index.js              # Server-kod (Express, routes, autentisering)
├── package.json          # NPM beroenden och konfiguration
├── README.md             # Projektbeskrivning
└── client/
    ├── index.html        # HTML main-file
    ├── client.js         # React komponenter och logik
    └── style.css         # CSS styling
```

---
### Installation
```bash
# 1. Installera beroenden
npm install

# 2. Starta servern
node index.js

# 3. Öppna i webbläsare
# Navigera till http://localhost:3000
```
---
### Konfiguration

### Express Server
- Port: 3000 (eller miljövariabel `port`)
- Static files serveras från `/client` mappen

### Session Middleware
```javascript
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));
```

### Data

#### Bilar
- Lagras i minnesarray
- Innehåller: id, brand, model, price
- 10 fördefinierade bilar (Toyota, Honda, Ford, osv.)

#### Användare
- Lagras i minnesarray
- Innehåller: id, email, password (hashed), type
- Lösenord hasheras med bcryptjs

### Autentisering

#### Middleware: isAuthenticated()
```javascript
function isAuthenticated(req, res, next) {
    if (req.session.auth) {
        next();
    } else {
        res.status(401).json({ error: "Not authenticated" });
    }
}
```
- Kontrollerar om användare är inloggad via session
- Returnerar 401-fel om ej autentiserad

***

### Autentisering

#### POST /register
Registrera en ny användare

#### Request body:
```json
{
    "email": "user@example.com",
    "password": "securePassword123"
}
```

#### Response:
```json
{
    "message": "User registered and logged in",
    "email": "user@example.com"
}
```

#### Validering:
- Email och lösenord krävs
- Email måste vara unik
- Lösenord hasheras innan lagring
- Automatisk inloggning efter registrering

#### Error responses:
- 400: Email eller lösenord saknas
- 400: Användaren existerar redan

***

#### POST /login
Logga in befintlig användare

#### Request body:
```json
{
    "email": "user@example.com",
    "password": "securePassword123"
}
```

#### Response (200 OK):
```json
{
    "message": "Logged in successfully",
    "email": "user@example.com",
    "type": "customer"
}
```

#### Validering:
- Email och lösenord krävs
- Användaren måste existera
- Lösenordet måste matcha (bcryptjs.compareSync)

#### Error responses:
- 400: Email eller lösenord saknas
- 401: Användaren hittas inte
- 401: Felaktig lösenord

***

## client.js

### React-komponenter

#### App Component
Huvudkomponent som hanterar:
- Autentiseringsstatus
- Användarens email
- Session-kontroll via checkAuth()

#### State:
- cars: Bilar från servern
- authenticated: Inloggningsstatus
- email: Inloggad användares email

#### useEffect:
- Kontrollerar autentisering vid sidladdning

***

#### Login Component
Handlerar registrering och inloggning

#### Props:
- setAuthenticated: Uppdatera inloggningsstatus
- setEmail: Uppdatera användarens email

**Funktioner:**
- handleSubmit(): Skickar POST-request till /register eller /login
- Togglar mellan inloggnings- och registreringsläge

### UI:
- Email input
- Lösenord input
- Login/Register knapp
- Fehanding med felmeddelanden

***

#### Header Component
Visar användarinfo och logout-knapp

***

#### Home Component
Hemskärm-komponent

***

#### Cars Component
Visar lista över tillgängliga bilar

#### Props:
- cars: Array med bilobjekt
- authenticated: Inloggningsstatus
- setCars: Uppdatera bilista

***

#### CreateCar Component
Formulär för att lägga till ny bil (endast för autentiserade användare)

#### Props:
- setCars: Uppdatera bilista

***
