import { API } from 'homebridge';

import { PLATFORM_NAME } from './settings';
import { AjaxSystemsUartPlatform } from './platform';
import { UartListener } from './uartListener';

/**
 * This method registers the platform with Homebridge
 */
export = (api: API) => {
  UartListener.Instance; //initialize
  api.registerPlatform(PLATFORM_NAME, AjaxSystemsUartPlatform);
};
