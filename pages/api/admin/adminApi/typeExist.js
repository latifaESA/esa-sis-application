const { existType } = require("../../controller/queries");

const typeExist = async( connection , value)=>{

    
    const exist = await existType(connection , value)

    if(exist.rowCount === 0){
        return false
    }else{
        return true
    }
}
export default typeExist;