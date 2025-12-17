import { useState, useCallback } from 'react'

interface PremiumCalculationState {
    totalPremium: number
    totalPremiumAfterLoadingAndDiscount: number
    discount: number
    loading: number
}

export const usePremiumCalculation = () => {
    const [premiumState, setPremiumState] = useState<PremiumCalculationState>({
        totalPremium: 0,
        totalPremiumAfterLoadingAndDiscount: 0,
        discount: 0,
        loading: 0
    })

    const calculateTotalPremium = useCallback((rows: any[]) => {
        return rows.reduce((acc, currVal) => {
            if (currVal.premiumRules.length > 0) {
                return acc + currVal.premiumRules.reduce((a: number, c: any) => a + c.sumOfPremium, 0)
            }
            return acc
        }, 0)
    }, [])

    const updateDiscountAndLoading = useCallback((discount: number, loading: number, totalPremium: number) => {
        const discountAmount = (discount / 100) * totalPremium
        const loadingAmount = (loading / 100) * totalPremium
        const totalAfterAdjustment = totalPremium + loadingAmount - discountAmount

        setPremiumState(prev => ({
            ...prev,
            discount,
            loading,
            totalPremiumAfterLoadingAndDiscount: totalAfterAdjustment
        }))
    }, [])

    const updateTotalPremium = useCallback((rows: any[]) => {
        const total = calculateTotalPremium(rows)
        setPremiumState(prev => ({ ...prev, totalPremium: total }))
    }, [calculateTotalPremium])

    return {
        premiumState,
        updateDiscountAndLoading,
        updateTotalPremium,
        calculateTotalPremium
    }
}
