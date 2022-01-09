
export enum AjaxDeviceType {
  DoorProtect = 1,
  MotionProtect = 2,
  FireProtect = 3,
  GlassProtect = 4,
  LeaksProtect = 5,
  CombiProtect = 8,
  FireProtectPlus = 9,
  SpaceControl = 11,
  MotionProtectPlus = 14,
  NotDefined = 0,
}


export enum AjaxSerialMessageType {
  ALARM = 'ALARM',
  STATUS = 'STATUS',
  RSTATE = 'RSTATE',
  UNKNOWN = ''
}

export enum AjaxAlarmType {
  FloodDetected = 19,
  FloodRemoved = 20
}
