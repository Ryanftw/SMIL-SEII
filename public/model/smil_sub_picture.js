export class SmilSubPicture {
    constructor(data) {
        this.source = data.source;
        this.startTime = data.startTime;
        this.duration = data.duration;
    }

    serialize() {
        return {
            source: this.source,
            startTime: this.startTime,
            duration: this.duration,
            // id: this.id
        }
    }
}