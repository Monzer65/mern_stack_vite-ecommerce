/** @format */
import "../../assets/styles/admin/table.css";
const Table = () => {
  const data = [
    {
      id: 1143155,
      product: "Acer Nitro 5",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "John Smith",
      date: "1 March",
      amount: 785,
      method: "Cash on Delivery",
      status: "Approved",
    },
    {
      id: 2235235,
      product: "Playstation 5",
      img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Michael Doe",
      date: "1 March",
      amount: 900,
      method: "Online Payment",
      status: "Pending",
    },
    {
      id: 2342353,
      product: "Redragon S101",
      img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "John Smith",
      date: "1 March",
      amount: 35,
      method: "Cash on Delivery",
      status: "Pending",
    },
    {
      id: 2357741,
      product: "Razer Blade 15",
      img: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Jane Smith",
      date: "1 March",
      amount: 920,
      method: "Online",
      status: "Approved",
    },
    {
      id: 2342355,
      product: "ASUS ROG Strix",
      img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Harold Carol",
      date: "1 March",
      amount: 2000,
      method: "Online",
      status: "Pending",
    },
  ];

  return (
    <div className="table">
      <table style={{ minWidth: 650 }} aria-label="simple table">
        <thead>
          <tr>
            <th className="tableCell">Tracking ID</th>
            <th className="tableCell">Product</th>
            <th className="tableCell">Image</th>
            <th className="tableCell">Customer</th>
            <th className="tableCell">Date</th>
            <th className="tableCell">Amount</th>
            <th className="tableCell">Payment Method</th>
            <th className="tableCell">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((val, key) => {
            return (
              <tr key={key}>
                <td className="tableCell">{val.id}</td>
                <td className="tableCell">
                  <div className="cellWrapper">
                    <img src={val.img} alt="" className="image" />
                    {val.product}
                  </div>
                </td>
                <td className="tableCell">
                  <img src={val.img} alt="" className="image" />
                </td>
                <td className="tableCell">{val.customer}</td>
                <td className="tableCell">{val.date}</td>
                <td className="tableCell">{val.amount}</td>
                <td className="tableCell">{val.method}</td>
                <td className="tableCell">
                  <span className={`status ${val.status}`}>{val.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
