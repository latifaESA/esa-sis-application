
const axios = require('axios')
import https from 'https';

// import axios from "axios";

// const https = require('https');
// const fs = require('fs');

// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false, // disable client verification
//   cert: fs.readFileSync('./usercert.pem'),
//   key: fs.readFileSync('./key.pem'),
//   passphrase: 'YYY'
// });

async function handler(req, res) {
    // console.log('hello')
    try {
        // let data = await axios.get("https://survey.esa.edu.lb/BPI/PathwayService.svc/PWGetUserPreventAccess?pathway=140&userid=201705636");
        let {data} = await axios.get('https://survey.esa.edu.lb/BPI/PathwayService.svc/PWBlueTasks?pathway=140&userid=201705636&SubjectIDs=2022_EMBA-CC-08_01,2022_EMBA-S-04_01,2022_EMBA-EC-03_02,2022_EMBA-EC-09_01', {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
          // requestCert: false,
          // keepAlive: true 
        })
        })
console.log(data)
return res.send(data)
        
    } catch (error) {
        console.log('the error is: ', error)
        return res.status('401').send(error)
        // return error;
        
    }

}
// export default handler;
module.exports = handler;