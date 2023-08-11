const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.js");
const bodyParser = require("body-parser");
const {
    NotFoundError, ApiError,
} = require("./core/apiError.js");
const app = express();

app.use(express.json());
var corsOptions = {
    origin: "*",
};
app.use(cors(corsOptions));

// //Routes
app.use("/api", routes);
app.use(express.json({ limit: "2mb" }));
app.use(bodyParser.json({ limit: "2mb" }));
app.use(
    bodyParser.urlencoded({ limit: "2mb", extended: true, parameterLimit: 1000 })
);


//Not Found Routes
app.all("*", (req, res) => {
    throw new NotFoundError(`Can't find ${req.originalUrl} on this server!`);
});

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        ApiError.handle(err, res);
    } else {
        if (err.name === "MulterError") {
            return res.status(400).json({
                status: "fail",
                message: err.message,
            });
        }
        //Mongoose Duplicate Error
        if (err.code && err.code === 11000) {
            return res.status(400).json({
                status: "fail",
                message: `${Object.keys(err.keyPattern)[0]} must be unique !`,
            });
        }
        //Development
        if (process.env.NODE_ENV === "development") {
            return res.status(400).json({
                status: "fail",
                message: err.message,
            });
        }
        console.log(err);
        //Production
        // ApiError.handle(new InternalError(), res);
    }
});

module.exports = app;
