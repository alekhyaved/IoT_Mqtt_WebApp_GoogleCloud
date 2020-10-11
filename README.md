# IoT_Mqtt_WebApp_GoogleCloud
## Description
This project is made  IoT and mobile devices with Google Cloud backend (or firebase)with serverless backend for IoT (MQTT protocol) and mobile devices (web HTTP REST API) with firestore db. IoT (any VM here we are using google colab) and mobile devices (web): both IoT and mobile device side with simulated application where IoT device provides real-time sensor data via MQTT to the Cloud, mobile device can receive real-time updates or notification from the backend (REST API + Websocket or Notification), mobile device can also send command to the IoT device (e.g., set temperature value), mobile device can fetch history data and plots the graph diagram via REST API.


Available Scripts
In the project directory, you can run:
```npm start```
Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.

## Steps followed for this Project
### Google Cloud, IoT, VM, PubSub and Firestore
* Create a project for IoT and done all required configurations and enables IoT Core, firestore and Pub Sub APIs.
* Create a virtual environment and downloaded the certificates in .pem files and added required files.
* After creating virtual environment, ```pip install -r requirements.txt```
* Run the google colab and test for publish message.
* Check for the response of data that is received by running the python sub.py file using ```python3 sub.py cmpelkk testpubsub-subscription1```
* Create cloud functions for iotPubSub .
* Triggering cloud function can either be done through Topics section in Cloud PubSub or directly by enabling cloud function.
* Read sensor data from virtual machine and run the code set up for mqtt pub sub communication from notebook file.
* Create cloud functions for HttpApi calls.
### Web application as mobile device:
* I have created a react web app to Get the data and plot graphs using the historical data of temperature and humidity sensors.

## Conclusion
By following the above steps, a simulated application is created, where IoT device provides sensor data via MQTT to the Cloud, mobile device can receive real-time updates from the backend (REST API + Websocket ), mobile device can also send command to the IoT device, mobile device can fetch history data and plots the graph diagram for temperature and humidity via REST API.


