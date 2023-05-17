
// const axios = require('axios')
// // import https from 'https';

// async function handler(req, res) {
//     try {
//         const credentialsXml = '<CREDENTIALS><USERNAME>API</USERNAME><PASSWORD>123</PASSWORD></CREDENTIALS>';

//         let token = await axios.post('http://192.168.10.36:8075/login', credentialsXml, {
//             headers: {
//               'Content-Type': 'application/xml'
//             }
//           })
//           console.log(token)
//         if(token){
//             // recieve financial data
//             let {data} = await axios.get(`http://192.168.10.36:8075/statement?token=${token.data}&auxiliary=ST00000001&curr=EUR&fromdate=01/01/2023`);

//             console.log(data)
//             res.status('200').send(data)

//         }else{
//             console.log({message: "No token recieved."})
//             return res.status('401').send({message: "No token recieved."})
//         }
        
//     } catch (error) {
//         console.log('the error is: ', error)
//         return res.status('401').send(error)
//         // return error;
//     }

// }
// // export default handler;
// module.exports = handler;



const axios = require('axios')
// import https from 'https';

async function handler(req, res) {
    try {
        const credentialsXml = '<CREDENTIALS><USERNAME>API</USERNAME><PASSWORD>123</PASSWORD></CREDENTIALS>';

        let token = await axios.post('http://192.168.10.36:8075/login', credentialsXml, {
            headers: {
              'Content-Type': 'application/xml'
            }
          })
          console.log(token.data)
        //   res.status('200').send(token)
        if(token){
            // recieve financial data
            let total = await axios.get(`http://192.168.10.36:8075/statement?token=${token.data}&auxiliary=ST00000001&curr=EUR&fromdate=01/01/2023`);

            if(total){
            console.log('Statement=',total.data)
            // res.status('200').send(total.data)

            let balance = await axios.get(`http://192.168.10.36:8075/EPL?cmd=PIMS(AUX,BAL,ST00000001)&token=${token.data}`);
            if(balance){
                console.log('Balance=',balance.data)
                res.status('200').send(`Balance= ${balance.data}`)
                
            }else{
                console.log({message: "No open account recieved"})
                res.status('401').send({message: "No open account recieved"})
            }

            let balance_of_bill = await axios.get(`http://192.168.10.36:8075/EPL?cmd=PIMS(AUX,BAL,ST00000001.BILL)&token=${token.data}`);
            if(balance_of_bill){
                console.log('Balance of Bill=',balance_of_bill.data)
                // res.status('200').send(`Balance of Bill= ${balance_of_bill.data}`)
            }else{
                console.log({message: "No open account recieved"})
                res.status('401').send({message: "No open account recieved"})
            }
            let balance_of_open = await axios.get(`http://192.168.10.36:8075/EPL?cmd=PIMS(AUX,BAL,ST00000001.OPEN)&token=${token.data}`);
            if(balance_of_open){
                console.log('Balance of OPEN=',balance_of_open.data)
                // res.status('200').send(`Balance of OPEN= ${balance_of_open.data}`)
                // return ;
            }else{
                console.log({message: "No open account recieved"})
                res.status('401').send({message: "No open account recieved"})
            }


            }else{
                console.log({message: "No data recieved"})
                res.status('401').send({message: "No data recieved"})
            }

        }else{
            console.log({message: "No token recieved."})
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