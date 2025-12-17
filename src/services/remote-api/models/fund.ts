export interface IFund {
        id: string,
        percentageOfFundExhausted: number,
        alertMessage: string,
        restrictClaim: boolean,
        groupClient: string[],
        alertModeEmail: boolean,
        alertModeSms: boolean,
        alertModeWhatsapp: boolean
      
}