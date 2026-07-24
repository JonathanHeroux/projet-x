import { RouterProvider } from "react-router-dom";
import { Suspense } from "react";
import router from "./Routes/Router";
import "./App.css";

export default function App() {
  return (
    <>
      <Suspense fallback={<p>Chargement...</p>}>
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}
