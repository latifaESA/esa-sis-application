const { connect, disconnect } = require("../../../utilities/db");
const { updateZoomInfo } = require('../controller/queries');


async function handler(req, res) {

    try {
        const connection = await connect();
        const {
            tmpscheduleIds, meetingIds, zoomUrls
        } = req.body;
   
            
            const response = await updateZoomInfo(connection,tmpscheduleIds, meetingIds, zoomUrls);
          

            await disconnect(connection)
            if (response.rowCount > 0) {
                return res.status(201).json({
                    success: true,
                    code: 201,
                    message: 'Schedule created successfully',
                })
            } else {
                return res.status(201).json({
                    success: true,
                    code: 400,
                    message: 'Error creating Schedule',
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