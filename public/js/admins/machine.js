$(document).ready(() => {

    let token = Cookies.get('admintoken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
        
    var dataTable =  $('#machineTable').DataTable( {
        responsive: true,
        bInfo: false,
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
            { "data": "location" },
            { "data" : null,
              "render": function(data,type,row) {
                  if(data['iotStream']) {
                      return `<span class='badge badge-secondary'>data['iotStream']</span>`;
                  } else {
                    return `<span class='btn btn-primary'><i class='fas fa-plus'></i> Add IoT stream</span>`;
                    
                  }
              }
            }
        ],
        select: true,
    } );
})
