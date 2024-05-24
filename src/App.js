// import './App.css';
// import Login from './component/login';
// function App() {
//   return (
//     <div className="App">
//       <Login></Login>
//     </div>
//   );
// }
import ResponsiveAppBar from './Component/TabBar';
import MapSignalement from './View/map';
function App() {
  return (
    <div>
      <ResponsiveAppBar/>
      <MapSignalement/>
      
    </div>
  );
}
export default App;
