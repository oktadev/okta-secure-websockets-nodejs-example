const socket = io.connect(window.location.origin);

function start(jwt) {

    socket.on('connect', () => {
        socket
            .emit('authenticate', { token: jwt }) //send the jwt
            .on('authenticated', () => {

                socket.on("user entered", (user) => {
                    $("#chat-table").append(
                        '<tr class="bg-info"><td colspan=2>' + user + ' has entered the chat room. </td></tr>'
                    );

                    var li = '<li class="list-group-item"> ' + user + ' </li>';
                    $('#users-list').append(li);

                });

                socket.on("user exited", (user) => {
                    $("#chat-table").append(
                        '<tr class="bg-warning"><td colspan=2>' + user + ' has left the chat room. </td></tr>'
                    );

                    $('#users-list > li:contains("' + user + '")')[0].remove();
                });

                socket.on("message received", (user, message) => {
                    $("#chat-table").append(
                        '<tr><td style="width:20%">' + user + "</td><td>" + message + "</td></tr>"
                    );
                });

                $("#chat-button").on("click", function () {
                    var message = $("#chat-message").val();
                    socket.emit("message sent", message);
                    $("#chat-message").val("");
                })

                window.onunload = window.onbeforeunload = () => {                  
                    socket.close();
                  };

                socket.emit('entered');
            })
            .on('unauthorized', (msg) => {
                console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
                throw new Error(msg.data.type);
            })
    })
}
