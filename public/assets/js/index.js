var links = [{}]
const logout = () => {
    Cookies.set("token", "")
    Cookies.set("user_id", "")
    location.reload()
}
const renderLinks = async (items) => {
    $("#add-name").val("")
    $("#add-long").val("")
    $('#edit-name').val("")
    $('#edit-long').val("")
    $('#edit-short').val("")
    $(".links-container").remove()
    items.forEach((item, count) => {
        created_at = ((new Date(item.created_at)).toString()).substring(4, 21)
        $('.main-container').append(`<div class="container links-container d-flex justify-content-between">
        <div class="link">
            <h3 class="link-title">${item.nameLink}</h3>
            <a href="${item.shortLink}" target="_blank" class="link-short">${this.location.host}/${item.shortLink}</a>
            <p class="link-original">${item.longLink}</p>
            <p class="created-at">Created at: ${created_at}</p>
        </div>
        <div class="operation d-flex flex-column align-items-center justify-content-around">
            <div class="d-flex justify-content-center">
                <button type="button" onclick="openQR('${item.shortLink}',${count})"class="button-qr btn btn-primary" 
                data-bs-toggle="modal" data-bs-target="#qr-modal">
                    <i class="fa-solid fa-qrcode"></i>QR Code</button>
            </div>
            <div class="d-flex">
            <button type="button" onclick="copyLink('${this.location.host}/${item.shortLink}')"class="button-copy btn btn-primary">
                   <i class="fa-solid fa-copy"></i>Copy</button>
            <button type="button" onclick="getEditLink('${item._id}',${count})" class="button-edit btn btn-primary" data-bs-toggle="modal"
                    data-bs-target="#edit-modal"><i class="fa-solid fa-pen-to-square"></i>Edit</button>
            <button type="button" onclick="deleteLink('${item._id}')" class="button-delete btn btn-primary">
                    <i class="fa-solid fa-x"></i>Delete</button>
            </div>
        </div>
    </div>`)
    })
}
const getLinks = async () => {
    let sendData = {
        'method': 'GET',
        'headers': {
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
    }
    let responseData = await httpRequest('/api/link/get/user/' + Cookies.get("user_id"), sendData)
    if (responseData.success) {
        links = responseData.data
        filterLinks()
    }
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
    let sendData = {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cookies.get("token")
        },
        'body': JSON.stringify(body)
    }
    let responseData = await httpRequest('/api/link/add', sendData)
    if (responseData.success) {
        links.push(responseData.data)
        $("#add-modal").modal('hide')
        $("#show-new-modal").modal('show')
        $('.new-link').empty()
        $('.new-link').append(`<div class="link">
            <h3 class="link-title">${responseData.data.nameLink}</h3>
            <a href="${responseData.data.shortLink}" target="_blank" class="link-short">${this.location.host}/${responseData.data.shortLink}</a>
            <p class="link-original">${responseData.data.longLink}</p>
            <p class="created-at">Created at: ${((new Date(responseData.data.created_at)).toString()).substring(4, 21)}</p>
        </div>`)
        $('.new-copy').attr("onclick", `copyLink("${this.location.host}/${responseData.data.shortLink}")`)
        filterLinks()
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            timer: 2000,
            timerProgressBar: true,
            text: responseData.message
        })
    }
}
const openQR = (shortLink, count) => {
    let nameLink = $(`.links-container:nth-child(${2 + count})`).find(".link-title").text()
    $('#qr-name').text(nameLink)
    $('#qr-image').attr('src', `/api/link/get/qr/${shortLink}`)
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
    if (responseData.success) {
        alert('success',responseData.message)
        let index = links.findIndex(arr => arr._id === linkId)
        links[index].longLink = longLink
        links[index].nameLink = nameLink
        $("#edit-modal").modal('hide')
        $('.submit-edit').attr("onclick", "")
        renderLinks(links)
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Oops',
            timer: 2000,
            timerProgressBar: true,
            text: responseData.message
        })
    }
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
    if (responseData.success) {
        alert('success',responseData.message)
        let index = links.findIndex(arr => arr._id === linkId)
        links.splice(index, 1)
        renderLinks(links)
    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Oops',
            timer: 2000,
            timerProgressBar: true,
            text: responseData.message
        })
    }
}
const filterLinks = () => {
    let search = $('.search-input').val()
    let sortBy = $('.sort-by').val()
    let sortOrder = $('.sort-order').val()
    tmpLinks = links
    if (sortBy === 'name') {
        tmpLinks.sort((a, b) => {
            if (a.nameLink.toLowerCase() > b.nameLink.toLowerCase()) {
                return 1
            }
            return -1
        })
    }
    else if (sortBy === 'short') {
        tmpLinks.sort((a, b) => {
            if (a.shortLink.toLowerCase() > b.shortLink.toLowerCase()) {
                return 1
            }
            return -1
        })
    }
    else if (sortBy === 'date') {
        tmpLinks.sort((a, b) => {
            if (a.created_at.toLowerCase() > b.created_at.toLowerCase()) {
                return 1
            }
            return -1
        })
    }
    else if (sortBy === 'long') {
        tmpLinks.sort((a, b) => {
            if (a.longLink.toLowerCase() > b.longLink.toLowerCase()) {
                return 1
            }
            return -1
        })
    }
    if (sortOrder == 'desc') {
        tmpLinks.reverse()
    }
    tmpLinks = tmpLinks.filter(arr => arr.nameLink.toLowerCase().includes(search))
    renderLinks(tmpLinks)
}
$(document).ready(() => {
    getLinks()
    $('.search-input').on({
        keyup: $.debounce(500, filterLinks)
    });
    $('.sort-by').on('change', function () {
        filterLinks()
    });
    $('.sort-order').on('change', function () {
        filterLinks()
    });
})
