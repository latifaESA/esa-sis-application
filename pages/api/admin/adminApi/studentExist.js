const {   studentExist } = require("../../controller/queries");

const StudentExist = async( connection , Student_email,major_id)=>{

    
    const exist = await studentExist(connection ,Student_email ,major_id )
    // console.log('exist' , exist)
    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default StudentExist;