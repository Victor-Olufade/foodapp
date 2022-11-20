import express,{Request, Response} from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import userRouter from './routes/users';
import indexRouter from './routes/index';
import {db} from './config/index';
import adminRouter from './routes/admin'
import vendorRouter from './routes/vendor'

// sequelize connection
db.sync().then(()=>{
    console.log("db connected successfully");
}).catch(err=> console.log(err)
)
//{force:true} to erase database
//killall node
const app = express();
app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());

// app.get('/about', (req:Request, res:Response)=>{
//     res.status(200).json({
//         message: "Success",

//     })
// })

app.use('/user', userRouter)
app.use('/', indexRouter)
app.use('/admins', adminRouter)
app.use('/vendor', vendorRouter)

const port = 4000
app.listen(port, ()=>{
    console.log(`server running on port http://localhost:${port}`);
});


export default app;