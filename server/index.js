import './utils/configEnv.js'
import './utils/dbConfig.js'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParse from 'body-parser'
// import OxdayLinkRoute from './routes/0xdayLinkRoute.js' 
import { fileURLToPath } from 'url';
import path from 'path'
import authenticateToken from './middlewares/protectAdminRoute.js'
import authRouter from './routes/authRouter.js'
import adminRouter from './routes/adminRouter.js'
import userRouter from './routes/userRouter.js'

// Create __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();
app.use(cors());
app.use(bodyParse.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3001

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

// Serve static files from the dp-uploads directory
const dpUploadsPath = path.join(__dirname, 'dp-uploads');
app.use('/dp-uploads', express.static(dpUploadsPath));

app.use('/api/auth', authRouter)
app.use('/api/admin', adminRouter) 
app.use('/api/user', userRouter)

app.use('/admin-access', authenticateToken)

app.use((err, req, res, next) => {
    console.error(err.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})

app.get("/", (req,res)=>{
    res.send("Hello from server")
})