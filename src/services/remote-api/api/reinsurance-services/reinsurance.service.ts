import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { http } from '../../http.client'; // Import the shared http client
import type { Page } from '../../models/page';
import type { PageRequest } from '../../models/page.request'; // Assuming PageRequest is needed

// Define the type for broker data if you have a specific model, otherwise use any
interface Broker {
    id: number;
    slNo: number;
    brokerName: string;
    brokerCode: string;
    contactPerson: string;
    phoneNo: string;
    email: string;
    // Add other broker properties here
}

// Define the type for reinsurer data if you have a specific model, otherwise use any
interface Reinsurer {
    id: number;
    slNo: number;
    reinsurerName: string;
    reinsurerCode: string;
    contactPerson: string;
    phoneNo: string;
    email: string;
    // Add other reinsurer properties here
}

export class ReinsuranceService {
    readonly BROKER_QUERY_CONTEXT = `/reinsurance-query-service/v1/reinsurance-broker`; // Updated context name
    readonly REINSURER_QUERY_CONTEXT = `/reinsurance-query-service/v1/reinsurance`; // New context for reinsurers
    readonly COMMAND_CONTEXT = `/reinsurance-command-service/v1`; // New context for reinsurers
    readonly QUERY_CONTEXT = `reinsurance-query-service/v1`; // New context for reinsurers

    getBrokers(params?: any): Observable<Page<Broker>> {
        // Use the http client to make the GET request
        // The http client should handle adding the Authorization header if its interceptor is active
        const page = params?.page || 0;
        const size = params?.size || 10; // Default size if not provided
        const summary = params?.summary || true; // Default summary
        const active = params?.active || true; // Default active
        const searchKey = params?.searchKey || ''; // Get search key
        let apiUrl = `${this.BROKER_QUERY_CONTEXT}?page=${page}&size=${size}&summary=${summary}&active=${active}`;

        if (searchKey) {
            apiUrl += `&searchKey=${encodeURIComponent(searchKey)}`;
        }
        return http
            .get<Page<Broker>>(apiUrl)
            .pipe(map(response => response.data)); // Extract the data from the AxiosResponse
    }

    getReinsurers(params?: any): Observable<Page<Reinsurer>> {
        // Manually construct the URL with query parameters
        const page = params?.page || 0;
        const size = params?.size || 10; // Default size if not provided
        const summary = params?.summary || true; // Default summary
        const active = params?.active || true; // Default active
        const searchKey = params?.searchKey || ''; // Get search key

        let apiUrl = `${this.REINSURER_QUERY_CONTEXT}?page=${page}&size=${size}&summary=${summary}&active=${active}`;

        if (searchKey) {
            apiUrl += `&searchKey=${encodeURIComponent(searchKey)}`;
        }

        // Use the http client to make the GET request for reinsurers with the constructed URL
        // The http client should handle adding the Authorization header if its interceptor is active
        return http
            .get<Page<Reinsurer>>(apiUrl)
            .pipe(map(response => response.data)); // Extract the data from the AxiosResponse
    }

    // /reinsurance-command-service/v1/treaty
    saveTreaty(payload: any): Observable<Map<string, any>> {
        return http
            .post<Map<string, any>>(`${this.COMMAND_CONTEXT}/treaty`, payload)
            .pipe(map((response) => response.data));
    }
    updateTreaty(id: any, payload: any): Observable<Map<string, any>> {
        return http
            .patch<Map<string, any>>(`${this.COMMAND_CONTEXT}/treaty/${id}`, payload)
            .pipe(map((response) => response.data));
    }
    // /reinsurance-query-service/v1/treaty?page=0&size=10&summary=true&active=true
    getAllTreaty(
        pageRequest: any
    ): Observable<any> {
        // ): Observable<Page<PreAuth>> {
        return http
            .get<Page<any>>(`${this.QUERY_CONTEXT}/treaty`, { params: pageRequest })
            .pipe(map((response) => response));
    }
    getTreatyById(
        id: any
    ): Observable<any> {
        // ): Observable<Page<PreAuth>> {
        return http
            .get<Page<any>>(`${this.QUERY_CONTEXT}/treaty/${id}`)
            .pipe(map((response) => response));
    }

    // Get treaty configurations
    getAllTreatyConfigurations(
        pageRequest: any
    ): Observable<any> {
        return http
            .get<Page<any>>(`${this.QUERY_CONTEXT}/treaty-configuration`, { params: pageRequest })
            .pipe(map((response) => response));
    }

