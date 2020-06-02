$(document).ready(() => {
    const token = Cookies.get('admintoken');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token
    }
    let qrText = "";
    let qrData = "";
    let currentMachine = '';
    let lastqrText = '';

    const cameraSelection = $('#cameraSelection');
    const scanButton = $('#scanButton');
    const stopButton = $('#stopButton');
    const machineSelection = $('#machineSelection');

    //get all machines
    axios.get('/api/admin/machines', {headers})
        .then(response => {
            response.data.data.forEach(machine => {
                let part = `<option value=${machine._id}>${machine.name}</option>`
                machineSelection.append(part);
            });
        }).catch(e => {
        })

    //filter machines
    machineSelection.change(e => {
        const type = e.target.value;
        currentMachine = type;
        if(type === '0') {
            scanButton.attr('disabled', true);
        } else {
            scanButton.attr('disabled', false);
        }
    })

    let scanner = new Instascan.Scanner(
        {
        video: document.getElementById('preview')
        }
        );

        /**
         * Scan function
         */
        scanner.addListener('scan', function(content) {
          qrText = content;
          if (qrText == lastqrText) {
            return;
          } 
          lastqrText = qrText;
          if(qrText.startsWith('http')) {
              window.open(`${qrText}?machineId=${currentMachine}`,'_blank');
          } else {
              axios.get('/api/admin/qr/'+qrText,{headers})
                .then(response => {
                    qrData = response.data;
                    if(qrData.activate === true) {
                        const processQr = {
                            qrid : qrData._id,
                            machineId: currentMachine
                        }
                        axios.post('/api/admin/qr/process',processQr,{headers})
                            .then(response => {
                                if(response.data.error) {
                                    const date = new Date(response.data.message);
                                    $('#errorModal').modal('show');
                                    $('#errorModalTitle').html('Transaction Failed');
                                    $('#errorModalContent').html('You have done your transaction on '+ date + '. Please try again next 3 days');
                                    setTimeout(() => {
                                        $('#errorModal').modal('hide');
                                    },1500);

                                } else {
                                    $('#successModal').modal('show');
                                    $('#successModalTitle').html('အောင်မြင်ပါသည်');
                                    $('#successModalContent').html('လက်ဆေးခြင်း ၊  mask  တပ်ခြင်းဖြင့် Covid-19 ကာကွယ်ကြဆို့။');
                                    setTimeout(() => {
                                        $('#successModal').modal('hide');
                                    },1500);
                                }
                                lastqrText = '';
                            }).catch(e => {
                                if(e.toString().includes('400')) {
                                    $('#errorModal').modal('show');
                                    $('#errorModalTitle').html('မအောင်မြင်ပါ');
                                    $('#errorModalContent').html('သင့် QR ကို အသုံးပြုပြီးသွားပါပြီ။ ထပ်မံထုတ်ယူလို့ မရသေးပါ။');
                                    setTimeout(() => {
                                        $('#errorModal').modal('hide');
                                    },2000);
                                }else  {
                                    $('#errorModal').modal('show');
                                    $('#errorModalTitle').html('မအောင်မြင်ပါ');
                                    $('#errorModalContent').html('မအောင်မြင်ပါ။ ခဏအကြာတွင် ပြန်လည် scan လုပ်ပါ။');
                                    setTimeout(() => {
                                        $('#errorModal').modal('hide');
                                    },2000);
                                }
                                lastqrText = '';
                            })

                    } else {
                        $('#errorModal').modal('show');
                        $('#errorModalTitle').html('QR is not activated.');
                        $('#errorModalContent').html('Your QR is not activated. Please activate first');
                        setTimeout(() => {
                            $('#errorModal').modal('hide');
                        },1500);

                        window.open(`/admin/qractivate/${qrText}`,'_blank');
                    }
                }).catch(e => {
                    $('#errorModal').modal('show');
                    $('#errorModalTitle').html('Error');
                    $('#errorModalContent').html('Error not exists in our database.');
                    lastqrText = '';
                })
          }
        });


        Instascan.Camera.getCameras().then(cameras => {
            
            for (var i = 0; i < cameras.length; i++) {
                const camera = cameras[i];
                let part = `<option value=${i}>${camera.name}</option>`
                cameraSelection.append(part);
            }

            scanButton.attr("disabled",true);
            stopButton.attr("disabled",true);

            scanButton.click(e => {
                e.preventDefault();
                if(currentMachine === '0') {
                    $('#errorModal').modal('show');
                    $('#errorModalTitle').html('Please Choose a machine.');
                    $('#errorModalContent').html('You have to choose a machine in order to activate a Qr scanner.');
                    setTimeout(() => {
                        $('#errorModal').modal('hide');
                    },1500);
                } else {
                    const currentScanner = cameraSelection.val();
                    scanner.start(cameras[currentScanner]);
    
                    scanButton.attr('disabled', true);
                    stopButton.attr('disabled', false);
                    machineSelection.attr('disabled',true);
                    $('#qr-status').html('Scanning in process . Press Stop Scanning to stop the Scanner');
                }
            })

            stopButton.click(e => {
                e.preventDefault();
                
                scanButton.attr('disabled', false);
                stopButton.attr('disabled', true);
                scanner.stop(0);
                $('#qr-status').html('You have stopped a QR Scanner. Please press Scan button to restart again.');
            })
        });

})