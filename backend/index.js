import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { config } from 'dotenv';
import connectDB from './config/dbConnection.js';
import RegisterationRoutes from './Routes/Registerationroutes.js';
import LeadsRoutes from './Routes/LeadsRoutes.js';
import { validateUser } from './Middlewares/validateUser.js';

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/files', express.static('./uploads'))
app.use('/leads', express.static('./leads'))
app.use(express.json());
app.use(morgan('dev'))
config();

app.use(validateUser)
app.use('/api/register', RegisterationRoutes)
app.use('/api/leads', LeadsRoutes)

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server Connected'
    })
})
const PORT = process.env.PORT || 3001;

(async () => {
    connectDB().then(()=>app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
})()
