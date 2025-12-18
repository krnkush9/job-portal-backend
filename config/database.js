const mongoose = require("mongoose");
// data base url
const URl = process.env.DB_URL;

const dbConnect = () => {
    mongoose.connect(URl)
        .then(() => {
            console.log("DB connected successfully.");
        })
        .catch((err) => {
            console.log("DB error > ", err)
            process.exit(1);
        })
}

module.exports = dbConnect;