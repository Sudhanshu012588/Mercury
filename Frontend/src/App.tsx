import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./Pages/Notfound";
import Navbar from "./Components/Navbar";
import Home from "./Pages/HomePage"
import Signup from "./Pages/Signup";
import Notebooks from "./Pages/Notebooks";
import { Toaster } from "react-hot-toast";
import Navigation from "./Pages/Navigation";
import {Module} from "./Pages/Navigation_Module";
function App() {
  return (
    <BrowserRouter>
    <Toaster/>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="*" element={<NotFound />} />
        <Route path="/notebooks" element={<Notebooks/>}/>
        <Route path="/navigation" element={<Navigation/>}/>
        <Route path="/navigation/module" element={<Module/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
