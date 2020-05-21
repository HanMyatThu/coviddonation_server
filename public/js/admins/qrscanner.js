$(document).ready(() => {
    const token = Cookies.get('admintoken');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token
    }
    let qrText = "";
    let qrData = "";
    let scanner = new Instascan.Scanner(
        {
        video: document.getElementById('preview')
        }
        );

        scanner.addListener('scan', async function(content) {
          qrText = content;
          if(qrText.startsWith('http')) {
              window.open(qrText,'_blank');
          } else {
              axios.get('/api/admin/qr/'+qrText,{headers})
                .then(response => {
                    qrData = response.data;
                    if(qrData.activate === true) {
                        const processQr = {
                            qrid : qrData
                        }
                        axios.post('/api/admin/qr/process',processQr,{headers})
                            .then(response => {
                                $('#successModal').modal('show');
                                $('#successModalTitle').html('အောင်မြင်ပါသည်');
                                $('#successModalContent').html('လက်ဆေးခြင်း ၊  mask  တပ်ခြင်းဖြင့် Covid-19 ကာကွယ်ကြဆို့။');
                                setTimeout(() => {
                                    $('#successModal').modal('hide');
                                },1500);
                            }).catch(e => {
                                if(e.toString().includes('401')) {
                                    $('#errorModal').modal('show');
                                    $('#errorModalTitle').html('မအောင်မြင်ပါ');
                                    $('#errorModalContent').html('သင့် QR ကို အသုံးပြုပြီးသွားပါပြီ။ ထပ်မံထုတ်ယူလို့ မရသေးပါ။');
                                    setTimeout(() => {
                                        $('#errorModal').modal('hide');
                                    },1500);
                                }else  {
                                    $('#errorModal').modal('show');
                                    $('#errorModalTitle').html('မအောင်မြင်ပါ');
                                    $('#errorModalContent').html('မအောင်မြင်ပါ။ ခဏအကြာတွင် ပြန်လည် scan လုပ်ပါ။');
                                    setTimeout(() => {
                                        $('#errorModal').modal('hide');
                                    },1500);
                                }
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
                    $('#errorModalContent').html('Webcam Error. Please refresh the page');

                    setTimeout(() => {
                        window.location.reload();
                    },1500);
                })
          }
        });


        Instascan.Camera.getCameras().then(cameras =>
            {
            if(cameras.length > 0){
            scanner.start(cameras[0]);
            } else {
            console.error("No camera detective");
            }
        });

})