// this file contains all routes + generic code outside routs like home/about/store page
// as well as navbar which is included in all routes
// here you want to import all the stuff for routing + all the different components

import {Routes, Route} from "react-router-dom"
import { Container } from "react-bootstrap"
import {Home} from "./pages/Home"
import {Store} from "./pages/Store"
import {About} from "./pages/About"

function App() {
  return (
    <>
     <Container className="mb-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/about" element={<About />} />
      </Routes>
     </Container>
    </>
  )
}

export default App
