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
            { "data": null,
              "render": function(data,type,row) {
                let part = '';
                switch (data['isUsed']) {
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
        ],
        select: true,
    } );
})