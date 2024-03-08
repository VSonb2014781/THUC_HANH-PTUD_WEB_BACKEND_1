const express = require("express");
const cors = require("cors")
const contactsRouter = require("./app/routes/contact.route");

const ApiError = require("./app/api-error");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res, next) => {
    // This code will run when no route matches the request.
    // Call next() to pass to the error-handling middleware.
    return next(new ApiError(404, "Resource not found"));
});

// Define error-handling middleware last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    // Middleware for centralized error handling.
    // In your route handling code, call next(err) to pass to this error-handling middleware.

    return res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});


app.get("/", (req,res)=>{
    res.json({message:"Welcome to contac book application,"});
});
module.exports= app;