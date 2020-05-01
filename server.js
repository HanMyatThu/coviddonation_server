const express = require('express');
const app = express();
require('dotenv').config();
require('./src/db/mongodb');
const cors = require('cors');
const bodyparser = require('body-parser');
const helmet = require('helmet');
const path = require('path');

/**
 * Bind Views
 */
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine","jade");


//import for API
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 3000;

io.on('connection', socket => {
    console.log('a user is connected');
    socket.on('chat message', msg => {
        console.log(msg);
    })
})


//Importing APIs
const userRoutes = require('./src/routes/users');
const AdminRoute = require('./src/routes/admin');
const FrontRoute = require('./src/routes/frontend');
const MachineRoute = require('./src/routes/machines');
const codeRoute = require('./src/routes/codes');

app.use(userRoutes);
app.use(AdminRoute);
app.use(FrontRoute);
app.use(MachineRoute);
app.use(codeRoute);

server.listen(port , () => {
    console.log('server running on the port', port);
})