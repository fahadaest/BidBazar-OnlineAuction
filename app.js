const express = require('express');
const app=express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const flash = require('express-flash');

const port =3002

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(flash());

const oneDay=1000 * 60 * 60 * 24;
app.use(sessions({
        secret:"thisisthesecretkey4vyser845gwy!@",
        saveUninitialized:true,
        cookie:{maxAge:oneDay},
        resave:true
}))

const webRoutes = require('./routes/web');
app.use('/api',webRoutes)


app.listen(port, () => {
        console.log(`loading on the port ${port}`);
});


