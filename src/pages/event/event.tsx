import TitlePage from "@/components/title-page";
import LayoutPage from "@/layout/layout-page";

export default function Event() {
    return (
        <LayoutPage
            childrenHead={
                <TitlePage title="Event" />
            }
        >
            hello
        </LayoutPage>
    )
}
