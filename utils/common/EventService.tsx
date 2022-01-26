
type EventCallback<EventMessageType>= {
    eventType: EventMessageType,
    callback: Function
}

class EventListener<EventMessageType>{
    callbacks: EventCallback<EventMessageType>[]
    constructor(){
        this.callbacks = []
    }

    addEventListener(eventType: EventMessageType, callback: Function){
        this.callbacks.push({
            eventType,
            callback
        })
    }

    removeEventListener(callback: Function){
        this.callbacks = this.callbacks.filter(listenerObj => {
           return listenerObj.callback !== callback
        })
    }

    emitEvent(eventType: EventMessageType, ...eventArgs: any[]){
        this.callbacks.forEach(listenerObj => {
            if(listenerObj.eventType === eventType){
                listenerObj.callback(...eventArgs);
            }
        })
    }

}

export default EventListener;