export class Smil {
    constructor(data) {
        this.from = data.from;
        this.sendTo = data.sendTo;
        this.subMessages = data.subMessages;
        this.subAudios = data.subAudio;
        this.subPictures = data.subPicture;
        this.duration = data.duratoin;
        this.timestamp = data.timestamp;
    }

    addMessage(subMessage){
        if(!this.subMessages) this.subMessages = [];
        if(subMessage.duration + subMessage.startTime < this.duration){
            const newMsg = subMessage.serialize();
            newMsg.docId = subMessage.docId;
            this.subMessages.push(newMsg);
        }
    }

    addAudio(subAudio){
        if(!this.subAudios) this.subAudios = [];
        if(subAudio.duration + subAudio.startTime < this.duration){
            const newAudio = subAudio.serialize();
            newAudio.docId = subAudio.docId;
            this.subAudios.push(newAudio);
        }
    }

    addPictures(subPic){
        if(!this.subPic) this.subPictures = [];
        if(subPic.duration + subPic.startTime < this.duration){
            const newPic = subPic.serialize();
            newPic.docId = subPic.docId;
            this.subPictures.push(newPic);
        }
    }


    serialize() {
        return {
            from: this.from,
            sendTo: this.sendTo,
            subMessages: this.subMessages,
            subAudios: this.subAudios,
            subPictures: this.subPictures,
            duration: this.duration,
            timestamp: this.timestamp,
        }
    }
}