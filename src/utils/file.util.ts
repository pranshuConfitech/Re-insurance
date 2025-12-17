function downloadFileResponseExecution(res:any) {
    const { data, headers } = res
    const fileName = headers['content-disposition'].replace(/\w+; filename=(.*)/, '$1')
    const blob = new Blob([data], { type: headers['content-type'] })
    const dom = document.createElement('a')
    const url = window.URL.createObjectURL(blob)

    dom.href = url
    dom.download = decodeURI(fileName)
    dom.style.display = 'none'
    document.body.appendChild(dom)
    dom.click()
    dom.parentNode?.removeChild(dom)
    window.URL.revokeObjectURL(url)
}

export default downloadFileResponseExecution;