let token = Cookies.get('admintoken');
if(!token) {
  window.location.replace('/admin/login');
}

$("#status").fadeOut(),
$("#preloader").delay(350).fadeOut("slow");

$(document).ready(()=> {
    $('#menu-action').click(function() {
        $('.sidebar').toggleClass('active');
        $('.main').toggleClass('active');
        $(this).toggleClass('active');
      
        if ($('.sidebar').hasClass('active')) {
          $(this).find('i').addClass('fa-times');
          $(this).find('i').removeClass('fa-bars');
        } else {
          $(this).find('i').addClass('fa-bars');
          $(this).find('i').removeClass('fa-times');
        }
      });
      
      // Add hover feedback on menu
      $('#menu-action').hover(function() {
          $('.sidebar').toggleClass('hovered');
      });

  
      //logout
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token
    }

    //logout
    $('#LogoutRoute').click((e) => {
        e.preventDefault();
        const name = {
          'name':'hi'
        }
        axios.post('/api/admins/admin/logout',name,{ headers })
        .then(response => {
            Cookies.remove('admintoken');
            Cookies.remove('admin');
            window.location.replace('/admin/login');
          })
          .catch(error => {
            console.log(error);
          });
    })
})