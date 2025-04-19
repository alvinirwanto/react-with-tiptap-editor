import { useNavigate } from "@tanstack/react-router";


export function useCheckUser() {
    const navigate = useNavigate();

    const checkUser = async (id: string | undefined, idUrl: string | undefined) => {
        if (!id) {
            return;
        }

        localStorage.setItem('user-auth-ifest', id ?? '');
        localStorage.setItem('portal-url', idUrl ?? '');

        try {
            const response = await fetch(
                `${import.meta.env.VITE_PUBLIC_API}/app-module`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: `Bearer ${id}`,
                    },
                }
            );

            const responseDataUser = await fetch(
                `${import.meta.env.VITE_PUBLIC_API}/auth/token-validate`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": 'application/json',
                        Authorization: `${id}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                const dataUser = await responseDataUser.json();
                localStorage.setItem('list-menu', JSON.stringify(data.data));
                localStorage.setItem('data-user', JSON.stringify(dataUser.data));

                const redirectTimer = setTimeout(() => {
                    navigate({ to: '/' });
                }, 4300);

                return () => clearTimeout(redirectTimer);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return { checkUser };
}
