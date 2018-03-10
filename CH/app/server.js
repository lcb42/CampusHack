const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const index = require('./routes/index');
// const users = require('./routes/users');

const port = 5000;
const app = express();
// const notifications = require('./routes/notificationcontroller');

// setting up mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://landonvago:Langtonrdsw9@ds261128.mlab.com:61128/campushack', {useMongoClient: true});
let connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
// successful connection to database
connection.once('open', function () {
    console.log("Connected to database successfully");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'components')));

app.use('/', index);
// app.use('/notificationHandler', notifications);
// app.use('/templates', require('./routes/emailTemplates'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log(`Listening in port ${port}`);
});

module.exports = app;