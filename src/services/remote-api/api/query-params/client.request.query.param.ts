import type { PageRequest } from "../../models/page.request";

export interface ProspectRequestQueryParam extends PageRequest {
  parentClientOnly?: boolean;
}

export interface AgentRequestQueryParam extends PageRequest {
  parentAgentOnly?: boolean;
}

export interface ProviderRequestQueryParam extends PageRequest {
  parentProviderOnly?: boolean;
}

export interface BankRequestQueryParam extends PageRequest {
  parentBankOnly?: boolean;
}

export interface TaxRequestQueryParam extends PageRequest {
  parentTaxOnly?: boolean;
}


export const defaultPageRequest3: ProspectRequestQueryParam = {
    page: 0,
    size: 100,
    summary: true,
    active:false,
    parentClientOnly:true
  };


export const defaultPageRequest4:AgentRequestQueryParam ={
  page: 0,
  size: 100,
  summary: true,
  active:false,
  parentAgentOnly:true
}

export const defaultPageRequest5:ProviderRequestQueryParam ={
  page: 0,
  size: 100,
  summary: true,
  active:false,
  parentProviderOnly:true
}

export const defaultPageRequest6:BankRequestQueryParam ={
  page: 0,
  size: 100,
  summary: true,
  active:false,
  parentBankOnly:true
}

export const defaultPageRequest7:TaxRequestQueryParam ={
  page: 0,
  size: 100,
  summary: true,
  active:false,
  parentTaxOnly:true
}