class Member{
    constructor(discordId,minecraftNickname,candidature){
        this.minecraftUIDiscordId = discordId;
        this.minecraftNickname = minecraftNickname;
        this.candidature = candidature;
    }

    checkCandidature() {
        if(this.candidature.lenght<256)return false;
        return true;
    }

    checkMinecraftUsername
}