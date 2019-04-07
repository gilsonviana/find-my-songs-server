const express    = require('express'),
      bodyParser = require('body-parser');

const app = express();

/**
 * parse application/json
 */ 
app.use(bodyParser.json());



const PORT = 3000 || process.env.PORT;
app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));