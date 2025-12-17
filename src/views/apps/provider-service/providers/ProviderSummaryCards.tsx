import React, { useEffect, useState } from 'react';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ScienceIcon from '@mui/icons-material/Science';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ProvidersService } from '@/services/remote-api/fettle-remote-api';
import { ProviderTypeService } from '@/services/remote-api/api/master-services/provider.type.service';
import SummaryCards from '../../shared-component/components/SummaryCards';

type Props = {
    onSelectType?: (typeCode?: string) => void;
    selectedTypeCode?: string;
    disabled?: boolean;
};

const providerservice = new ProvidersService();
const providerTypeService = new ProviderTypeService();

const ProviderSummaryCards = ({ onSelectType, selectedTypeCode, disabled = false }: Props) => {
    const [count, setCount] = useState({
        hospitals: 0,
        clinics: 0,
        pharmacy: 0,
        laboratory: 0,
        radiology: 0,
        doctors: 0,
        others: 0,
    });

    const [nameToCode, setNameToCode] = useState<Record<string, string>>({});

    useEffect(() => {
        const sub1 = providerservice.getProviderTypeCount().subscribe({
            next: (data: any[]) => {
                const counts: any = {};
                data.forEach(item => {
                    counts[item.providerTypeName?.toUpperCase()] = item.totalCount;
                });

                setCount({
                    hospitals: counts['HOSPITAL'] || 0,
                    clinics: counts['CLINIC'] || 0,
                    pharmacy: counts['PHARMACY'] || 0,
                    laboratory: counts['DIAGNOSTIC CENTER'] || 0,
                    radiology: counts['RADIOLOGY'] || 0,
                    doctors: counts['DOCTOR'] || 0,
                    others: counts['DISPENSARY'] || counts['OTHERS'] || 0,
                });
            },
            error: err => {
                console.error('Error fetching provider counts:', err);
            },
        });

        const sub2 = providerTypeService.getProviderType().subscribe((res: any) => {
            const mapping: Record<string, string> = {};
            (res?.content || []).forEach((t: any) => {
                if (t?.name && t?.code) mapping[t.name.toUpperCase()] = t.code;
            });
            setNameToCode(mapping);
        });

        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
        };
    }, []);

    const handleTypeClick = (key: string) => {
        if (!onSelectType || disabled) return;
        const code = nameToCode[key];
        if (selectedTypeCode === code) {
            onSelectType(undefined);
        } else {
            onSelectType(code || undefined);
        }
    };

    const isTypeActive = (key: string) => {
        const code = nameToCode[key];
        return selectedTypeCode !== undefined && code !== undefined && selectedTypeCode === code;
    };

    const items = [
        { color: '#d80f51', icon: <LocalHospitalIcon />, label: 'Hospitals', value: count.hospitals, onClick: () => handleTypeClick('HOSPITAL'), active: isTypeActive('HOSPITAL'), disabled },
        { color: '#28a745', icon: <MedicalServicesIcon />, label: 'Clinics', value: count.clinics, onClick: () => handleTypeClick('CLINIC'), active: isTypeActive('CLINIC'), disabled },
        { color: '#fc862b', icon: <LocalPharmacyIcon />, label: 'Pharmacy', value: count.pharmacy, onClick: () => handleTypeClick('PHARMACY'), active: isTypeActive('PHARMACY'), disabled },
        { color: '#18a2b8', icon: <ScienceIcon />, label: 'Laboratory', value: count.laboratory, onClick: () => handleTypeClick('DIAGNOSTIC CENTER'), active: isTypeActive('DIAGNOSTIC CENTER'), disabled },
        { color: '#dc3444', icon: <CancelOutlinedIcon />, label: 'Radiology', value: count.radiology, onClick: () => handleTypeClick('HEALTH CENTER'), active: isTypeActive('HEALTH CENTER'), disabled },
        { color: '#6f42c1', icon: <PersonIcon />, label: 'Doctors', value: count.doctors, onClick: () => handleTypeClick('DOCTOR'), active: isTypeActive('DOCTOR'), disabled },
        { color: '#20c997', icon: <CheckCircleIcon />, label: 'Others', value: count.others, onClick: () => handleTypeClick('DISPENSARY'), active: isTypeActive('DISPENSARY'), disabled },
    ];

    return <SummaryCards items={items} />;
};

export default ProviderSummaryCards;
