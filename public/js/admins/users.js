$(document).ready(() => {

    let token = Cookies.get('admintoken');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
        
    var dataTable =  $('#userTable').DataTable( {
        responsive: true,
        bInfo: false,
        dom: 'Bfrtip',
        autowidth: true,
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5',
            'pageLength'
        ],
        "ajax": {
            "url": '/api/admin/users',
            "dataType": 'json',
            "type": "GET",
            "beforeSend": function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer "+token);
            },
        
        },
        "columns": [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { "data": "_id"},
            { "data": null,
              "render": function(data,type,row) {
                let part = '';
                switch (data['approved']) {
                    case true:
                        part = `<span class="badge badge-success mr-2">Approved</span>`
                        break;
                    case false:
                         part = `<div class="dropdown"><span class="btn btn-sm btn-info dropdown-toggle ml-3" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Not Approved</span><div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <span class="dropdown-item">Approved</span></div></div>`
                        break;
                    default:
                        break;
                }
                return part;
              }
            },    
            { "data": "name" },
            { "data": 'street',
            },
            { "data": null,
              "render": function(data,type,row) {
                return `${data.township},${data.city}`
              }
            },
            { "data": "phone" },           
            { "data": "familyNo" },
            { "data": null,
            "render": function(data,type,row) {
                    if(data['qruser'] === true) {
                        return `<span class='badge badge-success'><i class='fas fa-check-circle'> Correct</i><span>`
                    } else {
                        return `<span class='badge badge-warning'><i class='fas fa-times-circle'> None</i><span>`
                    }
                }
            },
            { "data" : null,
              "render": function(data,type,row) {
                return `<span class='btn btn-danger custom-action-btn'><i class='fas fa-trash'>Delete</i></span>`
              }
            }
        ],
        select: true,
    } );

    
     /**
     * Change the Approved , Not Approved -> Approved
     */
    dataTable.on('click', 'tbody > tr > td > div > div > span', function (e) {
        e.preventDefault();
        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();

        const dumpData = {
            "approved" : true
        }
        axios.put(`/api/admin/users/${data._id}/approved`,dumpData,{ headers})
            .then(response => {
                
                const codeData = {
                    owner: data._id
                }
                axios.post('/api/admin/codes',codeData,{headers})
                    .then(response => {
                        const code = response.data;
                        
                        const SMSData = {
                            phone : data.phone,
                            content : `စာရင်းပေးသွင်းခြင်းအောင်မြင်ပါသည်။ ဆန်ထုတ်ယူရန် https://bit.ly/2T5kRUW ၏ chatboxသို့သွားပါ။`
                        }
                        axios.post('/api/admin/msg-service/sms/send',SMSData,{headers})
                            .then(response => {

                                $('#successModal').modal('show');
                                $('#successModalTitle').html('User approval succeeded');
                                $('#successModalContent').html('Your approval of user is success with a request code for machine');
                                dataTable.ajax.reload();

                            }).catch(e => {
                            })
                    }).catch(e => {
                    }); 
            }).catch(e => {
                $('#errorModal').modal('show');
                $('#errorModalTitle').html('User approval failed');
                $('#errorModalContent').html('Your approval of user is failed. Please contact support.');
            });
    })

    // Add event listener for opening and closing details
    dataTable.on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();
 
        axios.get(`/api/admin/codes/user/${data._id}`,{headers})
            .then(response => {
               data = response.data;

                if ( row.child.isShown() ) {
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    // Open this row
                    row.child( format(data) ).show();
                    tr.addClass('shown');
                }

            }).catch(e => {
                // console.log(e);
        })
        
    } );

    //remove user
    dataTable.on('click', 'tbody > tr > td > .btn-danger', function(e) {
        e.preventDefault();
        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();

        currentData = data;
        $('#userDeleteModal').modal('show');
    })

    //remove user form
    $('#userDelForm').submit(e => {
        e.preventDefault();

        const confirm = $('#confirmDel').val();

        if(confirm.toLowerCase() === 'confirm') {
            axios.delete(`/api/admin/users/${currentData._id}`,{headers})
                .then(response => {
                    $('#userDeleteModal').modal('hide');

                    $('#successModal').modal('show');
                    $('#successModalTitle').html('Success');
                    $('#successModalContent').html('A user is deleted successfully.');

                    dataTable.ajax.reload();
                }).catch(e => {
                    $('#processDeleteModal').modal('hide');
                    
                    $('#errorModal').modal('show');
                    $('#errorModalTitle').html('Deleting user Failed');
                    $('#errorModalContent').html('The process of deleting user is failed. Please check your data and retry again.');
                })
        }
    })

})

/* Formatting function for row details - modify as you need */
    const format  = ( data ) => {
        // `d` is the original data object for the row
        let value = '';
        if(data.isUsed) {
            value = 'Already Used'
        } else {
            value = 'Not Used Yet'
        }
        return '<div class="row"><div class="col-md-4"><table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr><td colspan="2" class="bg-info text-white">User Current Code</td></tr>'+   
            '<tr>'+
                '<td>Code:</td>'+
                '<td>'+data.text+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Is Code Used:</td>'+
                '<td>'+value+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Code Created Date</td>'+
                '<td>'+changeDateFormat(data.createdAt)+'</td>'+
            '</tr>'+
            '<tr>'+
                '<td>Code Expired Date</td>'+
                '<td>'+expiredDateFormat(data.createdAt)+'</td>'+
            '</tr>'+
            
        '</table></div></div>'
    }

    const changeDateFormat = (isoString) => {
        let date = new Date(isoString);
        let day = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
        let time = date.getHours()+':'+(date.getMinutes()+1)+':'+date.getSeconds();
        let fulldate = day+' '+time;
        return fulldate;
    }

    const expiredDateFormat = (isoString) => {
        let transactionDate = new Date(isoString);
        let nextWeek = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate() + 7);
        let date = nextWeek.getFullYear()+'-'+(nextWeek.getMonth()+1)+'-'+nextWeek.getDate();
        let time = transactionDate.getHours()+':'+(transactionDate.getMinutes()+1)+':'+transactionDate.getSeconds();
        let todayDate = date+' '+time;
        return todayDate;
    }