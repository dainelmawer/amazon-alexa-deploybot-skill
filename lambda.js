exports.handler = function( event, context ) {

   var https = require( 'https' );

   var options = {
      host: 'dlm.deploybot.com',
      path: '/api/v1/deployments',
      port: 443,
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'X-Api-Token' : 'your-token'
      }
   };

   callback = function(response) {

      var str = '';

      response.on('data', function (chunk) {
         str += chunk;
      });

      response.on('end', function () {
         output(report, context);
      });
   };

   var targetSlot = event.request.intent.slots.Environment.value;
   var report = 'Deploy to environment ' + targetSlot + ' successful.';

   if (event.request.type === "IntentRequest") {

      var req = https.request(options, callback);
      var postData = '{"environment_id":'+ targetSlot +'}';

      req.write(postData);
      req.end();
   }
};

function output( text, context ) {

   var response = {
      outputSpeech: {
         type: "PlainText",
         text: text
      },
      card: {
         type: "Simple",
         title: "DeployBot Trigger Deploy",
         content: text
      },
   shouldEndSession: true
   };

   context.succeed( {response : response} );

}
