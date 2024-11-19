const WebSocket = require('ws');

// Configura a porta do servidor WebSocket
const PORT = process.env.WS_PORT || 8000;

// Cria um servidor WebSocket na porta especificada
const wss = new WebSocket.Server({ port: PORT });

console.log(`Servidor WebSocket rodando na porta ${PORT}`);

// Evento de conexão
wss.on('connection', (ws, req) => {
    const clientAddress = req.socket.remoteAddress;
    console.log(`Novo cliente conectado: ${clientAddress}`);
    console.log(`Clientes conectados: ${wss.clients.size}`);

    // Envia mensagem de boas-vindas ao cliente conectado
    ws.send(JSON.stringify({ type: 'welcome', message: 'Bem-vindo ao servidor WebSocket!' }));

    // Evento de recebimento de mensagem
    ws.on('message', (message) => {
        try {
            console.log(`Mensagem recebida de ${clientAddress}: ${message}`);

            // Valida se a mensagem é JSON
            const parsedMessage = JSON.parse(message);

            // Envia a mensagem de volta para todos os clientes conectados (broadcast)
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(parsedMessage));
                }
            });
        } catch (error) {
            console.error('Erro ao processar mensagem:', error.message);
            ws.send(JSON.stringify({ type: 'error', message: 'Mensagem inválida' }));
        }
    });

    // Evento de fechamento da conexão
    ws.on('close', () => {
        console.log(`Cliente desconectado: ${clientAddress}`);
        console.log(`Clientes conectados: ${wss.clients.size}`);
    });

    // Tratamento de erros na conexão
    ws.on('error', (error) => {
        console.error(`Erro no cliente ${clientAddress}:`, error.message);
    });
});
