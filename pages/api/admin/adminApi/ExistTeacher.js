const { getExistTeacher } = require("../../controller/queries");

const teacherExist = async( connection ,teacher_firstname, teacher_lastname, teacher_mail)=>{

    
    const exist = await getExistTeacher(connection , teacher_firstname, teacher_lastname, teacher_mail)
    console.log('exist' , exist)
    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default teacherExist;