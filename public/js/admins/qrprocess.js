let token = Cookies.get("admintoken");
token || window.location.replace("/process/qr/fail"), $(document).ready(() => {
    const e = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
    };
    
    const machineId = $('#machineId').html();
    const s = {
        qrid: $("#qrid").html(),
        machineId
    };
    axios.post("/api/admin/qr/process", s, {
        headers: e
    }).then(e => {
        console.log(e);
        if(e.data.error) {
            const date = new Date(e.data.message);
            $('#errorModal').modal('show');
            $('#errorModalTitle').html('Transaction Failed');
            $('#errorModalContent').html('You have done your transaction on '+ date + '. Please try again next 3 days');
        } else {
            $('#successModal').modal('show');
            $('#successModalTitle').html('Transaction Success');
            $('#successModalContent').html('Transaction Success');
            window.close();
        }
    }).catch(e => {
        console.log(e), e.toString().includes("401") ? ($("#errorModal").modal("show"), $("#errorModalTitle").html("Failed"), $("#errorModalContent").html("User is already used the code. Please try again in 3 days.")) : ($("#errorModal").modal("show"), $("#errorModalTitle").html("Failed"), $("#errorModalContent").html("Your process is failed.Please rescan the QR Code and try again"))
    })
});