const { connect, disconnect } = require("../../../utilities/db");

const { createBooking } = require("../controller/queries");
import moment from 'moment-timezone';
async function handler(req, res) {
  try {
    const connection = await connect();
    // const { bookingId , room , space ,bookingBy ,date , fromTime , toTime } = req.body;

    // await createBooking(connection,bookingId , room , space ,bookingBy ,date , fromTime , toTime);
    const { booking } = req.body
    for(let i = 0 ; i<= booking.length ; i++){
      if(booking[i] && booking[i].Id){
        const formattedDate = moment(booking[i].BookingDate).format('YYYY-MM-DDT00:00:00[Z]');

        await createBooking(
          connection,
          {
            bookingId :booking[i].Id,
             room: booking[i].Title , 
             space:  booking[i].Space ,
             bookingBy: booking[i].BookedBy,
             date:  formattedDate, 
             fromTime :booking[i].FromTime , 
             toTime:booking[i].ToTime

          }
          );

      }else{
        console.log("Invalid booking element:", booking[i]);
      }
      


    }

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
// module.exports = handler;
export default handler;