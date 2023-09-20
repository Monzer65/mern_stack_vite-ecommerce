/** @format */
import Users from "../components/Users";
import useRefreshToken from "../hooks/UseRefreshToken";
function Dashboard() {
  const refresh = useRefreshToken();
  return (
    <>
      <h1>Admin page</h1>
      <Users />
      <button onClick={() => refresh()}>refresh</button>
    </>
  );
}

export default Dashboard;
