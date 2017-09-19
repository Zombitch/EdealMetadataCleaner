MCEngine = {
  triggerType : {
    TRIGGER_SEND_MAIL : 1,
    TRIGGER_INTERACT_WITH_NODE : 2
  },

  eventType : {
    EVENT_EVENT: 1,
    EVENT_VALUE_CHANGE : 2
  },

  //Used to store timeout object which aim to rollback an action
  delayedBackAction : {},

  /**
  * Get the list of available event Type
  * @return EventType Enum
  */
  getEventType:function(){
    return this.eventType;
  }
};

module.exports = MCEngine;
