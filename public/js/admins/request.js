$(document).ready(() => {

    let token = Cookies.get('admintoken');
    let currentData = '';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
        
    var dataTable =  $('#requestTable').DataTable( {
        responsive: true,
        autowidth: true,
        "ajax": {
            "url": '/api/admin/requests',
            "dataType": 'json',
            "type": "GET",
            "beforeSend": function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer "+token);
            },
        
        },
        "columns": [
            { "data": "user.name" },
            {
                "data" : null,
                "render": function(data,type,row) {
                    return `<span class='badge badge-info'>${data['type']}</span>`
                }
            },
            {
                "data" : null,
                "render": function(data,type,row) {
                    if(data['type'] === 'requesting_new_transaction') {
                        if(data['status'] === 'open') {
                            return `<span class='badge badge-info'> Opened</span>`
                        } else {
                            return `<span class='badge badge-success'> Completed</span>`
                        }
                    } else {
                        if(data['status'] === 'open') {
                            return `
                                <div class="btn-group">
                                    <span type="button" class="btn btn-warning dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Not Done
                                    </span>
                                    <div class="dropdown-menu">
                                        <span id='resetpw' class="dropdown-item text-black">Reset Password</span>
                                    </div>
                                </div>`
                        } else {
                            return `<span class='badge badge-success'> Completed</span>`
                        }
                    }
                }
            },
            {
                "data": null,
                "render": function(data,type,row) {
                    let date = new Date(data['createdAt']);
                    let day = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
                    let time = date.getHours()+':'+(date.getMinutes()+1)+':'+date.getSeconds();
                    let fulldate = day+' '+time;
                    return fulldate;
                }
            }
        ],
        select: true,
    } );

     //remove process
     dataTable.on('click', 'tbody > tr > td > div > div > #resetpw', function(e) {
        e.preventDefault();
        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();

        const dumpData = {
            type : "changepw"
        }
        axois.put(`/api/admin/users/password/reset/${data.user._id}`,dumpData ,{headers})
            .then(response => {
                const newPassword = response.data.newPassword;
                currentData = response.data;
                const SMSData = {
                    phone : response.data.phone,
                    content : `သင်၏ လှို့ဝှက်စကား (password) အသစ်မှာ ${newPassword}  ဖြစ်ပါသည်။ https://riceatm.azurewebsites.net/login သို့သွားပါ။`
                }
                axios.post('/api/admin/msg-service/sms/send',SMSData,{headers})
                    .then(response => {

                        $('#successModal').modal('show');
                        $('#successModalTitle').html('Password reset is successful.');
                        $('#successModalContent').html('You have reset the password of phone number:'+currentData.phone);
                        dataTable.ajax.reload();

                    }).catch(e => {
                    })
            })
    })

})
