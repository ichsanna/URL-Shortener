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