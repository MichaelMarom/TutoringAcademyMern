const { startDateTimeAsync, endDateTimeAsync } = require('./dateTimeFormat');
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
const { TokenCredentialAuthenticationProvider } = require('@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials');
require('isomorphic-fetch');
require('dotenv').config()

let clientSecretCredential;
let appGraphClient;

function ensureGraphForAppOnlyAuth() {
    if (!clientSecretCredential) {
        clientSecretCredential = new ClientSecretCredential(
            process.env.AZURE_TENANT_ID,
            process.env.AZURE_CLIENT_ID,
            process.env.AZURE_CLIENT_SECRET
        );
    }

    if (!appGraphClient) {
        const authProvider = new TokenCredentialAuthenticationProvider(
            clientSecretCredential, {
            scopes: ['https://graph.microsoft.com/.default']
        });

        appGraphClient = Client.initWithMiddleware({
            authProvider: authProvider
        });
    }
}

async function createNewMeetingAsync(userId) {
    ensureGraphForAppOnlyAuth();
    let startTime = await startDateTimeAsync();
    let endTime = await endDateTimeAsync();
    const newMeeting = `/users/${userId}/calendar/events`;

    const event = {
        subject: 'Customer Service Meeting',
        start: {
            dateTime: startTime,
            timeZone: 'UTC'
        },
        end: {
            dateTime: endTime,
            timeZone: 'UTC'
        },
        isOnlineMeeting: true
    };

    try {
        const newEvent = await appGraphClient.api(newMeeting).post(event);
        return newEvent;
    } catch (error) {
        console.error('Error creating new meeting:', error);
        throw error;
    }
}

module.exports = createNewMeetingAsync;
