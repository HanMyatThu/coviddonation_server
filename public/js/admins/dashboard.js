$(document).ready(() => {
    var code = '';
    var user = '';
    const token = Cookies.get('admintoken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }

    $('#registerForm').submit(e => {
        e.preventDefault();
        const name = $('#name').val();
        const password = '123456'
        const township = $('#township').val();
        const phone = $('#phone').val();
        const familyNo = $('#familyNo').val();

        
        //alert(name+ age + email + password + nrc + township + street + city + country + phone + familyNo);

        const RegisterData = {
            name,
            township,
            phone,
            familyNo,
            password
        }
        axios.post('/users/register', RegisterData)
            .then(response => {
                user = response.data;
                const dumpData = {
                    "approved" : true
                }
                axios.put(`/api/admin/users/${response.data._id}/approved`,dumpData,{ headers})
                    .then(response => {
                        const codeData = {
                            owner: user._id
                        }
                        axios.post('/api/admin/codes',codeData,{headers})
                            .then(response => {
                                code = response.data;
                                $('#code').val(code.text);
                                $('#processCreateBtn').attr('disabled',false);
                                $('#successModal').modal('show');
                                $('#successModalTitle').html('Register Successfully');
                                $('#successModalContent').html('Your Registeration is successful.');

                                $('#name').val('');
                                $('#township').val('');
                                $('#phone').val('');
                                $('#familyNo').val('');
                
                                setTimeout(() => {
                                    $('#successModal').modal('hide');
                                },1500);

                            }).catch(e => {
                            }); 
                    }).catch(e => {
                        $('#errorModal').modal('show');
                        $('#errorModalTitle').html('User approval failed');
                        $('#errorModalContent').html('Your approval of user is failed. Please contact support.');
                    });

            }).catch(e => {
                $('#errorModal').modal('show');
                $('#errorModalTitle').html('Register Failed');
                $('#errorModalContent').html('Wrong Registration. Please try again.');

                setTimeout(() => {
                    window.location.reload();
                },1500);
            })
    });

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

    /**
     * Create Process
     */
    $('#processForm').submit(e => {
        e.preventDefault();

        const name = $('#machineID').val();
        const process ={
            userid: user._id,
            name,
            code: code.text
        }
        
        axios.post('/api/admin/processes',process,{headers})
            .then(response => {
                $('#successModal').modal('show');
                $('#successModalTitle').html('Process Successfully');
                $('#successModalContent').html('Withdrawing Process is successful.U can try again now.');

                setTimeout(() => {
                    window.location.reload();
                },1500);
            }).catch(e => {
                console.log(e.toString());
                $('#errorModal').modal('show');
                $('#errorModalTitle').html('Process Failed');
                $('#errorModalContent').html('User already withdrew Rice.Unable to do this action now. ');
            })
    })
});