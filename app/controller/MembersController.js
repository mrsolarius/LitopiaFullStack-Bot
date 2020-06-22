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

    async getStaf(){
        let data = await db.query("SELECT * FROM MEMBERS WHERE rolename != 'Litopien' and rolename not null;");
        this.litopien = data.rows;
    }

    async displayMembers() {
        await this.getMembers();

        this.res.render('./membres/DisplayMembers', { title: 'Nos Membres',members:this.litopien});
    }
}

module.exports = MembersController;