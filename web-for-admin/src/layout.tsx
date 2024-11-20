import { Outlet } from "react-router-dom"
import Sidebar from "./components/slidebar"
export default function LayOut(){
    return(
        <>
        <Sidebar />
        <div id="main">
          <Outlet/>
        </div>
        </>
    )
};