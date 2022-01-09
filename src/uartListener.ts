import { Logger } from 'homebridge';
import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';

const SERIAL_DEVICE_NAME = '/dev/serial0';
const BAUD_RATE = 57600;
export class UartListener {

  public messageObserver: ((msg: string) => void) | undefined;

  private static _instance: UartListener;

  private constructor(private readonly log: Logger) {
    const serialPort = new SerialPort(SERIAL_DEVICE_NAME, {baudRate: BAUD_RATE},
      (err) => {
        if (err) {
          this.log.error('Unable to open serial port: ' + err);
        } else {
          this.log.debug(`Serial port open: ${SERIAL_DEVICE_NAME}, rate=${BAUD_RATE}`);
        }
      });
    const parser = serialPort.pipe(new Readline({ delimiter: '\r\n', encoding: 'ascii' }));
    parser.on('data', (data) => {
      this.log.debug(data);
    });
  }

  public static instance(logger: Logger) {
    return this._instance || (this._instance = new this(logger));
  }

}
