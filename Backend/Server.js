const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const AuthRoutes = require("./Routes/Auth");
const ConnectDB = require("./config/db");

dotenv.config();
const app = express();


app.get('/',(req,res)=>{
    return res.json({
        message:'Api hit success'
    })
})
app.use(helmet());
app.use(cors({
  origin: process.env.Client_Url || "*",
}));
app.use(express.json()); // IMPORTANT: To parse JSON request body

app.use("/api/auth", AuthRoutes);

const PORT = process.env.PORT || 5000;

ConnectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
