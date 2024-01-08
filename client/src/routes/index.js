import { Suspense, lazy } from "react";
import { Navigate, useRoutes, useLocation } from "react-router-dom";
// layouts// guards
import GuestGuard from "../guards/GuestGuard";
import AuthGuard from "../guards/AuthGuard";
// import RoleBasedGuard from '../guards/RoleBasedGuard';// components
import SignUp from "../pages/auth/SignUp";
import Login from "../pages/auth/Login";
import LandingPage from "../pages/LandingPage";
import RacingPage from "../pages/RacingPage";

// ----------------------------------------------------------------------

// const Loadable = (Component) => (props) => {
//   // eslint-disable-next-line react-hooks/rules-of-hooks
//   const { pathname } = useLocation();
//   const isDashboard = pathname.includes("/dashboard");

//   return (
//     <Suspense
//       fallback={
//         <LoadingScreen
//           sx={{
//             ...(!isDashboard && {
//               top: 0,
//               left: 0,
//               width: 1,
//               zIndex: 9999,
//               position: "fixed",
//             }),
//           }}
//         />
//       }
//     >
//       <Component {...props} />
//     </Suspense>
//   );
// };

export default function Router() {
  return useRoutes([
    {
      path: "auth",
      children: [
        {
          path: "login",
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        {
          path: "register",
          element: (
            <GuestGuard>
              <SignUp />
            </GuestGuard>
          ),
        },
      ],
    },

    // Dashboard Routes

    {
      path: "/",
      // element: <AuthGuard></AuthGuard>,
      children: [
        {
          path: "/",
          element: (
            <AuthGuard>
              <LandingPage />
            </AuthGuard>
          ),
        },
      ],
    },
    {
      path: "room",
      children: [
        {
          path: ":id",
          element: <RacingPage />,
        },
      ],
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
