$(document).ready(() => {

    $('#processForm').submit(e => {
        e.preventDefault();
        const name = $('#machineId').val();
        const data = {
            name
        }
        axios.post('/admin/test/test/process',data)
            .then(response => {
                alert('success');
            }).catch(e => {
                console.log(e);
                alert('fail');
            })
    })
    
})