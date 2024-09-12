import express from 'express';
import routes from './routes/index.js';
import errHandler from './middlewares/errHandle.js';
import db from './databases/connect.js';

const app = express();
const port = 3000;

db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use('/api/', routes);

// Middleware error handlers
app.use(errHandler);

app.listen(port, () => {
    console.log('listening on port ' + port);
});
