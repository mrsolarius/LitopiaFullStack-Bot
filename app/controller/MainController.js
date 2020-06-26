var createError = require('http-errors');

class MainController{

    constructor (req,res,next){
        this.req = req;
        this.res = res;
        this.next = next;
    }

    steper(){
        if(this.req.params.step>0 && this.req.params.step<=3)
            this.res.render('./nous-rejoindre/step/'+this.req.params.step.toString(), { title: 'Rejoindre' });
        else
            this.next(createError(404));
    }
}


module.exports = MainController;