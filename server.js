import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { SERVER } from './src/config/config.js';
import connectMongoDB from './src/database/mongoDBConnection.js';
import accessPointRoutes from './src/routes/accessPointRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import viewRoutes from './src/routes/viewRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// MongoDB bağlantısı
connectMongoDB();

// API route'ları
app.use('/api', accessPointRoutes);
app.use('/api', adminRoutes);

// View route'ları
app.use('/', viewRoutes);

// Sunucu
app.listen(SERVER.PORT, () => {
  console.log('API listening on ' + SERVER.PORT);
});
