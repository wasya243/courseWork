const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');
const errorHandler = require('./lib');

//---should-reside-within-env-variables-->
const PORT = 3000;
//--------------------------------------->

const swaggerSpec = require('./swagger');

const app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const router = express.Router();
routes.applyRoutes(router);
app.use('/api', router);

app.get('/swagger.json', (req, res) => {
   res.setHeader('Content--Type', 'application/json');
   res.send(swaggerSpec);
});

app.use(errorHandler.notFoundMiddleware);
app.use(errorHandler.errorMiddleware);


app.listen(PORT || 3000, () => {
    console.log(`App is listening on the port ${PORT || 3000}`)
});


