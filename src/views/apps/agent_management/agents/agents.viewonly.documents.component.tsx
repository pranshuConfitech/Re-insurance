'use client'

import React, { useState, useEffect } from 'react'
import {
  Grid,
  Typography,
  Paper,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  CardActionArea
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Subscription } from 'rxjs'
import { AgentsService } from '@/services/remote-api/fettle-remote-api'

interface AgentViewOnlyDocumentsProps {
  agentData: any
}

interface DocumentItem {
  id: string
  documentType: string
  documentName: string
  documentOriginalName: string
  docFormat: string
  agentId: string | null
  documentNo: string
}

const AgentViewOnlyDocuments: React.FC<AgentViewOnlyDocumentsProps> = ({ agentData }) => {
  const identifications = agentData?.agentBasicDetails?.identifications || []
  const agentId = agentData?.agentId || agentData?.id

  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [documentPreviews, setDocumentPreviews] = useState<Record<string, string>>({})
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedDocName, setSelectedDocName] = useState<string>('')
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingFullImage, setLoadingFullImage] = useState(false)

  const agentsService = new AgentsService()

  useEffect(() => {
    let subscription: Subscription | undefined

    if (agentId) {
      setLoadingDocs(true)

      subscription = agentsService.getAgentDocuments(agentId).subscribe({
        next: (response: any[]) => {
          setDocuments(response || [])
          loadDocumentPreviews(response || [])
          setLoadingDocs(false)
        },
        error: (error: any) => {
          console.error('Error fetching documents:', error)
          setLoadingDocs(false)
        }
      })
    }

    return () => {
      subscription?.unsubscribe()
    }
  }, [agentId])

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  const loadDocumentPreviews = (docs: DocumentItem[]) => {
    const subscriptions: Subscription[] = []

    docs.forEach((doc) => {
      const sub = agentsService.getDocumentById(doc.id).subscribe({
        next: async (blob: Blob) => {
          try {
            const base64String = await blobToBase64(blob)
            setDocumentPreviews((prev) => ({
              ...prev,
              [doc.id]: base64String
            }))
          } catch (error) {
            console.error(`Error loading preview for ${doc.id}:`, error)
          }
        },
        error: (error) => {
          console.error(`Error fetching preview for ${doc.id}:`, error)
        }
      })

      subscriptions.push(sub)
    })

    return () => {
      subscriptions.forEach(sub => sub.unsubscribe())
    }
  }

  const handleDocumentClick = (documentId: string, documentName: string) => {
    setLoadingFullImage(true)
    setModalOpen(true)
    setSelectedDocName(documentName)

    if (documentPreviews[documentId]) {
      setSelectedImage(documentPreviews[documentId])
      setLoadingFullImage(false)
      return
    }

    const subscription: Subscription = agentsService.getDocumentById(documentId).subscribe({
      next: async (blob: Blob) => {
        try {
          const base64String = await blobToBase64(blob)
          setSelectedImage(base64String)
        } catch (error) {
          console.error('Error converting blob to base64:', error)
          setSelectedImage(null)
        } finally {
          setLoadingFullImage(false)
        }
      },
      error: (error) => {
        console.error('Error fetching full image:', error)
        setSelectedImage(null)
        setLoadingFullImage(false)
      }
    })
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedImage(null)
    setSelectedDocName('')
  }

  return (
    <Paper elevation={1} sx={{ padding: 3, margin: 2 }}>
      <Typography variant="h6" gutterBottom>
        Documents
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 3, mb: 2 }}>
            Uploaded Documents
          </Typography>

          {loadingDocs ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : documents.length > 0 ? (
            <Grid container spacing={2}>
              {documents.map((doc) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={doc.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      height: 280,
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleDocumentClick(doc.id, doc.documentOriginalName)}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        justifyContent: 'flex-start'
                      }}
                    >
                      {documentPreviews[doc.id] ? (
                        <CardMedia
                          component="img"
                          height="180"
                          image={documentPreviews[doc.id]}
                          alt={doc.documentOriginalName}
                          sx={{ 
                            objectFit: 'cover',
                            flexShrink: 0
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            height: 180,
                            flexShrink: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.200'
                          }}
                        >
                          <CircularProgress size={30} />
                        </Box>
                      )}
                      <CardContent 
                        sx={{ 
                          flexGrow: 1,
                          height: 100,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          p: 2,
                          '&:last-child': {
                            pb: 2
                          }
                        }}
                      >
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 600,
                            mb: 0.5,
                            height: '2.4em',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}
                        >
                          {doc.documentType.replace(/_/g, ' ')}
                        </Typography>
                        <Box sx={{ height: '1.5em', display: 'flex', alignItems: 'center' }}>
                          {doc.documentNo && (
                            <Typography 
                              variant="caption" 
                              color="textSecondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              Doc No: {doc.documentNo}
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="textSecondary">
              No uploaded documents available
            </Typography>
          )}
        </Grid>
      </Grid>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            m: 2
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{selectedDocName}</Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseModal}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          {loadingFullImage ? (
            <CircularProgress />
          ) : selectedImage ? (
            <Box
              component="img"
              src={selectedImage}
              alt={selectedDocName}
              sx={{
                maxWidth: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: 1
              }}
            />
          ) : (
            <Typography color="error">Failed to load image</Typography>
          )}
        </DialogContent>
      </Dialog>
    </Paper>
  )
}

export default AgentViewOnlyDocuments
