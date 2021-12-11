export class SmilSubMessage {
    constructor(data) {
        // this.id = data.id;
        this.messageContent = data.messageContent;
        this.startTime = data.startTime;
        this.duration = data.duration;
    }

    serialize() {
        return {
            messageContent: this.messageContent,
            startTime: this.startTime,
            duration: this.duration,
            // id: this.id
        }
    }
}