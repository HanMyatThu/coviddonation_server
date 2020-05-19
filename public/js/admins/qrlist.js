$(document).ready(() => {

    let token = Cookies.get('admintoken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }    
        
    var dataTable =  $('#qrTable').DataTable( {
        responsive: true,
        bInfo: false,
        autowidth: true,
        "ajax": {
            "url": '/api/admin/qr/list',
            "dataType": 'json',
            "type": "GET",
            "beforeSend": function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer "+token);
            },
        
        },
        "columns": [
            { "data": "_id"},
            { "data": "user.name" },
            { "data": "user.phone" },
            { "data": "machine.name" },

            { "data" : null,
              "render" : function(data,type,row) {
                  if(data.machine['status'] === 'Working') {
                    return `<span class='badge badge-success'>${data.machine['status']} <i class='fas fa-check-circle'></i></span>`
                  } else  {
                    return `<span class='badge badge-warning'>${data.machine['status']} <i class='fas fa-times-circle'></i></span>`
                  }
              }
            },
            { "data": "code.text" },
            { "data": null,
              "render": function(data,type,row) {
                let part = '';
                switch (data.code['isUsed']) {
                    case true:
                        part = `<span class="badge badge-warning mr-2">Already Used</span>`
                        break;
                    case false:
                         part = `<span class="badge badge-warning mr-2">Not Used</span>`
                        break;
                    default:
                        break;
                }
                return part;
              }
            },    
            { "data" : null,
              "render" : function(data,type,row) {
                  if(data['activate'].toString() === 'true') {
                    return `<span class='badge badge-success'>Activated <i class='fas fa-check-circle'></i></span>`
                  } else  {
                    return `<span class='badge badge-warning'>Not Activated <i class='fas fa-times-circle'></i></span>`
                  }
              }
            },
            { "data" : null,
              "render": function(data,type,row) {
                return `<span class='btn btn-success custom-action-btn'><i class="fas fa-download">Download</i></span>`
              }
            }
        ],
        select: true,
    } );

     //remove process
     dataTable.on('click', 'tbody > tr > td > .btn-success', function(e) {
        e.preventDefault();
        
    })

})