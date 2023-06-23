const { getExistCourse } = require("../../controller/queries");

const courseExist = async( connection ,course_id , teacher_id ,major_id)=>{

    
    const exist = await getExistCourse(connection , course_id , teacher_id ,major_id)
    console.log('exist' , exist)
    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default courseExist;