export default function logOut() {
    if (localStorage.getItem("user-auth-pass")) {
        localStorage.removeItem("user-auth-pass");
    }

    // if (localStorage.getItem("list-menu")) {
    //     localStorage.removeItem("list-menu");
    // }

    if (localStorage.getItem("user-status-password")) {
        localStorage.removeItem("user-status-password");
    }

    if (localStorage.getItem("user-data")) {
        localStorage.removeItem("user-data");
    }

    window.location.href = "/login";
    
    // const a = document.createElement('a');
    // // a.href = localStorage.getItem('portal-url') + 'login';
    // a.href = '/login'
    // a.click();
}
