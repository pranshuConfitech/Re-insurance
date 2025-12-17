
export const clearSelectedRuleFromBenefitInNavPath = (navPath: any, startIndex: number) => {
    const tempNavPath = (startIndex && startIndex > 0 && startIndex < navPath.length) ? navPath.slice(startIndex) : navPath;

    tempNavPath.forEach(clearSelectedRuleFromBenefit);
}

export const clearSelectedRuleFromBenefit = (benefit: { ruleList: any[]; }) => {
    if (!benefit?.ruleList)
        return;

        benefit && benefit.ruleList.every(r => {
        if (r.isSelected) {
            r.isSelected = false;
            
return false;
        }

        
return true;
    });

}

export const getSelectedRuleId = (benefit: { ruleList: any[]; }) => {
    if (!benefit.ruleList)
        return null;

    return benefit.ruleList.filter(r => r.isSelected)[0]?.internalId;
}

export const hasAnyRuleInBenefitHierarchies = (benefitStructures: any[]) => {
    const fl = benefitStructures.filter(b => b?.ruleList && b?.ruleList.length > 0)

    
return fl.length > 0;
};




export const extractRulesFromBenefit = (benefit: any) => {
    const rules = benefit.ruleList || [];

    if (benefit.child) {
        const rules = benefit.ruleList || [];
        const childRules = benefit.child.map((c:any) => extractRulesFromBenefit(c)).flat(1);

        
return [...rules, ...childRules];
    }

    
return rules;

}

export const extractPremiumRulesFromBenefit = (benefit:any) => {
    const productRules = extractRulesFromBenefit(benefit);

    
return productRules.map((pr:any)=>({productRuleId:pr.id,premiumRules:pr.premiumRules}));
}

export const extractRulesFromBenefitStructures = (benefitStructures:any) => {

    return benefitStructures.map((bs:any) => bs)
        .map(extractRulesFromBenefit)
        .flat(1);

}

export const extractPremiumRulesFromBenefitStructures = (benefitStructures:any) => {

    return benefitStructures.map((bs:any) => bs.hirearchy)
        .map(extractPremiumRulesFromBenefit)
        .flat(1)
        .filter((pr:any)=> pr.premiumRules && pr.premiumRules.length > 0);

}

export const productRulesGroupByBenefitId = (rules=[]) => {
    return rules.reduce((group:any, rule:any) => {
        const { benefitId,benefitStructureId } = rule;
        const id=`${benefitStructureId}_${benefitId}`;
        
        group[id] = group[id] ?? [];
        group[id].push(rule);
        
return group;
    }, {});
}

const recursivlyCheckBenefitAndSetProductRules = (benefitStructureId: any,benefit: any, productRulesGroupByBenefitId: any) => {
    benefit.ruleList = productRulesGroupByBenefitId[`${benefitStructureId}_${benefit.id}`] || [];

    if (benefit.child) {
        benefit.child.forEach((cb:any) => recursivlyCheckBenefitAndSetProductRules(benefitStructureId,cb, productRulesGroupByBenefitId));
    }
}

export const setRulesInBenefitStructures = (benefitStructures:any, rules:any) => {
    const groupByRules = productRulesGroupByBenefitId(rules);

    benefitStructures.forEach((bs:any) => {
        const rootBenefit=bs.hirearchy;

        recursivlyCheckBenefitAndSetProductRules(bs.id,rootBenefit, groupByRules);
    });

}

export const setPremiumDetailsInProductRules=(product:any,premiums:any)=>{
    if(product.productRules && product.productRules.length > 0 && premiums && premiums.length > 0){
        product.productRules.forEach((pr:any)=>{
            const selectedPremiumRuleObj=premiums.filter((premium:any)=> premium.productRuleId ==pr.id)[0];

            pr.premiumRules= selectedPremiumRuleObj?.premiumRules || [];
        })
    }
}

export const isBenefitStructureContainsAnyPremiumRule =(benefitStructureHirearchy:any)=>{

    let flagArray:any=[];

    if(benefitStructureHirearchy.child){
        for(const c of benefitStructureHirearchy.child){
            const returnArray=isBenefitStructureContainsAnyPremiumRule(c);

            flagArray=[...flagArray,...returnArray];
        }
    }

    if(benefitStructureHirearchy.ruleList && benefitStructureHirearchy.ruleList.length > 0){
        const count=benefitStructureHirearchy.ruleList
        .filter((pr:any)=> pr.premiumRules && pr.premiumRules.length > 0).length;

        flagArray=[...[count>0],...flagArray];
    }

    
return flagArray;
}

export const hasAnyPremiumRuleInBenefitHierarchies =(benefitStructures:any)=>{
        for(const bs of benefitStructures){
            const responseArray=isBenefitStructureContainsAnyPremiumRule(bs.hirearchy);
            const containsAny=responseArray.filter((value:any)=> value).length > 0;

            if(containsAny){
                return true;
            }
        }

        
return false;
}

export const deleteRule=(benefit:any,rule:any)=>{
    const ruleList=benefit?.ruleList || [];

    ruleList.splice(ruleList.indexOf(rule),1);
    benefit.ruleList= ruleList;

    if(benefit.child && benefit.child.length > 0){
        benefit.child.forEach((cb:any)=>{
            if(cb.ruleList && cb.ruleList.length > 0){
                cb.ruleList.filter((r:any)=> r.parentInternalId === rule.internalId)
                .forEach((r:any)=> deleteRule(cb,r));
            }
        })
    }

}

