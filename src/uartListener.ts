import { Logger } from 'homebridge';
import SerialPort from 'serialport';
import Readline from '@serialport/parser-readline';
import { ajaxMessageFromString, SerialMessage } from './messages/ajaxSerialMessage';
import { AjaxSerialMessageType } from './ajax';
import { Transform } from 'stream';

const SERIAL_DEVICE_NAME = '/dev/serial0';
const BAUD_RATE = 57600;


export class UartListener {

  private _observers: Record<string, (msg: SerialMessage) => void> = {};

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

    const processMessage = new Transform({ //define transform to parse string messag to object
      readableObjectMode: true,
      transform(chunk: string, encoding, callback) {
        const msg = ajaxMessageFromString(chunk.toString());
        if (msg.messageType !== AjaxSerialMessageType.UNKNOWN) {
          log.debug(`MSG: ${msg}`);
          this.push(msg);
        } else {
          log.debug(`Message skipped: ${chunk.toString()}`);
        }
        callback();
      },
    });

    // process messages line by line
    serialPort.pipe(new Readline({ delimiter: '\r\n', encoding: 'ascii' }))
      .pipe(processMessage) // parse string to message object
      .on('data', (msg: SerialMessage) => { // call device specific handler function
        log.debug(`Calling observers for message ${msg.messageType}`);
        if (msg.deviceId in this._observers) {
          this._observers[msg.deviceId](msg);
        } else {
          log.debug(`Nothing wanted to nandle a message. No observers found. MSG: ${msg}`);
        }
      });

  }

  public static instance(logger: Logger) {
    return this._instance || (this._instance = new this(logger));
  }

  registerObserverForDevice(deviceId: string, observer: (msg:SerialMessage)=>void):void {
    this._observers[deviceId] = observer;
    this.log.debug(`Serial port observer added for device id ${deviceId}`);
  }

}
