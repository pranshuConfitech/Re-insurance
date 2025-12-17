import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import QuotationListComponent from './quotation.list';

export default function QuotationTabComponent({ tabType }: { tabType: 'new' | 'renewal' }) {
  const router = useRouter();

  return (
    <div className='card'>
      <div style={{ position: 'relative' }}>
        <Button
          variant='contained'
          size='small'
          onClick={() => router.push('/quotations?mode=create')}
          startIcon={<AddIcon />}
          sx={{
            position: 'absolute',
            top: 6,
            right: 8,
            zIndex: 2,
            backgroundColor: '#28a745',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            '&:hover': { backgroundColor: '#218838' }
          }}
        >
          Create
        </Button>
        <QuotationListComponent tabType={tabType} />
      </div>
    </div>
  );
}

