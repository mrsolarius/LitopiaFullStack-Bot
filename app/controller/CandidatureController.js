const get = require('../usefullScript/xhrRequest');
const split = require('../usefullScript/arraySplitter');
const db = require('../../database/databaseController');
const bot = require('../../discordBot/bot');
const digits_only = string => [...string].every(c => '0123456789'.includes(c));

class CandidatureController{

    constructor (req,res){
        this.req = req;
        this.res = res;
    }

    /**
     * Fonction permettant de récuper les cles primaire d'un compte minecraft via l'api de mojang
     * @param String minecraftNickname
     * @returns apiJSON 
     */
    async getMCAPI(minecraftNickname){
        let apiJSON = await get('https://api.mojang.com/users/profiles/minecraft/'+minecraftNickname).then(function (apiJSON) {
            return JSON.parse(apiJSON);
        }).catch(function (err) {
            return err
        });

        return apiJSON;        
    }

    /**
     * Verifie dans la base de donnée si l'identifiant discord et déjà présent dans la base de donnée
     * @param string idDiscord 
     * @returns bolean
     */
    async isDiscordInDatabase(idDiscord){
        let data = await db.query('SELECT count(*) FROM MEMBERS WHERE idDiscord = $1 ', [idDiscord]);
        if(data.rows[0].count==0)return false;
        return true;
    }

    async isMinecraftInDatabase(minecraftNickname){
        var json = await this.getMCAPI(minecraftNickname).catch(function (err) {
            return err;
        });
        var data = await db.query('SELECT count(*) FROM MEMBERS WHERE minecraftUUID = $1 ', [json.id]);
        if(data.rows[0].count==0)return false;
        return true;        
    }

    
    /**
     * Function prenant en entrait les parametre de base du formulaire
     * Puis remplis le json contenant les erreur de validation (this.errReturn)
     * @param {minecraft,discord,candidature} data 
     */
    async localCheck(data){

        this.errReturn = {
            error:{},
            sucess:true
        };

        if(this.req.body.discord.length ==18){
            try {
                console.log(this.req.body.discord)
                await global.bot.client.guilds.resolve("390427003779809281").members.fetch(this.req.body.discord);
            } catch (error) {
                //console.error(error);
                if(typeof this.errReturn.error.discord === 'undefined')this.errReturn.error.discord=[];
                this.errReturn.error.discord.push('Veuillez d\'abords vous connecter à notre discord en <a href="https://discord.gg/AFPw3Zv">cliquant ici</a>');
                this.errReturn.sucess = false;
            }
        }

        if(data.checker =='false'){
            if(typeof this.errReturn.error.checker === 'undefined')this.errReturn.error.checker=[];
            this.errReturn.error.checker.push('Pour que votre candidature soit traité vous devez accepter les conditions d\'utilisation de ce formulaire');
            this.errReturn.sucess = false;
        }

        if(data.minecraft.length==0){
            if(typeof this.errReturn.error.minecraft === 'undefined')this.errReturn.error.minecraft=[];
            this.errReturn.error.minecraft.push('Votre pseudo minecraft est requis.');
            this.errReturn.sucess = false;
        }
        
        if(data.discord.length === 0){
            if(typeof this.errReturn.error.discord === 'undefined')this.errReturn.error.discord=[];
            this.errReturn.error.discord.push('Votre identifiant est requis.');
            this.errReturn.sucess = false;
        }

        if(data.discord.length!=18){
            if(typeof this.errReturn.error.discord === 'undefined')this.errReturn.error.discord=[];
            this.errReturn.error.discord.push('Votre identifiant discord doit faire 18 caractères.');
            this.errReturn.sucess = false;
        }

        if(!digits_only(data.discord)){
            if(typeof this.errReturn.error.discord === 'undefined')this.errReturn.error.discord=[];
            this.errReturn.error.discord.push('Votre identifiant discord doit être numérique');
            this.errReturn.sucess = false;
        }

        if(data.candidature.length==0){
            if(typeof this.errReturn.error.candidature === 'undefined')this.errReturn.error.candidature=[];
            this.errReturn.error.candidature.push('Une candidature est requise.');
            this.errReturn.sucess = false;
        }

        if(data.candidature.length<256){
            if(typeof this.errReturn.error.candidature === 'undefined')this.errReturn.error.candidature=[];
            this.errReturn.error.candidature.push('Votre candidature doit faire plus de 4 stacks de caractères.');
            this.errReturn.sucess = false;
        }
        
        //mode asyncrone (environ 150ms de temps de réponse)
        var asyncData = await Promise.all([this.getMCAPI(data.minecraft),this.isDiscordInDatabase(data.discord),this.isMinecraftInDatabase(data.minecraft)]).then(function(arr) {
            return arr;
        }).catch(function (error) {
            return error;
        });
        
        

        //mode syncrone (environ 400ms pour executer la requette)
        /*
        var asyncData = []
        asyncData.push(await this.getMCAPI(data.minecraft));
        asyncData.push(await this.isDiscordInDatabase(data.discord));
        asyncData.push(await this.isMinecraftInDatabase(data.minecraft));
        */

        if(typeof asyncData[0].status=='number'){
            if(typeof this.errReturn.error.minecraft === 'undefined')this.errReturn.error.minecraft=[];
            this.errReturn.error.minecraft.push('Votre pseudo minecraft n\'existe pas.');
            this.errReturn.sucess = false;
        }

        if(asyncData[2]){
            if(typeof this.errReturn.error.minecraft === 'undefined')this.errReturn.error.minecraft=[];
            this.errReturn.error.minecraft.push('Votre pseudo minecraft est déjà utilisé par l\'un de nos membres.');
            this.errReturn.sucess = false;
        }
        
        if(asyncData[1]){
            if(typeof this.errReturn.error.discord === 'undefined')this.errReturn.error.discord=[];
            this.errReturn.error.discord.push('Ce compte discord et déjà utilisé');
            this.errReturn.sucess = false;
        }        
    }

