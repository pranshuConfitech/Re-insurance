
import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Typography,
    Divider
} from '@mui/material'
import UploadIcon from '@mui/icons-material/CloudUpload'
import VisibilityIcon from '@mui/icons-material/Visibility'

interface DocumentUploadProps {
    members: any[]
    onUploadDocument: (member: any, event: any) => void
    classes: any
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
    members,
    onUploadDocument,
    classes
}) => {
    return (
        <>
            <Typography variant='h6'>Upload Medical Report</Typography>
            <Divider style={{ margin: '8px 0' }} />
            <Table size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Member Name</TableCell>
                        <TableCell align='right'>Upload File</TableCell>
                        <TableCell align='right'>View File</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members.map((member, index) => (
                        <TableRow key={member.id}>
                            <TableCell>{member.name}</TableCell>
                            <TableCell align='right'>
                                <input
                                    id={`file-upload-${index}`}
                                    type='file'
                                    onChange={(e) => onUploadDocument(member, e)}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor={`file-upload-${index}`}>
                                    <Button color='primary' component='span'>
                                        <UploadIcon />
                                    </Button>
                                </label>
                            </TableCell>
                            <TableCell align='right'>
                                <VisibilityIcon />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}
