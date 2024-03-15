import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
    CallAndChatLocator,
    CallWithChatComposite,
    useAzureCommunicationCallWithChatAdapter,
    fromFlatCommunicationIdentifier,
    CallWithChatCompositeOptions
} from '@azure/communication-react';
// import { Theme, PartialTheme, Spinner, initializeIcons } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import Loading from '../../components/common/Loading';
import { createCallWithChat } from './Test2';

// initializeIcons();


export const CallWithChatExperience = () => {
    const [locator, setLocator] = useState(null)
    const props = {
        token: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwNUVCMzFEMzBBMjBEQkRBNTMxODU2MkM4QTM2RDFCMzIyMkE2MTkiLCJ4NXQiOiJZRjZ6SFRDaURiMmxNWVZpeUtOdEd6SWlwaGsiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOjc3YmFjMWM0LWNmNTUtNGI5MS1iNjBjLTVhMzk2ZGY5OGIxY18wMDAwMDAxZS1lMWE1LTFhMzEtNjMzMS04ZTNhMGQwMDA3ZjUiLCJzY3AiOjE3OTIsImNzaSI6IjE3MTA1MDAzMTIiLCJleHAiOjE3MTA1ODY3MTIsInJnbiI6ImFtZXIiLCJhY3NTY29wZSI6ImNoYXQsdm9pcCIsInJlc291cmNlSWQiOiI3N2JhYzFjNC1jZjU1LTRiOTEtYjYwYy01YTM5NmRmOThiMWMiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNzEwNTAwMzEyfQ.AYTkkRFsw0LVec0pq5UeL7FN_dNN6gjFWvJm8OeW8pK0uS41p_O99gxiM7DjKPSfKCC2APg_iCU-5lWvfYamoyxuSQogBKqUKGejg4quFhzMz6AerHhjEFuIyS95CMgaG_eZU-fE9WFL47-hfE_n6UVEmX7L0tmnYPhebdStZUwr0Yd-80dmjqp5KRv4tFMeMui6fgiUmOZsJEFOicbf0wdTulOazt2mJx9d1LwBSS3ZzNh1q7WjrFOWMt4KrbuJoULRI8Khm70G8FTSXGeZVoL7M-uXPNNvjXZr9a6tp0Ea7bvHXE3ykVhm7s5KY14QYDapgx70slL0FedEvOv1gw',
        userId: '8:acs:77bac1c4-cf55-4b91-b60c-5a396df98b1c_0000001e-e1a5-1a31-6331-8e3a0d0007f5',
        endpointUrl: 'https://smstutoingacademy.unitedstates.communication.azure.com/'
    }
    // Construct a credential for the user with the token retrieved from your server. This credential
    // must be memoized to ensure useAzureCommunicationCallWithChatAdapter is not retriggered on every render pass.
    const credential = useMemo(() => new AzureCommunicationTokenCredential(props.token), [props.token]);
    // Create the adapter using a custom react hook provided in the @azure/communication-react package.
    // See https://aka.ms/acsstorybook?path=/docs/composite-adapters--page for more information on adapter construction and alternative constructors.
    useEffect(() => {
        if (props.token && props.userId && props.endpointUrl ) {
            const initializeCallWithChat = async () => {
                try {
                    const { callLocator } = await createCallWithChat();
                    setLocator(callLocator);
                } catch (error) {
                    console.error('Error creating call with chat:', error);
                }
            };
            initializeCallWithChat();
        }
    }, [props]);

    const adapter = useAzureCommunicationCallWithChatAdapter({
        userId: props.userId,
        displayName: 'Asiya',
        credential,
        locator: locator,
        endpoint: props.endpointUrl
    })
    // The adapter is created asynchronously by the useAzureCommunicationCallWithChatAdapter hook.
    // Here we show a spinner until the adapter has finished constructing.
    if (!adapter) {
        return <Loading loadingText="Initializing..." />;
    }

    return (
        <CallWithChatComposite
            adapter={adapter}
        // fluentTheme={props.fluentTheme}
        // rtl={props.rtl}
        // formFactor={props.formFactor}
        // joinInvitationURL={props.callInvitationURL}
        // options={props.compositeOptions}
        />
    );
};