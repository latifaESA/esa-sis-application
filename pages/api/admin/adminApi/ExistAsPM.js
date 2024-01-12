const { getExistASPM } = require("../../controller/queries");

const AsPMExist = async( connection , pm_ass_email , major_id)=>{

    
    const exist = await getExistASPM(connection , pm_ass_email , major_id)

    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default AsPMExist;