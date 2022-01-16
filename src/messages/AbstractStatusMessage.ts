import { AjaxSerialMessageType, AjaxDeviceType } from '../ajax';
import { SerialMessage } from './ajaxSerialMessage';

export abstract class AbstractStatusMessage implements SerialMessage {

  messageType!: AjaxSerialMessageType;
  deviceType!: AjaxDeviceType;
  deviceId!: string;

  // handy list of property names for utility purposes. Used for initialization and toString
  protected propertyNames: string[] = [];

  /**
   * Initialize new object properties using property list names from `this.propertyNames` and
   * data from serial port in `messageChunks`;
   */
  protected initProperties(messageChunks: string[], propShift: number): void {
    for (let i = 0; i < this.propertyNames.length; i++) {
      const propName = this.propertyNames[i];
      this[propName] = messageChunks[i + propShift];
    }
  }

  toString(): string {
    let str = '';
    this.propertyNames.forEach(propName => {
      str += `${propName}=${this[propName]}, `;
    });
    return `${AjaxSerialMessageType[this.messageType]}: from ${AjaxDeviceType[this.deviceType]}@${this.deviceId}, ${str}`;
  }
}