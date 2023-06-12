const { getAttendanceByCTD } = require("../../controller/queries");

const attendanceExist = async( connection ,teacher_id , course_id , attendance_date)=>{

    
    const exist = await getAttendanceByCTD(connection ,teacher_id , course_id , attendance_date)
    
    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default attendanceExist;