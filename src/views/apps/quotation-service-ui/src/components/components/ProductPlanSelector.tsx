import React from 'react'
import { FormControl, Grid, Button } from '@mui/material'
import { FettleAutocomplete } from '@/views/apps/shared-component'

interface ProductPlanSelectorProps {
    selectedProductId: string
    selectedPlan: string
    productDetails: any
    planDetails: any
    onProductChange: (name: string, e: any, value: any) => void
    onPlanChange: (name: string, e: any, value: any) => void
    onCreatePlan: () => void
    productDataSource: any
    planDataSource: any
    classes: any
}

export const ProductPlanSelector: React.FC<ProductPlanSelectorProps> = ({
    selectedProductId,
    selectedPlan,
    productDetails,
    planDetails,
    onProductChange,
    onPlanChange,
    onCreatePlan,
    productDataSource,
    planDataSource,
    classes
}) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} sm={6} md={3}>
                <FormControl className={classes.formControl}>
                    <FettleAutocomplete
                        id='product'
                        name='product'
                        label='Product'
                        displayKey='productBasicDetails.name'
                        $datasource={productDataSource}
                        changeDetect={true}
                        txtValue={productDetails?.productBasicDetails?.name}
                        value={selectedProductId}
                        onChange={(e: any, newValue: any) => onProductChange('selectedProductId', e, newValue)}
                    />
                </FormControl>
            </Grid>

            {selectedProductId && (
                <>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.formControl}>
                            <FettleAutocomplete
                                id='plan'
                                name='plan'
                                label='Plan'
                                $datasource={planDataSource}
                                changeDetect={true}
                                txtValue={planDetails?.name}
                                value={selectedPlan}
                                onChange={(e: any, newValue: any) => onPlanChange('selectedPlan', e, newValue)}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Button color='secondary' onClick={onCreatePlan}>
                            Create Plan
                        </Button>
                    </Grid>
                </>
            )}
        </Grid>
    )
}
