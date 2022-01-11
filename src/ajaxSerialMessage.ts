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
    return `Alarm: from ${AjaxDeviceType[this.deviceType]}@${this.deviceId}, alarm=${AjaxAlarmType[this.alarmType]}`;
  }
}

export class StatusPingMessage implements SerialMessage {
  messageType: AjaxSerialMessageType = AjaxSerialMessageType.STATUS;
  deviceType: AjaxDeviceType;
  deviceId: string;

  strStore!: number; // STR(store) //System number of device (sequence number in a system)
  sltSlot!: number; // SLT(slot); Slot number of device
  shifted!: number; //Shifted The slot number for the superframe
  numPack!: number; // NumPack Package number from device

  locNoise!: number; // Loc_Noise Noise level which gets receiver from the device
  locRssi!: number; // Loc_RSSI Level which gets receiver from the device
  battery!: 0 | 1; // Bat_Сondition Battery state:
  // discharged — 1
  // charged — 0
  settingByte1!: number; // SettingByte1 First byte of settings
  settingByte2!: number; // SettingByte2 Second byte of settings
  shiftSynchro!: number; // ShiftSynchro Deviation of detector synchronization from system in ms
  numberOfSkip!: number; // Number _of_Skip Amount of missed statuses in a row until current received status
  freqErr!: number; // FrecERR Frequency deviation in Hz
  actAnt!: 0 | 1; // Act_ANT Active aerial 0 or 1
  badAntRssi!: number; // Bad_ANT_RSSI Reception level with the worst aerial
  sensCondition!: number; // Sens_ Сondition Sensor state (tamper, hermetic, contact, terminal)
  frequency!: number; // Frequency Frequency, where status was received (868.0 or 868.5)

  // handy list of property names for utility purposes. Used for initialization and toString
  private static properties = ['strStore', 'sltSlot', 'shifted', 'numPack', 'locNoise', 'locRssi',
    'battery', 'settingByte1', 'settingByte2', 'shiftSynchro', 'numberOfSkip',
    'freqErr', 'actAnt', 'badAntRssi', 'sensCondition', 'frequency'];

  constructor(messageChunks: string[]) {
    //STATUS;5;943C26;1;114;31;9336;-93;-69;0;3;0;-8;0;5124;0;-69;0;868.1;PING;
    //STATUS;DevType;DevID; STR; SLT;Shifted;NumPack;Loc_Noise;-Loc_RSSI;
    //       Bat_Сondition; SettingByte1;SettingByte2; ShiftSynchro; Number_of_Skip;FrecERR;
    //       Act_ANT;Bad_ANT_RSSI,Sens_ Сondition; Frequency;PING;
    if (messageChunks[messageChunks.length - 2] !== 'PING') {
      throw Error('Attempted to construct wrong message object. Expected Status Ping, got no Ping');
    }
    this.deviceType = Number(messageChunks[1]) as AjaxDeviceType;
    this.deviceId = messageChunks[2];

    const propShift = 3;
    for (let i = 0; i < StatusPingMessage.properties.length; i++) {
      const propName = StatusPingMessage.properties[i];
      this[propName] = messageChunks[i + propShift];
    }
  }

  toString(): string {
    let str = '';
    StatusPingMessage.properties.forEach(propName => {
      str += `${propName}=${this[propName]}, `;
    });
    return `Status Ping: from ${AjaxDeviceType[this.deviceType]}@${this.deviceId}, battery=${this.battery}, ${str}`;
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

