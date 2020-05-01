let token = Cookies.get('admintoken');
if(token) {
  window.location.replace('/admin/dashboard');
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
                alert("success");
                window.location.replace('/admin/dashboard');
            }).catch(e => {
                alert(e);
            })
    })
})