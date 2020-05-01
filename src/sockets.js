
module.exports = function(io,sequelize){

    let users={};
    const tabla_chat= sequelize.import("./models/mesages.js");
    tabla_chat.sync({force:false})
    
    
    io.on('connection', async function(socket){
        console.log('Nuevo Cliente conectado');
        
        //let messages = await tabla_chat.findAll({ attributes: ['nombre', 'mensaje'], offset:3, limit:4 })
        let messages = await tabla_chat.findAll({ attributes: [ 'nombre', 'mensaje'], order:[['id', 'DESC']], limit:10 })
        

        socket.on('new user', (data,cb)=>{
            if(data in users){
                cb(false)
            }
            else
            {
                socket.emit('load_old_msg', messages);
                cb(true)
                socket.nickname = data;
                users[socket.nickname]=socket;
                update_nicknames();
            }
        })

        socket.on("mensaje-cliente", async function(data,cb){

            var msg=data.trim();
            
            if(msg.substring(0,3)==="/p "){
                msg=msg.substring(3);
                
                const index = msg.indexOf(' ');
                if(index!=-1){
                    var name = msg.substring(0,index);
                    
                    var msg =msg.substring(index +1);
                 
                    if(name in users){
                        users[name].emit('privado',{
                            msg,
                            nick:socket.nickname
                        })
                    }
                    else
                    {
                        cb('Error: Por favor introduzca un Usuario válido !!')
                    }
                }
                else
                {
                    cb('Error: Please introduzca un mensaje !!')
                }
            }
            else{
                
                await tabla_chat.create({
                    nombre: socket.nickname,
                    mensaje: data
                })
                    
                
                

                io.sockets.emit('mensaje-servidor',{
                    msg: data,
                    nick: socket.nickname}
                );
            }
            
        })

       

        socket.on('disconnect', data=>{
            if(socket.nickname){
                delete users[socket.nickname]
                update_nicknames();
            }
            
        })

        function update_nicknames()
        {
            io.sockets.emit('usernames',Object.keys(users))
        }
    })

}