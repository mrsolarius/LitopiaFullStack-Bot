class MainController{

    constructor (req,res){
        this.req = req;
        this.res = res;
    }

    steper(){
        if(this.req.params.step>0 && this.req.params.step<=3)
            this.res.render('./nous-rejoindre/step/'+this.req.params.step.toString(), { title: 'Rejoindre' });
    }
}


module.exports = MainController;