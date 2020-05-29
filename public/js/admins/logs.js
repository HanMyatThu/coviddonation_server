$(document).ready(() => {

    let token = Cookies.get('admintoken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
        
    var dataTable =  $('#logsTable').DataTable( {
        responsive: true,
        bInfo: false,
        dom: 'Bfrtip',
        autowidth: true,
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5',
            'pageLength'
        ],
        "ajax": {
            "url": '/api/admin/msg-service/sms/logs',
            "dataType": 'json',
            "type": "GET",
            "beforeSend": function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer "+token);
            },
        
        },
        "columns": [
            { "data": "name" },
            { "data": "phone" },
            {
                "data": null,
                "render": function(data,type,row) {
                    let date = new Date(data['createdAt']);
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

        ],
        select: true,
    } );
})