    getTreatyConfigurationById(
        id: any
    ): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/treaty-configuration/${id}`)
            .pipe(map((response) => response));
    }

    // Save treaty configuration
    saveTreatyConfiguration(payload: any): Observable<any> {
        return http
            .post<any>(`${this.COMMAND_CONTEXT}/treaty-configuration`, payload)
            .pipe(map((response) => response.data));
    }

    // Surplus Participant APIs
    getAllSurplusParticipants(pageRequest: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/surplus-participant`, { params: pageRequest })
            .pipe(map((response) => response));
    }

    getSurplusParticipantById(id: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/surplus-participant/${id}`)
            .pipe(map((response) => response));
    }

    saveSurplusParticipant(payload: any): Observable<any> {
        return http
            .post<any>(`${this.COMMAND_CONTEXT}/surplus-participant`, payload)
            .pipe(map((response) => response.data));
    }

    updateSurplusParticipant(id: any, payload: any): Observable<any> {
        return http
            .patch<any>(`${this.COMMAND_CONTEXT}/surplus-participant/${id}`, payload)
            .pipe(map((response) => response.data));
    }

    // Treaty Allocation API
    getTreatyAllocation(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/treaty-allocation?responseType=JSON`)
            .pipe(map((response) => response.data));
    }

    // Treaty Allocation Excel Download
    downloadTreatyAllocationExcel(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/treaty-allocation?responseType=EXCEL`, {
                responseType: 'blob' as 'json'
            })
            .pipe(map((response) => response.data));
    }

    // Surplus Participant Allocation API
    getSurplusParticipantAllocation(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/surplus-participant-allocation?responseType=JSON`)
            .pipe(map((response) => response.data));
    }

    // Surplus Participant Allocation Excel Download
    downloadSurplusParticipantAllocationExcel(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/surplus-participant-allocation?responseType=EXCEL`, {
                responseType: 'blob' as 'json'
            })
            .pipe(map((response) => response.data));
    }

    // Proportional Allocations on Claim API
    getProportionalAllocationsOnClaim(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/treaty-allocation/proportional-allocations-on-claim?responseType=JSON`)
            .pipe(map((response) => response.data));
    }

    // Proportional Allocations on Claim Excel Download
    downloadProportionalAllocationsOnClaimExcel(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/treaty-allocation/proportional-allocations-on-claim?responseType=EXCEL`, {
                responseType: 'blob' as 'json'
            })
            .pipe(map((response) => response.data));
    }

    // Surplus Participant Allocation Paid Claims API
    getSurplusParticipantAllocationPaidClaims(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/surplus-participant-allocation/paid-claims?responseType=JSON`)
            .pipe(map((response) => response.data));
    }

    // Surplus Participant Allocation Paid Claims Excel Download
    downloadSurplusParticipantAllocationPaidClaimsExcel(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/surplus-participant-allocation/paid-claims?responseType=EXCEL`, {
                responseType: 'blob' as 'json'
            })
            .pipe(map((response) => response.data));
    }

    // Surplus Participant Allocation Outstanding Claims API
    getSurplusParticipantAllocationOutstandingClaims(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/surplus-participant-allocation/outstanding-claims?responseType=JSON`)
            .pipe(map((response) => response.data));
    }

    // Surplus Participant Allocation Outstanding Claims Excel Download
    downloadSurplusParticipantAllocationOutstandingClaimsExcel(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/surplus-participant-allocation/outstanding-claims?responseType=EXCEL`, {
                responseType: 'blob' as 'json'
            })
            .pipe(map((response) => response.data));
    }

    // XOL Treaty Master APIs
    getAllXolTreatyMaster(pageRequest: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/xol-treaty-master`, { params: pageRequest })
            .pipe(map((response) => response));
    }

    getXolTreatyMasterById(id: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/xol-treaty-master/${id}`)
            .pipe(map((response) => response));
    }

    saveXolTreatyMaster(payload: any): Observable<any> {
        return http
            .post<any>(`${this.COMMAND_CONTEXT}/xol-treaty-master`, payload)
            .pipe(map((response) => response.data));
    }

    updateXolTreatyMaster(id: any, payload: any): Observable<any> {
        return http
            .patch<any>(`${this.COMMAND_CONTEXT}/xol-treaty-master/${id}`, payload)
            .pipe(map((response) => response.data));
    }

    // XOL Treaty APIs
    saveXolTreaty(payload: any): Observable<any> {
        return http
            .post<any>(`${this.COMMAND_CONTEXT}/xol-treaty`, payload)
            .pipe(map((response) => response.data));
    }

    getAllXolTreaties(pageRequest: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/xol-treaty`, { params: pageRequest })
            .pipe(map((response) => response));
    }

    // XOL Treaty Definition Allocation API
    getXolTreatyDefinitionAllocation(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/xol-treaty-definition-allocation?responseType=JSON`)
            .pipe(map((response) => response.data));
    }

    // XOL Treaty Definition Allocation Excel Download
    downloadXolTreatyDefinitionAllocationExcel(): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/xol-treaty-definition-allocation?responseType=EXCEL`, {
                responseType: 'blob' as 'json'
            })
            .pipe(map((response) => response.data));
    }

    // Treaty Definition APIs (Treaty Config 3)
    saveTreatyDefinition(payload: any): Observable<any> {
        return http
            .post<any>(`${this.COMMAND_CONTEXT}/treaty-definition`, payload)
            .pipe(map((response) => response.data));
    }

    getAllTreatyDefinitions(pageRequest: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/treaty-definition`, { params: pageRequest })
            .pipe(map((response) => response));
    }

    getTreatyDefinitionById(id: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/treaty-definition/${id}`)
            .pipe(map((response) => response));
    }

    // Portfolio Treaty APIs (Treaty Config 4)
    savePortfolioTreaty(payload: any): Observable<any> {
        return http
            .post<any>(`${this.COMMAND_CONTEXT}/portfolio-treaty`, payload)
            .pipe(map((response) => response.data));
    }

    getAllPortfolioTreaties(pageRequest: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/portfolio-treaty`, { params: pageRequest })
            .pipe(map((response) => response));
    }

    getPortfolioTreatyById(id: any): Observable<any> {
        return http
            .get<any>(`${this.QUERY_CONTEXT}/portfolio-treaty/${id}`)
            .pipe(map((response) => response));
    }

    updatePortfolioTreaty(id: any, payload: any): Observable<any> {
        return http
            .patch<any>(`${this.COMMAND_CONTEXT}/portfolio-treaty/${id}`, payload)
            .pipe(map((response) => response.data));
    }
}
