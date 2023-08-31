const { getExistTeacher } = require("../../controller/queries");

const teacherExist = async( connection , teacher_mail)=>{

    
    const exist = await getExistTeacher(connection , teacher_mail)

    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default teacherExist;