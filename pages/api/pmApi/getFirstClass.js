const { connect, disconnect } = require("../../../utilities/db");
const { getClassStart } = require('../controller/queries')

async function handler(req, res) {

    try {
        const connection = await connect();
        const {

            promotion

        } = req.body;
        const response = await getClassStart(connection,

            promotion
        );
        console.log('response' , response)
       
        await disconnect(connection);
        if (response.rows.length === 0) {
            return res.status(404).json({
                success: false,
                code: 404,
                message: "schedule not exist Not found"
            })
        } else {
            return res.status(200).json({
                success: true,
                code: 200,
                data: response.rows
            })

        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            code: 500,
            message: error.message
        })
    }
}
// module.exports = handler;
export default handler;