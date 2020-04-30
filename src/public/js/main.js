$(function(){

    // Inicialización del Socket
    const socket=io();

    //variables
    const message =$('#chat-message');
    const chat =$('#chat');
    const nickname =$('#chat-message1');

    $('#message-box').submit(function(ev){
        ev.preventDefault();
        socket.emit('mensaje-cliente', message.val(),data=>{
            chat.append(`<p class="error">${data}</p>`)
        });
        message.val("");
        
    });

    $('#login').submit(function(ev){
        ev.preventDefault();
        socket.emit('new user', nickname.val(), data=>{
            if(data)
            {
                $("#message-box").removeClass("oculta");
                $("#message-box").addClass("visible2");
                $("#users").removeClass("oculta");
                $("#users").addClass("visible2");
                $("#login").removeClass("visible2");
                $("#login").addClass("oculta");
                $('#nick').html('Bienvenido '+nickname.val());

                message.focus();
            }
            else
            {
                $('#error').html('Usuario en uso. Por favor, inténtelo con otro.');
            }
        } );

        //socket.emit('mensaje-cliente', message.val());
        
    });

    socket.on('privado', data=>{
        chat.append(`<p class="privado"><strong>${data.nick}:</strong> ${data.msg}</p>`)
    })

    socket.on('load_old_msg', msgs=>{
        for(let i=0;i<msgs.length;i++)
        {
            chat.append('<p class="privado"><strong>'+msgs[i].nombre+ ": </strong>"+ msgs[i].mensaje + "</p>")
        }
    });

    socket.on('mensaje-servidor',function(data){
        chat.append('<p><strong>'+data.nick+ ": </strong>"+ data.msg + "</p>")
    });

    socket.on('usernames', function(data){
        
        let html='<h2>Usuarios</h2><br/>';
        for(let i=0;i<data.length;i++)
        {
            html+='<p><strong>'+data[i]+'</strong></p><br/>';
        }
       
        
        document.getElementById('usernames').innerHTML=html;
    })
});