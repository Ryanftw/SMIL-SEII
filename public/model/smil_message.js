export class SmileMessage {
    constructor(data) {
        this.from = data.from;
        this.to = data.to; 
        this.subject = data.subject; 
        this.image1url = data.image1; 
        this.image1name = data.image1name; 
        this.image2url = data.image2; 
        this.image2name = data.image2name; 
        this.audiourl = data.audio; 
        this.audioname = data.audioname; 
        this.textcontent = data.textcontent; 
        this.timesetamp = data.timestamp;
    }

    serialize() {
        return {
            from: this.from,
            to: this.to,
            subject: this.subject, 
            image1: this.image1, 
            image1name: this.image1name, 
            image2: this.image2,
            image2name: this.image2name,
            audio: this.audio,
            audioname: this.audioname,
            textcontent: this.textcontent,
            timestamp: this.timestamp,
        }
    }
}