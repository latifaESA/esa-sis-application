const { getAll } = require("./queries");

const DataSettings = async( connection , table)=>{

    
    const exist = await getAll(connection , table )
      if(exist){
        return exist.rows
      }
}
export default DataSettings;