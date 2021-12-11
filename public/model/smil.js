export class Smil {
    constructor(data) {
        this.from = data.from;
        this.sendTo = data.sendTo;
        this.subMsgId = data.subMsgId;
        this.subAudioId = data.subAudioId;
        this.subPicture1Id = data.subPicture1Id;
        this.subPicture2Id = data.subPicture2Id;
        this.duration = data.duration;
        this.timestamp = data.timestamp;
    }

    // addMessage(subMessage){
    //     if(!this.subMessages) this.subMessages = [];
    //     if(subMessage.duration + subMessage.startTime < this.duration){
    //         const newMsg = subMessage.serialize();
    //         newMsg.docId = subMessage.docId;
    //         this.subMessages.push(newMsg);
    //     }
    // }

    // addAudio(subAudio){
    //     if(!this.subAudios) this.subAudios = [];
    //     if(subAudio.duration + subAudio.startTime < this.duration){
    //         const newAudio = subAudio.serialize();
    //         newAudio.docId = subAudio.docId;
    //         this.subAudios.push(newAudio);
    //     }
    // }

    // addPictures(subPic){
    //     if(!this.subPic) this.subPictures = [];
    //     if(subPic.duration + subPic.startTime < this.duration){
    //         const newPic = subPic.serialize();
    //         newPic.docId = subPic.docId;
    //         this.subPictures.push(newPic);
    //     }
    // }


    serialize() {
        return {
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