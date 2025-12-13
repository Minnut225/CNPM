import { Children, createContext, useState, useEffect } from "react";
import { logIn as logInAPI } from "../api/authAPI";
import { toast } from "react-toastify";
import config from "../api/config.json";

const { SERVER_API } = config;

export const AuthContext = createContext()

function AuthProvider({ children }) {
    const [auth, setAuth] = useState({ userId: '', token: '' })

    useEffect(() => {
        const storedAuth = localStorage.getItem("auth");
        if (storedAuth) {
            setAuth(JSON.parse(storedAuth));
        }
    }, []);

    const logIn = async (phone, password) => {
        try {
            const data = await logInAPI(phone, password)

            setAuth({ userId: data.userId, token: data.token })
            localStorage.setItem("userId", data.userId);

            localStorage.setItem(
                "auth",
                JSON.stringify({ userId: data.userId, token: data.token })
            )
            if (data.userId) {
                try {
                    // Gọi API tìm nhà hàng theo Owner ID
                    const res = await fetch(`${SERVER_API}/api/restaurants/owner/${data.userId}`);
                    console.log("👉 Fetch nhà hàng theo Owner ID:", res);
                    if (res.ok) {
                        const restaurantData = await res.json();

                        console.log("👉 Full Response từ Server:", restaurantData);
                        if (restaurantData && restaurantData.restaurantId) {
                            console.log("User là chủ nhà hàng:", restaurantData.restaurantName);

                            // Lưu ID nhà hàng vào LocalStorage để dùng cho các trang quản lý
                            localStorage.setItem('restaurantId', restaurantData.restaurantId);
                            localStorage.setItem('ResLatitude', restaurantData.latitude);
                            localStorage.setItem('ResLongitude', restaurantData.longitude);
                        }
                    } else {
                        console.log("không tìm thấy nhà hàng cho user này.");
                        localStorage.removeItem('restaurantId');
                    }
                } catch (fetchErr) {
                    console.error("Lỗi khi fetch thông tin nhà hàng:", fetchErr);
                }
            }
        }
        catch (err) {
            throw err;
        }
    }

    const logOut = () => {
        setAuth({ userId: '', token: '' })
        localStorage.removeItem("auth");
    }

    return (
        <AuthContext.Provider value={{ auth, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;