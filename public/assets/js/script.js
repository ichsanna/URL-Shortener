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
const logout = () => {
    Cookies.set("token", "")
    Cookies.set("user_id", "")
    location.reload()
}
const getLinks = async () => {
    let sendData = {
        'method': 'GET',
        'headers': {
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
    }
    let responseData = await httpRequest('/api/link/get/user/' + Cookies.get("user_id"), sendData)
    let links = responseData.data
    links.forEach((link,count) => {
        $('.main-container').append(`<div class="container links-container d-flex justify-content-between">
        <div class="link">
            <h3 class="link-title">${link.nameLink}</h3>
            <p class="link-short">localhost:3000/${link.shortLink}</p>
            <p class="link-original">${link.longLink}</p>
        </div>
        <div class="operation d-flex align-items-end">
            <button type="button" onclick="copyLink('localhost:3000/${link.shortLink}')"class="button-copy btn btn-primary">
                   <i class="fa-solid fa-copy"></i>Copy</button>
            <button type="button" onclick="getEditLink('${link._id}',${count})" class="button-edit btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#edit-modal"><i class="fa-solid fa-pen-to-square"></i></button>
            <button type="button" onclick="deleteLink('${link._id}')" class="button-delete btn btn-primary">
                    <i class="fa-solid fa-x"></i></button>
        </div>
    </div>`)
    });
}
const addNewLink = async () => {
    let longLink = $('#add-long').val()
    let nameLink = $('#add-name').val()
    let userId = Cookies.get("user_id")
    let body = {
        userId: userId,
        longLink: longLink,
        nameLink: nameLink
    }
    console.log(body)
    let sendData = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        'body': JSON.stringify(body)
    }
    let responseData = await httpRequest('/api/link/add', sendData)
    console.log(responseData)
    $("#add-modal").modal('hide')
    $("#add-name").val("")
    $("#add-long").val("")
    $(".links-container").remove()
    getLinks()
}
const copyLink = (link) => {
    navigator.clipboard.writeText(link);
}
const getEditLink = (linkId,count) => {
    let nameLink = $(`.links-container:nth-child(${2+count})`).find(".link-title").text()
    let longLink = $(`.links-container:nth-child(${2+count})`).find(".link-original").text()
    let shortLink = $(`.links-container:nth-child(${2+count})`).find(".link-short").text()
    $('#edit-name').val(nameLink)
    $('#edit-long').val(longLink)
    $('#edit-short').val(shortLink)
    $('.submit-edit').attr("onclick",`editLink("${linkId}")`)
}
const editLink = async (linkId) => {
    let nameLink = $('#edit-name').val()
    let longLink = $('#edit-long').val()
    let body = {
        linkId: linkId,
        longLink: longLink,
        nameLink: nameLink
    }
    let sendData = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        'body': JSON.stringify(body)
    }
    let responseData = await httpRequest('/api/link/edit', sendData)
    $("#edit-modal").modal('hide')
    $('#edit-name').val("")
    $('#edit-long').val("")
    $('#edit-short').val("")
    $('.submit-edit').attr("onclick","")
    $(".links-container").remove()
    getLinks()
}
const deleteLink = async (linkId) => {
    let body = {
        linkId: linkId
    }
    let sendData = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        'body': JSON.stringify(body)
    }
    let responseData = await httpRequest('/api/link/delete', sendData)
    $(".links-container").remove()
    getLinks()
}
const httpRequest = async (url, data) => {
    try {
        let response = await fetch(url, data)
        return response.json()
    }
    catch (err) {
        console.log("Error")
        console.log(err)
    }
}
const passwordCheck = (password1, password2) => {
    if (password1 === password2) {
        return true
    }
    else return false;
}
$(document).ready(async () => {
    getLinks()
})