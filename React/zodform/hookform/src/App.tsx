import { createContext, useState } from "react";
import "./App.css";
import CustomForm from "./components/CustomForm/CustomForm";
export const GentelmanContext = createContext({});
function App() {
   return (
    <>
      <CustomForm />
         </>
  );
}

export default App;
