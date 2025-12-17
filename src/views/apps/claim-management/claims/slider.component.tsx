import React, { useEffect, useState } from 'react'

import { useParams, useSearchParams } from 'next/navigation'

import { withStyles } from '@mui/styles'
import Carousel from 'react-material-ui-carousel'

import { Grid, IconButton, Typography } from '@mui/material'
import { CloudDownload as DownloadIcon } from '@mui/icons-material'

import PdfReview from './component/pdf.preview'

import { config } from '@/services/remote-api/api/configuration'

const useStyles = (theme: any) => ({
  navButtonsWrapperProps: {
    top: '50%',
    height: '12%'
  }
})

const RenderPreview = ({ document, baseDocumentURL }: { document: any; baseDocumentURL: string }) => {
  const { docFormat, documentName } = document
  const completeURL = `${baseDocumentURL}${documentName}`

  const [img, setImg] = useState<string | undefined>()

  useEffect(() => {
    const fetchImg = async () => {
      try {
        const res = await fetch(completeURL)

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

  if (docFormat?.split('/')[0] === 'image') {
    // if (docFormat === 'image/png') {
    return (
      <img
        src={img} // Complete URL for images
        alt='Document Thumbnail'
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          // aspectRatio: '1',
          borderRadius: '8px',
          objectFit: 'cover',
          border: '1px solid rgba(0, 0, 0, 1)'
        }}
      />
    )
  } else if (docFormat === 'application/pdf') {
    return <PdfReview url={completeURL} />
  } else {
    return null
  }
}

// function useQuery1() {
//   return new URLSearchParams(useLocation().search);
// }
const SliderComponent = ({ items, classes }: { items: any; classes: any }) => {
  const query = useSearchParams()
  const id: any = useParams().id
  let preId = query.get('preId')

  if (!preId) {
    preId = id?.split('-')[1]
  }

  const baseDocumentURL = `${config.rootUrl}/claim-query-service/v1/preauths/${preId}/docs/`

  return (
    <div style={{ height: "800px" }}>
      <Carousel
        sx={{ height: "800px" }}
        autoPlay={false}
        indicators={false}
        navButtonsAlwaysVisible={items?.length > 1 && true}
        navButtonsWrapperProps={{
          className: classes.navButtonsWrapperProps
        }}
      >
        {items?.map((item: any, i: any) => {
          return (
            // <DocumentPreview documents={item} preAuthId={i} />
            <Grid item key={item.id || `doc-${i}`} style={{ height: "800px" }}>
              <div style={{ position: 'relative', borderRadius: '6px', height: "800px" }}>
                <RenderPreview document={item} baseDocumentURL={baseDocumentURL} />
                <a href={`${baseDocumentURL}${item.documentName}`} download>
                  <IconButton
                    style={{
                      position: 'absolute',
                      top: 1,
                      right: 1,
                      padding: '4px',
                      color: '#fff',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      transition: 'background-color 0.3s'
                    }}
                    // Add onMouseEnter and onMouseLeave to handle hover effect
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.4)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.2)')}
                  >
                    <DownloadIcon />
                  </IconButton>
                </a>
              </div>
              <div style={{ textAlign: 'left', marginTop: '8px' }}>
                <Typography
                  variant='subtitle2'
                  style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  title={item?.documentName}
                >
                  {item.documentOriginalName}
                </Typography>
                <Typography variant='caption' color='textSecondary'>
                  {item.documentType}
                </Typography>
              </div>
            </Grid>
          )
        })}
      </Carousel>
    </div>
  )
}

export default withStyles(useStyles)(SliderComponent)
