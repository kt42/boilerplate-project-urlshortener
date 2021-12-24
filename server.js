"use strict";
require('dotenv').config();
var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var dns = require("dns");
var cors = require("cors");
const { nextTick } = require('process');
var app = express();
var dns = require("dns");

const mySecret = process.env['MONGO_URI']
mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });
var urlMappingSchema = new mongoose.Schema({
  original_url: String,
  short_url: String
});
var UrlMapping = mongoose.model("UrlMapping", urlMappingSchema);
app.use(cors());
app.use("/", bodyParser.urlencoded({extended: false}));
app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function(req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API" });
});




function checkIfExists(original_url) 
{
  return new Promise(function(resolve, reject) 
  {
    UrlMapping.findOne({ original_url: original_url }, function(err, doc) 
    {
      console.log(311, err, doc);
      if (err) return reject(err);
      else return resolve(doc);
    });
  });
}

function saveUrlMapping(mapping) 
{
  return new Promise(function(resolve, reject) {
    mapping.save(function(err, doc) {
      if (err) reject(err);
      else resolve(doc);
    });
  });
}

app.post("/api/shorturl/new", function(req, res) 
{
  var url = req.body.url;

  // these variables can be called anything, (they are actually functions that have been passed - ie callback functions)
  var dnsLookup = new Promise(function(resolve, reject) 
  {
    var result = url.replace(/(^\w+:|^)\/\//, "");
    
    dns.lookup(result, function(err, addresses, family) 
    {
      if (err) reject(err);
      resolve(addresses);
    });
    
    // if (url === "home"){
    //   resolve("wil this write twice?????")
    //   return res.json({ ok: "going home" });
    // }

    // console.log(90909, resolve, reject);
    // setTimeout(function() 
    // {
    //     console.log("hello 3");
    // }, 600)
    //reject("also yes")

    // testing
    //resolve("yes");
    //reject("yes");
  });
    


  dnsLookup // always passes
  .then(function(resolve, reject) 
  {
    console.log(11, resolve, reject);
    //resolve("yes");
    //return resolve; // always passes
    //return resolve("565656")
    setTimeout(function() 
   {
   		console.log("hello 4");
   }, 200)
   
   return reject = "fsdfsdfg", resolve = "aaaaaaaaaa";
  })
  .then(function(previousThnReturn, reject) 
  {
    console.log(22, previousThnReturn, reject);
    return checkIfExists(url); // returns a new promise, if resolve is filled the .then will run, if .reject is filled .catch will run
  })
  .then(function(previousThnReturn, reject) // no error retriving from db
  {
    console.log(33, previousThnReturn, reject);
    if (previousThnReturn)
    {
      console.log(previousThnReturn)
      res.json({ here: "the record already exists, here is the link" + previousThnReturn.short_url });
      // throw new BreakSignal({});
      //return 1;
    }
    else
    {
      // "this is a new url, attempting to save"
      var shortUrl = shorterUrl();
      var urlMapping = new UrlMapping({ original_url: url,short_url: shortUrl });
      return saveUrlMapping(urlMapping); // returns a new promise, if resolve is filled the .then will run, if .reject is filled .catch will run 
    }
  })
  .then(function(previousThnReturn) // record saved, "If save() succeeds, the promise resolves to the document that was saved"
  { 
    console.log(9999999999999, previousThnReturn);
    if (previousThnReturn.short_url)
    {
      console.log(previousThnReturn.short_url)
      return res.json({ here: "Records saved successfully, here is the new shortened link" + previousThnReturn.short_url});
    }
    return 1;
  })  
  .catch(function(reject) // a reject has been returned by one of the promises, either the url already exists or the saving failed
  { // very INTERESTING - IF THERE is no "return" processed in any of the .then's above the .catch will also run
    console.log(5555555, reject);
    // if (reject.err){ // an error message exists from one of the callbacks
    //   return res.json({ error: reject.err });
    // }
    // else{ // some other error, i.e. syntax
      
    // console.log(777777);
    // return res.json({ error: reject.toString() });
    // }
    var bleh = "is this resolve also filled from a return from the .catch to the additional .then !!??? - YES it was";
    //return bleh;
    res.json({"rejected": reject});

  });
  // .then(function(resolve) // record saved, "If save() succeeds, the promise resolves to the document that was saved"
  // { 
    
  //   console.log(resolve)
  //   console.log("Whether the original Promise is reject OR Resolved this will always run. So the chain essentially just jupms to .catch upon the Reject callback being called");
    
  // });

  
  console.log("important TESTTTT");

});

app.get("/api/shorturl/:shortUrl", function(req, res) {
  var redirectPromise = redirectToOriginalUrl(req.params.shortUrl);
  redirectPromise.then(function(original_url) {
    return res.redirect(original_url);
  });
  redirectPromise.catch(function(reason) {
    return res.json({ error: "see console for error" });
  });
});

function redirectToOriginalUrl(short_url) {
  return new Promise(function(resolve, reject) {
    UrlMapping.findOne({ short_url: short_url }, function(err, doc) {
      if (err || doc === null) return reject(err);
      else return resolve(doc.original_url);
    });
  });
}



function shorterUrl() 
{
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}


const port = process.env.PORT || 3009;
app.listen(port, function () {
  console.log(`Listening on port http://localhost:${port}`);
});