import { useHasHydrated } from "@/utils/hooks";
import { useEffect, useState, useMemo } from "react";
import { initMqtt } from "./connector";
import { convertTagToSymbol, convertTagToSymbolType } from "@/utils/smarter";

const EVENT_TAG = '/event';
const INFO_TAG = '/info';
const ACTION_TAG = '/action';
const GUI_TAG = '/gui';

export const LED_RED_ACTION = '{"action":"led", "value": "red"}';
export const LED_BLUE_ACTION = '{"action":"led", "value": "blue"}';
export const LED_GREEN_ACTION = '{"action":"led", "value": "green"}';
export const LED_WHITE_ACTION = '{"action":"led", "value": "white"}';


export const useSmarter = (props) => {
  const { smarterIds, onConnect, onMessage, onError } = props;

  const hydrated = useHasHydrated();

  const [events, setEvents] = useState([]);
  const [info, setInfo] = useState([]);
  const [gui, setGui] = useState([]);

  const [error, setError] = useState();
  const [isConnecting, setIsConnecting] = useState(true);

  const actionTopics = smarterIds.map(id => ({
    smarter_id: id,
    topic: id+ACTION_TAG
  }));

  const topics = smarterIds.flatMap(id => [
    id+EVENT_TAG,
    id+INFO_TAG,
    id+GUI_TAG,
  ]);

  const client = useMemo(() => initMqtt(topics),[]);

  const sendAction = (smarter_id, action) => {
    client.publish(actionTopics.find(topic => topic.smarter_id === smarter_id), action);
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

          const message_splitted = topic.split("/");

          switch("/"+message_splitted[1]) {
            case EVENT_TAG:
              if (Array.isArray(json) && JSON.stringify(info) !== JSON.stringify(json)) {
                  setEvents(json.map((obj => ({
                    smarter_id: message_splitted[0],
                    payload: obj.values?.map(value => convertTagToSymbol(value)),
                    payloadTypes: obj.values?.map(value => convertTagToSymbolType(value))
                }))));
              }
              break;
            case INFO_TAG:
              if (Array.isArray(json) && JSON.stringify(info) !== JSON.stringify(json)) {
                setInfo(json.map((obj => ({
                  smarter_id: message_splitted[0],
                  payload: convertTagToSymbol(obj.value),
                  payloadType: convertTagToSymbolType(obj.value)
                }))));
              }
              break;
            case GUI_TAG:
              console.log(json);
              setGui(json);
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

  return {events, info, gui, sendAction, isConnecting, error};
}