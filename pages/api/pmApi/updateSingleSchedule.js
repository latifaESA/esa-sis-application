const { connect , disconnect} = require("../../../utilities/db");
const { updateSchedule } = require("../controller/queries");

async function handler(req, res) {
  try {
    const connection = await connect();
    const { tmpscheduleID, classID, day, fromTime, toTime, room_id, pm_id , is_online } =
      req.body;
    const response = await updateSchedule(
      connection,
      classID,
      day,
      fromTime,
      toTime,
      room_id,
      pm_id,
      tmpscheduleID,
      is_online
    );
   
  
    await disconnect(connection)
    // console.log(response)

    if (response.rowCount > 0) {
      return res.status(201).json({
        success: true,
        code: 201,
        message: "Single Schedule updated successfully",
      });
    }else{
      return res.status(400).json({
        success: true,
        code: 400,
        message: "Single Schedule did not updated successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
}
export default handler;
