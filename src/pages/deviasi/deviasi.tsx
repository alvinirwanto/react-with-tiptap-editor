import TitlePage from "@/components/title-page";
import LayoutPage from "@/layout/layout-page";
import TableDataDeviasi from "./table/table-data-deviasi";

export default function Deviasi() {
    return (
        <LayoutPage
            childrenHead={
                <TitlePage title="Deviasi" />
            }
        >
            <TableDataDeviasi /> 
        </LayoutPage>
    )
}
