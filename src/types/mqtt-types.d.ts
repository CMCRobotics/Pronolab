import * as mqtt from 'mqtt';

declare module 'mqtt' {
  export interface Client extends mqtt.MqttClient {
    publish(topic: string, message: string | Buffer, opts?: mqtt.IClientPublishOptions, callback?: mqtt.PacketCallback): this;
    subscribe(topic: string | string[], opts?: mqtt.IClientSubscribeOptions, callback?: mqtt.ClientSubscribeCallback): this;
    on(event: 'message', callback: (topic: string, payload: Buffer) => void): this;
    on(event: 'connect', callback: () => void): this;
    end(force?: boolean, opts?: object, callback?: () => void): this;
  }

  export interface IClientOptions extends mqtt.IClientOptions {}
}