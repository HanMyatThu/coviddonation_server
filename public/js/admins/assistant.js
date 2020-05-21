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
})
