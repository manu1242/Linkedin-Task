const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const App = express();
const PORT = process.env.PORT;
App.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    
})