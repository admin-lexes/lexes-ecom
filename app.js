import dotenv from 'dotenv'
dotenv.config()
import  express from 'express'
import connectDB from './db/connection.js'
import web from './routes/web.js'



const app = express();

const port = process.env.PORT 


const DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost:27017";

connectDB(DATABASE_URL)

//  app.use(express.urlencoded({extended:false}));

// // json parser
 app.use(express.json());

// Load Routes
 app.use('/api', web);



app.listen(port, ()=>{
    console.log(`listing  at server http://localhost:${port}`)
})