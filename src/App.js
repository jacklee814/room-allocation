import { lazy, Suspense } from "react";

const RoomAllocation = lazy(() => import("./features/RoomAllocation"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <RoomAllocation
          guest={10}
          room={3}
          onChange={(result) => console.log({ result })}
        />
      </Suspense>
    </div>
  );
}

export default App;
