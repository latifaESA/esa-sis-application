
const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
    try {
        let {data} = await axios.post('login',{
          // data for login  
        })
        if(data.token){
            // recieve financial data
            let {data} = await axios.post('financial',{
                // send the token here or in the url
            });

            res.status('200').send(data)

        }else{
            return res.status('401').send({message: "No token recieved."})
        }
        
    } catch (error) {
        console.log('the error is: ', error)
        return res.status('401').send(error)
        // return error;
    }

}
// export default handler;
module.exports = handler;