const express = require('express');
const http = require('http');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db/conn');
const { PORT, CLIENT_URL } = require('./config/env');
(async () => {
await connectDB();
const app = express();
const server = http.createServer(app);
const initSocket = require('./socket');
const io = initSocket(server, CLIENT_URL);
app.use(helmet());
app.use(cors({ origin: CLIENT_URL === '*' ? true : CLIENT_URL }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));
// Routes
app.use('/webhooks', require('./routes/webhook.routes')(io));
app.use('/api', require('./routes/api.routes')(io));
// Serve client build if deployed as a single app
const clientBuild = path.join(__dirname, '../../client/dist');
app.use(express.static(clientBuild));
app.get('*', (req, res) => res.sendFile(path.join(clientBuild,
'index.html')));
server.listen(PORT, () => console.log(` Server on :${PORT}`));
})();
