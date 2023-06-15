import { createHashRouter } from "react-router-dom";
import Layout from "@/layouts/Layout";
import Welcome from "@/views/Welcome";
import Settings from "@/views/Settings";
import Chat from "@/views/Chat";

const router = createHashRouter(
  [
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: <Welcome />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        {
          path: "chat/:id?",
          element: <Chat />,
        },
      ],
    },
  ],
  { basename: "/" }
);

export default router;
