const login = async () => {
    let username = $('#username').val()
    let password = $('#password').val()
    let body = {
        username: username,
        password: password
    }
    let sendData = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(body)
    }
    let responseData = await httpRequest('/api/user/login', sendData)
    Cookies.set("token", responseData.data.token)
    Cookies.set("user_id", responseData.data.userId)
    window.location = "/"
}
const register = async () => {
    let username = $('#username').val()
    let password = $('#password').val()
    let password2 = $('$password-repeat').val()
    if (passwordCheck(password, password2)) {
        let body = {
            'username': username,
            'password': password
        }
        let sendData = {
            'method': 'POST',
            'headers': {
                'Content-Type': 'application/json'
            },
            'body': JSON.stringify(body)
        }
        let responseData = await httpRequest('/api/user/register', sendData)
        Cookies.set("token", responseData.data.token)
        Cookies.set("user_id", responseData.data.userId)
        window.location = "/"
    }
    else {
        $('#password-repeat').addClass("is-invalid")
        $('label[for=password-repeat]').html("The password doesnt match")
    }
}
const passwordCheck = (password1, password2) => {
    if (password1 === password2) {
        return true
    }
    else return false;
}