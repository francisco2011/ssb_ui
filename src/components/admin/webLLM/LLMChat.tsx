import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    MessageModel
} from "@chatscope/chat-ui-kit-react";
import { useContext, useState } from "react";
import { WebLLMContext } from "./WebLLMProvider";
import * as webllm from "@mlc-ai/web-llm";

export default function LLMChat() {

    const [messages, setMessages] = useState<MessageModel[]>([]);

    const llmContext = useContext(WebLLMContext)
    const engine: webllm.MLCEngine | null = llmContext?.engine ? llmContext.engine as webllm.MLCEngine : null

    //message?:string;
    //sentTime?:string;
    //sender?:string;
    //direction: MessageDirection;
    //position: "single" | "first" | "normal" | "last" | 0 |  1 | 2 | 3;
    //type?: MessageType;
    //payload?: MessagePayload;
    function onNewMessage(innerHtml: string, textContent: string, innerText: string, nodes: NodeList) {

        const newMessage = {
            message: textContent,
            sender: 'user',
            direction: 'outgoing',
            position: 'last'
        }

        messages.push(newMessage)

        setMessages([...messages])

        functionCallLLM(textContent)
    };

    async function functionCallLLM(message: string) {

        if (!llmContext.loading && engine) {
            const completion = await engine.chat.completions.create({
                stream: false,
                messages: [{ role: 'user', content: message }],
            });

            const _messages = completion.choices.map(c => c.message.content)
            addLLMessages(_messages)
        }
    }

    function addLLMessages(_messages: string[]) {

        const allNewMessages = _messages.map(c => {
            return {
                message: c,
                sender: 'llm',
                direction: 'incoming',
                position: 'last'
            }
        })

        setMessages([...messages, ...allNewMessages])
    }


    return (
        <div className="w-[30rem] h-[30rem]">
            <ChatContainer>
                <MessageList>
                    {messages &&
                        messages.map((message) => {
                            return message.sender === "user" ? (
                                <Message
                                    model={message}
                                />
                            ) : (
                                <div style={{ justifyContent: "flex-end", display: "flex" }}>
                                    <Message
                                        model={message}
                                    />
                                </div>
                            );
                        })}
                </MessageList>
                <MessageInput placeholder="Type message here" onSend={onNewMessage} />
            </ChatContainer>
        </div>

    );
}