const { getAllCourses } = require("../../controller/queries");

const CourseExist = async( connection , course_id , major_id)=>{

    
    const exist = await getAllCourses(connection  , course_id ,major_id)
    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default CourseExist;