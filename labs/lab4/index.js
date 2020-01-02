// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
const https = require('https');
const Particle = require('particle-api-js');

var token = "YOUR_PERSONAL_ACCESS_TOKEN_HERE";
var deviceId = "YOUR_DEVICE_ID_HERE";

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome, you can say Hello or Help. Which would you like to try?';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const LightPowerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LightPowerIntent';
    },
    handle(handlerInput) {
        var command = "toggle";
        if (handlerInput.requestEnvelope.request.intent.slots.OnOff.value !== undefined) command = handlerInput.requestEnvelope.request.intent.slots.OnOff.value;
        var particle = new Particle();
        particle.callFunction({ deviceId: deviceId, name: "toggleLightPower", argument: command.toString(), auth: token })
        
        var speakOutput = "Your LED state has been updated";
        if (command !== "toggle") speakOutput += " to " + command + ".";
        return handlerInput.responseBuilder
            .speak(speakOutput + "<break time='.25s'/>What else can I do for you?")
            .reprompt("What else can I do for you?")
            .getResponse();
    }
}

const TemperatureIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'TemperatureIntent';
    },
    async handle(handlerInput) {
        var particle = new Particle();
        return await particle.getVariable({ deviceId: deviceId, name: 'temp', auth: token }).then(function(data) {
            console.log("RESULT = " + JSON.stringify(data));
            var speakOutput = "Your temperature sensor says it is " + parseInt(data.body.result) + " degrees fahrenheit.";
            return handlerInput.responseBuilder
                .speak(speakOutput + "<break time='.25s'/>What else can I do for you?")
                .reprompt("What else can I do for you?")
                .getResponse();
        }, function(err) { console.log('An error occurred while getting attrs:', err);return 0;});
    }
}

const ColorIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ColorIntent';
    },
    handle(handlerInput) {
        var speakOutput = "This skill currently only supports the colors of the rainbow and white.  Please select one of those colors.";
        if (handlerInput.requestEnvelope.request.intent.slots.color.value !== undefined) {
            var color = handlerInput.requestEnvelope.request.intent.slots.color.value.toLowerCase();
            if (["red", "orange", "yellow", "green", "blue", "purple", "white"].indexOf(color) >= 0) {
                var particle = new Particle();
                particle.callFunction({ deviceId: deviceId, name: "toggleColor", argument: color, auth: token })
                speakOutput = "The LED is now " + color;
            }
        }
        return handlerInput.responseBuilder
            .speak(speakOutput + "<break time='.25s'/>What else can I do for you?")
            .reprompt("What else can I do for you?")
            .getResponse();
    }
}

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        LightPowerIntentHandler,
        TemperatureIntentHandler,
        ColorIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    )
    .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
