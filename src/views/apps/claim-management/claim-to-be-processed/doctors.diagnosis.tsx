import { FormControl } from '@mui/material'

import { makeStyles } from '@mui/styles'

import { ProductService } from '@/services/remote-api/api/product-services/product.service'
import { defaultPageRequest } from '@/services/remote-api/models/page.request'

const productservice = new ProductService()

const useStyles = makeStyles(theme => ({
  formControl: {
    minWidth: 282
  }
}))

const productDataSourceCallback$ = (params = {}, action: any, pageRequest = defaultPageRequest) => {
  let reqParam: any = { ...pageRequest, ...params }

  if (action.searchText && action.searchText.length > 2) {
    reqParam = {
      ...reqParam,
      name: action.searchText
    }
    delete reqParam.active
  }

  return productservice.getProducts(reqParam)
}

const DoctorsDiagnosis = () => {
  const classes = useStyles()

  return (
    <FormControl className={classes.formControl}>
      {/* <FettleAutocomplete id="prvosional_diagnosis" name="prvosional_diagnosis" label="Prvosional Diagnosis" displayKey="productBasicDetails.name"
                $datasource={productDataSourceCallback$} value={formik.values.productData}
                changeDetect={true} onChange={handlePChange}
                error={formik.touched.productId && Boolean(formik.errors.productId)}
                helperText={formik.touched.productId && formik.errors.productId} required /> */}
    </FormControl>
  )
}

export default DoctorsDiagnosis
