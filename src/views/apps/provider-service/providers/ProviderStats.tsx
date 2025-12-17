import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import { Grid, Paper, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { ProvidersService } from '@/services/remote-api/api/provider-services';

const useStyles = makeStyles((theme: any) => ({
    statsCard: {
        padding: theme?.spacing ? theme.spacing(3) : '24px',
        borderRadius: 12,
        height: '100%',
        width: '100%',
        maxWidth: 200,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
            transform: 'translateY(-4px)',
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
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
        textAlign: 'left',
        width: '100%',
    },
    label: {
        color: theme?.palette?.text?.secondary,
        fontSize: '0.875rem',
        textAlign: 'left',
        wordBreak: 'break-word',
        width: '100%',
    },
}));

const providersService = new ProvidersService();

const ProviderStats = () => {
    const classes = useStyles();
    const [providerTypeCounts, setProviderTypeCounts] = useState<any[]>([]);

    useEffect(() => {
        providersService.getProviderTypeCount().subscribe((result: any) => {
            setProviderTypeCounts(Array.isArray(result) ? result : []);
        });
    }, []);

    return (
        <Grid container spacing={2}>
            {providerTypeCounts.map((type: any) => (
                <Grid item key={type.providerTypeName} xs={12} sm={6} md={4} lg={3} xl={2}>
                    <Paper className={classes.statsCard}>
                        <Box className={classes.iconBox} style={{ backgroundColor: "#4CAF50" }}>
                            <PeopleIcon className={classes.icon} />
                        </Box>
                        <Typography variant="h5" className={classes.value}>
                            {type.totalCount}
                        </Typography>
                        <Typography className={classes.label}>{type.providerTypeName}</Typography>
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );
};

export default ProviderStats; 
