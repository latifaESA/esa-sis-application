const { ExistElective } = require("../../controller/queries");

const assignExistElective = async( connection ,course_id ,student_id)=>{

    
    const exist = await ExistElective(connection , course_id , student_id)
    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default assignExistElective;