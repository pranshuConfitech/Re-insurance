import React, { useState, useEffect, forwardRef } from 'react';
import { makeStyles } from '@mui/styles';
import { Grid, Paper, Typography, Box, TextField, InputAdornment } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { ReportService } from '@/services/remote-api/api/report-services';
import AppReactDatepicker from '@/libs/styles/AppReactDatepicker';
import { width } from '@mui/system';

const useStyles = makeStyles((theme: any) => ({
    statsCard: {
        padding: theme?.spacing ? theme.spacing(3) : '24px',
        borderRadius: 12,
        height: '100%',
        width: '100%',
        maxWidth: 300,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-4px)',
        },
    },
    iconBox: {
        width: 45,
        height: 45,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme?.spacing ? theme.spacing(1) : '8px',
    },
    icon: {
        color: '#fff',
        fontSize: 24,
    },
    value: {
        fontSize: '1.5rem',
        fontWeight: 600,
        marginBottom: theme?.spacing ? theme.spacing(1) : '8px',
    },
    label: {
        color: theme?.palette?.text?.secondary,
        fontSize: '0.875rem',
    },
    datePickersRow: {
        display: 'flex',
        gap: theme?.spacing ? theme.spacing(2) : '16px',
        marginBottom: theme?.spacing ? theme.spacing(3) : '24px',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
    },
    datePickerBox: {
        background: theme?.palette?.background?.paper,
        borderRadius: theme?.shape?.borderRadius || 8,
        boxShadow: theme?.shadows ? theme.shadows[1] : '0 1px 4px rgba(0,0,0,0.08)',
        padding: theme?.spacing ? theme.spacing(1.5, 2) : '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 180,
    },
    inputLabel: {
        marginBottom: theme?.spacing ? theme.spacing(0.5) : '4px',
        fontWeight: 500,
        color: theme?.palette?.text?.primary,
        fontSize: '0.95rem',
    },
}));

const reportService = new ReportService();

const MUITextFieldInput = forwardRef(({ value, onClick, label, error }: any, ref) => (
    <TextField
        fullWidth
        label={label}
        value={value}
        onClick={onClick}
        inputRef={ref}
        error={!!error}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <CalendarTodayIcon fontSize="small" />
                </InputAdornment>
            ),
            readOnly: true,
        }}
        variant="outlined"
        size="small"
    />
));

const ClientStats = () => {
    const classes = useStyles();
    const [data, setData] = useState<any>();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    useEffect(() => {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        reportService
            .clientOverviewReport({
                reportType: "CLIENT_OVERVIEW",
                startDate: start.getTime(),
                endDate: end.getTime()
            })
            .subscribe((result: any) => {
                setData(result.CLIENT_OVERVIEW?.records[0]?.record);
            });
    }, [startDate, endDate]);

    return (
        <Grid container spacing={0}>
            <Grid item xs={12} className={classes.datePickersRow}>
                <Box className={classes.datePickerBox}>
                    <AppReactDatepicker
                        selected={startDate}
                        onChange={(date: Date | null) => date && setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        maxDate={endDate}
                        showPopperArrow={false}
                        customInput={<MUITextFieldInput label="Start Date" />}
                    />
                </Box>
                <Box className={classes.datePickerBox}>
                    <AppReactDatepicker
                        selected={endDate}
                        onChange={(date: Date | null) => date && setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        minDate={startDate}
                        showPopperArrow={false}
                        customInput={<MUITextFieldInput label="End Date" />}
                    />
                </Box>
            </Grid>
            <Grid item>
                <Paper className={classes.statsCard} style={{ width: "200px" }}>
                    <Box className={classes.iconBox} style={{ backgroundColor: "#4CAF50" }}>
                        <PeopleIcon className={classes.icon} />
                    </Box>
                    <Typography variant="h5" className={classes.value}>
                        {data?.client_count || '0'}
                    </Typography>
                    <Typography className={classes.label}>Total Clients</Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default ClientStats; 
