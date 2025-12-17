import { map } from "rxjs/operators";

import { http } from "../../http.client";
import type { IMemberPageRequest} from "../../models/member.request";
import { memberDefaultPageRequest } from "../../models/member.request";
import type { Page } from "../../models/page";

export class MemberProcessService {
    readonly COMMAND_CONTEXT = `member-command-service/v1/member-details-configs`;
    readonly QUERY_CONTEXT = `member-query-service/v1/prospects`;
    readonly MEMBER_QUERY_CONTEXT = `member-query-service/v1/members`;

    getMemberRequests(
        pageRequest: IMemberPageRequest = { ...memberDefaultPageRequest }
    ): any {
        return http
            .get<Page<any>>(`${this.MEMBER_QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }
    getMemberFromIds(
        pageRequest: IMemberPageRequest = { ...memberDefaultPageRequest }
    ): any {
        return http
            .get<Page<any>>(`${this.MEMBER_QUERY_CONTEXT}`, { params: pageRequest })
            .pipe(map((response) => response.data));
    }
}

// status=POLICY_CREATED&active=true : for member list in member upload management module
// key=sourceType&value=QUOTATION&key2=sourctId&value={quotationid} : for quotation module when member upload status 'completed'
