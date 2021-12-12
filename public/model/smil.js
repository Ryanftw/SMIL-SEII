export class Smil {
    constructor(data) {
        this.sent = data.sent;
        this.from = data.from;
        this.sendTo = data.sendTo;
        this.subMsgId = data.subMsgId;
        this.subAudioId = data.subAudioId;
        this.subPicture1Id = data.subPicture1Id;
        this.subPicture2Id = data.subPicture2Id;
        this.duration = data.duration;
        this.timestamp = data.timestamp;
    }

    serialize() {
        return {
            sent: this.sent,
            from: this.from,
            sendTo: this.sendTo,
            subMsgId: this.subMsgId,
            subAudioId: this.subAudioId,
            subPicture1Id: this.subPicture1Id,
            subPicture2Id: this.subPicture2Id,
            duration: this.duration,
            timestamp: this.timestamp,
        }
    }
}