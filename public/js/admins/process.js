$(document).ready(() => {

    let token = Cookies.get('admintoken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
        
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
                  if(data['status'] === 'processing') {
                    return `<span class='badge badge-dark'>${data['status']} </span>`
                  } else  {
                    return `<span class='badge badge-info'>${data['status']} </span>`
                  }
              }
            },
            { "data": "user.name" },
            { "data": "machine.name" },
            { "data": "machine.code" },
            { "data": "createdAt" },


        ],
        select: true,
    } );
})