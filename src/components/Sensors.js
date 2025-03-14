import React, { useState, useEffect } from "react";
import Paho from "paho-mqtt";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const MQTT_BROKER = "ws://test.mosquitto.org:8080/mqtt";
const MQTT_TOPIC_TEMP = "esp-10504491/data/temp";
const MQTT_TOPIC_HUMID = "esp-10504491/data/humid";
const CLIENT_ID = "client_" + Math.random().toString(16).substr(2, 8);

const MqttSensorDisplay = () => {
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);

    useEffect(() => {
        const mqttClient = new Paho.Client(MQTT_BROKER, CLIENT_ID);

        mqttClient.onConnectionLost = (responseObject) => {
            console.error("Connection lost:", responseObject.errorMessage);
        };

        mqttClient.onMessageArrived = (message) => {
            console.log("Message received:", message.payloadString);
            if (message.topic === MQTT_TOPIC_HUMID) {
                setHumidity(parseFloat(message.payloadString) || 0);
            } else if (message.topic === MQTT_TOPIC_TEMP) {
                setTemperature(parseFloat(message.payloadString) || 0);
            }
        };

        mqttClient.connect({
            onSuccess: () => {
                console.log("Connected to MQTT Broker");
                mqttClient.subscribe([MQTT_TOPIC_HUMID, MQTT_TOPIC_TEMP]);
            },
            onFailure: (error) => {
                console.error("Connection failed:", error.errorMessage);
            },
        });

        return () => {
            mqttClient.disconnect();
            console.log("Disconnected from MQTT Broker");
        };
    }, []);

    return (
        <>
        <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>IOT Sensor Dashboard</h1>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px" }}>
            {/* Temperature Meter */}
            
            <div style={{ width: 120, height: 120 }}>
                <CircularProgressbar
                    value={temperature}
                    maxValue={50}
                    text={`${temperature}°C`}
                    styles={buildStyles({
                        textColor: "#FF5733",
                        pathColor: "#FF5733",
                        trailColor: "#E0E0E0",
                        textSize: "16px",
                    })}
                />
                <p style={{ textAlign: "center", marginTop: "5px", fontSize: "12px", fontWeight: "bold", color: "#555" }}>
                    Temperature
                </p>
            </div>
    
            {/* Humidity Meter */}
            <div style={{ width: 120, height: 120 }}>
                <CircularProgressbar
                    value={humidity}
                    maxValue={100}
                    text={`${humidity}%`}
                    styles={buildStyles({
                        textColor: "#007BFF",
                        pathColor: "#007BFF",
                        trailColor: "#E0E0E0",
                        textSize: "16px",
                    })}
                />
                <p style={{ textAlign: "center", marginTop: "5px", fontSize: "12px", fontWeight: "bold", color: "#555" }}>
                    Humidity
                </p>
            </div>
        </div>
        </>
    );
    
};

export default MqttSensorDisplay;
