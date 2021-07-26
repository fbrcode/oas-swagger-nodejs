const express = require("express");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const {join} = require('path');
const morgan = require("morgan");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const docs = require('./docs');
const todoRouter = require('./routes/todos');

const adapter = new FileSync(join(__dirname,'..','db.json'));
const db = low(adapter);
db.defaults({ todos:[] }).write();    
const app = express();
const PORT = process.env.PORT || 4000;

// app configs.
app.db = db;
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(morgan("dev"));
app.use(cors());
app.use('/todos',todoRouter);
app.use('/swagger',swaggerUI.serve,swaggerUI.setup(docs));
//app.use('/api-docs',docs);
app.get('/api-docs.json', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(docs);
});



//app.get('/api-docs.json', function(req, res) {
//    res.setHeader('Content-Type', 'application/json');
//    res.send(documentation.swaggerSpecs);
//  });
  

//initialize the app.
async function initialize(){    
    app.listen(PORT);
};

initialize()
    .finally(
        () => console.log(`app started on port:${PORT}`)
    );