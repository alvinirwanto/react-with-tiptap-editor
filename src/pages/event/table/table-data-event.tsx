import { useEffect, useMemo, useState } from "react";
import { Download, Plus, Search, User2 } from "lucide-react";

import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import InputText from "@/components/input/input-text";
import { Form } from "@/components/ui/form";

import { getPesertaMutationFn } from "@/api/admin/api-master-peserta";
import { useDebounce } from "@/hooks/use-debounce";
import toast from "react-hot-toast";
import { useTableStore } from "@/stores/table-store";
import { PiUsersFill } from "react-icons/pi";
import { useNavigate } from "@tanstack/react-router";
import TitlePage from "@/components/title-page";

export default function TableDataEvent() {

    const navigate = useNavigate()

    const form = useForm({});

    const dataEvent = [
        {
            id_memo: 1,
            id_event: 1,
            no_memo: '74389HSJS',
            judul_pelatihan: 'Hello',
            divisi: 'ATI',
            sub_kategori_pelatihan: 'Pelatihan',
            jumlah_peserta: 3,
            status: 'menunggu',
        },
        {
            id_memo: 2,
            id_event: 2,
            no_memo: '74389HSJ55S',
            judul_pelatihan: 'Hello',
            divisi: 'ATI 2',
            sub_kategori_pelatihan: 'Pelatihan',
            jumlah_peserta: 3,
            status: 'menunggu',
        },
    ]

    // const [searchParams, setSearchParams] = useSearchParams();

    // const initialPage = searchParams.get('page');
    // const initialLimit = searchParams.get('limit');
    // const initialSearch = searchParams.get('search');

    // const [dataPeserta, setDataPeserta] = useState<DataProps[]>([]);

    const [limit, setLimit] = useState(Number(10));
    const [page, setPage] = useState(Number(1));
    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const search = form.watch("search") || "";
    const debounceSearch = useDebounce(search, 500);

    useEffect(() => {
        if (form.formState.isDirty) {
            setPage(1);
        }
    }, [debounceSearch]);

    const { data, isLoading, refetch, isFetching, error, isError } = useQuery({
        queryKey: ["peserta", limit, page, debounceSearch],
        queryFn: () => getPesertaMutationFn(limit, page, debounceSearch),
        staleTime: Infinity
    });

    useEffect(() => {
        if (isError) {
            toast.error(`Failed to fetch data ujian: ${(error as any)?.description || "Unknown error"}`);
        }
    }, [isError]);

    // useEffect(() => {
    //     if (data) {
    //         setDataPeserta(data?.data?.rows);
    //         setLimit(data?.data?.limit);
    //         setPage(data?.data?.page);
    //         setTotalRows(data?.data?.total_rows);
    //         setTotalPages(data?.data?.total_pages);
    //     }
    // }, [data]);

    // useEffect(() => {
    //     form.setValue('search', initialSearch ?? '', { shouldDirty: false });
    //     setPage(initialPage ? Number(initialPage) : 1);
    //     setLimit(initialLimit ? Number(initialLimit) : 10);
    // }, []);


    // useEffect(() => {
    //     const params: any = {
    //         page: String(page),
    //         limit: String(limit),
    //     };

    //     if (debounceSearch) params.search = debounceSearch;

    //     setSearchParams(params);
    // }, [page, limit, debounceSearch]);

    const table = useTableStore((state) => state.table);

    return (
        <div className="flex flex-col gap-3 w-full h-full">
            <TitlePage
                title="Verifikasi Event"
                tag="h2"
                size="md"
                prefix={
                    <PiUsersFill className='text-3xl text-blue-pnm' />
                }
            />
            <div className="w-full flex items-center justify-between">
                <div className="w-[400px]">
                    <Form {...form}>
                        <InputText
                            control={form.control}
                            name="search"
                            qa="input-search"
                            placeholder="Search here"
                            startAdorn={<Search className="w-5 h-5 text-blue-pnm" />}
                        />
                    </Form>
                </div>
                <div className="w-full flex justify-end gap-3">
                    <Button
                        qa="button-import-peserta"
                        variant='outline'
                        className='flex items-center gap-3 w-[170px]'
                    >
                        <Download className="h-4 w-4" />
                        Download
                    </Button>
                    <Button
                        qa="button-add-peserta"
                        variant="green"
                        className="flex items-center gap-2 w-[170px]"
                        onClick={() => navigate({ to: '/event/pengajuan-event' })}
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Event
                    </Button>
                </div>
            </div>
        </div>
    );
}

