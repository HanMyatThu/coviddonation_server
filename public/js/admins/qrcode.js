$(document).ready(() => {
    const token = Cookies.get('admintoken');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
    }

    $('#city').change(e => {
      const type = e.target.value;

      if(type === 'naypyitaw') {
        $('#township').attr('disabled',false);
        $('#township').val('');
      } else {
        $('#township').attr('disabled', true);
        $('#township').val('Hlaing Thar Yar');
      }
    })
    $('#QrForm').submit(e => {
        e.preventDefault();
        var phone = $('#phone').val();
        var township = $('#township').val();
        var street = $('#street').val();
        var name = $('#name').val();
        var city = $('#city').val();
        
        if(city === '0') {
          $('#errorModal').modal('show');
          $('#errorModalTitle').html('Invalid City');
          $('#errorModalContent').html('Process failed. Please enter city');
          setTimeout(() => {
            $('#errorModal').modal('hide');
          },1500);
        } else {
          axios({
            url: `/api/download/qrcode/qr/${name}/${phone}/${township}/${street}/${city}`,
            method: 'GET',
            responseType: 'blob', // important
            headers
          }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${phone}.png`);
            document.body.appendChild(link);
            link.click();

            $('#successModal').modal('show');
            $('#successModalTitle').html('Success Process');
            $('#successModalContent').html('Your process is success. Qr code is generated');
            setTimeout(() => {
                window.location.reload();   
            },1500);
          }).catch(e => {
            const error = e.toString();
            if(error.includes('400')) {
              $('#errorModal').modal('show');
              $('#errorModalTitle').html('Failed');
              $('#errorModalContent').html('Your process is failed. User with phone no already existed');
              setTimeout(() => {
                  window.location.reload();
              },1500);
            } else {
              $('#errorModal').modal('show');
              $('#errorModalTitle').html('Failed');
              $('#errorModalContent').html('Your process is failed. Please try again');
              setTimeout(() => {
                  window.location.reload();
              },1500);
            }
          });
        }
    })
    
    $('#defaultQr').click(e => {
      e.preventDefault();

      axios({
        url: `/api/download/qrcode/defaultqr`,
        method: 'GET',
        responseType: 'blob',
        headers
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `default-qr.png`);
        document.body.appendChild(link);
        link.click();

        $('#successModal').modal('show');
        $('#successModalTitle').html('Success Process');
        $('#successModalContent').html('Your process is success. Qr code is generated');
        setTimeout(() => {
            window.location.reload();   
        },1500);
      }).catch(e => {
          $('#errorModal').modal('show');
          $('#errorModalTitle').html('Failed');
          $('#errorModalContent').html('Your process is failed. Please try again');
          setTimeout(() => {
              window.location.reload();
          },1500);
      });

    })
})