import dotenv from 'dotenv'
dotenv.config()
import  express from 'express'
import connectDB from './db/connection.js'
import web from './routes/web.js'
import product from './routes/product.js'



const app = express();

const port = process.env.PORT 


const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017";

connectDB(DATABASE_URL);

//  app.use(express.urlencoded({extended:false}));

// // json parser
 app.use(express.json());

// Load Routes
 app.use('/api', web);
 app.use('/api', product);



app.listen(port, ()=>{
    console.log(`mongodb server:${DATABASE_URL} , listing  at server http://localhost:${port}`)
})