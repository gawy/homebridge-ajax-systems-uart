import { Serial } from 'raspi-serial';
import { init } from 'raspi';

export class UartListener {

  private static _instance: UartListener;
  messageBuffer = '';
  // private serial: Serial;

  private constructor() {
    console.log('Uart listener created');

    init(() => {
      const serial = new Serial({baudRate: 57600});
      serial.open(() => {
        // this.serial = serial;
        serial.on('data', this.receiveData);
      });
    });
  }

  receiveData(receiveData: Buffer) {
    const message = receiveData.toString('ascii');
    const eom_i = message.indexOf('\r\n');

    if (eom_i >= 0) { // one buffer may contain parts of several commands (2 in this case)
      this.messageBuffer += message.substring(0, eom_i + 2);
      console.log(this.messageBuffer);
      console.log('End of message');
      this.messageBuffer = message.substring(eom_i + 2);
    } else {
      this.messageBuffer += message;
    }
  }

  public static get Instance() {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this());
  }
}