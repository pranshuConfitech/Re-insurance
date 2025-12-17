import React, { useEffect } from "react";

import { Button } from "primereact/button";
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { FettleRulePreviewGraph } from "@/views/apps/shared-component/components/fettle.rule.preview.graph";


const RuleDesignPreviewModal = ({ openDialog, handleClose}:{openDialog:any, handleClose:any}) => {

    const [previewBenefitStructure,setPreviewBenefitStructure]= React.useState([]);

    useEffect(()=>{
       
    },[])

    return (<Dialog
        fullWidth
        maxWidth='lg'
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title"></DialogTitle>
        <DialogContent>
            <div id="alert-dialog-description">
                {/* {JSON.stringify(props.benefitStructures[value])} */}
                <FettleRulePreviewGraph benefitStructures={previewBenefitStructure} />
            </div>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus className='p-button-text'>
                Exit
            </Button>
        </DialogActions>
    </Dialog>)
}


export default RuleDesignPreviewModal;
