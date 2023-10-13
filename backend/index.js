let express = require('express');
let router = require('./routes/routes');
const cors = require('cors');
let dbConnect = require('./Database/index');
let {PORT} = require('./config env/index');
let errorHandler = require('./middlewares/errorHandler');
let app = express();
let path = require('path')

//Enable Cors
app.use(cors());

//Convert coming data to javascript object
app.use(express.json());

//Access routes
app.use(router);

//access static files
app.use('/images', express.static(path.join(__dirname, 'images')));


dbConnect();

//error handler middleware
app.use(errorHandler);


app.listen(PORT, ()=>{
    console.log('Backend is running at Port 1000')
})