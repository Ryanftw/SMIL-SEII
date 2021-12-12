import { SmilSubAudio } from "./smil_sub_audio.js";
import { SmilSubMessage } from "./smil_sub_message.js";
import { SmilSubPicture } from "./smil_sub_picture.js";

export class SmilClient {
    constructor(data) {
        this.from = data.from;
        this.sendTo = data.sendTo;
        this.subMsg = SmilSubMessage(data.subMsg);
        this.subAudio = SmilSubAudio(data.subAudio);
        this.subPicture1 = SmilSubPicture(data.subPicture1);
        this.subPicture2 = SmilSubPicture(data.subPicture2);
        this.duration = data.duration;
        this.timestamp = data.timestamp;
    }

    serialize() {
        return {
            from = this.from,
            sendTo = this.sendTo,
            subMsg = this.subMsg.serialize(),
            subAudio = this.subAudio.serialize(),
            subPicture1 = this.subPicture1.serialize(),
            subPicture2 = this.subPicture2.serialize(),
            duration = this.duration,
            timestamp = this.timestamp,
        }
    }
}