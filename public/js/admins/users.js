$(document).ready(() => {

    let token = Cookies.get('admintoken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }
        
    var dataTable =  $('#userTable').DataTable( {
        responsive: true,
        bInfo: false,
        autowidth: true,
        "ajax": {
            "url": '/api/admin/users',
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
            { "data": "age" },
            { "data": "nationalID" },
            { "data": null,
              "render": function(data,type,row) {
                return `${data.street},${data.township},${data.city},${data.country}`
              }
            },
            { "data": "email"},
            { "data": "phone" },           
            { "data": "familyNo" },
            { "data": null,
              "render": function(data,type,row) {
                let part = '';
                switch (data['approved']) {
                    case true:
                        part = `<span class="badge badge-success mr-2">Approved</span>`
                        break;
                    case false:
                         part = `<div class="dropdown"><span class="btn btn-sm btn-info dropdown-toggle ml-3" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Not Approved</span><div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <span class="dropdown-item">Approved</span></div></div>`
                        break;
                    default:
                        break;
                }
                return part;
              }
            },           

        ],
        select: true,
    } );

    
     /**
     * Change the Approved , Not Approved -> Approved
     */
    dataTable.on('click', 'tbody > tr > td > div > div > span', function (e) {
        e.preventDefault();
        var tr = $(this).closest('tr');
        var row = dataTable.row( tr );
        let data = row.data();

        const dumpData = {
            "approved" : true
        }
        axios.put(`/api/admin/users/${data._id}/approved`,dumpData,{ headers})
            .then(response => {

                const code = {
                    owner: data._id,
                }

                axios.post('/api/admin/codes',code,{headers})
                    .then(response => {
                        $('#successModal').modal('show');
                        $('#successModalTitle').html('User approval succeeded');
                        $('#successModalContent').html('Your approval of user is success with a request code for machine');

                        dataTable.ajax.reload();
                    }).catch(e => {
                       
                    })
            }).catch(e => {
                $('#errorModal').modal('show');
                $('#errorModalTitle').html('User approval failed');
                $('#errorModalContent').html('Your approval of user is failed. Please contact support.');
            });
    })

    // // Add event listener for opening and closing details
    // dataTable.on('click', 'td.details-control', function () {
    //     var tr = $(this).closest('tr');
    //     var row = dataTable.row( tr );
    //     let data = row.data();
    //     console.log(data);
 
    //     axios.get(`/api/admin/baccount/${data.id}`,{headers})
    //         .then(response => {
    //            data = response.data;

    //             if ( row.child.isShown() ) {
    //                 // This row is already open - close it
    //                 row.child.hide();
    //                 tr.removeClass('shown');
    //             }
    //             else {
    //                 // Open this row
    //                 row.child( format(data) ).show();
    //                 tr.addClass('shown');
    //             }

    //         }).catch(e => {
    //             // console.log(e);
    //     })
        
    // } );

    // /**
    //  * Edit Merchant Subscripition
    //  * Eg. Disabled Subscription
    //  *  */ 
    // dataTable.on('click', 'tbody > tr > td > div > div > span#editSub',function(e) {
    //     e.preventDefault();
        
    //     var tr = $(this).closest('tr');
    //     var row = dataTable.row( tr );
    //     let data = row.data();

    //     let subscriptionData = {
    //         active: false
    //     }

    //     console.log(data);
    //     axios.put(`/api/admin/subscriptions/${data.subscriptionId}`, subscriptionData , {headers})
    //         .then(response => {
    //             $('#successModal').modal('show');
    //             dataTable.ajax.reload();
    //         }).catch(e => {
    //             console.log(e);
    //         })
    // })

    // /**
    //  * Generate Secret Key for Merchant
    //  */
    // dataTable.on('click', 'tbody > tr > td > button.gen_key', function(e) {
    //     e.preventDefault();
    //     var data=dataTable.rows( $(this).parents('tr') ).data();

    //     axios.get(`/api/admin/merchant/${data[0].id}/secret`, {headers})
    //         .then(response => {
    //             console.log(response.data);
    //             $('#successModal').modal('show');
    //             $('#successModalContent').html(`The Secret Key for merchant ${data[0].id} is ${response.data}. Please do not share with others.`);
    //         }).catch(e => {
    //             console.log(e);
    //         })
    // })

    // //add new bank to merchant
    // dataTable.on('click', 'tbody > tr > td > button.add_bank ', function (e) {
    //     e.preventDefault();
        

    //     var data=dataTable.rows( $(this).parents('tr') ).data();
    //     currentMerchantid = data[0].id;

    //     $('#newBankAccountModal').modal('toggle');
    //     $('#errorMsg').addClass('nodisplay');
    // } );

    // dataTable.on('click', 'tbody > tr > td > button.add_sub', function(e) {
    //     e.preventDefault();
    
    //     var data=dataTable.rows( $(this).parents('tr') ).data();
    //     currentMerchantid = data[0].id;

    //     $('#newSubscriptionModal').modal('toggle');
    //     $('#errorMsg').addClass('nodisplay');
    // })

    // //select back format
    // $('#bank_type').change(e => {
    //     let option = e.target.value;
    //     switch (option) {
    //         case 0:
    //             $('#BankImg').attr('src','/images/banks/None.png');
    //             break;
    //         case 'USD':
    //             $('#BankImg').attr('src','/images/usd.jpg');
    //             break;
    //         case 'MMK':
    //             $('#BankImg').attr('src','/images/mmk.png');
    //             break;
    //         case 'SGD':
    //             $('#BankImg').attr('src','/images/sgd.png');
    //             break;
    //         default:
    //             $('#BankImg').attr('src','/images/banks/None.png');
    //             break
    //     }
    // })

    // //check if bank number is anumber
    // // $('#bank_number').on("change keyup paste", function(e){
    // //     const input = e.target.value
    // //     const check = $.isNumeric(input)
    // //     if(!check) {
    // //         $('#errorMsg').removeClass('nodisplay');
    // //         $('#errorMsg').html('*** Please type a number ***')
    // //     } else {
    // //         $('#errorMsg').addClass('nodisplay');
    // //         $('#errorMsg').html('')
    // //     }
    // // })

    // //add bank modal
    // $('#addnewBankForm').submit(e => {
    //     e.preventDefault();

    //     const accountType = $('#bank_type').val();

    //     if(accountType === "USD") {
    //         name = 'USD Balance Account';
    //     } else if (accountType === 'MMK') {
    //         name = 'MMK Balance Account';
    //     } else if (accountType === 'SGD') {
    //         name = 'SGD Balance Account';
    //     }
        
    //     BankData = {
    //         accountType,
    //         name
    //     }

    //     $('#newBankAccountModal').modal('hide');
    //     $('#confirmModal').modal('show');
       
    // })

    // //confirm to add bank
    // $('#confirmForm').submit(e => {
    //     e.preventDefault();

    //     const confirm = $('#confirmBox').val();

    //     if(confirm === 'confirm') {
    //        axios.post(`/api/admin/baccount/${currentMerchantid}`,BankData,{headers})
    //         .then(response => {
    //             $('#confirmModal').modal('hide');
    //             $('#successModal').modal('show');
    //             dataTable.ajax.reload();
    //         }).catch(e => {
    //             console.log(e)
    //         })
    //     } else {
    //         $('#errorModal').modal('show');
    //     }
    // })

    // $('#merchant_subscription').change(e => {
    //     const type = e.target.value;

    //     switch (type) {
    //         case 0:
    //             $('#subscription_section').addClass('no_display');
    //             $('#subscription_service').val('');
    //             break;
    //         case 'MPU':
    //             $('#subscription_section').removeClass('no_display');
    //             $('#subscription_service').val('MPU');

    //             break;
    //         case 'International':
    //             $('#subscription_section').removeClass('no_display');
    //             $('#subscription_service').val('International');

    //             break;
    //         case 'Local-visa':
    //             $('#subscription_section').removeClass('no_display');
    //             $('#subscription_service').val('Local-visa');

    //             break;
    
    //         default:
    //             $('#subscription_section').addClass('no_display');
    //             $('#subscription_service').val('');

    //             break;
    //     }
    // })

    // //add new subscription
    // $('#subscriptionForm').submit(e => {
    //     e.preventDefault();
    //     const type = $('#subscription_service').val();
    //     const start_date = $('#subscription_startdate').val();
    //     const end_date = $('#subscription_enddate').val();
    //     const deposit = $('#subscription_deposit').val();
    //     const deposit_currency = $('#subscription_depositCurrency').val();
    //     const min_transaction_size = $('#subscription_minitrans').val();
    //     const max_transaction_size = $('#subscription_maxitrans').val();
    //     const merchant_fees = $('#subscription_merchantfees').val();
    //     const merchant_percentage = $('#subscription_merchantPercentage').val();
    //     const buyer_fees = $('#buyerfees').val();
    //     const buyer_percentage = $('#buyerPer').val();

    //     const service = services.filter(ser => {
    //         return ser.name === type;
    //     })

    //     const id = service[0].id;
    //     const fees = service[0].fees;
        
    //     const subscriptionData = {
    //         id,
    //         start_date,
    //         end_date,
    //         deposit,
    //         deposit_currency,
    //         min_transaction_size,
    //         max_transaction_size,
    //         merchant_fees,
    //         merchant_percentage,
    //         buyer_fees,
    //         buyer_percentage,
    //         merchant_id : currentMerchantid,
    //         transaction_percentage: fees,
    //     }

    //     axios.post(`/api/admin/subscriptions`,subscriptionData,{headers})
    //         .then(response => {
    //             console.log(response.data);
    //             $('#newSubscriptionModal').modal('hide');
    //             $('#successModal').modal('show');
    //             dataTable.ajax.reload();
    //         }).catch(e => {
    //             console.log(e);
    //         })
    // })
})

// /* Formatting function for row details - modify as you need */
//     const format  = ( data ) => {
//         // `d` is the original data object for the row
//         console.log(data);

//         return '<div class="row"><div class="col-md-4"><table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
//             '<tr><td colspan="2">Merchant Balance Account 1</td></tr>'+   
//             '<tr>'+
//                 '<td>Bac Id:</td>'+
//                 '<td>'+data[0].id+'</td>'+
//             '</tr>'+
//             '<tr>'+
//                 '<td>Currency:</td>'+
//                 '<td>'+data[0].accountType+'</td>'+
//             '</tr>'+
//             '<tr>'+
//                 '<td>Amount:</td>'+
//                 '<td>'+data[0].amount / 100+'</td>'+
//             '</tr>'+
//             '<tr>'+
//                 '<td>Withdrawable Amount:</td>'+
//                 '<td>'+(data[0].payoutAmount / 100).toFixed(2)+'</td>'+
//             '</tr>'+
//             '<tr>'+
//                 '<td>Bank:</td>'+
//                 '<td>'+data[0].banks+'</td>'+
//             '</tr>'+
            
//         '</table></div>'+
//         '<div class="col-md-4"><table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
//             '<tr><td colspan="2">Merchant Balance Account 1</td></tr>'+
//             '<tr>'+
//             '<td>Bacc Id:</td>'+
//             '<td>'+data[1].id+'</td>'+
//             '</tr>'+
//             '<tr>'+
//                 '<td>Currency:</td>'+
//                 '<td>'+data[1].accountType+'</td>'+
//             '</tr>'+
//             '<tr>'+
//                 '<td>Amount:</td>'+
//                 '<td>'+data[1].amount / 100+'</td>'+
//             '</tr>'+
//             '<tr>'+
//                 '<td>Withdrawable Amount:</td>'+
//                 '<td>'+(data[1].payoutAmount / 100).toFixed(2)+'</td>'+
//             '</tr>'+
//             '<tr>'+
//                 '<td>Bank:</td>'+
//                 '<td>'+data[1].banks+'</td>'+
//             '</tr>'+
//         '</table></div>';
//     }