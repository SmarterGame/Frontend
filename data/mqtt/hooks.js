import { useHasHydrated } from "@/utils/hooks";
import { useEffect, useState, useMemo } from "react";
import { initMqtt } from "./connector";
import { convertTagToSymbol } from "@/utils/smarter";

const EVENT_TAG = '/event';
const INFO_TAG = '/info';
const ACTION_TAG = '/action';

export const LED_RED_ACTION = '{"action":"led", "value": "red"}';
export const LED_BLUE_ACTION = '{"action":"led", "value": "blue"}';
export const LED_GREEN_ACTION = '{"action":"led", "value": "green"}';
export const LED_WHITE_ACTION = '{"action":"led", "value": "white"}';


export const useSmarter = (props) => {
  const { smarterId, onConnect, onMessage, onError } = props;

  const hydrated = useHasHydrated();

  const [events, setEvents] = useState([]);
  const [info, setInfo] = useState([]);

  const [error, setError] = useState();
  const [isConnecting, setIsConnecting] = useState(true);

  const eventTopic = smarterId + EVENT_TAG;
  const infoTopic = smarterId + INFO_TAG;
  const actionTopic = smarterId + ACTION_TAG;

  const topics = [eventTopic, infoTopic];

  const client = useMemo(() => initMqtt(topics),[]);

  const sendAction = (action) => {
    client.publish(actionTopic, action);
  }

  // setup connection mqtt
  useEffect(() => {
    // prevent to open an extraconnection during server rendering
    if (!hydrated) return;

    client.on('connect', () => {
        console.log('Connected')
        setIsConnecting(false);
        onConnect?.();
    })

    client.on('message', (topic, payload) => {
        try {
          console.log(payload.toString())
          const json = JSON.parse(payload.toString());

          switch(topic) {
            case eventTopic:
              if (Array.isArray(json) && JSON.stringify(info) !== JSON.stringify(json)) setEvents(json.map((obj => obj.values?.map(value => convertTagToSymbol(value)))));
              break;
            case infoTopic:
              if (Array.isArray(json) && JSON.stringify(info) !== JSON.stringify(json)) setInfo(json.map((obj => convertTagToSymbol(obj.value))));
              break;
            default:
              console.log("event not registered!");
          }
        } catch (err) {
          setError(err);
          console.log(err);
          console.log("invalid message format");
          return;
        }

        onMessage?.(payload);
    })

    client.on('error', (err) => {
      setError(err);
      onError?.();
    })

    client.on('reconnect', () => {
      console.log("reconnect");
      setIsConnecting(true);
    })

    return () => {
        if (client) {
            client.unsubscribe(topics);
            client.end(client);
        }
    };
  },[hydrated]);

  return {events, info, sendAction, isConnecting, error};
}