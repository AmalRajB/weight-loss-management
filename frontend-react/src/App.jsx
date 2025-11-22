import Navbar from './components/navigationbar/navbar'
import Footer from './components/navigationbar/footer'
import { Routes,Route } from 'react-router'
import Home from './components/pages/home'
// import Signup from './components/signup'
import LoginProtected from "./components/auth/LoginProtected";
import Addweight from './components/pages/addweight'
import Edit from './components/pages/editlist'
import Calculateweightlose from './components/pages/WeightLossCalculator'
import SignupProtected from './components/auth/signupprotected'


function App() {
  return(
    <>
    <div>
      <Navbar />
      <Routes>
        {/* <Route path='/' element={<Signup/>}/> */}
        <Route path='/' element={<SignupProtected/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path="/login" element={<LoginProtected />} />
        <Route path='/add' element={<Addweight/>}/>
        <Route path='/editlist/:id' element={<Edit/>}/>
        <Route path='/weightlose' element={<Calculateweightlose/>}/>



      </Routes>
      <Footer />
    </div>
    
    </>
  )

}

export default App