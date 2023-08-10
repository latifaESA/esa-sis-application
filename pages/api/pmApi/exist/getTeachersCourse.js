const { getTeachersCourses } = require("../../controller/queries");

const assignedExist = async (connection, teacher_id, course_id, major_id) => {
  const exist = await getTeachersCourses(
    connection,
    teacher_id,
    course_id,
    major_id
  );
  // console.log('existt' , exist)
  if (exist.rowCount === 0) {
    return false;
  } else {
    return true;
  }
};
export default assignedExist;
