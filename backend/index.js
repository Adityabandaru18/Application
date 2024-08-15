const express = require('express');
const cors = require('cors'); 
const app = express();
const Croutes = require('./Routes/Routes');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/', Croutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
