import { appConfig } from '@/configs/app';

export interface StreamCallbacks {
    onStart?: () => void;
    onChunk?: (chunk: string, fullText: string, displayText: string) => void;
    onComplete?: (fullText: string, displayText: string, messageId?: number) => void;
    onError?: (error: Error) => void;
}

/**
 * Loại bỏ tool calls từ text để hiển thị
 */
function filterToolCalls(text: string): string {
    // Remove tool_start...tool_end blocks
    let filtered = text.replace(/tool_start[\s\S]*?tool_end/g, '');
    // Remove incomplete tool markers
    filtered = filtered.replace(/tool_start[\s\S]*$/g, ''); // Remove từ tool_start đến hết
    // Clean up
    return filtered.trim();
}

/**
 * Kiểm tra xem text có đang trong tool call block không
 */
function isInToolBlock(text: string): boolean {
    const lastToolStart = text.lastIndexOf('tool_start');
    const lastToolEnd = text.lastIndexOf('tool_end');
    return lastToolStart > lastToolEnd;
}

/**
 * Stream message từ AI qua SSE
 */
export async function streamMessage(
    conversationId: number,
    content: string,
    callbacks: StreamCallbacks
): Promise<void> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
        callbacks.onError?.(new Error('Chưa đăng nhập'));
        return;
    }

    const url = `${appConfig.api.baseUrl}/Chat/conversations/${conversationId}/messages/stream`;

    try {
        callbacks.onStart?.();

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content }),
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
            throw new Error('Response body is not readable');
        }

        const decoder = new TextDecoder();
        let fullText = '';
        let messageId: number | undefined;

        while (true) {
            const { done, value } = await reader.read();

            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);

                    if (data === '[DONE]') {
                        const displayText = filterToolCalls(fullText);
                        callbacks.onComplete?.(fullText, displayText, messageId);
                        return;
                    }

                    try {
                        const parsed = JSON.parse(data);

                        if (parsed.type === 'chunk' && parsed.content) {
                            fullText += parsed.content;

                            // Chỉ gọi callback nếu không đang trong tool block
                            if (!isInToolBlock(fullText)) {
                                const displayText = filterToolCalls(fullText);
                                callbacks.onChunk?.(parsed.content, fullText, displayText);
                            }
                        } else if (parsed.type === 'complete') {
                            messageId = parsed.messageId;
                            const displayText = filterToolCalls(fullText);
                            callbacks.onComplete?.(fullText, displayText, messageId);
                            return;
                        } else if (parsed.type === 'error') {
                            throw new Error(parsed.message || 'Stream error');
                        }
                    } catch {
                        // Nếu không phải JSON, có thể là text chunk thuần
                        if (data.trim()) {
                            fullText += data;
                            if (!isInToolBlock(fullText)) {
                                const displayText = filterToolCalls(fullText);
                                callbacks.onChunk?.(data, fullText, displayText);
                            }
                        }
                    }
                }
            }
        }

        const displayText = filterToolCalls(fullText);
        callbacks.onComplete?.(fullText, displayText, messageId);
    } catch (error) {
        callbacks.onError?.(error instanceof Error ? error : new Error(String(error)));
    }
}

/**
 * Fallback: Gọi API thường nếu streaming không khả dụng
 * Simulate streaming bằng cách hiển thị từng ký tự
 */
export async function simulateStream(
    text: string,
    callbacks: StreamCallbacks,
    delayMs: number = 20
): Promise<void> {
    callbacks.onStart?.();

    let fullText = '';

    for (const char of text) {
        fullText += char;
        const displayText = filterToolCalls(fullText);
        callbacks.onChunk?.(char, fullText, displayText);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    const displayText = filterToolCalls(fullText);
    callbacks.onComplete?.(fullText, displayText);
}
