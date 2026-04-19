import { useState } from 'react';

export interface Source {
  doc_name: string;
  page?: number;
  score: number;
  text: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Abortcontroller state isn't strictly necessary for SSE but is good practice.
  
  const sendMessage = async (question: string) => {
    // 1. Add user message
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: question };
    
    // 2. Add empty assistant message that will be populated
    const assistantMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, userMessage, { id: assistantMessageId, role: 'assistant', content: '' }]);
    setIsStreaming(true);

    console.log(`[Chat] Sending query request: "${question}"`);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/query/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        console.error("[Chat] Stream error response:", response.statusText);
        throw new Error(`Error: ${response.statusText}`);
      }

      console.log("[Chat] Connected to stream. Awaiting tokens...");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      
      let currentContent = '';
      let currentSources: Source[] = [];
      let buffer = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Normalize carriage returns so splitting works across all OS/servers
        buffer = buffer.replace(/\r\n/g, '\n');
        
        // Split by double newline to get complete SSE events
        const events = buffer.split('\n\n');
        
        // Keep the last incomplete event in the buffer
        buffer = events.pop() || '';
        
        for (const eventStr of events) {
          if (!eventStr.trim()) continue;
          
          let eventType = 'message';
          let dataStr = '';
          
          const lines = eventStr.split('\n');
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.substring(7).trim();
            } else if (line.startsWith('data: ')) {
              dataStr += line.substring(6);
            }
          }
          
          if (dataStr === '[DONE]') {
            console.log("[Chat] Stream complete indicator received.");
            setIsStreaming(false);
            break;
          }
          
          if (eventType === 'sources') {
            console.log("[Chat] Received sources array:", dataStr);
            try {
              currentSources = JSON.parse(dataStr);
              // Update state with sources immediately
              setMessages(prev => prev.map(m => 
                m.id === assistantMessageId 
                  ? { ...m, sources: currentSources } 
                  : m
              ));
            } catch (e) {
              console.error("Failed to parse sources", e);
            }
          } else if (eventType === 'message') {
            currentContent += dataStr;
            // Update state with new content token
            setMessages(prev => prev.map(m => 
              m.id === assistantMessageId 
                ? { ...m, content: currentContent } 
                : m
            ));
          }
        }
      }
    } catch (err) {
      console.error("Streaming error:", err);
      // Update with error message
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { ...m, content: "Sorry, an error occurred while generating the answer." } 
          : m
      ));
    } finally {
      setIsStreaming(false);
    }
  };

  return { messages, sendMessage, isStreaming };
}
