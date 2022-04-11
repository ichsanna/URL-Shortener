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
    links.forEach((link, count) => {
        $('.main-container').append(`<div class="container links-container d-flex justify-content-between">
        <div class="link">
            <h3 class="link-title">${link.nameLink}</h3>
            <a href="${link.shortLink}" target="_blank" class="link-short">localhost:3000/${link.shortLink}</a>
            <p class="link-original">${link.longLink}</p>
        </div>
        <div class="operation d-flex flex-column align-items-center justify-content-between">
            <div class="d-flex justify-content-center">
            <button type="button" onclick="openQR('${link.shortLink}',${count})"class="button-qr btn btn-primary" 
            data-bs-toggle="modal" data-bs-target="#qr-modal">
                   <i class="fa-solid fa-qrcode"></i>QR Code</button>
            </div>
            <div class="d-flex">
            <button type="button" onclick="copyLink('localhost:3000/${link.shortLink}')"class="button-copy btn btn-primary">
                   <i class="fa-solid fa-copy"></i>Copy</button>
            <button type="button" onclick="getEditLink('${link._id}',${count})" class="button-edit btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#edit-modal"><i class="fa-solid fa-pen-to-square"></i>Edit</button>
            <button type="button" onclick="deleteLink('${link._id}')" class="button-delete btn btn-primary">
                    <i class="fa-solid fa-x"></i>Delete</button>
            </div>
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
const openQR = (shortLink,count) => {
    let nameLink = $(`.links-container:nth-child(${2 + count})`).find(".link-title").text()
    $('#qr-name').text(nameLink)
    $('#qr-image').attr('src',`/api/link/get/qr/${shortLink}`)
}
const copyLink = (link) => {
    navigator.clipboard.writeText(link);
}
const getEditLink = (linkId, count) => {
    let nameLink = $(`.links-container:nth-child(${2 + count})`).find(".link-title").text()
    let longLink = $(`.links-container:nth-child(${2 + count})`).find(".link-original").text()
    let shortLink = $(`.links-container:nth-child(${2 + count})`).find(".link-short").text()
    $('#edit-name').val(nameLink)
    $('#edit-long').val(longLink)
    $('#edit-short').val(shortLink)
    $('.submit-edit').attr("onclick", `editLink("${linkId}")`)
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
    $('.submit-edit').attr("onclick", "")
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

$(document).ready(async () => {
    getLinks()
})