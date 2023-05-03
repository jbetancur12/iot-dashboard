import React, { useEffect, useState } from 'react';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

interface IMQTTConnectorProps {
  url: string;
  options?: IClientOptions;
  topics: string[];
  onMessage: (topic: string, message: Buffer) => void;
}

const MQTTConnector: React.FC<IMQTTConnectorProps> = ({ url, options, topics, onMessage }) => {
  const [mqttClient, setMqttClient] = useState<MqttClient>();
  

  useEffect(() => {
    const client = mqtt.connect(url, {...options,      clean: true,
        reconnectPeriod: 1000, 
        connectTimeout: 30 * 1000, });

    client.on('connect', () => {
      console.log('Connected to MQTT broker');
      client.subscribe(topics);
    });

    client.on('message', (topic: string, message: Buffer) => {
      onMessage(topic, message);
    });

    setMqttClient(client);

    return () => {
      if (client) {
        client.end();
      }
    };
  }, [url, options, topics, onMessage]);

  return null;
};

export default MQTTConnector;
