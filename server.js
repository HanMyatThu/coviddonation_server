const express = require('express');
const app = express();
require('dotenv').config();
require('./src/db/mongodb');
const cors = require('cors');
const bodyparser = require('body-parser');
const helmet = require('helmet');
const path = require('path');
const session = require('express-session');
require('events').EventEmitter.defaultMaxListeners = 15;
const crypto = require('crypto')
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
const port = process.env.PORT || 3000;

//create session for checkout
app.use(session({
    secret: 'plepaysess',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false,maxAge: 300000}
}));

 
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
}

//Importing APIs
const userRoutes = require('./src/routes/users');
const AdminRoute = require('./src/routes/admin');
const FrontRoute = require('./src/routes/frontend');
const MachineRoute = require('./src/routes/machines');
const ProcessRoute = require('./src/routes/process');
const CodeRoute = require('./src/routes/code');
const SMSRoute = require('./src/routes/sms');
const RequestRoute = require('./src/routes/request');
const qrRoute = require('./src/routes/qrcode');
const assistantRoute = require('./src/routes/assistant');

app.use(userRoutes);
app.use(AdminRoute);
app.use(FrontRoute);
app.use(MachineRoute);
app.use(CodeRoute);
app.use(ProcessRoute);
app.use(SMSRoute);
app.use(RequestRoute);
app.use(qrRoute);
app.use(assistantRoute);

server.listen(port , () => {
    console.log('server running on the port', port);
})