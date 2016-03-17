import express from 'express'; // need to server files and handle requests
import bodyParser from 'body-parser'; // handle json structure
import cors from 'cors';
import request from 'ajax-request';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// host client files as static files
app.use(express.static(__dirname + '/client'));

app.listen(3000, ()=>{
  console.log("listening on port 3000")
});

export default app;
