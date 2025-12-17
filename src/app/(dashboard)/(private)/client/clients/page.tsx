import { Suspense } from "react";

import Client, { Dashboard } from "@/views/apps/client-management/client";


const Client_Management = () => {
    return (
        <Suspense fallback={null}>
            {/* <Dashboard /> */}
            <Client />
        </Suspense>
    )
}

export default Client_Management;
