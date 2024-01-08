const express           = require("express");
const axios             = require('axios');
const bodyParser        = require('body-parser');
const config            = require('./config.json');
const app               = express();
const IFTTT_EVENT       = process.env.IFTTT_EVENT;
const IFTTT_WEBHOOK_KEY = process.env.IFTTT_WEBHOOK_KEY;
const TARGETSERVICE     = `https://maker.ifttt.com/trigger/${IFTTT_EVENT}/json/with/key/${IFTTT_WEBHOOK_KEY}`;
const PORT              = 8081;

let routeMappings = {};

const loadConfig = () => {
  try {
      const configFile = fs.readFileSync(CONFIG_FILE, 'utf8');
      routeMappings = JSON.parse(configFile);
  } catch (error) {
      console.error('Error reading config file:', error);
      routeMappings = {}; // Reset to empty if there's an error
  }
};


app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', async(req, res) =>{
    try {
      console.debug(`target service: ${TARGETSERVICE}`)
      const response = await axios.post(`https://maker.ifttt.com/trigger/${IFTTT_EVENT}/json/with/key/${IFTTT_WEBHOOK_KEY}`, req.body);
      res.status(response.status).send(response.body);
    } catch (error) {
      console.error('error forwarding the data');
      res.status(500).send('failed to forward data');
    }
  }
);

async function handleForward(req, res, forwardUrl) {
  try {
    console.debug(`target service: ${TARGETSERVICE}`)
    const response = await axios.post(`https://maker.ifttt.com/trigger/${IFTTT_EVENT}/json/with/key/${IFTTT_WEBHOOK_KEY}`, req.body);
    res.status(response.status).send(response.body);
  } catch (error) {
    console.error('error forwarding the data');
    res.status(500).send('failed to forward data');
  }
}

for (const [path, forwardUrl] of Object.entries(config)) {
  app.post(`/${path}`,(req, res) => handleForward(req,res,forwardUrl));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});