import mqtt from "mqtt";

export const initMqtt = (topics) => {
    const client = mqtt.connect(process.env.MQTT_URI, {
        clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
        username: '',
        password: '',
        path: "/mqtt",
        reconnectPeriod: 1000
    });

    if (topics) {
        client.subscribe(topics);
    }

    return client;
}