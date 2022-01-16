import { AjaxDeviceType, AjaxSerialMessageType } from '../ajax';
import { AbstractStatusMessage } from './AbstractStatusMessage';

/** Status message that is periodically broadcasted by accesories. */
export class StatusPingMessage extends AbstractStatusMessage {

  strStore!: number; // STR(store) //System number of device (sequence number in a system)
  sltSlot!: number; // SLT(slot); Slot number of device
  shifted!: number; //Shifted The slot number for the superframe
  numPack!: number; // NumPack Package number from device

  locNoise!: number; // Loc_Noise Noise level which gets receiver from the device
  locRssi!: number; // Loc_RSSI Level which gets receiver from the device
  battery!: 0 | 1; // Bat_Сondition Battery state: discharged — 1, charged — 0
  settingByte1!: number; // SettingByte1 First byte of settings
  settingByte2!: number; // SettingByte2 Second byte of settings
  shiftSynchro!: number; // ShiftSynchro Deviation of detector synchronization from system in ms
  numberOfSkip!: number; // Number _of_Skip Amount of missed statuses in a row until current received status
  freqErr!: number; // FrecERR Frequency deviation in Hz
  actAnt!: 0 | 1; // Act_ANT Active aerial 0 or 1
  badAntRssi!: number; // Bad_ANT_RSSI Reception level with the worst aerial
  sensCondition!: number; // Sens_ Сondition Sensor state (tamper, hermetic, contact, terminal)
  frequency!: number; // Frequency Frequency, where status was received (868.0 or 868.5)


  constructor(messageChunks: string[]) {
    super();
    this.messageType = AjaxSerialMessageType.STATUS;

    this.propertyNames = ['strStore', 'sltSlot', 'shifted', 'numPack', 'locNoise', 'locRssi',
      'battery', 'settingByte1', 'settingByte2', 'shiftSynchro', 'numberOfSkip',
      'freqErr', 'actAnt', 'badAntRssi', 'sensCondition', 'frequency'];

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
    this.initProperties(messageChunks, propShift);
  }

}
