// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    // configuration =================
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/work-item', { useMongoClient: true });     // connect to mongoDB database on 

    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    // define model =================
    var schema = new mongoose.Schema({ text: 'string' });
    var WorkItem = mongoose.model('WorkItem', schema);

    // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all workitems
    app.get('/api/workitems', function(req, res) {

        // use mongoose to get all workitems in the database
        WorkItem.find(function(err, workitems) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(workitems); // return all workitems in JSON format
        });
    });

    // create workitem and send back all workitems after creation
    app.post('/api/workitems', function(req, res) {

        // create a workitem, information comes from AJAX request from Angular
        WorkItem.create({
            text : req.body.text,
            done : false
        }, function(err, workitem) {
            if (err)
                res.send(err);

            // get and return all the workitems after you create another
            WorkItem.find(function(err, workitems) {
                if (err)
                    res.send(err)
                res.json(workitems);
            });
        });

    });

    // delete a workitem
    app.delete('/api/workitems/:workitem_id', function(req, res) {
        WorkItem.remove({
            _id : req.params.workitem_id
        }, function(err, workitems) {
            if (err)
                res.send(err);

            // get and return all the workitems after you delete another
            WorkItem.find(function(err, workitems) {
                if (err)
                    res.send(err)
                res.json(workitems);
            });
        });
    });

    // application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});


    // listen (start app with node server.js) ======================================
    app.listen(3000);
    console.log("App listening on port 3000");