const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();
const helmet = require('helmet');
  //middleware
server.use(helmet());
server.use(express.json());

//endpoints
server.use('/api/hubs',gatekeeper("mellon"), hubsRouter);
server.use(gatekeeper("hello"));
server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.use((error,req,res,next) => {
  res.status(400).json({error: "something broke!"})
})

module.exports = server;


function logger(req,res,next) {
  console.log(`${req.method} Request to ${req.originalUrl}`)
}

// function authenticator(req, res, next) {
//   const { pass } = req.query;
//   if (pass === "mellon") {
//     next();
//   } else {
//     res.status(400).json({ error: "I'm afraid I can't do that" });
//   }
// }

function gatekeeper(password) {
  return function (req,res,next) {
  const { pass } = req.query;
  if (pass === password) {
    next();
  } else {
    next("OOF");
    // res.status(400).json({ error: "I'm afraid I can't do that" });
  }
}
}