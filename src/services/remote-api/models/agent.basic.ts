export interface AgentBasicDetails {
    name: string;
    type?: string;
    parnerId: string;
    taxPinNumber: string;
    code?: string;
    parentAgentId?: string;
    natureOfAgent: string;
    orgTypeCd?: string;
    contactNos: [
      {
        id?: 0,
        contactNo: string,
        contactType: string
      }
    ];
    emails: [
      {
        id?: 0,
        emailId: string,
        contactType: string
      }
    ];
    identifications: [
      {
        id?: 0,
        identificationType: string,
        identificationNo: string,
        docFormat: string,
        document: string
      }
    ]
}