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
        dom: "Bfrtip",
        buttons: ["copyHtml5", "excelHtml5", "csvHtml5", "pdfHtml5", "pageLength"],
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
                        part = `<div class="dropdown"><span class="btn btn-sm btn-info dropdown-toggle ml-3" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Not Used</span><div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <span class="dropdown-item">Already Used</span></div></div>`
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
                    let date = new Date(data['updatedAt']);
                    let day = date.getFullYear()+'.'+(date.getMonth()+1)+'.'+date.getDate();
                    let time = date.getHours()+':'+(date.getMinutes()+1)+':'+date.getSeconds();
                    let fulldate = day+' '+time;
                    return fulldate;
                }
            },
            {
                "data": null,
                "render": function(data,type,row) {
                    let transactionDate = new Date(data['updatedAt']);
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

    // user is used
      dataTable.on("click", "tbody > tr > td > div > div > span", function (e) {
        e.preventDefault();
        var tr = $(this).closest("tr");
        var row = dataTable.row(tr);
        let data = row.data();
    
        const dumpData = {
          isUsed: true,
        };
        axios.put(`/api/admin/codes/${data._id}/isused`,dumpData,{headers})
            .then((response)=>{
                dataTable.ajax.reload();

            })
            .catch(e=>{
                console.log(e);
            });
        });
})