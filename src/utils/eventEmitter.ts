export enum EventEmitterKey {
  INSIGHTS_NOTIFICATION = 'insights_notification',
  AGENT_NEW_TRIGGER = 'agent_new_trigger',
}

export interface EmitterDataType {
  [propName: string]: (...param: any) => any
}

export interface EventEmitterType {
  observerArray: EmitterDataType
  emit(key: string, data: any): void
  on(key: string, func: EmitterDataType[keyof EmitterDataType]): void
  remove(key: string): void
}

const eventEmitter: EventEmitterType = {
  observerArray: {},

  emit(key: string, data: any) {
    Object.keys(this.observerArray).map((funcKey) => {
      if (funcKey === key) {
        this.observerArray[key](data)
      }
    })
  },

  on(key: string, func) {
    this.observerArray[key] = func
  },

  remove(key) {
    delete this.observerArray[key]
  },
}

export default eventEmitter
