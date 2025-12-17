'use client'
import React, { useState, useRef } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputTextarea } from 'primereact/inputtextarea'
import { Toast } from 'primereact/toast'
import { RadioButton } from 'primereact/radiobutton'

interface AgentApprovalModalProps {
  visible: boolean
  onHide: () => void
  onSubmit: (action: 'REVERT' | 'REJECTED' | 'APPROVED', comment: string) => void
  agentData?: any
  loading?: boolean
}

const AgentApprovalModal: React.FC<AgentApprovalModalProps> = ({
  visible,
  onHide,
  onSubmit,
  agentData,
  loading = false
}) => {
  const [selectedAction, setSelectedAction] = useState<'REVERT' | 'REJECTED' | 'APPROVED'>('APPROVED')
  const [comment, setComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const toast = useRef<any>(null)

  const actions = [
    {
      key: 'APPROVED',
      label: 'Approve Agent',
      icon: 'pi pi-check-circle',
      color: '#10b981',
      bgColor: '#ecfdf5',
      darkBgColor: '#064e3b',
      description: 'Approve this agent for activation'
    },
    {
      key: 'REJECTED',
      label: 'Reject Agent',
      icon: 'pi pi-times-circle',
      color: '#ef4444',
      bgColor: '#fef2f2',
      darkBgColor: '#7f1d1d',
      description: 'Reject this agent application'
    },
    {
      key: 'REVERT',
      label: 'Revert to Pending',
      icon: 'pi pi-undo',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      darkBgColor: '#78350f',
      description: 'Revert agent back to pending status'
    }
  ]

  const resetForm = () => {
    setSelectedAction('APPROVED')
    setComment('')
    setCommentError('')
  }

  const handleSubmit = () => {
    if (!comment.trim()) {
      setCommentError('Please enter a reason for this action')
      return
    }

    if (comment.trim().length < 10) {
      setCommentError('Comment must be at least 10 characters long')
      return
    }

    setCommentError('')
    onSubmit(selectedAction, comment.trim())
  }

  const handleCancel = () => {
    resetForm()
    onHide()
  }

  const selectedActionData = actions.find(a => a.key === selectedAction)

  const dialogFooter = (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
        paddingTop: '24px',
        borderTop: '1px solid var(--surface-border)'
      }}
    >
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={handleCancel}
        severity="secondary"
        outlined
        disabled={loading}
        style={{
          minWidth: '100px',
          height: '44px'
        }}
      />
      <Button
        label={loading ? 'Processing...' : 'Submit Action'}
        icon={loading ? 'pi pi-spin pi-spinner' : selectedActionData?.icon}
        onClick={handleSubmit}
        severity={selectedAction === 'APPROVED' ? 'success' : selectedAction === 'REJECTED' ? 'danger' : 'warning'}
        disabled={loading || !comment.trim()}
        style={{
          minWidth: '140px',
          height: '44px'
        }}
      />
    </div>
  )

  React.useEffect(() => {
    if (visible) {
      resetForm()
    }
  }, [visible])

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        style={{
          width: '700px',
          maxWidth: '95vw',
        }}
        header={
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 0'
          }}>

            <div>
              <h3 style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: '600',
                color: 'var(--text-color)'
              }}>
                Agent Approval - {agentData?.agentBasicDetails?.name || 'N/A'}
              </h3>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                color: 'var(--text-color-secondary)',
                opacity: 0.8
              }}>
                Review and process agent application
              </p>
            </div>
          </div>
        }
        modal={true}
        footer={dialogFooter}
        onHide={handleCancel}
        draggable={false}
        resizable={false}
        closable={!loading}
        maskStyle={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(2px)'
        }}
        contentStyle={{
          padding: '36px',
          backgroundColor: 'var(--surface-card)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>



          {/* Action Selection */}
          <div>
            <h4 style={{
              margin: '0 0 20px 0',
              color: 'var(--text-color)',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="pi pi-cog" style={{ color: 'var(--primary-color)' }}></i>
              Select Action
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {actions.map((action) => (
                <div
                  key={action.key}
                  onClick={() => setSelectedAction(action.key as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px',
                    borderRadius: '12px',
                    border: `2px solid ${selectedAction === action.key
                      ? action.color
                      : 'var(--surface-border)'
                      }`,
                    backgroundColor: selectedAction === action.key
                      ? `${action.color}15`
                      : 'var(--surface-card)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative' as const
                  }}
                  onMouseEnter={(e) => {
                    if (selectedAction !== action.key) {
                      e.currentTarget.style.borderColor = `${action.color}60`
                      e.currentTarget.style.backgroundColor = `${action.color}08`
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedAction !== action.key) {
                      e.currentTarget.style.borderColor = 'var(--surface-border)'
                      e.currentTarget.style.backgroundColor = 'var(--surface-card)'
                    }
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    backgroundColor: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px'
                  }}>
                    <i className={action.icon} style={{
                      fontSize: '20px',
                      color: 'white'
                    }}></i>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'var(--text-color)',
                      marginBottom: '4px'
                    }}>
                      {action.label}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: 'var(--text-color-secondary)',
                      lineHeight: '1.4'
                    }}>
                      {action.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Comment Section - Updated with wider textarea */}
          <div>
            <h4 style={{
              margin: '0 0 16px 0',
              color: 'var(--text-color)',
              fontSize: '16px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className="pi pi-comment" style={{ color: 'var(--primary-color)' }}></i>
              Reason / Comment
              <span style={{
                color: '#ef4444',
                fontSize: '14px',
                fontWeight: '500'
              }}>*</span>
            </h4>

            <InputTextarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value)
                if (commentError && e.target.value.trim()) {
                  setCommentError('')
                }
              }}
              rows={5}
              placeholder={`Please provide your reason for ${selectedAction.toLowerCase()}ing this agent...`}
              className={commentError ? 'p-invalid' : ''}
              disabled={loading}
              style={{
                width: '100%',
                minHeight: '140px',
                maxHeight: '200px',
                resize: 'vertical' as const,
                fontSize: '15px',
                lineHeight: '1.6',
                padding: '16px',
                borderRadius: '8px',
                border: '2px solid var(--surface-border)',
                backgroundColor: 'var(--surface-card)',
                color: 'var(--text-color)'
              }}
            />

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '12px',
              paddingTop: '8px'
            }}>
              {commentError ? (
                <small style={{
                  color: '#ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  <i className="pi pi-exclamation-triangle"></i>
                  {commentError}
                </small>
              ) : (
                <small style={{
                  color: 'var(--text-color-secondary)',
                  fontSize: '13px'
                }}>
                  Minimum 10 characters required
                </small>
              )}

              <small style={{
                color: comment.length > 450 ? '#f59e0b' : 'var(--text-color-secondary)',
                fontSize: '13px',
                fontWeight: '500'
              }}>
                {comment.length}/500 characters
              </small>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default AgentApprovalModal
