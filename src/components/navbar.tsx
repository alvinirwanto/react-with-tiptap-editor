import { useState } from "react";
import { HoveredLink, Menu, MenuItem, MenuItemChild } from "./ui/navbar-menu";
import { useLocation } from "@tanstack/react-router";

export default function Navbar() {

    const menuList = [
        {
            name: 'Portal',
            link: '/',
            child: []
        },
        {
            name: 'Dashboard',
            link: '/dashboard',
            child: []
        },
        {
            name: 'Previledge',
            link: '/previledge',
            child: []
        },
        {
            name: 'Master Data',
            link: '',
            child: [
                {
                    name: 'Trainer',
                    link: '/master/trainer'
                },
                {
                    name: 'Trainer Eksternal',
                    link: '/master/trainer-eksternal'
                },
                {
                    name: 'Kategori Pelatihan',
                    link: '/master/kategori-pelatihan'
                },
                {
                    name: 'Sub Kategori Pelatihan',
                    link: '/master/sub-kategori-pelatihan'
                },
                {
                    name: 'Anggaran KS Cabang',
                    link: '/master/anggaran-ks-cabang'
                },
                {
                    name: 'Sasaran Peserta',
                    link: '/master/sasaran-peserta'
                }
            ]
        },
        {
            name: 'Deviasi',
            link: '',
            child: [
                {
                    name: 'List Deviasi',
                    link: '/deviasi/list'
                },
                {
                    name: 'Approval Deviasi',
                    link: '/deviasi'
                }
            ]
        },
        {
            name: 'Event',
            link: '',
            child: [
                {
                    name: 'List Event & Pengajuan Event',
                    link: '/event/list'
                },
                {
                    name: 'Verifikasi Event',
                    link: '/event/verifikasi'
                },
                {
                    name: 'Persetujuan Pusat Event',
                    link: '/event/persetujuan-pusat'
                },
            ]
        },
    ]

    const [active, setActive] = useState<string | null>(null);

    const location = useLocation()
    const activeLink = location.pathname

    return (
        <div className='h-[60px] px-6 bg-white flex items-center !z-[100] relative justify-between border-b-2'>
            <img
                alt="logo"
                src='/PNM_logo.png'
                className="h-10 py-[4px]"
            />
            <div className="flex items-center gap-6 font-semibold">
                <Menu setActive={setActive}>
                    {
                        menuList.map((item, i) => (
                            <div key={i + 1}>
                                {
                                    item.child.length === 0
                                        ? <MenuItem
                                            link={item}
                                            activeLink={activeLink}
                                        >
                                            {item.name}
                                        </MenuItem>
                                        : <MenuItemChild
                                            setActive={setActive}
                                            active={active}
                                            item={item}
                                            activeLink={activeLink}
                                        >
                                            <div className="flex flex-col space-y-1">
                                                {
                                                    item.child.map((item, i) => (
                                                        <HoveredLink
                                                            key={i + 1}
                                                            href={item.link}
                                                        >
                                                            {item.name}
                                                        </HoveredLink>
                                                    ))
                                                }
                                            </div>
                                        </MenuItemChild>
                                }
                            </div>
                        ))
                    }
                </Menu>
            </div>
            <div className="relative flex items-center gap-8 bg-white rounded-full py-1 pl-2">
                <div
                    className="flex items-center gap-1 md:gap-3"
                >
                    <img
                        alt="Profile Pict"
                        src={'/PNM_logo.png'}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/placeholder.jpg';
                        }}
                        className="h-8 w-8 rounded-full object-cover shadow-xl bg-white border-gray-200 border"
                    />
                    <div className="flex flex-col justify-start items-start">
                        <span className="hidden md:block text-xs pr-1 text-gray-600 font-medium">Budi</span>
                        <span className="hidden md:block text-[9px] text-gray-500">Bos</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
