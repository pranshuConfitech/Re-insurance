import React, { useEffect, useState } from 'react'

import { Grid, Typography, IconButton } from '@mui/material'
import { CloudDownload as DownloadIcon } from '@mui/icons-material'

import PdfReview from './pdf.preview'
import DocumentModal from './document.modal'
import { config } from '@/services/remote-api/api/configuration'

const DocumentPreview = ({ documents, preAuthId }: { documents: any; preAuthId: any }) => {
  const [selectedDocument, setSelectedDocument] = useState(null)

  const baseDocumentURL = `${config.rootUrl}/claim-query-service/v1/preauths/${preAuthId}/docs/`

  const handleDocumentClick = (document: any) => {
    setSelectedDocument(document)
  }

  const handleCloseModal = () => {
    setSelectedDocument(null)
  }

  const handleFileDownload = async (e: any, doc: any) => {
    e.preventDefault()
    e.stopPropagation()
    const anchor = document.createElement('a')

    document.body.appendChild(anchor)

    const token = (window as any).getToken?.()
    const fileUrl = `${baseDocumentURL}${doc.documentName}` // Build the file URL

    const headers = new Headers()

    headers.append('Authorization', `Bearer ${token}`) // Use the token in the headers

    try {
      const response = await fetch(fileUrl, { headers })

      if (!response.ok) {
        throw new Error(`Failed to fetch file with status: ${response.status}`)
      }

      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)

      anchor.href = objectUrl
      anchor.download = doc.documentOriginalName
      anchor.click()

      window.URL.revokeObjectURL(objectUrl)
    } catch (error) {
      console.error('Error downloading file:', error)
    } finally {
      anchor.remove()
    }
  }

  return (
    <Grid container spacing={3}>
      {documents.map((document: any) => (
        <Grid item key={document.id}>
          <div
            style={{
              position: 'relative',
              width: '100px',
              height: '100px',
              borderRadius: '6px',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              cursor: 'pointer'
            }}
            onClick={() => handleDocumentClick(document)}
          >
            {RenderPreview(document, baseDocumentURL)}
            {/* <a href={`${baseDocumentURL}${document.documentName}`} download> */}
            <IconButton
              onClick={e => handleFileDownload(e, document)}
              style={{
                position: 'absolute',
                top: 1,
                right: 1,
                padding: '4px',
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)')}
            >
              <DownloadIcon />
            </IconButton>
            {/* </a> */}
          </div>
          <div style={{ textAlign: 'left', marginTop: '22px' }}>
            <Typography
              variant='subtitle2'
              style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
              title={document.documentOriginalName}
            >
              {document.documentOriginalName}
            </Typography>
            <Typography variant='caption' color='textSecondary'>
              {/* {document.documentOriginalName} */}
              {document.documentType}
            </Typography>
          </div>
        </Grid>
      ))}
      <DocumentModal document={selectedDocument} onClose={handleCloseModal} baseDocumentURL={baseDocumentURL} />
    </Grid>
  )
}

const RenderPreview = (document: any, baseDocumentURL: any) => {
  const { docFormat, documentName } = document
  const completeURL = `${baseDocumentURL}${documentName}`
  const [img, setImg] = useState<any>()

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const res = await fetch(completeURL, {
          headers: {
            Authorization: `Bearer ${(window as any).getToken?.()}`
          }
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const file = await res.blob()

        setImg(URL.createObjectURL(file))
      } catch (error) {
        alert('Failed to fetch the image')

        // Handle the error (e.g., display a fallback image or show an error message)
      }
    }

    fetchImg()
  }, [])

  if (docFormat.split('/')[0] === 'image') {
    return (
      <img
        src={img} // Complete URL for images
        alt='Document Thumbnail'
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          borderRadius: '8px',
          objectFit: 'cover'
        }}
      />
    )
  } else if (docFormat === 'application/pdf') {
    return <PdfReview url={completeURL} onClick={undefined} />
  } else {
    return null
  }
}

export default DocumentPreview
