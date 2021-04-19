const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId
const bodyParser = require('body-parser')

const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1eg3a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const bookingList = client.db(`${process.env.DB_NAME}`).collection("orders")

  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders"); 

  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("serviceAdmin");
  

const isAdmin = client.db(`${process.env.DB_NAME}`).collection("serviceAdmin");
app.post('/isAdmin', (req, res) => {
  const email = req.body.email;
  console.log(email);
  isAdmin.find({ email: email })
      .toArray((err, admin) => {
          res.send(admin.length > 0);
      })
})
//Try to add order 
app.post('/dashboard/addorder', (req, res) => {
  const addOrder = req.body;

  ordersCollection.insertOne(addOrder)
  .then(result => {
      console.log('inserted count', result.insertedCount);
      res.send(result.insertedCount > 0)
  })
})


//Showing Order
 app.get('/dashboard/bookinglist', (req, res) => {
  bookingList.find()
   .toArray((err, docs) => {
       res.send(docs)
   })
 })

  
  //Adding Review
  const reviewsCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
  app.post('/dashboard/addreviews', (req, res) => {
    const userReview = req.body;
    reviewsCollection.insertOne(userReview)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
  })
  app.get('/reviews', (req, res) => {
      reviewsCollection.find()
     .toArray((err, docs) => {
         res.send(docs)
     })
   })
     //Add  Order From Client
     const servicesCollection = client.db(`${process.env.DB_NAME}`).collection("services");
  app.post('/dashboard/addservice', (req, res) => {
    const review = req.body;
    servicesCollection.insertOne(review)
    .then(result =>{
        res.send(result.insertedCount>0)
    })
  })
  app.get('/services', (req, res) => {
    servicesCollection.find()
     .toArray((err, docs) => {
         res.send(docs)
     })
   })

   //Make an Admin
   app.post('/dashboard/addAdmin', (req, res) => {
    const {email} = req.body
    console.log(req.body);
    adminCollection.insertOne({email})
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})

//    Delete your order
app.delete('/dashboard/delete/:id', (req, res) => {
  console.log('Data Delete');

  bookingList.findOneAndDelete({_id: req.params.id})
  .then(data => res.json({success: !!data.value}));
})

   app.get('/dashboard/book/:id', (req, res) => {

    serviceCollection.findOne({_id:ObjectId(req.params.id)})
    .then(service=>{
      res.json(service)
    })
   })

 console.log('Connected')
});





app.get('/', (req, res) => {
  res.send('You server is running !')
})

app.listen(`${port}`)