const { existMajor } = require("../../controller/queries");

const majorExist = async( connection , teacher_mail)=>{

    
    const exist = await existMajor(connection , teacher_mail)

    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default majorExist;