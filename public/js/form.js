function restForm() {
    $('#form-minecraft').removeClass('has-error');
    $('#form-discord').removeClass('has-error');
    $('#form-message').removeClass('has-error');
    $('#span-minecraft').html('');
    $('#span-discord').html('');
    $('#span-message').html('');
    $('#span-checkbox').html('');
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
        restForm();
        displayError(json);
    });
}

$('#candidature-message').focus(function(){
    checker();
});
$('#candidature-discord').focus(function(){
    checker();
});
$('#candidature-minecraft').focus(function(){
    checker();
});


$('#sendForm').click(function () {
    sender();
    $('#form-output-global').html('<p><span class="icon text-middle mdi mdi-check icon-xxs"></span><span>Votre Candidature à était envoyer</span></p>');
    $('#form-output-global').addClass('active');

    $('#form-output-global').html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xxs"></span><span>Traitement en cours</span></p>');
    $('#form-output-global').addClass("active");
    return false;
});
