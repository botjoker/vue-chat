const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: 9000 });

wsServer.on('connection', onConnect);

function onConnect(wsClient) {
    console.log('Новый пользователь');

    const messages = [
        "Пожалуйста, повторите попытку", 
        "Сделайте глубокий вдох и продолжайте надеяться", 
        "Мы работаем над этой проблемой", 
        "Извините, абонент разговаривает по другой линии", 
        ];
    

    wsClient.on('close', function() {
        console.log('Пользователь отключился');
    });

    wsClient.on('message', function(message) {
        console.log(message);
        try {
            const jsonMessage = JSON.parse(message);
            if(jsonMessage.hasOwnProperty('name') && jsonMessage.hasOwnProperty('name')) {
                let random = Math.floor(Math.random() * messages.length);
                wsClient.send(jsonMessage.name + ', ' +messages[random]);
            } else {
                console.log('Неизвестная команда')
            }
        } catch (error) {
            console.log('Ошибка', error);
        }
    });
}

console.log('Сервер запущен на 9000 порту');