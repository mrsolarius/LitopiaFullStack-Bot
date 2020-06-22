const db = require('../../database/databaseController');

class MembersController {
    constructor (req,res){
        this.req = req;
        this.res = res;
    }

    async getMembers(){
        let data = await db.query("SELECT * FROM MEMBERS WHERE rolename = 'Litopien';");
        this.litopien = data.rows;
    }

    async getMember(member){
        console.log(member);
        let data = await db.query("SELECT * FROM MEMBERS WHERE minecraftnickname = $1 and rolename is not null;",[member]);
        this.member = data.rows[0];
    }

    async getStaf(){
        let data = await db.query("SELECT * FROM MEMBERS WHERE rolename != 'Litopien' and rolename not null;");
        this.litopien = data.rows;
    }

    async displayMembers() {
        await this.getMembers();
        this.res.render('./membres/DisplayMembers', { title: 'Nos Membres',members:this.litopien});
    }

    async displayMember(){
        await this.getMember(this.req.params.nickname);
        console.log(`test
        lol
        li
        lol`);
        this.res.render('./membres/DisplayMember', { title: 'Nos Membres',membre:this.member});
    }
}

module.exports = MembersController;