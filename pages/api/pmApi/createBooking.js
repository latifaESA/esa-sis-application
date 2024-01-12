const { connect, disconnect } = require("../../../utilities/db");

const { createBooking } = require("../controller/queries");

async function handler(req, res) {
  try {
    const connection = await connect();
    const { bookingId , room , space ,bookingBy ,date , fromTime , toTime } = req.body;

    await createBooking(connection,bookingId , room , space ,bookingBy ,date , fromTime , toTime);

    await disconnect(connection);

    return res.status(201).json({
      success: true,
      code: 201,
     
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: 500,
      message: error.message,
    });
  }
}
module.exports = handler;
