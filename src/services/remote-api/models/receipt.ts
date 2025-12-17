export interface Receipt { 
    receiptType: "",
    receiptDate: 0,
    clientOrProspectId: "",
    clientOrProspectType: "",
    depositBank: "",
    depositAccountNo: "",
    premiumAmount: 0,
    fundAmount: 0,
    transactionDetails: [
      {
        transactionMode: "",
        transactionAmount: "",
        transactionCurrency: "",
        exchangeRate: "",
        exchangeAmount: ""
      }
    ]
 }