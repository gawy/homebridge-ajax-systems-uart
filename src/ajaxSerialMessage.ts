import { AjaxAlarmType, AjaxDeviceType, AjaxSerialMessageType } from './ajax';


export interface SerialMessage {
  messageType: AjaxSerialMessageType;
  deviceType: AjaxDeviceType;
  deviceId: string;
  toString(): string;
}

export class AlarmMessage implements SerialMessage {
  messageType: AjaxSerialMessageType = AjaxSerialMessageType.ALARM;
  deviceType: AjaxDeviceType;
  deviceId: string;
  alarmType: AjaxAlarmType;

  constructor(messageChunks: string[]) {
    //Spec says => ALARM;DevType;DevID;AlarmNUM=Value;
    //Reality   => ALARM;5;943C26;19;PRT=0;
    this.deviceType = Number(messageChunks[1]) as AjaxDeviceType;
    this.deviceId = messageChunks[2];

    // const pair = messageChunks[3].split('=');
    // if (pair[0] !== 'AlarmNUM') {
    //   throw new Error(`Unexpected command format. Expected key "AlarmNUM" got "${pair[0]}" in string ${messageChunks.join(';')}`);
    // }
    this.alarmType = Number(messageChunks[3]) as AjaxAlarmType;
  }

  toString(): string {
    return `Alarm: device=${this.deviceType}, id=${this.deviceId}, alarm=${this.alarmType}`;
  }
}
export class UnknownMessage implements SerialMessage {
  messageType: AjaxSerialMessageType = AjaxSerialMessageType.UNKNOWN;
  deviceType: AjaxDeviceType = AjaxDeviceType.NotDefined;
  deviceId = '';
  toString(): string {
    return 'Unsupported message';
  }

}

export function ajaxMessageFromString(messageStr: string): SerialMessage {
  const chunks: string[] = messageStr.split(';');

  const messageType = chunks[0] as AjaxSerialMessageType;

  let msgObj: SerialMessage;
  switch (messageType) {
    case AjaxSerialMessageType.ALARM:
      msgObj = new AlarmMessage(chunks);
      break;

    default:
      msgObj = new UnknownMessage();
      break;
  }

  return msgObj;
}

