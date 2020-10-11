// Imports the Google Cloud client library

/* Main file for google cloud MQTT 
IoT and mobile devices with Google Cloud backend (or firebase): set the serverless backend for IoT (MQTT protocol) 
and mobile devices (iOS or Android HTTP REST API) with firestore db.
IoT (any VM, or Linux/Win/MacOS machine) and mobile devices (iOS, Android, or web): both IoT and mobile device side
Simulated application: IoT device provide real-time sensor data via MQTT to the Cloud, mobile device
can receive real-time updates or notification from the backend (REST API + Websocket or Notification), mobile device 
can also send command to the IoT device (e.g., set value, control ON/OFF), mobile device can fetch history data and 
plot the diagram (via REST API, draw the graph/diagram) */

const { BigQuery } = require('@google-cloud/bigquery');
// Instantiates a client
const bigquery = new BigQuery({
    projectId: 'cmpeiot'
});

// Get a reference to the Pub/Sub component
const { PubSub } = require('@google-cloud/pubsub');
const pubsub = new PubSub();

//gcloud pubsub topics publish cmpeiotdevice1 --message "test pubsub"
/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by index.js, and executed when
 * the trigger topic receives a message.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */

const Firestore = require('@google-cloud/firestore');
const db = new Firestore();

async function testfirestore() {
    // Obtain a document reference.
    const document = db.doc('iottests/intro-to-firestore');

    // Enter new data into the document.
    await document.set({
        title: 'Welcome to Firestore',
        body: 'Hello World',
    });
    console.log('Entered new data into the document');

    // Update an existing document.
    await document.update({
        body: 'My first Firestore app',
    });
    console.log('Updated an existing document');

    // Read the document.
    let doc = await document.get();
    console.log('Read the document');

    // Delete the document.
    await document.delete();
    console.log('Deleted the document');
}
// testfirestore();

// Send Command

const sendCommand = async (
    deviceId,
    registryId,
    projectId,
    cloudRegion,
    commandMessage
) => {
    // [START iot_send_command]
    const iot = require('@google-cloud/iot');
    const iotClient = new iot.v1.DeviceManagerClient({
        // optional auth parameters.
    });

    const formattedName = iotClient.devicePath(
        projectId,
        cloudRegion,
        registryId,
        deviceId
    );
    const binaryData = Buffer.from(commandMessage);
    const request = {
        name: formattedName,
        binaryData: binaryData,
    };

    try {
        const responses = await iotClient.sendCommandToDevice(request);
        console.log('Sent command: ', responses[0]);
    } catch (err) {
        console.error('Could not send command:', err);
    }

};


exports.mainPubSub = (pubsubMessage, context) => {
  const message = pubsubMessage.data
    ? Buffer.from(pubsubMessage.data, 'base64').toString()
    : 'Hello, World';
  console.log(message);
  sendCommand('cmpeiotdevice2','CMPEIoT1','cmpeiot','us-central1','Testing Send Command successful')
  const incomingData = pubsubMessage.data ? Buffer.from(pubsubMessage.data, 'base64').toString() : "{'sensorID':'na','timecollected':'1/1/1970 00:00:00','zipcode':'00000','latitude':'0.0','longitude':'0.0','temperature':'-273','humidity':'-1','dewpoint':'-273','pressure':'0'}";
  const created = new Date().getTime();
  let data = JSON.parse(incomingData);
  data.created = created;
  db.collection('iottests')
  .add(data).then(doc =>{
  console.log("Stored data", doc)
  }).catch(err => {
  console.log(err);
  console.log("unable to store",err);
  });
  console.log("Received Data", incomingData);
  setTimeout(function(){ }, 100);
};

exports.httpApi = (req, res) => {
    const Firestore = require('@google-cloud/firestore');
    const db = new Firestore();
        try{ 
        const id = req.query.id;//req.params.id;
        console.log(`Get http query:, ${id}`);
        console.log("ID is", JSON.stringify(id))
        let bodydata;
    
        switch (req.get('content-type')) {
            // '{"name":"John"}'
            case 'application/json':
                bodydata = req.body;
                console.log("json content", JSON.stringify(bodydata));
                break;
    
            // 'John', stored in a Buffer
            case 'application/octet-stream':
                bodydata = req.body.toString(); // Convert buffer to a string
                break;
    
            // 'John'
            case 'text/plain':
                bodydata = req.body;
                break;
    
            // 'name=John' in the body of a POST request (not the URL)
            case 'application/x-www-form-urlencoded':
                ({ bodydata } = req.body);
                break;
        }
        //bodydata =req.body
       
        if (bodydata) {
            console.log("Get body query:", JSON.stringify(bodydata));
        } else {
            bodydata = req.body ? req.body : 'nobody';
            console.log(`No body query: ${bodydata}`);
            console.log(bodydata);
        }
        console.log("request method", req.method);
        switch (req.method) {
            case 'GET':
                const datalist = [];
                db.collection('iottests').get()
                    .then((snapshot) => {
                        snapshot.forEach((doc) => {
                            console.log(doc.id, '=>', doc.data());
                            datalist.push({
                                id: doc.id,
                                data: doc.data()
                            });
                        });
                        res.status(200).send(datalist);
                    })
                    .catch((err) => {
                        console.log('Error getting documents', err);
                        res.status(405).send('Error getting data');
                    });
                //res.status(200).send('Get request!');
                break;
            case 'POST':
                let docRef = db.collection('iottests').doc(id);
                let setdoc = docRef.set({
                    name: id,
                    sensors: bodydata,
                    time: new Date()
                });
                //res.status(200).send('Get Post request!');
                //sendCommand('cmpe181dev1', 'CMPEIoT1', 'cmpelkk', 'us-central1', 'test command');
                //res.status(200).send(`Post data: ${escapeHtml(bodydata || 'World')}!`);
                res.status(200).json({
                    name: id,
                    sensors: bodydata,
                    time: new Date()
                })
                break;
            case 'PUT':
                let docdelRef = db.collection('iottests').doc(id);
                console.log('PUT Created doc ref');
                console.log("body data before doc set",bodydata);
                let deldoc = docdelRef.set({
                    name: id,
                    bodydata: bodydata.temperature,
                    time: new Date()
                });
                console.log("body data and body data.temperature after doc set",bodydata,bodydata.temperature);
                res.status(200).json({
                    name: id,
                    sensors: bodydata,
                    time: new Date()
                })
                //res.status(403).send('Forbidden!');
                break;
            case 'DELETE':
                if (!id) {
                    res.status(405).send('query document id not available');
                } else {
                    let deleteDoc = db.collection('iottests').doc(id).delete();
                    res.status(200).send('Deleted!');
                }
                break;
            default:
                res.status(405).send({ error: 'Something blew up!' });
                break;
        }
        //res.send(`Hello ${escapeHtml(req.query.name || req.body.name || 'World')}!`);
        }
        catch(Exception){
            console.log("error", error);
        }
    };