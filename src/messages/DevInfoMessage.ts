import { AjaxSerialMessageType } from '../ajax';
import { AbstractStatusMessage } from './AbstractStatusMessage';

/**
 * Device information message sent in the Extended mode.
 * To enable, execute "ext 1" command.
 */
export class DevInfoMessage extends AbstractStatusMessage {


  sysNum!: number;// SysNum Sequence number in a system
  numPack!: number;// NumPack Package number from device
  slt!: number;// SLT(slot); Slot number of device
  noiseRssiAvg!: number;// NoiseRSSI_Avg Noise level, measured by receiver
  locRssi!: number;// Loc_RSSI Signal level, measured by receiver
  resRssi!: number;// Rem_RSSI Signal level, measured by remote radio device
  vbat!: number;// VBat Battery voltage
  outPower!: number;// OutPower Output power of device
  shiftSync!: number;// ShiftSynchro Time correction rate
  settingsByte1!: number;// SettingByte1 First byte of settings
  settingsByte2!: number;// SettingByte2 Second byte of settings
  temperature!: number;// Temp Ambient temperature around microcontroller
  devReset!: number;// Dev_Reset Reset-factor — Value of last device reboot (33 — reset by power)
  numberOfSkip!: number;// Number _of_Skip Amount of missed statuses in a row until current received
  mrrSkip!: number;// MRR_Skip Amount of missed unheard packages (all and on alarm) from MRR — counter is incremented up to 65535
  frequencyErr!: number;// FrecERR Frequency deviation in Hz
  reserveBatCondition!: 0 | 1;// ResBatCondition State of reserve battery: discharged — 1, charged — 0
  voltageReservBat!: number;// V_ResBat Voltage of redundant battery
  dust!: number;// Dust Camera dustiness in %


  constructor(messageChunks: string[]) {
    super();
    this.propertyNames = ['sysNum', 'numPack', 'slt', 'noiseRssiAvg', 'locRssi', 'resRssi',
      'vbat', 'outPower', 'shiftSync', 'settingsByte1', 'settingsByte2',
      'temperature', 'devReset', 'numberOfSkip', 'numberOfSkip', 'mrrSkip', 'frequencyErr',
      'reserveBatCondition', 'voltageReservBat', 'dust'];

    this.messageType = AjaxSerialMessageType.DEVINFO;

    //DEVINFO;943C26;1;114;18196;-92;-70;-48;34;-5;6;3;0;19;34;0;5;5124;0;0;0;0;
    //DEVINFO;DevID;SysNum;SLT(slot);NumPack;NoiseRSSI_Avg;Loc_RSSI;Rem_RSSI;VBat;OutPower;
    //ShiftSynchro;SettingByte1;SettingByte2;Temp;Dev_Reset; Number_of_Skip;MRR_Skip;
    //FrecERR;ResBatCondition; V_ResBat

    this.deviceId = messageChunks[2];

    const propShift = 2;
    this.initProperties(messageChunks, propShift);

  }

}