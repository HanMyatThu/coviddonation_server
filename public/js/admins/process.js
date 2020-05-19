$(document).ready(() => {

    let token = Cookies.get('admintoken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }

    /**
     * Setting for filter
     */
    //activate Date Time Picker
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();

    //filter selector
    $('#filterSelector').change((e) => {
        option = e.target.value;
        
        switch (option) {
            case 'qruser':
                $('#secondOption').addClass('nodisplay');
                $('#thirdOption').addClass('nodisplay');

                break;
            case 'time':
                $('#secondOption').removeClass('nodisplay');
                $('#inputText2').html('From (Date & Time)');  

                $('#thirdOption').removeClass('nodisplay');
                $('#inputText3').html('To (Date & Time)');
                break;
            default:
                break;
        }
    })

    //search the filtered data
    $('#filterBtn').click(e => {
        e.preventDefault();
        const option = $('#filterSelector').val();
        switch (option) {
            case 'qruser':
                dataTable.ajax.url(`/api/admin/process/filter?sortBy=qruser`).load();
                break;
            case 'time':
                option1 = $('#inputBox1').val();
                from = filterDateTime(option1);
                option2 = $('#inputBox2').val();
                to = filterDateTime(option2);
                dataTable.ajax.url(`/api/admin/process/filter/time/${from}/${to}`).load();
                break;
            default:
                break;
        }
    })
        
    var dataTable =  $('#processTable').DataTable( {
        responsive: true,
        bInfo: false,
        autowidth: true,
        "ajax": {
            "url": '/api/admin/processes',
            "dataType": 'json',
            "type": "GET",
            "beforeSend": function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer "+token);
            },
        
        },
        "columns": [
            { "data": "_id"},
            { "data" : null,
              "render" : function(data,type,row) {
                  if(data['status'] === 'completed') {
                    return `<span class='badge badge-info'>${data['status']} </span>`
                  } else  {
                    return `<span class='badge badge-warning'>${data['status']} </span>`
                  }
              }
            },
            { "data": "user.name" },
            { "data": "machine.name" },
            { "data": "code.text" },
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
            {
                "data": null,
                "render": function(data,type,row) {
                    let transactionDate = new Date(data['createdAt']);
                    let nextWeek = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate() + 7);
                    let date = nextWeek.getFullYear()+'-'+(nextWeek.getMonth()+1)+'-'+nextWeek.getDate();
                    let time = transactionDate.getHours()+':'+(transactionDate.getMinutes()+1)+':'+transactionDate.getSeconds();
                    let todayDate = date+' '+time;
                    return todayDate;
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

     //remove process
     dataTable.on('click', 'tbody > tr > td > .btn-danger', function(e) {
        e.preventDefault();
        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();

        currentData = data;
        $('#processDeleteModal').modal('show');
    })

    //remove process form
    $('#processDelForm').submit(e => {
        e.preventDefault();

        const confirm = $('#confirmDel').val();

        if(confirm.toLowerCase() === 'confirm') {
            axios.delete(`/api/admin/process/${currentData._id}`,{headers})
                .then(response => {
                    $('#processDeleteModal').modal('hide');

                    $('#successModal').modal('show');
                    $('#successModalTitle').html('Success');
                    $('#successModalContent').html('A process is deleted successfully.');

                    dataTable.ajax.reload();
                }).catch(e => {
                    $('#processDeleteModal').modal('hide');
                    
                    $('#errorModal').modal('show');
                    $('#errorModalTitle').html('Deleting Process Failed');
                    $('#errorModalContent').html('The process of deleting process is failed. Please check your data and retry again.');
                })
        }
    })

        
    //format to ISO String be same with backend
    const filterDateTime = (input) => {
        var today = new Date(input);
        var dateTime = today.toISOString();
        return dateTime;
    }
})