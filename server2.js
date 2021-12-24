// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// var bodyParser = require('body-parser');

// const app = express();
// app.use(cors());
// app.use('/public', express.static(`${process.cwd()}/public`));
// app.use("/", bodyParser.urlencoded({extended: false}));

// // Setup Mongo and schema

// const mySecret = process.env['MONGO_URI']
// mongoose.connect(mySecret, { useNewUrlParser: true, useUnifiedTopology: true });

// const { Schema } = mongoose;
// const urlSchema = new Schema(
// {
//   originalURl: {type: String}, // String is shorthand for {type: String}
//   shortURL: {type: String}
// });

// const urlModel = mongoose.model('urlModel', urlSchema);

// // set up endpoint routes

// app.get('/', function(req, res) {
//   res.sendFile(process.cwd() + '/views/index.html');
// });

// app.get('/api/hello', function(req, res) {
//   res.json({ greeting: 'hello API' });
// });

// //////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////


// // app.post('/api/shorturl', async function(req, res)
// // {
// //   console.log(11, req.body.url);
// //   var testReturn = await urlModel.findOne({originalURl: url}).exec()
// //   .then(var neUrlDoc = new urlModel({originalURl: url, shortURL: "blank"});
// //   neUrlDoc.save(function(err, createdItem))
// //   console.log(22, testReturn);
// //   res.json({ "greeting": testReturn });
// // });

// // function createNewURL(url)
// // {

// }


// git add .
// git commit -m "aaaa"
// git push






// // this works , but i cant make it send something back to testReturn
// app.post('/api/shorturl2', function(req, res)
// {
//   console.log(11, req.body.url);
//   var testReturn = createNewURL2(req.body.url);
//   console.log(22, testReturn);
//   res.json({ "greeting": testReturn });
// });

// function createNewURL2(url)
// {
//   urlModel.findOne({originalURl: url}, function(err, doc) 
//   {
//     if (err) // error
//     {
//         console.log("MongoDB Error: " + err);
//         return false; // or callback
//     }

//     if (doc)  // 1 found
//     {
//       console.log("Found one item: " + doc);
//       // return doc
//     }
//     else if (!doc)
//     {
//       console.log("No doc for that url found, creating it");
//       var neUrlDoc = new urlModel({originalURl: url, shortURL: "blank"});
      
//       neUrlDoc.save(function(err, createdItem) 
//       {
//         if (err) 
//         {
//           console.log("MongoDB Error: " + err);
//           return null; // or callback
//         }
//         else
//         {
//           console.log("added: " + createdItem);
//           return true;
//         }
//       });
//     }
//     return true; // or callback ..?
//   });
// }

// const port = process.env.PORT || 3009;
// app.listen(port, function () {
//   console.log(`Listening on port http://localhost:${port}`);
// });


// // edit: 
// // .findOne, .push, .save.

// // update
// // .findOneAndUpdate


// // //create:
// // 
// //   // check if exists
// //   // Model.countDocuments({}) + 1
// //   // Add this as the shortened url
// //   const blah1 = urlModel.findOne({originalURl: url});

// //   if (blah1)
// //   {
    
// //     console.log(333, blah1);
// //     // if (err) {return err} //request to db not successful or no record found

// //     // console.log(444);
// //     // if (data) // data will be null if nothing found
// //     // {
// //     //   console.log(555);
// //     //   console.log(22, test);
// //     //   return data
// //     // }
    
// //   }
// //   else {
// //     console.log(444, blah1);}


// //   // neUrlDoc.save(function(err, data)
// //   // {
// //   //   if (err) {console.log("error", data._id)};
// //   //   console.log("great success", data._id);
// //   // });
  
// // };


