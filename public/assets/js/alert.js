const alert = (condition, message) => {
    if (condition === 'success') {
        Swal.fire({
            icon: 'success',
            title: 'Yay',
            timer: 2000,
            timerProgressBar: true,
            text: message
        })
    }
    else if (condition === 'error') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            timer: 2000,
            timerProgressBar: true,
            text: message
        })
    }
}