let token = Cookies.get('admintoken');
if(token) {
  window.location.replace('/admin/process');
}
$(document).ready(() => {
    let admin;
    //login
    $('#LoginForm').submit(e => {
        e.preventDefault();
        
        const password = $('#password').val();
        const phone = $('#phone').val();

        const LoginData = {
            phone,
            password
        }
       
        axios.post('/api/admins/admin/login', LoginData)
            .then(response => {
                Cookies.set('admintoken',response.data.token , {expires:1} );
                Cookies.set('admin',JSON.stringify(response.data.admin) , {expires:1} );
               
                $('#successModal').modal('show');
                $('#successModalTitle').html('Login Successfully');
                $('#successModalContent').html('Your login is successful. You will be redirected to admin page in a few second.');

                setTimeout(() => {
                    window.location.replace('/admin/dashboard');
                },1500)
            }).catch(e => {
                $('#errorModal').modal('show');
                $('#errorModalTitle').html('Login Failed');
                $('#errorModalContent').html('Wrong Phone & Password. Please try relogin again.');

                setTimeout(() => {
                    window.location.reload();
                },1500);
            })
    })
     /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
        
    });
})