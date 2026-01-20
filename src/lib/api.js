// const BASE_URL =  process.env.REACT_APP_API_URL ||"http://localhost:3001";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// const BASE_URL = (process.env.REACT_APP_API_URL as string) || "http://localhost:3001";

export async function apiFetch(
    path,
    options = {}
) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
    }

    return data;
}
