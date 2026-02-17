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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck, faItalic } from "@fortawesome/free-solid-svg-icons";

export type PromptOption = {
    value: string,
    option: string
}

export type props = {
    preBuiltPrompts: PromptOption[],
    initialText: string,
    onMessageSelected: (message: string) => void
}

export default function LLMChat({ preBuiltPrompts, initialText, onMessageSelected }: props) {

    const [messages, setMessages] = useState<MessageModel[]>([]);
    const [userInput, setUserInput] = useState<string>(initialText ?? '');
    const [selectedPrompt, setSelectedPromt] = useState('none');

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
        setUserInput('')
    };

    function onNewUserInputMessage(innerHtml: string, textContent: string, innerText: string, nodes: NodeList) {

        setUserInput(textContent)
    };

    async function functionCallLLM(message: string) {

        if (llmContext && !llmContext.loading && engine) {
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
                position: 'last',
                // type: 'html'
            }
        })

        setMessages([...messages, ...allNewMessages])
    }

    function addPrompt(event: React.ChangeEvent<HTMLSelectElement>) {

        let val = event.target.value
        setSelectedPromt(val);

        if (val != "none") {

            val = "<p style='font-weight: bold'>" + val + "</p>"
            val = val + userInput

            setUserInput(val)
            if(userInput) onNewMessage('', val, '', undefined) 
        }
    };

    return (
        <div className="w-[40rem] h-[40rem]">
            <select defaultValue="none" id="car-select" value={selectedPrompt} onChange={addPrompt}>
                <option value="none">"None"</option>
                {preBuiltPrompts.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.option}
                    </option>
                ))}
            </select>
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
                                    <Message model={message}>

                                        <Message.CustomContent>
                                            {message.message}

                                            <div className="flex justify-end">
                                                <button onClick={() => onMessageSelected(message.message??'')}>
                                                    <FontAwesomeIcon icon={faCheck} className="text-green-600 w-6 h-6" />
                                                </button>
                                            </div>


                                        </Message.CustomContent>

                                    </Message>
                                </div>
                            );
                        })}
                </MessageList>
                <MessageInput value={userInput} onChange={onNewUserInputMessage} placeholder="Type message here" onSend={onNewMessage} />
            </ChatContainer>
        </div >

    );
}