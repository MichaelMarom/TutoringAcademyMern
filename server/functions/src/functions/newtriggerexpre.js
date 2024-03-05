const { app } = require('@azure/functions');

app.timer('newtriggerexpre', {
    schedule: '0 33 10 5 3 2',
    handler: (myTimer, context) => {
        context.log('Timer function processed requestat .', new Date());
    }
});
