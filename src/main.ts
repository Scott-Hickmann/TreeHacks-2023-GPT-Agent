import { Server, WebSocket, WebSocketServer } from 'ws';
import { chatWith } from './chat';
import { RequestData } from './types';
import fs from 'fs';
import https from 'https';

let wss: Server<WebSocket>;
if (process.env.NODE_ENV !== 'production') {
  wss = new WebSocketServer({ port: 8080 });
} else {
  const server = https.createServer({
    cert: fs.readFileSync(
      '/etc/letsencrypt/live/treehacks.stanfordmoonshot.club/fullchain.pem'
    ),
    key: fs.readFileSync(
      '/etc/letsencrypt/live/treehacks.stanfordmoonshot.club/privkey.pem'
    )
  });
  server.listen(443);
  wss = new WebSocketServer({ server });
}

wss.on('connection', (ws) => {
  ws.on('error', console.error);

  ws.on('message', async (data) => {
    try {
      data = JSON.parse(data.toString());
    } catch (error) {
      console.error(error);
      ws.close();
      return;
    }
    const parsed = RequestData.safeParse(data);
    if (parsed.success) {
      const { data } = parsed;
      console.log('Running agent on', data);
      const response = await chatWith(
        data.articleId,
        data.input,
        (partialResponse) => {
          ws.send(JSON.stringify({ type: 'data', data: partialResponse }));
        },
        data.info
      );
      ws.send(
        JSON.stringify({
          type: 'info',
          data: {
            conversationId: response.conversationId,
            parentMessageId: response.parentMessageId
          }
        })
      );
    } else {
      console.error(parsed.error);
    }
  });
});
