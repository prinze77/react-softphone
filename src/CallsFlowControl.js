import { UA, debug } from 'jssip'
import _ from 'lodash'

function CallsFlowControl() {
  this.onUserAgentAction = () => {}

  this.notify = (message) => {
    this.onCallActionConnection('notify', message)
  }
  this.tmpEvent = () => {
    console.log(this.activeCall)
    console.log(this.callsQueue)
    console.log(this.holdCallsQueue)
  }
  this.onCallActionConnection = () => {}
  this.engineEvent = () => {}
  this.setMicMuted = () => {
    if (this.micMuted && this.activeCall) {
      this.activeCall.unmute()
      this.micMuted = false
      this.onCallActionConnection('unmute', this.activeCall.id)
    } else if (!this.micMuted && this.activeCall) {
      this.micMuted = true
      this.activeCall.mute()
      this.onCallActionConnection('mute', this.activeCall.id)
    }
  }
  this.hold = (sessionId) => {
    // If there is an active call with id that is requested then fire hold
    if (this.activeCall.id === sessionId) {
      this.activeCall.hold()
    }
  }
  this.unhold = (sessionId) => {
    // If we dont have active call then unhold the the call with requested id
    if (!this.activeCall) {
      // Find the Requested call in hold calls array
      const toUnhold = _.find(this.holdCallsQueue, { id: sessionId })
      // If we found the call in hold calls array the fire unhold function
      if (toUnhold) {
        toUnhold.unhold()
      }
    } else {
      console.log('Please exit from all active calls to unhold')
    }
  }
  this.micMuted = false
  this.activeCall = null
  this.activeChanel = null
  this.callsQueue = []
  this.holdCallsQueue = []
  this.player = {}
  this.ringer = null
  this.connectedPhone = null
  this.config = {}
  this.initiated = false
  this.playRing = () => {
    this.ringer.current.currentTime = 0
    this.ringer.current.play()
  }
  this.stopRing = () => {
    this.ringer.current.currentTime = 0
    this.ringer.current.pause()
  }
  this.removeCallFromQueue = (callId) => {
    _.remove(this.callsQueue, (calls) => calls.id === callId)
  }
  this.addCallToHoldQueue = (callId) => {
    if (this.activeCall.id === callId) {
      this.holdCallsQueue.push(this.activeCall)
    }
  }
  this.removeCallFromActiveCall = (callId) => {
    if (this.activeCall && callId === this.activeCall.id) {
      this.activeCall = null
    }
  }
  this.removeCallFromHoldQueue = (callId) => {
    _.remove(this.holdCallsQueue, (calls) => calls.id === callId)
  }
  this.connectAudio = () => {
    this.activeCall.connection.addEventListener('addstream', (event) => {
      this.player.current.srcObject = event.stream
    })
  }

  this.sessionEvent = (type, data, cause, callId) => {
    // console.log(`Session: ${type}`);
    // console.log('Data: ', data);
    // console.log('callid: ', callId);

    switch (type) {
      case 'terminated':
        //  this.endCall(data, cause);
        break
      case 'accepted':
        // this.startCall(data);
        break
      case 'reinvite':
        this.onCallActionConnection('reinvite', callId, data)
        break
      case 'hold':
        this.onCallActionConnection('hold', callId)
        this.addCallToHoldQueue(callId)
        this.removeCallFromActiveCall(callId)
        break
      case 'unhold':
        this.onCallActionConnection('unhold', callId)
        this.activeCall = _.find(this.holdCallsQueue, { id: callId })
        this.removeCallFromHoldQueue(callId)
        break
      case 'dtmf':
        break
      case 'muted':
        this.onCallActionConnection('muted', callId)
        break
      case 'unmuted':
        break
      case 'confirmed':
        if (!this.activeCall) {
          this.activeCall = _.find(this.callsQueue, { id: callId })
        }
        this.removeCallFromQueue(callId)
        this.onCallActionConnection('callAccepted', callId, this.activeCall)
        break
      case 'connecting':
        break
      case 'ended':
        this.onCallActionConnection('callEnded', callId)
        this.removeCallFromQueue(callId)
        this.removeCallFromActiveCall(callId)
        this.removeCallFromHoldQueue(callId)
        if (this.callsQueue.length === 0) {
          this.stopRing()
        }
        break
      case 'failed':
        this.onCallActionConnection('callEnded', callId)
        this.removeCallFromQueue(callId)
        this.removeCallFromActiveCall(callId)
        if (this.callsQueue.length === 0) {
          this.stopRing()
        }
        break
      default:
        break
    }
  }

  this.handleNewRTCSession = (rtcPayload) => {
    const { session: call, request } = rtcPayload
    if (call.direction === 'incoming') {
      this.callsQueue.push(call)
      this.onCallActionConnection('incomingCall', call)
      if (!this.activeCall) {
        this.playRing()
      }
    } else {
      this.activeCall = call
      this.onCallActionConnection('outgoingCall', call)
      this.connectAudio()
    }
    const defaultCallEventsToHandle = [
      'peerconnection',
      'connecting',
      'sending',
      'progress',
      'accepted',
      'newDTMF',
      'newInfo',
      'hold',
      'unhold',
      'muted',
      'unmuted',
      'reinvite',
      'update',
      'refer',
      'replaces',
      'sdp',
      'icecandidate',
      'getusermediafailed',
      'ended',
      'failed',
      'connecting',
      'confirmed'
    ]
    _.forEach(defaultCallEventsToHandle, (eventType) => {
      call.on(eventType, (data, cause) => {
        this.sessionEvent(eventType, data, cause, call.id)
      })
    })
  }

  this.init = () => {
    try {
      this.phone = new UA(this.config)
      this.phone.on('newRTCSession', this.handleNewRTCSession.bind(this))
      const binds = [
        'connected',
        'disconnected',
        'registered',
        'unregistered',
        'registrationFailed',
        'invite',
        'message',
        'connecting'
      ]
      _.forEach(binds, (value) => {
        this.phone.on(value, (e) => {
          this.engineEvent(value, e)
        })
      })
      this.initiated = true
    } catch (e) {
      console.log(e)
    }
  }

  this.call = (to) => {
    if (!this.connectedPhone) {
      this.notify('Please connect to Voip Server in order to make calls')
      console.log('User agent not registered yet')
      return
    }
    if (this.activeCall) {
      this.notify('Already have an active call')
      console.log('Already has active call')
      return
    }
    this.phone.call(`sip:${to}@${this.config.domain}`, {
      extraHeaders: ['First: first', 'Second: second'],
      RTCConstraints: {
        optional: [{ DtlsSrtpKeyAgreement: 'true' }]
      },
      mediaConstraints: {
        audio: true
      },
      sessionTimersExpires: 600
    })
  }

  this.answer = (sessionId) => {
    if (this.activeCall) {
      this.notify('Already have an active call')
      console.log('Already has active call')
    } else if (this.activeChanel.inCall) {
      this.notify('Current chanel is busy')
      console.log('Chanel is Busy')
    } else {
      // Stop the annoying ring ring
      this.stopRing()

      // Get the call from calls Queue
      this.activeCall = _.find(this.callsQueue, { id: sessionId })
      if (this.activeCall) {
        this.activeCall.customPayload = this.activeChanel.id
        this.activeCall.answer({
          mediaConstraints: {
            audio: true
          }
        })

        // Connect Audio
        this.connectAudio()
      }
    }
  }

  this.hungup = (e) => {
    this.phone._sessions[e].terminate()
  }

  this.start = () => {
    if (!this.initiated) {
      this.notify('Error: 356 Please report')
      console.log('Please call .init() before connect')
      return
    }

    if (this.config.debug) {
      debug.enable('JsSIP:*')
    } else {
      debug.disable()
    }
    this.phone.start()
  }

  this.stop = () => {
    this.phone.stop()
  }
}

export default CallsFlowControl
