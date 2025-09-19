const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const AuthRoutes = require("./Routes/Auth");
const ConnectDB = require("./config/db");
const postRoutes = require('./Routes/posts');
const authMiddleware = require('./Middleware/Auth');
const profileRoutes = require('./Routes/Profile');
const AdminRoutes = require('./Routes/Admin');
const ConnectionRoutes = require('./Routes/connection');
const ApplicationRoutes = require('./Routes/Application');

dotenv.config();
const app = express();


app.get('/',(req,res)=>{
    return res.json({
        message:'Api hit success'
    })
})
app.use(helmet());
app.use(cors());

app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/posts",authMiddleware,postRoutes)
app.use('/api/profile',authMiddleware,profileRoutes)
app.use('/api/admin',authMiddleware,AdminRoutes);
app.use('/api/connections',authMiddleware,ConnectionRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/applications', ApplicationRoutes);

const PORT = process.env.PORT || 5000;

ConnectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
