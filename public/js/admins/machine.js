$(document).ready(() => {

    let token = Cookies.get('admintoken');
    let currentData = '';

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
        
    var dataTable =  $('#machineTable').DataTable( {
        responsive: true,
        bInfo: false,
        dom: 'Bfrtip',
        buttons: [
            {
                text: ' Add Machine',
                className: 'machineAddBtn fas fa-truck'
            },
            'pageLength'
        ],
        autowidth: true,
        "ajax": {
            "url": '/api/admin/machines',
            "dataType": 'json',
            "type": "GET",
            "beforeSend": function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer "+token);
            },
        
        },
        "columns": [{
            "className":      'details-control',
            "orderable":      false,
            "data":           null,
            "defaultContent": ''
        },
            { "data": "_id"},
            { "data": "name" },
            { "data": "code"},
            { "data" : null,
              "render" : function(data,type,row) {
                  if(data['status'] === 'Working') {
                    return `<span class='badge badge-success'>${data['status']} <i class='fas fa-check-circle'></i></span>`
                  } else  {
                    return `<span class='badge badge-warning'>${data['status']} <i class='fas fa-times-circle'></i></span>`
                  }
              }
            },
            { "data": "location" },
            { "data" : null,
              "render": function(data,type,row) {
                  if(data['iotString']) {
                      return `<span class='badge badge-secondary'>${data['iotString'].slice(0,20)}</span>`;
                  } else {
                    return `<button class='btn btn-primary'><i class='fas fa-plus'></i> Add IoT stream</button>`;    
                  }
              }
            }
        ],
        select: true,
    } );


    /**
     * Add new Machine
     */
    $('.machineAddBtn').click(e => {
        e.preventDefault();
        $('#machineModal').modal('show');
    })

    $('#machineForm').submit(e => {
        e.preventDefault();
        $('#errorTmsg').addClass('nodisplay');

        const name = $('#machineName').val();
        const location = $('#location').val();
        const  iotString = $('#iotString').val();
        const machine = {
            name,location,iotString
        }
        if(location === 0) {
            $('#errorTmsg').removeClass('nodisplay');
        } else {
            axios.post('/api/admin/machines',machine,{headers})
                .then(response => {
                    $('#machineModal').modal('hide');

                    $('#successModal').modal('show');
                    $('#successModalTitle').html('Machine Added Successfully');
                    $('#successModalContent').html('A machine is added to your list.');

                    dataTable.ajax.reload();
                })
                .catch(e => {
                    $('#errorModal').modal('show');
                    $('#errorModalTitle').html('Process Failed');
                    $('#errorModalContent').html('Your process of adding machine is failed. Please try again.');
                }); 
        }
    })

    //enter iot modal
    
    dataTable.on('click', 'tbody > tr > td > button', function (e) {
        e.preventDefault();

        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();
        currentData = data;

        $('#iotStringModal').modal('show');
    });

    //update iotString
    $('#iotForm').submit(e => {
        e.preventDefault();

        const iotString = $('#iotNewStirng').val();
        const iotData = {
            iotString
        }

        axios.put(`/api/admin/machines/${currentData._id}`,iotData,{headers})
            .then(response => {
                $('#iotStringModal').modal('hide');

                $('#successModal').modal('show');
                $('#successModalTitle').html('IoTString is Added Successfully');
                $('#successModalContent').html('An IoTString is added to your machine.');

                dataTable.ajax.reload();
            })
            .catch(e => {
                $('#errorModal').modal('show');
                $('#errorModalTitle').html('Process Failed');
                $('#errorModalContent').html('Your process of adding IoTString is failed. Please try again.');
            }); 
    })
})
