import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from '../features/home/Home';


const App = () => {
  return (
    <>
      
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
