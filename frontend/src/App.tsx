import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router";

export default function App() {
  return (
    <div>
      <h1>The Cold Place</h1>
      <Button>Click Me dear !</Button>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