    async checker(){
        await this.localCheck(this.req.body);
        this.res.setHeader('Content-Type', 'application/json');
        this.res.send(this.errReturn);
    }

    async send(){
        await this.localCheck(this.req.body);
        if(this.errReturn.sucess){
            
            var member = {};
            member.discordID = this.req.body.discord;
            member.minecraft = this.req.body.minecraft;
            member.candidature = this.req.body.candidature;
            member.date = new Date();
            try{
                let user = await global.bot.client.users.fetch(this.req.body.discord)
                member.discord = user.username;
            }catch(e){ 
                this.errReturn.sucess = false;
                this.errReturn.code = 500;
                this.res.setHeader('Content-Type', 'application/json');    
                this.res.send(this.errReturn);         
            }
            try{
                let mcjson = await this.getMCAPI(this.req.body.minecraft);
                member.minecraftUUID = mcjson.id;
            }catch{
                this.errReturn.sucess = false;
                this.errReturn.code = 500;
                this.res.setHeader('Content-Type', 'application/json');    
                this.res.send(this.errReturn);   
            }
            this.composeDiscordMessage(member);
            var data = await db.query('Insert into MEMBERS values($1,$2,$3,$4,$5,$6)',[member.discordID,member.minecraftUUID,member.discord,member.minecraft,member.candidature,member.date]);
            this.res.setHeader('Content-Type', 'application/json');
            this.res.send(this.errReturn);
        }else{
            this.res.setHeader('Content-Type', 'application/json');
            this.res.send(this.errReturn);
        }
       
    }
    async composeDiscordMessage(member){
        var chanToSend = await global.bot.client.channels.fetch('722114238553784400');
        var splitingText = split(member.candidature,2048);
        var candidature;
        var firstEmbed = {
            embed:{
                title: "Nouvelle candidature !",
                description: "Veuillez voter pour notre nouveau candidat !",
                color: 7506394,
                fields: [
                    {
                    name: "Minecraft",
                    value: member.minecraft,
                    inline: true
                    },
                    {
                    name: "Discord",
                    value: `<@${member.discordID}>`,
                    inline: true
                    }
                ],
                footer: {
                    text: `Page 1/${splitingText.length+1}`
                },
                timestamp: member.date,
                thumbnail: {
                    url: "https://crafatar.com/avatars/"+member.minecraftUUID
                }
            }
        };
        chanToSend.send(firstEmbed);
        for(var i = 0; i < splitingText.length; i++){
            candidature = {
                embed:{
                    timestamp: member.date,
                    description:`${splitingText[i]}`,
                    footer: {
                        text: `Page ${i+2}/${splitingText.length+1}`
                    }
                }
            };
            
            if(i==0){
                candidature.embed.title = `Candidature de ${member.minecraft}`;
            }
            
            if(i==splitingText.length-1){
                let message = await chanToSend.send(candidature);
                try {
                    await message.react('👍');
                    await message.react('👎');
                } catch (error) {
                    console.error('One of the emojis failed to react.');
                }
                const filter = (reaction, user) => {
                    return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
            }else{
                chanToSend.send(candidature);
            }
        }
    }

}
module.exports = CandidatureController;

       /*
       ,
       \`-._           __
        \\  `-..____,.'  `.
         :`.         /    \`.
         :  )       :      : \
          ;'        '   ;  |  :
          )..      .. .:.`.;  :
         /::...  .:::...   ` ;
         ; _ '    __        /:\
         `:o>   /\o_>      ;:. `.
        `-`.__ ;   __..--- /:.   \
        === \_/   ;=====_.':.     ;
         ,/'`--'...`--....        ;
              ;                    ;
            .'                      ;
          .'                        ;
        .'     ..     ,      .       ;
       :       ::..  /      ;::.     |
      /      `.;::.  |       ;:..    ;
     :         |:.   :       ;:.    ;
     :         ::     ;:..   |.    ;
      :       :;      :::....|     |
      /\     ,/ \      ;:::::;     ;
    .:. \:..|    :     ; '.--|     ;
   ::.  :''  `-.,,;     ;'   ;     ;
.-'. _.'\      / `;      \,__:      \
`---'    `----'   ;      /    \,.,,,/
                   `----`              
 * TypeError: Cannot read property 'minecraft' of undefined
 * at CandidatureController.localCheck (D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\app\controller\CandidatureController.js:19:81)
    at CandidatureController.checker (D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\app\controller\CandidatureController.js:38:14)
    at D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\routes\index.js:27:17
    at Layer.handle [as handle_request] (D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\node_modules\express\lib\router\layer.js:95:5)
    at next (D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\node_modules\express\lib\router\route.js:137:13)
    at Route.dispatch (D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\node_modules\express\lib\router\route.js:112:3)
    at Layer.handle [as handle_request] (D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\node_modules\express\lib\router\layer.js:95:5)
    at D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\node_modules\express\lib\router\index.js:281:22
    at Function.process_params (D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\node_modules\express\lib\router\index.js:335:12)
    at next (D:\Utilisateur\Louis\Nextcloud\DevProject\LitopiaFullStack&amp;Bot\node_modules\express\lib\router\index.js:275:10)
*/