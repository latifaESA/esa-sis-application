const { connect , disconnect} = require("../../../utilities/db");
const { updateSchedule } = require("../controller/queries");

async function handler(req, res) {
  try {
    const connection = await connect();
    const { tmpscheduleID, classID, day, fromTime, toTime, room_id, pm_id } =
      req.body;

    // console.log(tmpscheduleID, classID, day, fromTime, toTime, room_id, pm_id)
    const response = await updateSchedule(
      connection,
      classID,
      day,
      fromTime,
      toTime,
      room_id,
      pm_id,
      tmpscheduleID
    );
    await disconnect(connection)
    // console.log(response)

    if (response.rowCount > 0) {
      return res.status(201).json({
        success: true,
        code: 201,
        message: "Single Schedule updated successfully",
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
module.exports = handler;
