const WebSocket = require('ws');

// Cria um servidor WebSocket na porta 8000
const wss = new WebSocket.Server({ port: 8000 });

// Evento de conexão
wss.on('connection', (ws) => {
    console.log('Novo cliente conectado');

    // Evento de recebimento de mensagem
    ws.on('message', (message) => {
        console.log(`Mensagem recebida: ${message}`);

        // Envia a mensagem de volta para todos os clientes conectados (broadcast)
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Evento de fechamento da conexão
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log('Servidor WebSocket rodando na porta 8000');
