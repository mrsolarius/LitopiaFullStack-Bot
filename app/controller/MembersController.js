const db = require('../../database/databaseController');
var createError = require('http-errors');

class MembersController {
    constructor (req,res,next){
        this.req = req;
        this.res = res;
        this.next = next;
    }


    async getMembers(){
        let data = await db.query("SELECT * FROM MEMBERS WHERE rolename = 'Litopien';");
        this.litopien = data.rows;
    }

    async getStaff(){
        let data = await db.query("SELECT * FROM MEMBERS WHERE rolename not in ('Litopien','Refuser');");
        this.staff = data.rows;
    }

    async getMember(member){
        let data = await db.query("SELECT * FROM MEMBERS WHERE minecraftnickname = $1 and rolename is not null;",[member]);
        this.member = data.rows[0];
    }

    async getMemberItemStats(discordID,minecraftUUID){
        let data = await db.query("SELECT * FROM itemstat WHERE iddiscord = $1 and minecraftuuid = $2;",[discordID,minecraftUUID]);
        this.member.ItemStats = data.rows;
    }

    async getMemberMobStats(discordID,minecraftUUID){
        let data = await db.query("SELECT * FROM mobstat WHERE iddiscord = $1 and minecraftuuid = $2;",[discordID,minecraftUUID]);
        this.member.MobsStats = data.rows;
    }

    async displayMembers() {
        await Promise.all([this.getMembers(),this.getStaff()])
        this.res.render('./membres/DisplayMembers', { title: 'Nos Membres',members:this.litopien,staffmembers:this.staff});
    }

    async displayMember(){

        await this.getMember(this.req.params.nickname);

        if(typeof(this.member)=='undefined'){
            this.next(createError(404));
        }

        await Promise.all([this.getMemberItemStats(this.member.iddiscord,this.member.minecraftuuid),this.getMemberMobStats(this.member.iddiscord,this.member.minecraftuuid)]);
        console.log(this.member);
        this.res.render('./membres/DisplayMember', { title: 'Nos Membres',membre:this.member,});
    }
}

module.exports = MembersController;