const { env } = require('process');
async function handler (req, res){
    try{
        const ONLINE_SIS_SECRET_KEY = env.ONLINE_SIS_SECRET_KEY;
    // for dev mode should be localhost:3001
    const ONLINE_URL = env.ONLINE_APPLICATION_URL;
    // Allow integration with the online application
    // during SIS development the value should be false until the integration is done
    // because we plan to deploy progresvly the SIS application in the production server
    const allowIntegration = env.ALLOW_INTEGRATION;

    res.setHeader('Access-Control-Allow-Origin', ONLINE_URL);
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Authorization', ONLINE_SIS_SECRET_KEY);
      console.log('allowIntegration' , allowIntegration)
    
    console.log('req.method' , req.method)
    console.log('req.url' , req.url)
    if (
      allowIntegration &&
      req.method === 'POST' &&
      req.url === '/api/external_applications/recieve_data'
    ) {
      // Verify authorization token
      const authHeader = req.headers['authorization'];
      if (!authHeader || authHeader !== ONLINE_SIS_SECRET_KEY) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Unauthorized');
        return;
      }
        console.log('request body' , req.body)
        return res.status(201).json({
            code:200,
            message:'welcome to recive_data.js'
        })
    }else{
        return res.status(200).json({
            code:200,
            message:'welcome to recive_data.js else'
        })
    }
    }catch(error){
        return res.status(500).json({
            code:500,
            message:error.message
        })
    }
}
export default handler;