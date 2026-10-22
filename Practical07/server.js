const express = require("express");
const session = require("express-session");
const app = express();
const PORT = 3000;

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.json());

app.use(
    express.static("public")
);

app.use(
    session({

        secret:
            "central-city-library-secret",

        resave: false,

        saveUninitialized: false,

        cookie: {
            httpOnly: true
        }

    })
);

function isAuthenticated(
    req,
    res,
    next
) {

    if (req.session.user) {

        next();

    } else {

        res.redirect("/login");

    }

}

app.get("/", (req, res) => {

    res.send(`

        <h1>
            Central City Library
        </h1>

        <p>
            Welcome to the Library Portal.
        </p>

        <a href="/about">
            About
        </a>

        <br><br>

        <a href="/login">
            Login
        </a>

    `);

});

app.get("/about", (req, res) => {

    res.send(`

        <h1>
            About Central City Library
        </h1>

        <p>
            Central City Library provides
            educational resources for students
            and staff.
        </p>

        <ul>

            <li>Books</li>
            <li>Digital Library</li>
            <li>Research Papers</li>
            <li>Online Journals</li>

        </ul>

        <a href="/">
            Home
        </a>

        <br>

        <a href="/login">
            Login
        </a>

    `);

});

app.get("/login", (req, res) => {

    res.send(`

        <h1>
            Member Login
        </h1>

        <form
            action="/login"
            method="POST">

            <label>
                Username:
            </label>

            <input
                type="text"
                name="username"
                required>

            <br><br>

            <label>
                Password:
            </label>

            <input
                type="password"
                name="password"
                required>

            <br><br>

            <button type="submit">
                Login
            </button>

        </form>

        <p>
            Username: student
        </p>

        <p>
            Password: 12345
        </p>

    `);

});

app.post("/login", (req, res) => {

    const {
        username,
        password
    } = req.body;


    if (
        username === "student" &&
        password === "12345"
    ) {

        req.session.user = {

            username: username,

            role: "member"

        };


        res.redirect("/dashboard");

    } else {

        res.send(`

            <h1>
                Login Failed
            </h1>

            <p>
                Invalid username or password.
            </p>

            <a href="/login">
                Try Again
            </a>

        `);

    }

});

app.get(
    "/dashboard",
    isAuthenticated,
    (req, res) => {

        const user =
            req.session.user;


        res.send(`

            <h1>
                Library Dashboard
            </h1>

            <h2>
                Welcome,
                ${user.username}
            </h2>

            <p>
                Authentication successful.
            </p>

            <h3>
                Library Resources
            </h3>

            <ul>

                <li>
                    Digital Books
                </li>

                <li>
                    Research Papers
                </li>

                <li>
                    Online Journals
                </li>

            </ul>

            <a href="/profile">
                Profile
            </a>

            <br><br>

            <a href="/logout">
                Logout
            </a>

        `);

    }
);

app.get(
    "/profile",
    isAuthenticated,
    (req, res) => {

        const user =
            req.session.user;


        res.send(`

            <h1>
                Member Profile
            </h1>

            <p>
                Username:
                ${user.username}
            </p>

            <p>
                Role:
                ${user.role}
            </p>

            <a href="/dashboard">
                Dashboard
            </a>

            <br><br>

            <a href="/logout">
                Logout
            </a>

        `);

    }
);

app.get("/logout", (req, res) => {

    req.session.destroy(
        (error) => {

            if (error) {

                return res
                    .status(500)
                    .send(
                        "Logout failed."
                    );

            }

            res.redirect("/login");

        }
    );

});

app.listen(
    PORT,
    () => {

        console.log(
            `Server running at:
            http://localhost:${PORT}`
        );

    }
);
