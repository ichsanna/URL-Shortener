const login = async () => {
    let username = $('input[name=username]').val()
    let password = $('input[name=password]').val()
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
    Cookies.set("user_id", responseData.data.id)
    window.location = "/"
}
const register = async () => {
    let username = $('input[name=username]').val()
    let password = $('input[name=password]').val()
    let password2 = $('input[name=password2]').val()
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
        Cookies.set("user_id", responseData.data.id)
        window.location = "/"
    }
    else {
        $('input[name=password2]').addClass("is-invalid")
        $('label[for=floatingPassword2]').html("The password doesnt match")
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
    let longLink = $('#floatingLink').val()
    let nameLink = $('#floatingName').val()
    let userId = Cookies.get("user_id")
    let body = {
        userId: userId,
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
    let responseData = await httpRequest('/api/link/add', sendData)
    $("#add-modal").modal('hide')
    $("#floatingName").val("")
    $("#floatingLink").val("")
    $(".links-container").remove()
    getLinks()
}
const copyLink = (link) => {
    navigator.clipboard.writeText(link);
}
const getEditLink = (linkId,count) => {
    let nameLink = $(`.links-container:nth-child(${4+count})`).find(".link-title").text()
    let longLink = $(`.links-container:nth-child(${4+count})`).find(".link-original").text()
    let shortLink = $(`.links-container:nth-child(${4+count})`).find(".link-short").text()
    $('#floatingEditName').val(nameLink)
    $('#floatingEditLink').val(longLink)
    $('#floatingEditShortLink').val(shortLink)
    $('.submit-edit').attr("onclick",`editLink("${linkId}")`)
}
const editLink = async (linkId) => {
    let longLink = $('#floatingEditLink').val()
    let nameLink = $('#floatingEditName').val()
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
    $("#floatingEditName").val("")
    $("#floatingEditLink").val("")
    $("#floatingEditShortLink").val("")
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