/** @format */
import "../../assets/styles/admin/home.css";
import Sidebar from "../../components/admin/Sidebar";
import Navbar from "../../components/admin/Navbar";
import Widget from "../../components/admin/Widget";
import Featured from "../../components/admin/Featured";
import Chart from "../../components/admin/Chart";
import Table from "../../components/admin/Table";

function Home() {
  return (
    <div className="admin-home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div>
      </div>
    </div>
  );
}

export default Home;
