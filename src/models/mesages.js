const Sequelize = require('sequelize');
module.exports=function(sequelize,DataTypes){
    return sequelize.define('chat',
        {
        id:{
            type:Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        
        nombre:{
                type:Sequelize.STRING,
        },
        mensaje:{
            type:Sequelize.STRING,
        },
        fecha:{
            type:'TIMESTAMP',
            default: Sequelize.literal('CURRENT_TIMESTAMP')
        }
        
    },
    {
        timestamps: false,
        freezeTableName:true
    }
    );
}
