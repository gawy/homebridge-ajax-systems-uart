import { AjaxAlarmType, AjaxDeviceType, AjaxSerialMessageType } from '../ajax';
import { SerialMessage } from './ajaxSerialMessage';


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
    return `Alarm: from ${AjaxDeviceType[this.deviceType]}@${this.deviceId}, alarm=${AjaxAlarmType[this.alarmType]}`;
  }
}
