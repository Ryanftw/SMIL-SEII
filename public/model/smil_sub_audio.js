export class SmilSubAudio {
    constructor(data) {
        this.source = data.source;
        this.startTime = data.startTime;
        this.duration = data.duration;
        this.startAudioAt = data.startAudioAt;
    }

    serialize() {
        return {
            source: this.source,
            startTime: this.startTime,
            duration: this.duration,
            startAudioAt: this.startAudioAt,
            // id: this.id
        }
    }
}