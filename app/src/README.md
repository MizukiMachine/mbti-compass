# MBTI Shadow Friend - Source

## Project Structure

```
src/
  components/
    VoiceInputButton.tsx     # Voice input (Web Speech API)
  data/
    mbti-characters.ts       # 16 MBTI character definitions with shadow functions
    mbti-questions.ts        # 20 diagnosis questions
  hooks/
    useSpeechRecognition.ts  # Speech recognition hook (Web Speech API)
  lib/
    jwt-auth.ts              # JWT utilities for WebSocket auth
  services/
    conversation-engine.ts   # Client-side conversation engine (HTTP → /api/chat)
    websocket-server.ts      # WebSocket server for real-time streaming
  types/
    websocket.ts             # WebSocket type definitions
```

## API Endpoints

- `POST /api/chat` - Chat with MBTI character (OpenAI)
- `GET /api/conversations/[id]/stream` - WebSocket connection info

## Running Tests

```bash
npm test
npm run test:coverage
```
