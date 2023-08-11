const app = require("./app.js");
const { dbConnector } = require("./db/connectDB.js");
const dotenv = require('dotenv')
dotenv.config({ path: "./.env" });

const PORT = process.env.port;

dbConnector();

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
 