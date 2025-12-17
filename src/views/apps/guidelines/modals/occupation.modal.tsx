import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Grid,
    Box,
    InputAdornment
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
    formControl: {
        minWidth: '100%',
    },
}));

interface OccupationModalProps {
    open: boolean;
    onClose: () => void;
}

const OccupationModal: React.FC<OccupationModalProps> = ({ open, onClose }) => {
    const classes = useStyles();
    const [selectedOccupation, setSelectedOccupation] = useState('');
    const [selectedGuideline, setSelectedGuideline] = useState('');
    const [loadingValue, setLoadingValue] = useState('');

    // Hardcoded dropdown options based on the image
    const occupationOptions = [
        { value: 'ACCOUNTANT, CLERK (ALL DESK JOBS) [ACC]', label: 'ACCOUNTANT, CLERK (ALL DESK JOBS) [ACC]' },
        { value: 'ADMIN EMPLOYEE [AEM]', label: 'ADMIN EMPLOYEE [AEM]' },
        { value: 'AGRICULTURAL LABOURER [AGL]', label: 'AGRICULTURAL LABOURER [AGL]' },
        { value: 'AGRICULTURAL WORKER [AGW]', label: 'AGRICULTURAL WORKER [AGW]' },
        { value: 'AGRICULTURE LAND LORD [ALL]', label: 'AGRICULTURE LAND LORD [ALL]' },
        { value: 'AGRICULTURIST [AGS]', label: 'AGRICULTURIST [AGS]' },
        { value: 'AGRONOMIST [AGN]', label: 'AGRONOMIST [AGN]' },
        { value: 'AIR FORCE [ARF]', label: 'AIR FORCE [ARF]' },
        { value: 'ANY OTHER LABOURER [AOL]', label: 'ANY OTHER LABOURER [AOL]' },
        { value: 'ARMED FORCES INCLUDING NAVY [AFN]', label: 'ARMED FORCES INCLUDING NAVY [AFN]' },
        { value: 'BEAUTY PARLOUR OWNER / WORKER, TUTIONS, TRADER [BTT]', label: 'BEAUTY PARLOUR OWNER / WORKER, TUTIONS, TRADER [BTT]' },
        { value: 'BOAT BUILDER AND REPAIRER [BBR]', label: 'BOAT BUILDER AND REPAIRER [BBR]' },
        { value: 'BOILER WORKER [BOW]', label: 'BOILER WORKER [BOW]' },
        { value: 'BOILERMAN [BOM]', label: 'BOILERMAN [BOM]' },
        { value: 'BUILDING CLEANER [BCL]', label: 'BUILDING CLEANER [BCL]' },
        { value: 'BUILDING MAINTENANCE WORKER [BMW]', label: 'BUILDING MAINTENANCE WORKER [BMW]' },
        // Add other options if visible in the image or known
        { value: 'CARPENTER [CAR]', label: 'CARPENTER [CAR]' },
        { value: 'CATERING LABOURER [CAL]', label: 'CATERING LABOURER [CAL]' },
        { value: 'CHEMIST [CHM]', label: 'CHEMIST [CHM]' },
        { value: 'CIVIL ENGINEER [CEN]', label: 'CIVIL ENGINEER [CEN]' },
        { value: 'CLEANER OTHER THAN HOTELS [CLO]', label: 'CLEANER OTHER THAN HOTELS [CLO]' },
        { value: 'COAL MINE WORKER [CMW]', label: 'COAL MINE WORKER [CMW]' },
        { value: 'COMMISSION AGENT [CAG]', label: 'COMMISSION AGENT [CAG]' },
        { value: 'COMMISSION AGENTS, SALESMAN, ADVISOR, MARKETER [CSA]', label: 'COMMISSION AGENTS, SALESMAN, ADVISOR, MARKETER [CSA]' },
        { value: 'COMMISSION AGENTS, SALESMAN, ADVISOR, MARKETER [CSS]', label: 'COMMISSION AGENTS, SALESMAN, ADVISOR, MARKETER [CSS]' },
        { value: 'CONSTRUCTION / BUILDING WORKER,CONSTRUCTION LOADER [CBC]', label: 'CONSTRUCTION / BUILDING WORKER,CONSTRUCTION LOADER [CBC]' },
        { value: 'CONSTRUCTION [CON]', label: 'CONSTRUCTION [CON]' },
        { value: 'DAILY WORKER [DAW]', label: 'DAILY WORKER [DAW]' },
        { value: 'DELIVERY AGENT / COURIER [DAC]', label: 'DELIVERY AGENT / COURIER [DAC]' },
        { value: 'DIAMOND POLISHER & CUTTER [DPC]', label: 'DIAMOND POLISHER & CUTTER [DPC]' },
        { value: 'DIAMOND SORTER, DIAMOND CUTTER [DSC]', label: 'DIAMOND SORTER, DIAMOND CUTTER [DSC]' },
        { value: 'DOCK WORKER, PORT TRUST [DPT]', label: 'DOCK WORKER, PORT TRUST [DPT]' },
        { value: 'DOMESTIC SERVANT [DOS]', label: 'DOMESTIC SERVANT [DOS]' },
        { value: 'DRIVER - AMBULANCE [AMB]', label: 'DRIVER - AMBULANCE [AMB]' },
        { value: 'DRIVER - ARMOURED CAR [ARC]', label: 'DRIVER - ARMOURED CAR [ARC]' },
        { value: 'DRIVER - BUS,TRUCK [BUS]', label: 'DRIVER - BUS,TRUCK [BUS]' },
        { value: 'DRIVER - CRANE [CNE]', label: 'DRIVER - CRANE [CNE]' },
        { value: 'DRIVER - EARTH MOVING VEHICLE [EMV]', label: 'DRIVER - EARTH MOVING VEHICLE [EMV]' },
        { value: 'DRIVER - FORKLIFT [FKT]', label: 'DRIVER - FORKLIFT [FKT]' },
        { value: 'DRIVER - HEAVY MOTOR VEHICLE [HMV]', label: 'DRIVER - HEAVY MOTOR VEHICLE [HMV]' },
        { value: 'DRIVER - LIGHT MOTOR VEHICLE [LMV]', label: 'DRIVER - LIGHT MOTOR VEHICLE [LMV]' },
        { value: 'DRIVER - TAXI,RICKSHAW OR MINIBUS [TXI]', label: 'DRIVER - TAXI,RICKSHAW OR MINIBUS [TXI]' },
        { value: 'DRY CLEANER [DRC]', label: 'DRY CLEANER [DRC]' },
        { value: 'ELECTRICIAN [ELC]', label: 'ELECTRICIAN [ELC]' },
        { value: 'ELECTRICITY LINE WORKER [ELW]', label: 'ELECTRICITY LINE WORKER [ELW]' },
        { value: 'FACTORY WORKER [FAW]', label: 'FACTORY WORKER [FAW]' },
        { value: 'EXECUTIVE, SALESMAN [EXS]', label: 'EXECUTIVE, SALESMAN [EXS]' },
        { value: 'EXPLOSIVES HANDLER [EXH]', label: 'EXPLOSIVES HANDLER [EXH]' },
        { value: 'FACTORY OWNER, MONEY LENDER [FOM]', label: 'FACTORY OWNER, MONEY LENDER [FOM]' },
        { value: 'FARMER [FMR]', label: 'FARMER [FMR]' },
        { value: 'FIRE FIGHTER [FIF]', label: 'FIRE FIGHTER [FIF]' },
        { value: 'FOREIGN CORRESPONDENT - WAR RISK,FOREIGN [FOC]', label: 'FOREIGN CORRESPONDENT - WAR RISK,FOREIGN [FOC]' },
        { value: 'FRUIT SELLER [FRS]', label: 'FRUIT SELLER [FRS]' },
        { value: 'FURNACEMAN [FUN]', label: 'FURNACEMAN [FUN]' },
        { value: 'HOUSEWIFE, HOUSE WIFE WITH RENTAL INCOME [HWI]', label: 'HOUSEWIFE, HOUSE WIFE WITH RENTAL INCOME [HWI]' },
        { value: 'HOUSEMAID [HOM]', label: 'HOUSEMAID [HOM]' },
        { value: 'LATHE MACHINE OPERATOR [LMO]', label: 'LATHE MACHINE OPERATOR [LMO]' },
        { value: 'LIFT OPERATOR IN APARTMENTS,MANAGER [LTA]', label: 'LIFT OPERATOR IN APARTMENTS,MANAGER [LTA]' },
        { value: 'LIFT OPERATOR IN CONSTRUCTION INDUSTRY [LOC]', label: 'LIFT OPERATOR IN CONSTRUCTION INDUSTRY [LOC]' },
        { value: 'MASON [MSN]', label: 'MASON [MSN]' },
        { value: 'MAINTENANCE WORKER [MAW]', label: 'MAINTENANCE WORKER [MAW]' },
        { value: 'MARINE NAVAL OFFICERS [MNO]', label: 'MARINE NAVAL OFFICERS [MNO]' },
        { value: 'MERCHANT SEAMAN - CREW / DECKHAND [MSD]', label: 'MERCHANT SEAMAN - CREW / DECKHAND [MSD]' },
        { value: 'MINING AND QUARRYING [MIQ]', label: 'MINING AND QUARRYING [MIQ]' },
        { value: 'MOBILE SHOP OWNER, KIOSKS STORES [MSO]', label: 'MOBILE SHOP OWNER, KIOSKS STORES [MSO]' },
        { value: 'PAINTER [PNT]', label: 'PAINTER [PNT]' },
        { value: 'PHARMACIST [PHM]', label: 'PHARMACIST [PHM]' },
        { value: 'POLICE CONSTABLE / OFFICER [PCO]', label: 'POLICE CONSTABLE / OFFICER [PCO]' },
        { value: 'POLICE FORCE, POLICE OTHER RANKS [PFO]', label: 'POLICE FORCE, POLICE OTHER RANKS [PFO]' },
        { value: 'PROFESSIONALS LIKE DOCTOR, CHARTERED ACCOUNTANT [DCA]', label: 'PROFESSIONALS LIKE DOCTOR, CHARTERED ACCOUNTANT [DCA]' },
        { value: 'QUARRY WORKER,QUARRYMAN, BLASTING [QWB]', label: 'QUARRY WORKER,QUARRYMAN, BLASTING [QWB]' },
        { value: 'QUARRY WORKER,QUARRYMAN, NO BLASTING [QWN]', label: 'QUARRY WORKER,QUARRYMAN, NO BLASTING [QWN]' },
        { value: 'REAL ESTATE AGENTS [REA]', label: 'REAL ESTATE AGENTS [REA]' },
        { value: 'RETAIL / WHOLE SALE SHOP OWNER, DIAMOND TRADER [RWD]', label: 'RETAIL / WHOLE SALE SHOP OWNER, DIAMOND TRADER [RWD]' },
        { value: 'RETIREE - EMPLOYEE, CATERING BUSINESS [RCB]', label: 'RETIREE - EMPLOYEE, CATERING BUSINESS [RCB]' },
        { value: 'SECURITY GUARD - ARMED [SGA]', label: 'SECURITY GUARD - ARMED [SGA]' },
        { value: 'SECURITY GUARD - UNARMED [SGU]', label: 'SECURITY GUARD - UNARMED [SGU]' },
        { value: 'SELF EMPLOYED [SLE]', label: 'SELF EMPLOYED [SLE]' },
        { value: 'SOFTWARE ENGINEER, HARDWARE ENGINEER [SHE]', label: 'SOFTWARE ENGINEER, HARDWARE ENGINEER [SHE]' },
        { value: 'STUDENT [STU]', label: 'STUDENT [STU]' },
        { value: 'TAILOR, RETAILER, PROPRIETOR [TRP]', label: 'TAILOR, RETAILER, PROPRIETOR [TRP]' },
        { value: 'TAXI DRIVER, AUTO-RICKSHAW OR MINIBUS [TXI]', label: 'TAXI DRIVER, AUTO-RICKSHAW OR MINIBUS [TXI]' },
        { value: 'TEXTILE FACTORY WORKER [TFW]', label: 'TEXTILE FACTORY WORKER [TFW]' },
        { value: 'TOURIST AGRICULTURE [TOA]', label: 'TOURIST AGRICULTURE [TOA]' },
        { value: 'TRAVEL AGENT, BROKERS, ESTATE AGENT [TBE]', label: 'TRAVEL AGENT, BROKERS, ESTATE AGENT [TBE]' },
        { value: 'WINDOW CLEANER [WCL]', label: 'WINDOW CLEANER [WCL]' },
        { value: 'WORKER-AMMUNITION FACTORY [WAF]', label: 'WORKER-AMMUNITION FACTORY [WAF]' },
        { value: 'WORKER-FIREWORKS FACTORY [WFF]', label: 'WORKER-FIREWORKS FACTORY [WFF]' },
    ];

    const guidelineOptions = [
        { value: '', label: '-- SELECT ONE --' },
        { value: 'PREMIUM LOADING', label: 'PREMIUM LOADING' },
        { value: 'STANDARD', label: 'STANDARD' }
    ];

    const handleSave = () => {
        // Here you would typically process the selected values, e.g., send to an API
        console.log('Saving Occupation Guideline:', {
            occupation: selectedOccupation,
            guideline: selectedGuideline,
            loading: loadingValue
        });
        onClose(); // Close the modal after saving
    };

    const handleClose = () => {
        // Reset state when closing if needed
        setSelectedOccupation('');
        setSelectedGuideline('');
        setLoadingValue('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add Underwriting Guideline For Occupation</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                            <InputLabel id="occupation-label">Occupation</InputLabel>
                            <Select
                                labelId="occupation-label"
                                value={selectedOccupation}
                                onChange={(e) => setSelectedOccupation(e.target.value)}
                                label="Occupation"
                            >
                                <MenuItem value="">-- SELECT ONE --</MenuItem>
                                {occupationOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined" className={classes.formControl}>
                            <InputLabel id="guideline-label">Guideline</InputLabel>
                            <Select
                                labelId="guideline-label"
                                value={selectedGuideline}
                                onChange={(e) => setSelectedGuideline(e.target.value)}
                                label="Guideline"
                            >
                                {guidelineOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Loading"
                            variant="outlined"
                            value={loadingValue}
                            onChange={(e) => setLoadingValue(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">PER THOUSAND</InputAdornment>,
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
                <Button onClick={handleSave} color="primary" disabled={!selectedOccupation || !selectedGuideline || !loadingValue}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OccupationModal; 
