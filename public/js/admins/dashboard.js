$(document).ready(() => {
    let token  = Cookies.get('admintoken');
    $('#Trans').removeClass('nodisplay');
    $('#totalT').removeClass('nodisplay');

    $('#totalT1').removeClass('nodisplay');
    $('#totalT2').removeClass('nodisplay');

    $('#successT').removeClass('nodisplay');
    $('#activeM').removeClass('nodisplay');

    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let todayDate = date+'_'+time;
    let lastweekDate = getLastWeek();

    function getLastWeek() {
        let today = new Date();
        let lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        let date = lastWeek.getFullYear()+'-'+(lastWeek.getMonth()+1)+'-'+lastWeek.getDate();
        let time = lastWeek.getHours() + ":" + lastWeek.getMinutes() + ":" + lastWeek.getSeconds();
        let todayDate = date+'_'+time;
        return todayDate;
    } 
    //get all
    axios.get(`/api/admin/balancetransactions/admin00002`, {headers})
    .then(response => {
        let hold,needToConfirm,succeeded ;
        hold = response.data.data.filter(balT => {
            return balT.status === "Hold";
        })
        needToConfirm = response.data.data.filter(balT => {
            return balT.status === "NeedToConfirm";
        })
        succeeded = response.data.data.filter(balT => {
            return balT.status === "Succeeded";
        })

        setTimeout(() => {
            $('#totalT').addClass('nodisplay');
            $('#totalT-text').html(hold.length);
            $('#totalT1').addClass('nodisplay');
            $('#totalT1-text').html(needToConfirm.length);
            $('#totalT2').addClass('nodisplay');
            $('#totalT2-text').html(succeeded.length);

            $('#successT').addClass('nodisplay');
            $('#successT-text').html(succeeded.length);
        },1000)
    }).catch(e => {
        console.log(e);
    })  

    //get all active merchants
    axios.get('/api/admin/allusers', {headers})
        .then(response => {
            setTimeout(() => {
                $('#activeM').addClass('nodisplay');
                $('#activeM-text').html(response.data.data.length);
            },1000)
        }).catch(e => {
            console.log(e);
        })

    //get from time to time
    axios.get(`/api/admin/balancetransactions/admin00002/${lastweekDate}/${todayDate}`, {headers})
    .then(response => {
        console.log(response.data);
        transactionInAWeek = response.data.length;
        setTimeout(() => {
            $('#Trans').addClass('nodisplay');
            $('#Trans-text').html(transactionInAWeek);
        },1000) 
        let data = [];
        let labels = [];
        response.data.forEach(element => {
            let amount = parseInt(element.process_amount) / 100;
            labels.push(element.date_time)
            data.push(amount);
        });

        var ctx = document.getElementById("transChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Transaction Flow', // Name the series
                    data: data,
                    fill: false,
                    borderColor: '#4ada31', // Add custom color border (Line)
                    backgroundColor: '#da132a', // Add custom color background (Points and Fill)
                    borderWidth: 1 // Specify bar border width
                }]},
            options: {
            responsive: true, // Instruct chart js to respond nicely.
            maintainAspectRatio: false, // Add to prevent default behaviour of full-width/height 
            }
        });
    }).catch(e => {
        console.log(e);
    })

    axios.get('/api/admin/baccount',{headers})
        .then(response => {
            console.log(response.data);
            response.data.forEach(balance => {
                if(balance.currency === "USD" ) {
                    ok = "$";
                    exchange = 100;
                }else if(balance.currency === "SGD") {
                    ok = "S$";
                    exchange = 100;
                }else if(balance.currency === "MMK") {
                    ok = "MMK";
                    exchange = 1;
                }

                let balancePart = `<li class="list-group-item"><div class='row'><div class='col-md-6'><h6>${ balance.accountType } account</h6><small>${balance.id}</small></div><div class='col-md-6'><span>Amount: ${ ok +" "+ balance.amount / exchange }<span><br><small>Profit: ${ok +" "+ balance.net / exchange}</small><br><small class='text-red'>HoldAmount: ${ok +" "+ balance.holdamount / exchange}</small></div></div></li>`
                $('#adminBalance').append(balancePart);
            });
        }).catch(e => {
            console.log(e);
        })
    
})