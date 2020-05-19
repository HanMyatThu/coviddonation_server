$(document).ready(() => {

    let token = Cookies.get('admintoken');
    let admin = '';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }

    axios.get('/api/admins/admin/me',{headers})
        .then(response => {
            admin  = response.data;
            $('#duration').val(response.data.setting)
        }).catch(e => {
            console.log(e);
        })

    $('#btnMcEdit').click(e => {
        $('#btnMcSubmit').attr('disabled',false);
        $('#btnMcCancel').removeClass('nodisplay');

        $('#duration').attr('disabled', false);
    })

    $('#btnMcCancel').click(e => {
        $('#btnMcSubmit').attr('disabled',true);
        $('#btnMcCancel').addClass('nodisplay');

        $('#duration').attr('disabled', true);
        $('#duration').val(admin.setting)
    })

    $('#settingForm').submit(e => {
        e.preventDefault();

        const setting = $('#duration').val();
        axios.put('/api/admins/admin/setting' , {setting},{headers})
            .then(response => {
                $('#successModal').modal('show');
                $('#successModalTitle').html('Setting Changed');
                $('#successModalContent').html('You have successfully updated your setting for transaction.This is start efftecting the next transaction period.');
                setTimeout(() => {
                    window.location.reload();
                },1500)
            }).catch(e => {
                console.log(e);
            })
    })


    $('#firstEye.fa-eye').click(e => {
        $('#password').attr('type','text');
        $('#firstEye').removeClass('fa-eye');
        $('#firstEye').addClass('fa-eye-slash');
    });

    $('#secondEye.fa-eye').click(e => {
        $('#re-password').attr('type','text');
        $('#secondEye').removeClass('fa-eye');
        $('#secondEye').addClass('fa-eye-slash');
    });
  
    $('#cancelBtn').click(e => {
        $('#password').val('');
        $('#re-password').val('');

        $('#password').attr('type','password');
        $('#firstEye').removeClass('fa-eye-slash');
        $('#firstEye').addClass('fa-eye');
        
        $('#re-password').attr('type','password');
        $('#secondEye').removeClass('fa-eye-slash');
        $('#secondEye').addClass('fa-eye');
    })

    $('#passwordForm').submit(e => {
        e.preventDefault();
        const password = $('#password').val();
        const rePassword = $('#re-password').val();
        if(password.localeCompare(rePassword) === 0) {

            axios.post('/api/admins/admin/password/reset',{password},{headers})
                .then(response => {
                    $('#successModal').modal('show');
                    $('#successModalTitle').html('Password changed successfully');
                    $('#successModalContent').html('You have changed your password successfully.');

                    setTimeout(() => {
                        window.location.reload();
                    },1500)
                }).catch(e => {
                    $('#errorModal').modal('show');
                    $('#errorModalTitle').html('Failed');
                    $('#errorModalContent').html('Your attempts of changing password is failed. Password must contain at least 5 words.');
                })
        } else {
            $('#errorModal').modal('show');
            $('#errorModalTitle').html('Password does not match');
            $('#errorModalContent').html('Your passwords do not match. Please retype again.');
        }
        
    })
   
})