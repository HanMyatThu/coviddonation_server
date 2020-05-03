var Client = require('azure-iothub').Client;
var Message = require('azure-iot-common').Message;

function printResultFor(op) {
    return function printResult(err, res) {
      if (err) console.log(op + ' error: ' + err.toString());
      if (res) console.log(op + ' status: ' + res.constructor.name);
    };
  }

  function receiveFeedback(err, receiver){
    receiver.on('message', function (msg) {
      console.log('Feedback message:')
      console.log(msg.getData().toString('utf-8'));
    });
  }

  async function sendC2D (process,connectionString) {
    console.log(connectionString);
    const serviceClient = Client.fromConnectionString(connectionString);

    try {
        await serviceClient.open();
        console.log('Service client connected');
        await serviceClient.getFeedbackReceiver(receiveFeedback);
        var message = new Message(`{\"tranID\":\"${process.tranID}\",\"machineID\":\"${process.machineID}\",\"userID\":\"${process.userID}\",\"status\":\"${process.status}\"}`);
        message.ack = 'full';
        message.messageId = "My Message ID";
        console.log('Sending message: ' + message.getData());
        await serviceClient.send(process.machineID, message, () => {
          console.log('msg sends')
        });
    } catch(e) {
      console.error('Could not connect: ' + e);
    }
    // serviceClient.open(function (err) {
    //   if (err) {
    //     console.error('Could not connect: ' + err.message);
    //   } else {
    //     console.log('Service client connected');
    //     serviceClient.getFeedbackReceiver(receiveFeedback);
    //     var message = new Message(`{\"tranID\":\"${tranID}\",\"machineID\":\"${machineID}\",\"userID\":\"${userID}\",\"status\":\"${status}\"}`);
    //     message.ack = 'full';
    //     message.messageId = "My Message ID";
    //     console.log('Sending message: ' + message.getData());
    //     serviceClient.send(targetDevice, message, printResultFor('send'));
    //   }
    // });
  }

module.exports = {sendC2D};