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
})