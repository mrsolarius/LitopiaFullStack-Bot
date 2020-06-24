function restForm() {
    $('#form-minecraft').removeClass('has-error');
    $('#form-discord').removeClass('has-error');
    $('#form-message').removeClass('has-error');
    $('#span-minecraft').html('');
    $('#span-discord').html('');
    $('#span-message').html('');
    $('#span-checkbox').html('');
}

function clearFom() {
    $('#candidature-message').val("");
    $('#candidature-discord').val("");
    $('#candidature-minecraft').val("");
    $('#candidature-checkbox').val("");
}

function displayError(json) {
    if (typeof json.error.minecraft != 'undefined'){
        $('#form-minecraft').addClass('has-error');
        json.error.minecraft.forEach(element => {
            $('#span-minecraft').html($('#span-minecraft').html()+element+'<br>');
        });
    }
    if (typeof json.error.discord !='undefined'){
        $('#form-discord').addClass('has-error');
        json.error.discord.forEach(element => {
            $('#span-discord').html($('#span-discord').html()+element+'<br>');
        });
    }
    if (typeof json.error.candidature !='undefined'){
        $('#form-message').addClass('has-error');
        json.error.candidature.forEach(element => {
            $('#span-message').html($('#span-message').html()+element+'<br>');
        });
    }

    if (typeof json.error.checker !='undefined'){
        json.error.checker.forEach(element => {
            $('#span-checkbox').html($('#span-checkbox').html()+element+'<br>');
        });
    }

}

function checker(){
    $.post(window.location.origin+"/api/check/candidature",
    {
        minecraft: $('#candidature-minecraft').val(),
        discord: $('#candidature-discord').val(),
        candidature: $('#candidature-message').val(),
        checker: $('#candidature-checkbox').is(":checked")
    },
    function(json,status){
        restForm();
        displayError(json);
    });
}

function sender(){
    $.post(window.location.origin+"/api/send/candidature",
    {
        minecraft: $('#candidature-minecraft').val(),
        discord: $('#candidature-discord').val(),
        candidature: $('#candidature-message').val(),
        checker: $('#candidature-checkbox').is(":checked")
        
    },
    function(json,status){
        console.log(status);
        if (json.sucess){
            restForm();
            clearFom();
            $('#form-output-global').html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>Votre Candidature à était envoyer RDV sur notre discord 😉</span></p>');
            $('#form-output-global').addClass('active success');
        }else{
            restForm();
            displayError(json);
            $('#form-output-global').html('<p><span class="icon text-middle mdi mdi-alert-outline icon-xxs"></span><span>Votre Candidature et incomplete ou comporte des erreur veuillez la verifier avant de la renvoyer</span></p>');
            $('#form-output-global').addClass('active error');
        }
        setTimeout(function () {
            $('#form-output-global').removeClass("active error success");
        }, 15000);
    });
}

$('#candidature-message').bind('input propertychange', function() {
    if($('#candidature-message').val().length>=256){
        $('#form-message').removeClass('has-error');
        $('#span-message').html('');
    }else {
        $('#form-message').removeClass('has-error');
        $('#span-message').html('');
        $('#form-message').addClass('has-error');
        $('#span-message').html($('#span-message').html()+'Votre candidature doit faire plus de 4 stacks de caracthère');
        console.log('erreur');
    }
});

$('#candidature-message').focusout(function(){
    checker();
});

$('#candidature-minecraft').focusout(function(){
    checker();
});

$('#candidature-discord').focusout(function(){
    checker();
});
$('#candidature-minecraft').bind('input propertychange',function(){
    checker();
});

$('#candidature-checkbox').focus(function () {
    checker();
})


$('#sendForm').click(function () {
    sender();
    $('#form-output-global').html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Traitement en cours</span></p>');
    $('#form-output-global').addClass("active");
    return false;
});
