import TitlePage from "@/components/title-page";
import LayoutPage from "@/layout/layout-page";
import TableDataEvent from "./table/table-data-event";

export default function Event() {
    return (
        <LayoutPage
            childrenHead={
                <TitlePage title="Event" />
            }
        >
            <TableDataEvent /> 
        </LayoutPage>
    )
}
