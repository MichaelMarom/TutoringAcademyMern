// Contoso server to create a new user and thread.

import { GroupCallLocator } from '@azure/communication-calling';
import { ChatClient, ChatParticipant } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { v1 as createGUID } from 'uuid';

const createNewChatThread = async (chatClient, participants) => {
    const chatThreadResponse = await chatClient.createChatThread(
        { topic: 'Meeting with a friendly bot' },
        { participants }
    );
    if (chatThreadResponse.invalidParticipants && chatThreadResponse.invalidParticipants.length > 0) {
        throw 'Server could not add participants to the chat thread';
    }

    const chatThread = chatThreadResponse.chatThread;
    if (!chatThread || !chatThread.id) {
        throw 'Server could not create chat thread';
    }

    return chatThread.id;
};

export const createCallWithChat = async () => {
    const props = {
        token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwNUVCMzFEMzBBMjBEQkRBNTMxODU2MkM4QTM2RDFCMzIyMkE2MTkiLCJ4NXQiOiJZRjZ6SFRDaURiMmxNWVZpeUtOdEd6SWlwaGsiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOjc3YmFjMWM0LWNmNTUtNGI5MS1iNjBjLTVhMzk2ZGY5OGIxY18wMDAwMDAxZS1lMWE1LTFhMzEtNjMzMS04ZTNhMGQwMDA3ZjUiLCJzY3AiOjE3OTIsImNzaSI6IjE3MTA1MDAzMTIiLCJleHAiOjE3MTA1ODY3MTIsInJnbiI6ImFtZXIiLCJhY3NTY29wZSI6ImNoYXQsdm9pcCIsInJlc291cmNlSWQiOiI3N2JhYzFjNC1jZjU1LTRiOTEtYjYwYy01YTM5NmRmOThiMWMiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNzEwNTAwMzEyfQ.AYTkkRFsw0LVec0pq5UeL7FN_dNN6gjFWvJm8OeW8pK0uS41p_O99gxiM7DjKPSfKCC2APg_iCU-5lWvfYamoyxuSQogBKqUKGejg4quFhzMz6AerHhjEFuIyS95CMgaG_eZU-fE9WFL47-hfE_n6UVEmX7L0tmnYPhebdStZUwr0Yd-80dmjqp5KRv4tFMeMui6fgiUmOZsJEFOicbf0wdTulOazt2mJx9d1LwBSS3ZzNh1q7WjrFOWMt4KrbuJoULRI8Khm70G8FTSXGeZVoL7M-uXPNNvjXZr9a6tp0Ea7bvHXE3ykVhm7s5KY14QYDapgx70slL0FedEvOv1gw',
        userId: '8:acs:77bac1c4-cf55-4b91-b60c-5a396df98b1c_0000001e-e1a5-1a31-6331-8e3a0d0007f5',
        endpointUrl: 'https://smstutoingacademy.unitedstates.communication.azure.com/',
        displayName: "asiya123"
    }

    const { userId, token, endpointUrl, displayName } = props;
    
    const locator = { groupId: createGUID() };
    const chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(token));
    const threadId = await createNewChatThread(chatClient, [
        { id: { communicationUserId: userId }, displayName: displayName }
    ]);

    return {
        callLocator: locator,
        chatThreadId: threadId
    };
};