const { getExistPM } = require("../../controller/queries");

const PMExist = async( connection , pm_email , major_id)=>{

    
    const exist = await getExistPM(connection , pm_email , major_id)

    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default PMExist;