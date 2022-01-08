import { Serial } from 'raspi-serial';
import { init } from 'raspi';
import { Logger } from 'homebridge';

export class UartListener {

  private static _instance: UartListener;
  private messageBuffer = '';
  // private serial: Serial;

  private constructor(private readonly log: Logger) {
    this.log.debug('Uart listener created');

    init(() => {
      const serial = new Serial({baudRate: 57600});
      serial.open(() => {
        // this.serial = serial;
        serial.on('data', (data) => {
          this.receiveData(data);
        } );
      });
    });
  }

  receiveData(receiveData: Buffer) {
    const message = receiveData.toString('ascii');
    const eom_i = message.indexOf('\r\n');

    if (eom_i >= 0) { // one buffer may contain parts of several commands (2 in this case)
      this.messageBuffer += message.substring(0, eom_i + 2);
      this.log.debug(this.messageBuffer);
      this.messageBuffer = message.substring(eom_i + 2);
    } else {
      this.messageBuffer += message;
    }
  }

  public static instance(logger: Logger) {
    // Do you need arguments? Make it a regular static method instead.
    return this._instance || (this._instance = new this(logger));
  }
}
