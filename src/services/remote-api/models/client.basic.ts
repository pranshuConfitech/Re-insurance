export interface clientBasicDetails {
  gstNo: string;
  combinationPartnerId: string;
  clientTypeName: string;
  prefixCd: string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffixCd: string;
  displayName: string;
  groupTypeCd: string;
  clientTypeCd: string;
  orgTypeCd: string;
  parentclientId: string;
  code: string;
  partnerNumber: string;
  panNumber: string;
  incorporationNumber: string;
  dataOfIncorporation: number;
  countryOfIncorporation: string;
  policeStation: string;
  logoFormat: string;
  websiteUrl: string;
  prospectId: string;
  logo: string;
  contactNos: [
    {
      id?: number;
      contactNo: string;
      contactType: string;
    }
  ];
  emails: [
    {
      id?: number;
      emailId: string;
      contactType: string;
    }
  ];
  identifications: [
    {
      id?: number;
      identificationType: string;
      identificationNo: string;
      docFormat: string;
      document: string;
    }
  ];
}
