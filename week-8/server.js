const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    session({
        secret: "mySecretKey",
        resave: false,
        saveUninitialized: false
    })
);

// Home Page
app.get("/", (req, res) => {
    res.send(`
        <h1>Week 8 - Stateful Applications</h1>

        <h2>Cookies</h2>
        <a href="/create-cookie">Create Cookie</a>
        <br>
        <a href="/read-cookie">Read Cookie</a>

        <h2>Login</h2>

        <form action="/login" method="POST">
            <input
                type="text"
                name="username"
                placeholder="Username"
                required
            >
            <br><br>

            <input
                type="password"
                name="password"
                placeholder="Password"
                required
            >
            <br><br>

            <button type="submit">Login</button>
        </form>
    `);
});

// 1. Create Cookie
app.get("/create-cookie", (req, res) => {
    res.cookie("username", "Gayathri", {
        maxAge: 60000
    });

    res.send(`
        <h2>Cookie Created Successfully!</h2>
        <a href="/">Go Home</a>
    `);
});

// 1. Read Cookie
app.get("/read-cookie", (req, res) => {
    const username = req.cookies.username;

    if (username) {
        res.send(`
            <h2>Cookie Value: ${username}</h2>
            <a href="/">Go Home</a>
        `);
    } else {
        res.send(`
            <h2>No Cookie Found</h2>
            <a href="/">Go Home</a>
        `);
    }
});

// 2 & 3. Login and Maintain Session
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Simple login credentials
    if (username === "admin" && password === "1234") {

        // Store username in session
        req.session.username = username;

        res.send(`
            <h2>Login Successful!</h2>

            <p>Welcome, ${username}</p>

            <a href="/dashboard">Go to Dashboard</a>
            <br><br>

            <a href="/logout">Logout</a>
        `);

    } else {

        res.send(`
            <h2>Invalid Username or Password</h2>

            <a href="/">Try Again</a>
        `);
    }
});

// 4. Protect Private Routes
function isAuthenticated(req, res, next) {

    if (req.session.username) {
        next();
    } else {
        res.send(`
            <h2>Access Denied!</h2>

            <p>Please login first.</p>

            <a href="/">Go to Login</a>
        `);
    }
}

// Private Dashboard
app.get("/dashboard", isAuthenticated, (req, res) => {

    res.send(`
        <h1>Private Dashboard</h1>

        <p>Welcome ${req.session.username}!</p>

        <p>This page is protected.</p>

        <a href="/logout">Logout</a>
    `);
});

// 3. Logout
app.get("/logout", (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.send("Logout failed");
        }

        res.send(`
            <h2>Logout Successful!</h2>

            <a href="/">Login Again</a>
        `);
    });
});

// Start Server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});