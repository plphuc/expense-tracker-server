import dotenv from 'dotenv';
import app from './api/index.js'

dotenv.config()

app.listen(process.env.port || 4000, () => console.log("Server started ", app.address().port));