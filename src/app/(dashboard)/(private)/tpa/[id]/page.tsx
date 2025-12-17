"use client"
import TpaDetails from "../../../../../views/apps/tpa/tpa.details.component";

const TpaId = ({ params }: { params: any }) => {
    console.log(params);

    return <TpaDetails />;

}

export default TpaId;
