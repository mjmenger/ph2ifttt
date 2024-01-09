const express           = require("express");
const axios             = require('axios');
const bodyParser        = require('body-parser');
const config            = require('./config.json');
const app               = express();
const IFTTT_EVENT       = process.env.IFTTT_EVENT || 'defaultEvent';
const IFTTT_WEBHOOK_KEY = process.env.IFTTT_WEBHOOK_KEY || 'defaultKey';
const TARGETSERVICE     = `https://maker.ifttt.com/trigger/${IFTTT_EVENT}/json/with/key/${IFTTT_WEBHOOK_KEY}`;
const HOST_NAME         = process.env.HOSTNAME || 'undefinedhostname';
const PORT              = 8081;


app.use(bodyParser.urlencoded({ extended: true }));

async function handleDynamicPost(req, res, forwardUrl) {
  try {
    console.debug(`target service: ${forwardUrl}`)
    let payload = req.body;
    payload.phhost = HOST_NAME;
    const response = await axios.post(forwardUrl, payload);
    res.status(response.status).send(response.body);
  } catch (error) {
    console.error('error forwarding the data');
    res.status(500).send('failed to forward data');
  }
}


for (const[eventpath,eventkey] of Object.entries(config)) {
  let forwardUrl = `https://maker.ifttt.com/trigger/${eventkey}/json/with/key/${IFTTT_WEBHOOK_KEY}`;
  console.log(`forwarding ${eventpath} requests to ${forwardUrl}`);
  app.post(eventpath, (req, res) => handleDynamicPost(req, res, forwardUrl));
}

app.listen(PORT, () => {
  console.log(`Server running on ${HOST_NAME} port ${PORT}`);
});