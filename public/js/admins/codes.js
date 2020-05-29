$(document).ready(() => {

    let token = Cookies.get('admintoken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
        
    var dataTable =  $('#codeTable').DataTable( {
        responsive: true,
        bInfo: false,
        autowidth: true,
        "ajax": {
            "url": '/api/admin/codes',
            "dataType": 'json',
            "type": "GET",
            "beforeSend": function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer "+token);
            },
        
        },
        "columns": [
            { "data": "_id"},
            { "data": "text"},
            { "data": "owner.name"},
            {
                "data": null,
                "render": function(data,type,row) {
                    if(data['isUsed'] === true) {
                        return '<span class="badge badge-success mr-2 dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Already Used</span>'+
                        '<div class="dropdown-menu" aria-labelledby="dropdownmune"><span class="notusebtn dropdown-item">Not Used</span></div>';
                    } else {
                        return '<span class="badge badge-warning mr-2 dropdown-toggle" id="dropdownmenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Not Used</span>'+
                        '<div class="dropdown-menu" aria-labelledby="dropdownmune"><span class="usedbtn dropdown-item">Already Used</span></div>';
                    }
                }
            },    
            {
                "data": null,
                "render": function(data,type,row) {
                    let date = new Date(data['updatedAt']);
                    let day = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
                    let hours = date.getHours();
                    let minutes = (date.getMinutes()+1);
                    let seconds = date.getSeconds();
                    let ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; 
                    minutes = minutes < 10 ? '0'+minutes : minutes;
                    seconds = seconds < 10 ? '0'+seconds : seconds;
                    let time = hours+':'+minutes+':'+seconds+' '+ampm;
                    let fulldate = day+'<br>'+time;
                    return fulldate;
                }
            },
            {
                "data": null,
                "render": function(data,type,row) {
                    let transactionDate = new Date(data['updatedAt']);
                    let nextWeek = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate() + 7);
                    let date = nextWeek.getFullYear()+'-'+(nextWeek.getMonth()+1)+'-'+nextWeek.getDate();
                    let hours = transactionDate.getHours();
                    let minutes = (transactionDate.getMinutes()+1);
                    let seconds = transactionDate.getSeconds();
                    let ampm = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; 
                    minutes = minutes < 10 ? '0'+minutes : minutes;
                    seconds = seconds < 10 ? '0'+seconds : seconds;
                    let time = hours+':'+minutes+':'+seconds+' '+ampm;
                    let todayDate = date+'<br>'+time;
                    return todayDate;
                }
            },
            { "data" : null,
              "render": function(data,type,row) {
                return `<span class='btn btn-danger custom-action-btn'><i class='fas fa-trash'>Delete</i></span>`
              }
            },
        ],
        select: true,
    } );
    
    dataTable.on('click', 'tbody > tr > td > div > .notusebtn', function (e) {
        e.preventDefault();

        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();
        
        const id = data._id;
        const isUsed = false;
        //alert (id);
        axios.put(`/api/admin/codes/${id}`,{isUsed}, {headers})
        .then(response => {
            dataTable.ajax.reload();
        })
    });

    /**
     * Active Button
     */
    dataTable.on('click', 'tbody > tr > td > div > .usedbtn', function (e) {
        e.preventDefault();

        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();
        
        const id = data._id;
        const isUsed = true;
        axios.put(`/api/admin/codes/${id}`,{isUsed}, {headers})
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
        $('#codeDeleteModal').modal('show');
    })

    //remove assistant form
    $('#codeDelForm').submit(e => {
        e.preventDefault();

        const confirm = $('#confirmDel').val();

        if(confirm.toLowerCase() === 'confirm') {
            axios.delete(`/api/admin/codes/${currentData._id}`,{headers})
                .then(response => {
                    $('#codeDeleteModal').modal('hide');

                    $('#successModal').modal('show');
                    $('#successModalTitle').html('Success');
                    $('#successModalContent').html('A machine is deleted successfully.');

                    dataTable.ajax.reload();
                }).catch(e => {
                    $('#codeDeleteModal').modal('hide');
                    
                    $('#errorModal').modal('show');
                    $('#errorModalTitle').html('Deleting Machine Failed');
                    $('#errorModalContent').html('The process of deleting machine is failed. Please check your data and retry again.');
                })
        }
    })
})