import { AjaxDeviceType, AjaxSerialMessageType } from '../ajax';
import { AlarmMessage } from './AlarmMessage';
import { StatusPingMessage } from './StatusPingMessage';
import { UnknownMessage } from './UnknownMessage';


export interface SerialMessage {
  messageType: AjaxSerialMessageType;
  deviceType: AjaxDeviceType;
  deviceId: string;
  toString(): string;
}

export function ajaxMessageFromString(messageStr: string): SerialMessage {
  const chunks: string[] = messageStr.split(';');

  const messageType = chunks[0] as AjaxSerialMessageType;

  let msgObj: SerialMessage;
  switch (messageType) {
    case AjaxSerialMessageType.ALARM:
      msgObj = new AlarmMessage(chunks);
      break;
    case AjaxSerialMessageType.STATUS:
      if (chunks[chunks.length - 2] === 'PING') {
        msgObj = new StatusPingMessage(chunks);
      } else {
        msgObj = new UnknownMessage();
      }
      break;
    default:
      msgObj = new UnknownMessage();
      break;
  }

  return msgObj;
}

