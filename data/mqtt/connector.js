import mqtt from "mqtt";

// TODO: move in smarter configuration
export const SMARTER_ID_1 = "smarter_fbk_2";
export const SMARTER_ID_2 = "smarter_fbk_5";

export const initMqtt = (topics) => {
    const client = mqtt.connect(process.env.MQTT_URI, {
        clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
        username: process.env.MQTT_USER,
        password: process.env.MQTT_PSW,
        path: "/mqtt",
        reconnectPeriod: 1000
    });

    if (topics) {
        client.subscribe(topics);
    }

    return client;
}