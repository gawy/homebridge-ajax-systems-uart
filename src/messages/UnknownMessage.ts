import { AjaxDeviceType, AjaxSerialMessageType } from '../ajax';
import { SerialMessage } from './ajaxSerialMessage';


export class UnknownMessage implements SerialMessage {
  messageType: AjaxSerialMessageType = AjaxSerialMessageType.UNKNOWN;
  deviceType: AjaxDeviceType = AjaxDeviceType.NotDefined;
  deviceId = '';
  toString(): string {
    return 'Unsupported message';
  }

}
