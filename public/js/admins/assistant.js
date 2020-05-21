$(document).ready(() => {

    let token = Cookies.get('admintoken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
        
    var dataTable =  $('#assistantTable').DataTable( {
        responsive: true,
        bInfo: false,
        autowidth: true,
        dom: 'Bfrtip',
        buttons: [
            {
                text: ' Add Assistant',
                className: 'assistantBtn fas fa-user-tie'
            },
            'pageLength'
        ],
        "ajax": {
            "url": '/api/admin/assistants',
            "dataType": 'json',
            "type": "GET",
            "beforeSend": function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer "+token);
            },
        
        },
        "columns": [
            { "data": "name" },
            { "data": "phone" },
            { "data": "createdBy.name"},
            {
                "data": null,
                "render": function(data,type,row) {
                    if(data['active'] === true) {
                        return '<span class="btn btn-success dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Active</span>'+
                        '<div class="dropdown-menu" aria-labelledby="dropdownmune"><span class="disablebtn dropdown-item">Disable</span></div>';
                    } else {
                        return '<span class="btn btn-warning dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Disable</span>'+
                        '<div class="dropdown-menu" aria-labelledby="dropdownmune"><span class="activebtn dropdown-item">Active</span></div>';
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
     * Add new Machine
     */
    $('.assistantBtn').click(e => {
        e.preventDefault();
        $('#assistantModal').modal('show');
    })

    $('#assistantForm').submit(e => {
        e.preventDefault();
    
        const name = $('#name').val();
        const phone = $('#phone').val();
        const  password = $('#password').val();
        const assistant = {
            name,phone,password
        }
      
        axios.post('/api/admin/assistants',assistant,{headers})
            .then(response => {
                $('#assistantModal').modal('hide');

                $('#successModal').modal('show');
                $('#successModalTitle').html('Assistant Added Successfully');
                $('#successModalContent').html('An assistant is added to your list.');

                dataTable.ajax.reload();
            })
            .catch(e => {
                $('#errorModal').modal('show');
                $('#errorModalTitle').html('Process Failed');
                $('#errorModalContent').html('Your process of adding assistant is failed. Please try again.');
            }); 
    })
    
    /**
     * Disable Button
     */
    dataTable.on('click', 'tbody > tr > td > div > .disablebtn', function (e) {
        e.preventDefault();

        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();
        
        const id = data._id;
        const active = false;
        //alert (id);
        axios.put(`/api/admin/assistants/${id}`,{active}, {headers})
        .then(response => {
            dataTable.ajax.reload();
        })
    });

    /**
     * Active Button
     */
    dataTable.on('click', 'tbody > tr > td > div > .activebtn', function (e) {
        e.preventDefault();

        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();
        
        const id = data._id;
        const active = true;
        axios.put(`/api/admin/assistants/${id}`,{active}, {headers})
        .then(response => {
            dataTable.ajax.reload();
        })
    });

    //remove assistant
    dataTable.on('click', 'tbody > tr > td > .btn-danger', function(e) {
        e.preventDefault();
        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();

        currentData = data;
        $('#assistantDeleteModal').modal('show');
    })

    //remove assistant form
    $('#assistantDelForm').submit(e => {
        e.preventDefault();

        const confirm = $('#confirmDel').val();

        if(confirm.toLowerCase() === 'confirm') {
            axios.delete(`/api/admin/assistants/${currentData._id}`,{headers})
                .then(response => {
                    $('#assistantDeleteModal').modal('hide');

                    $('#successModal').modal('show');
                    $('#successModalTitle').html('Success');
                    $('#successModalContent').html('A machine is deleted successfully.');

                    dataTable.ajax.reload();
                }).catch(e => {
                    $('#assistantDeleteModal').modal('hide');
                    
                    $('#errorModal').modal('show');
                    $('#errorModalTitle').html('Deleting Machine Failed');
                    $('#errorModalContent').html('The process of deleting machine is failed. Please check your data and retry again.');
                })
        }
    })
})
