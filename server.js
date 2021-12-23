const express = require('express')
const cors = require('cors')
const app = express()
var bodyParser = require('body-parser');
const Merkle = require('./utils/merkle');


const port = process.env.PORT || 8080; 

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.use(function(req, res, next) {
  // do authentication
  console.log('Something is happening.');
  next(); // make sure we go to the next routes and don't stop here
});



router.get('/merkleRoot', (req, res) => {
  var merkle = new Merkle(req.query.client)
  const root = merkle.getMerkleRoot()
  res.json({ root: root });
})

router.get('/merkleProof', (req, res) => {
  var merkle = new Merkle(req.query.client)
  const proof = merkle.getMerkleProof(req.query.address)
  res.json({
    address: req.query.address, 
    proof: proof 
  });
})

router.get('/merkleLeaf', (req, res) => {
  var merkle = new Merkle(req.query.client)
  const is_valid = merkle.verifyLeaf(req.query.address)
  res.json({
    address: req.query.address, 
    is_valid: is_valid 
  });
})


app.use('/api', router);


app.listen(port, () => {
  console.log(`APIS running at http://localhost:${port}`)
})
