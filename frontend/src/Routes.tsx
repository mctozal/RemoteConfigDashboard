import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ConfigurationMain from "./pages/RemoteConfig/components/ConfigurationMain";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ConfigurationMain /> },
      {
        path: "/configuration",
        element: <ConfigurationMain />,
      },
      // {
      //   path: "/configuration/:id/preview",

      //   element: <PreviewConfiguration />,
      // },
      // {
      //   path: "/configuration/:id",

      //   element: <UpdateConfiguration />,
      // },
    ],
  },
]);
export default router;
