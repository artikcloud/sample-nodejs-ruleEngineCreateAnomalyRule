var request = require("request");

var your_user_id = 'your_user_id_here';
var your_user_token = 'your_user_token_here';
var your_device_id = 'your_device_id_here';

var url = 'https://api.artik.cloud/v1.1/rules?userId' + your_user_id;


// Here let's prepare the rule that will be created into your account.
// name	   - name of this rule which will be shown in user dashboard
// description - description of the rule
// rule    - the `if` and `then` condition
// enabled - we will create and have this rule enabled
// scope   - can be value of 'thisApplication' or 'allApplications' 
//    'thisApplication' (rule is accessible only to this application)
//    'allApplications' (rule is accessible to all applications)  

var rule_body = {
	"name": "Sample Anomaly Rule",
	"description": "sample anomaly rule for learning",
	"rule": {"if":{}, "then":{}},
	"enabled": true,
	"scope": "thisApplication"
}

// The if condition here will trigger if there is an anomaly detection
// sdid 	-  the device_id that will be monitored for anomaly
// field	-  monitors the `state` field of your device
// operator -  using "=" here to trigger if anomaly is detected
// transformer - will be defined with type 'anomalyDetection' here.
// anomalyDetectionSensitivity - how often anomalies should be detected, from 0 (very few) to 100 (many)

rule_body.rule.if = {
	"sdid": your_device_id,
	"field": "state",
	"operator": "=",
	"operand": {"value": true},
	"transformer": {
	    "type": "anomalyDetection",
	    "parameters": {
	      "anomalyDetectionSensitivity": 50
	     }
    }
}

// the action that is called when a anomaly is detected
// ddid     	- device_id to perform the action
// action   	- the action to call on the device
// parameters 	- any parameters if the action requires any parameters

rule_body.rule.then = [{
	"ddid":your_device_id,
	"action":"setOn",
	"parameters":{}}
];


var options = { 
  method: 'POST',
  url: url,
  headers: 
   { 'Authorization': 'Bearer ' + your_user_token,
     'Content-Type': 'application/json' },
  body: rule_body,
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  console.log(JSON.stringify(body, null, 2));
  
  // response:
  // {"data":{"uid":"c12345...","id":"1bf81c177c0e4255a9b9bb6ed9f7c505","aid":"a12345...","name":"Sample Anomaly Rule","languageVersion":1,"rule":{"if":{"sdid":"95c2fb05044749b7bf1966be7e0c6237","field":"state","operator":"=","operand":{"value":true},"transformer":{"type":"anomalyDetection","parameters":{"anomalyDetectionSensitivity":50}}},"then":[{"ddid":"95c2fb05044749b7bf1966be7e0c6237","action":"setOn","parameters":{}}]},"enabled":true,"index":8,"createdOn":1524605087622,"modifiedOn":1524605087622,"isTestable":true,"scope":"thisApplication","description":"sample anomaly rule for learning","warning":{"code":6316,"message":"Transformer warnings","warnings":[[{"modelId":"d63445e2f7554516a87d95fdb5c338e3","messages":["is training"]}]]}}}

});

