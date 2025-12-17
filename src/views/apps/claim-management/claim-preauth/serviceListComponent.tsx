import React, { useEffect } from 'react'

import { FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Autocomplete } from '@mui/lab'
import { Button } from 'primereact/button'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'

import { BenefitService } from '@/services/remote-api/fettle-remote-api'

const benefitService = new BenefitService()

const ServiceDetails = ({
  x,
  i,
  handleProviderChangeInService,
  providerList,
  handleBenefitChangeInService,
  autocompleteFilterChange,
  benefitOptions,
  handleChangeDiagnosis,
  handleChangeCodeStandard,
  handleChangeIntervention,
  handleEstimateCostInService,
  handleRemoveServicedetails,
  handleAddServicedetails,
  serviceDetailsList,
  classes,
  interventions,
  serviceList
}: {
  x: any
  i: any
  handleProviderChangeInService: any
  providerList: any
  handleBenefitChangeInService: any
  autocompleteFilterChange: any
  benefitOptions: any
  handleChangeDiagnosis: any
  handleChangeCodeStandard: any
  handleChangeIntervention: any
  handleEstimateCostInService: any
  handleRemoveServicedetails: any
  handleAddServicedetails: any
  serviceDetailsList: any
  classes: any
  interventions: any
  serviceList: any
}) => {
  const [benefitId, setBenefitId] = React.useState()

  useEffect(() => {
    if (x.benefitId) {
      setBenefitId(x.benefitId)
    }
  }, [x.benefitId])
  console.log('serviceList', serviceList)
  return (
    <Grid
      container
      spacing={2}
      key={i}
      sx={{
        mb: 2,
        p: 2,
        // borderRadius: 2,
        background: "#f7f9fc",
        // boxShadow: 1,
        alignItems: "center"
      }}
    >
      {/* Provider Autocomplete */}
      <Grid item xs={12} sm={6} md={2.4}>
        <FormControl className={classes.formControl} fullWidth>
          <Autocomplete
            id="provider-autocomplete"
            options={providerList}
            getOptionLabel={(option: any) => option?.providerBasicDetails?.name || ''}
            isOptionEqualToValue={(option: any, value: any) => option?.id === value?.id}
            value={providerList.find((p: any) => p.id === x.providerId) || null}
            onChange={(_, newValue) => {
              handleProviderChangeInService(
                { target: { name: 'providerId', value: newValue ? newValue.id : '' } },
                i
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Provider"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            )}
          />
        </FormControl>
      </Grid>

      {/* Benefit Autocomplete */}
      <Grid item xs={12} sm={6} md={2.4}>
        <FormControl className={classes.formControl} fullWidth>
          <Autocomplete
            value={
              x.benefitId
                ? benefitOptions.find((item: any) => item.benefitStructureId === x.benefitId) || null
                : null
            }
            onChange={(e, val) => {
              handleBenefitChangeInService(val, i);
              setBenefitId(val?.benefitStructureId || null);
            }}
            id="benefit-autocomplete"
            options={benefitOptions}
            getOptionLabel={(option) => option?.label || ""}
            isOptionEqualToValue={(option, value) => option?.benefitStructureId === value?.benefitStructureId}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Benefit Provider"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            )}
          />
        </FormControl>
      </Grid>

      {/* Code Standard */}
      <Grid item xs={12} sm={6} md={1.4}>
        <FormControl fullWidth>
          <InputLabel id="code-standard-label" shrink>
            Standard
          </InputLabel>
          <Select
            labelId="code-standard-label"
            label="Code Standard"
            name="codeStandard"
            value={x.codeStandard}
            variant="outlined"
            sx={{ background: "#fff", borderRadius: 2 }}
            fullWidth
          >
            <MenuItem value="ICD">ICD</MenuItem>
            <MenuItem value="SHA">SHA</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {/* Diagnosis Autocomplete */}
      <Grid item xs={12} sm={6} md={2.6}>
        <FormControl className={classes.formControl} fullWidth>
          <Autocomplete
            id="diagnosis-autocomplete"
            options={Array.isArray(serviceList) ? serviceList : []}
            value={
              x.diagnosis
                ? serviceList.find((item: any) => item.value === x.diagnosis) || null
                : null
            }
            onChange={(e, newValue) => {
              handleChangeDiagnosis(newValue, i);
            }}
            getOptionLabel={(option: any) => option?.label || ''}
            isOptionEqualToValue={(option: any, value: any) => option?.value === value?.value}
            renderInput={(params) => (
              <TextField
                {...params}
                label={i === 0 ? 'Primary Diagnosis' : 'Diagnosis'}
                placeholder="Select Diagnosis"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                sx={{ background: "#fff", borderRadius: 2 }}
              />
            )}
          />
        </FormControl>
      </Grid>

      {/* Estimated Cost */}
      <Grid item xs={12} sm={6} md={1.6}>
        <TextField
          id="estimated-cost"
          type="number"
          name="estimatedCost"
          value={x?.estimatedCost}
          onChange={(e) => handleEstimateCostInService(e, i)}
          label="Estimated Cost"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ background: "#fff", borderRadius: 2 }}
          fullWidth
        />
      </Grid>

      {/* Add/Remove Buttons */}
      <Grid item xs={12} sm={6} md={1.6} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {serviceDetailsList.length !== 1 && (
          <Button
            className={`mr10 p-button-danger ${classes.buttonSecondary}`}
            onClick={() => handleRemoveServicedetails(i)}
            color="secondary"
            type='button'
            style={{ minWidth: 40, minHeight: 40, borderRadius: 2 }}
          >
            <DeleteIcon />
          </Button>
        )}
        {serviceDetailsList.length - 1 === i && (
          <Button
            color="primary"
            className={classes.buttonPrimary}
            type='button'
            style={{ minWidth: 40, minHeight: 40, borderRadius: 2 }}
            onClick={handleAddServicedetails}
          >
            <AddIcon />
          </Button>
        )}
      </Grid>
    </Grid>
  )
}

export default ServiceDetails
