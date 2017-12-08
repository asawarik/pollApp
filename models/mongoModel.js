// include my model for this application
var mongoModel = require("../models/mongoModel.js")
// Define the routes for this controller
exports.init = function(app) {
app.get('/', index); // essentially the app welcome page
  /*
  8   * The :collection parameter maps directly to the mongoDB collection.
  9   * I've done this to have a very general set of operations to experiment with
 10   * but this is VERY BAD form for the client to supply the collection name
 11   * in an actual application.  You don't want to give a potentially malicious
 12   * client such a direct access into your database.  In your final project,
 13   * your app should define the collection name and should not get it from the
 14   * client. That is, just have a "const" variable in your model that defines
 15   * the collection name. WARNING:  In your final project, points will be lost
 16   * if the collection name comes from the client.
 17   */
 app.put('/:collection', doCreate); // CRUD Create
 app.get('/:collection', doRetrieve); // CRUD Retrieve
 app.post('/:collection', doUpdate); // CRUD Update
   // The CRUD Delete path is left for you to define
 }
 
 // No path:  display instructions for use
 index = function(req, res) {
   res.render('help', {title: 'MongoDB Test'})
 };
 
 /********** CRUD Create *******************************************************
 30 * Take the object defined in the request body and do the Create
 31 * operation in mongoModel. 
 32 */ 
 doCreate = function(req, res){
  console.log(req.params.collection);
   /*
 35   * A series of console.log messages are produced in order to demonstrate
 36   * the order in which the code is executed.  Given that asynchronous 
 37   * operations are involved, the order will *not* be sequential as implied
 38   * by the preceding numbers.  These numbers are only shorthand to quickly
 39   * identify the individual messages.
 40   */
   console.log("1. Starting doCreate in dbRoutes");
   /*
 43   * First check if req.body has something to create.
 44   * Object.keys(req.body).length is a quick way to count the number of
 45   * properties in the req.body object.
 46   */
   if (Object.keys(req.body).length == 0) {
     res.render('message', {title: 'Mongo Demo', obj: "No create message body found"});
     return;
   }
   /*
 52   * Call the model Create with:
 53   *  - The collection to do the Create into
 54   *  - The object to add to the model, received as the body of the request
 55   *  - An anonymous callback function to be called by the model once the
 56   *    create has been successful.  The insertion of the object into the 
 57   *    database is asynchronous, so the model will not be able to "return"
 58   *    (as in a function return) confirmation that the create was successful.
 59   *    Consequently, so that this controller can be alerted with the create
 60   *    is successful, a callback function is provided for the model to 
 61   *    call in the future whenever the create has completed.
 62   */
 mongoModel.create ( req.params.collection, 
                      req.body,
                        function(result) {
                          // result equal to true means create was successful
                            var success = (result ? "Create successful" : "Create unsuccessful");
                        res.render('message', {title: 'Mongo Demo', obj: success});
                              console.log("2. Done with callback in dbRoutes create");
                        });
   console.log("3. Done with doCreate in dbRoutes");
 }
 
 /********** CRUD Retrieve (or Read) *******************************************
 75 * Take the object defined in the query string and do the Retrieve
 76 * operation in mongoModel.  
 77 */ 
 
 doRetrieve = function(req, res){
   /*
 81   * Call the model Retrieve with:
 82   *  - The collection to Retrieve from
 83   *  - The object to lookup in the model, from the request query string
 84   *  - As discussed above, an anonymous callback function to be called by the
 85   *    model once the retrieve has been successful.
 86   * modelData is an array of objects returned as a result of the Retrieve
 87   */
   mongoModel.retrieve(
     req.params.collection, 
     req.query,
      function(modelData) {
        if (modelData.length) {
         res.render('results',{title: 'Mongo Demo', obj: modelData});
       } else {
         var message = "No documents with "+JSON.stringify(req.query)+ 
                       " in collection "+req.params.collection+" found.";
         res.render('message', {title: 'Mongo Demo', obj: message});
       }
      });
}

/********** CRUD Update *******************************************************
103 * Take the MongoDB update object defined in the request body and do the
104 * update.  (I understand this is bad form for it assumes that the client
105 * has knowledge of the structure of the database behind the model.  I did
106 * this to keep the example very general for any collection of any documents.
107 * You should not do this in your project for you know exactly what collection
108 * you are using and the content of the documents you are storing to them.)
109 */ 
doUpdate = function(req, res){
  // if there is no filter to select documents to update, select all documents
  var filter = req.body.find ? JSON.parse(req.body.find) : {};
  // if there no update operation defined, render an error page.
  if (!req.body.update) {
    res.render('message', {title: 'Mongo Demo', obj: "No update operation defined"});
    return;
  }
  var update = JSON.parse(req.body.update);
  /*
120   * Call the model Update with:
121   *  - The collection to update
122   *  - The filter to select what documents to update
123   *  - The update operation
124   *    E.g. the request body string:
125   *      find={"name":"pear"}&update={"$set":{"leaves":"green"}}
126   *      becomes filter={"name":"pear"}
127   *      and update={"$set":{"leaves":"green"}}
128   *  - As discussed above, an anonymous callback function to be called by the
129   *    model once the update has been successful.
130   */
  mongoModel.update(  req.params.collection, filter, update,
                       function(status) {
                               res.render('message',{title: 'Mongo Demo', obj: status});
                       });
}

/********** CRUD Delete *******************************************************
138 * The delete route handler is left as an exercise for you to define.
139 */


/*
143 * How to test:
144 *  - Create a test web page
145 *  - Use REST Console for Chrome
146 *    (If you use this option, be sure to set the Body Content Headers Content-Type to:
147 *    application/x-www-form-urlencoded . Else body-parser won't work correctly.)
148 *  - Use CURL (see tests below)
149 *    curl comes standard on linux and MacOS.  For windows, download it from:
150 *    http://curl.haxx.se/download.html
151 *
152 * Tests via CURL for Create and Update (Retrieve can be done from browser)
153
154# >>>>>>>>>> test CREATE success by adding 3 fruits
155curl -i -X PUT -d "name=apricot&price=2" http://localhost:50000/fruit
156curl -i -X PUT -d "name=banana&price=3" http://localhost:50000/fruit
157curl -i -X PUT -d "name=cantaloupe&price=4" http://localhost:50000/fruit
158# >>>>>>>>>> test CREATE missing what to put
159curl -i -X PUT  http://localhost:50000/fruit
160# >>>>>>>>>> test UPDATE success - modify
161curl -i -X POST -d 'find={"name":"banana"}&update={"$set":{"color":"yellow"}}' http://localhost:50000/fruit
162# >>>>>>>>>> test UPDATE success - insert
163curl -i -X POST -d 'find={"name":"plum"}&update={"$set":{"color":"purple"}}' http://localhost:50000/fruit
164# >>>>>>>>>> test UPDATE missing filter, so apply to all
165curl -i -X POST -d 'update={"$set":{"edible":"true"}}' http://localhost:50000/fruit
166# >>>>>>>>>> test UPDATE missing update operation
167curl -i -X POST -d 'find={"name":"pear"}' http://localhost:50000/fruit
168
169 */