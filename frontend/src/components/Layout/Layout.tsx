import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getSession, get_csrf } from "../../api/api";
import { apiCsrf, apiError, apiIsAuthenticated } from "../../actions/apiCreators";


export const Layout = () => {

  const dispatch = useDispatch();

// old version

//   useEffect(() => {
//     const fetchSession = async () => {
//
//       try {
//         const data = await getSession();
//         if (data.status === 200 && data) {
//           localStorage.setItem("isAuthenticated", String(data.isAuthenticated));
//           localStorage.setItem("username", data.username || "");
//           localStorage.setItem('userId', data.userId || '');
//           if (data.is_admin) {
//             localStorage.setItem('is_admin', String(data.is_admin));
//           }
//           dispatch(apiIsAuthenticated(true));
//
//           // Обнуляем ошибку соединения с сервером, если ранее была
//           dispatch(apiError(null));
//         } else {
//
//           // Обнуляем CSRF-токен, если пользователь не авторизован
//           dispatch(apiCsrf(""));
//           localStorage.setItem("isAuthenticated", "false");
//
//           // Запрашиваем новый CSRF-токен для неавторизованного пользователя
//           const csrf = await get_csrf() || '';
//           dispatch(apiCsrf(csrf));
//         }
//       } catch (error) {
//         console.error("Error fetching session:", error);
//         dispatch(apiCsrf(""));
//       }
//     };
//     fetchSession();
//   },
// [dispatch]);


// new version

    useEffect(() => {
      const fetchSession = async () => {
        try {
          const data = await getSession();
          if (data.status === 200 && data) {
            localStorage.setItem("isAuthenticated", String(data.isAuthenticated));
            localStorage.setItem("username", data.username || "");
            localStorage.setItem('userId', data.userId || '');
            if (data.is_admin) {
              localStorage.setItem('is_admin', String(data.is_admin));
            }
            dispatch(apiIsAuthenticated(true));
            dispatch(apiError(null));
          } else if (data.status === 403) {
            // Пользователь не аутентифицирован
            dispatch(apiCsrf(""));
            localStorage.setItem("isAuthenticated", "false");
            const csrf = await get_csrf() || '';
            dispatch(apiCsrf(csrf));
            dispatch(apiIsAuthenticated(false)); // Диспатчим, что пользователь не аутентифицирован
          }
           else {
            // Другие ошибки (404, 500 и т.д.)
            console.error("Error fetching session:", data);
            dispatch(apiError(data?.message ? String(data.message) : "Ошибка при получении сессии"));
            dispatch(apiCsrf(""));
            localStorage.setItem("isAuthenticated", "false");
            const csrf = await get_csrf() || '';
            dispatch(apiCsrf(csrf));
            dispatch(apiIsAuthenticated(false));
          }
        } catch (error) {
          console.error("Error fetching session:", error);
          dispatch(apiCsrf(""));
          dispatch(apiError("Произошла ошибка соединения с сервером"));
          localStorage.setItem("isAuthenticated", "false");
        }
      };
      fetchSession();
    },

    [dispatch]);

  return (
   <>
      <Header />
        <main className="container-max-widths mb-5">
          <Outlet />
        </main>
    </>
  );
};
