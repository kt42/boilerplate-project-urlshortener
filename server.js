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
  // res.json({ greeting: "hello API" });
  res.redirect("/");
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

app.post("/api/shorturl", function(req, res) 
{
  var enteredUrl = req.body.url;
  
  // This Regex will test for HTTP!!
  // var regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  // var isValid = regex.test(enteredUrl);

  // if (!isValid)
  // {
  //   return res.json({ error: 'invalid syntax URL!!! - http missing probably' })
  // }

  // these variables can be called anything, (they are actually functions that have been passed - ie callback functions)
  var dnsLookup = new Promise(function(resolve, reject) 
  {
    var result = enteredUrl.replace(/(^\w+:|^)\/\//, "");
    
    dns.lookup(result, function(err, iPaddresses, family) 
    {
      if (err) reject(err);
      resolve(iPaddresses);
    });

    // testing
    //resolve("yes");
    //reject("yes");
  });
    
  dnsLookup // always passes
  .then(function(iPaddresses) 
  {
    console.log(22, iPaddresses);
    
    var t = checkIfExists(enteredUrl); // returns a new promise, if resolve is filled the .then will run, if .reject is filled .catch will run
    console.log(34434, t);
    return t;

  })
  .then(function(previousThnReturn, reject) // no error retriving from db
  {
    console.log(33, previousThnReturn, reject);
    if (previousThnReturn) // "the url already exists in the db - provide it
    {
      console.log(2121212, previousThnReturn)
      //return res.redirect(previousThnReturn.original_url);
      
      return res.json({ original_url : previousThnReturn.original_url, short_url : previousThnReturn.short_url});
      // throw new BreakSignal({});
      //return 1;

    }
    else
    {
      console.log(4444444, "this is a new url, attempting to save");
      var shortUrl = shorterUrl();
      var urlMapping = new UrlMapping({ original_url: enteredUrl,short_url: shortUrl });
      return saveUrlMapping(urlMapping); // returns a new promise, if resolve is filled the .then will run, if .reject is filled .catch will run 
    }
  })
  .then(function(savedURL) // record saved, "If save() succeeds, the promise resolves to the document that was saved"
  { 
    console.log(999999, savedURL.short_url);
    if (savedURL.short_url)
    {
      console.log(1111, savedURL.short_url)
      return res.json({ original_url : enteredUrl, short_url : savedURL.short_url});
    }
    //return 1;

  })  
  .catch(function(reject) // a reject has been returned by one of the promises, either the url already exists or the saving failed
  { // very INTERESTING - IF THERE is no "return" processed in any of the .then's above the .catch will also run
    console.log(5555555, reject);
    //
    // if (reject.err){ // an error message exists from one of the callbacks
    //   return res.json({ error: reject.err });
    // }
    // else{ // some other error, i.e. syntax
      

    // console.log(777777);
    // return res.json({ error: reject.toString() });
    // }
    // var bleh = "is this resolve also filled from a return from the .catch to the additional .then !!??? - YES it was";
    //return bleh;

    if (reject.code === 'ENOTFOUND' || reject.code === "EAI_AGAIN"){return res.json({ error: 'NOT a website' });}; // prob got to make this a retrun aswell, seems to work without but i noticed it hanging at 1 point

  });
  // .then(function(resolve) // record saved, "If save() succeeds, the promise resolves to the document that was saved"
  // { 
    
  //   console.log(resolve)
  //   console.log("Whether the original Promise is reject OR Resolved this will always run. So the chain essentially just jupms to .catch upon the Reject callback being called");
    
  // });

  
  console.log("important TESTTTT");

});


// res.redirect("/api/redirect/" + "original_url");   /// Only way i can think to do it then:

// app.get("/api/redirect/:fff", function(req, res) 
// {
//   console.log(req.params.fff);
//   return res.redirect(req.params.fff);

// });

// DONT USE - Just CAUSES A MILLION REDIRECTS !!!!!!!!!!!
// need to ask stack overflow how to handel; internal redirect failure

app.get("/api/shorturl/:shortUrl", function(req, res) 
{
  
  var redirectPromise = redirectToOriginalUrl(req.params.shortUrl);

  redirectPromise
  .then(function(original_url) 
  {
    console.log(69, original_url);
    res.redirect(original_url);
    return;
  })
  .catch(function(reason) // If res fails here the catch will also trigger
  {
    console.log(433, reason);
    return res.json({ error: "see console for error" });
  });
});

function redirectToOriginalUrl(short_url) 
{
  return new Promise(function(resolve, reject) 
  {
    UrlMapping.findOne({ short_url: short_url }, function(err, doc) 
    {
      if (err)
      {
        console.log(67, err);
        return reject(err);
      }
      else if (doc === null)
      {
        console.log(64, err, doc);
        err = "URL not found";
        return reject(err);
      }
      else if (doc)
      {
        console.log(68, err, doc); 
        return resolve(doc.original_url);
      }
      else{
        console.log("WTFFFFFFFF"); }
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