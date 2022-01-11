
<p align="center">

<img src="./docs/logos.png" width="450">

</p>


# Homebridge Plugin for Ajax Systems (via UART bridge)

[Uart bridge device](https://support.ajax.systems/en/manuals/uartbridge/)

The simplest way to connect is to use RaspberyPi as a host or any other "computer" with UART pins.

## [Connecting hardware to Raspberry Pi](./docs/raspberry-uart.md)

## Solving `Unable to open serial port: Permission denied`
If you see this error in Homebridge logs after installing plugin this means you still need to fix few things.

Depending on how you install and run homebridge it will differ slightly

### Installed as docker container
The issue is that container by default does not have access to serial port that you used to connect to UART bridge.

To fix:
1. Include this 2 lines in your docker-compose.yml under homebridge section
```yml
devices:
      - "/dev/serial0:/dev/serial0"
```
2. Make sure homebridge process is ran under user that has access to respective serial port.
To do that

  * On the host machine, check what user group has access to serial port `sudo ls -l /dev |grep serial`

  * What user are you running under: `whoami`
  * In your docker-compose.yml update `PGID` and `PUID` to match ids of group and user that you saw above.

Final result can look like:
```yml
version: '2'
services:
  homebridge:
    image: oznu/homebridge:latest
    container_name: homebridge
    restart: always
    network_mode: host
    environment:
      - TZ=Europe/Kiev
      - PGID=1000
      - PUID=1000
      - HOMEBRIDGE_CONFIG_UI=1
      - HOMEBRIDGE_CONFIG_UI_PORT=8581
    devices:
      - "/dev/serial0:/dev/serial0"
    volumes:
      - ./homebridge:/homebridge
```
