const stripe = Stripe('pk_test_51LxXaMA3Pa2TDpvc20HEW0ziYnFcHqbIsMZp2jXNNjMiVhM8HkaCn4RLCUp2qYAfskNPKnQpJwe8GRyjoI8dysRf006iYsieqk');

var $form = $('#checkout-form');

$form.submit(function(event){
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
    }, stripResponseHandler);
    return false;
});

function stripResponseHandler(status, response){
    if (response.error){
        //Show the errors on the form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false);
    }else {
        //Get the token ID:
        var token = response.id;
        //Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken"/>').val(token));
        //Submit the form:
        $form.get(0).submit();
    }

}