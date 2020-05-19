$(document).ready(() => {
    let checktoken = Cookies.get('admintoken');
    if(!checktoken) {
        window.location.replace('/admin/login');
    }
})