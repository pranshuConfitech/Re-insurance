import { useState, useEffect, useCallback } from 'react'
import { QuotationService } from '@/services/remote-api/api/quotation-services'

interface QuotationData {
    quotationDetails: any
    loading: boolean
    error: string | null
}

export const useQuotationData = (quotationId: string): QuotationData => {
    const [quotationDetails, setQuotationDetails] = useState({})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchQuotationDetails = useCallback(async () => {
        if (!quotationId) return

        try {
            setLoading(true)
            setError(null)
            const quotationService = new QuotationService()
            const data = await quotationService.getQuoationDetailsByID(quotationId).toPromise()
            setQuotationDetails(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch quotation details')
        } finally {
            setLoading(false)
        }
    }, [quotationId])

    useEffect(() => {
        fetchQuotationDetails()
    }, [fetchQuotationDetails])

    return { quotationDetails, loading, error }
}
