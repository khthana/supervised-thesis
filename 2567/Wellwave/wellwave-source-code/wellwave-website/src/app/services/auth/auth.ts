export const handleLogout = async () => {
    try {
        const response = await fetch('http://ce67-16.cloud.ce.kmitl.ac.th/api/v1/auth/logout', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}` // ถ้าต้องการใช้ Token ใน Header
            },
        });

        console.log('Response status:', response.status);

        if (response.ok) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            console.log('Logout successful');
            window.location.href = '/login';
        } else {
            console.error('Logout failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};