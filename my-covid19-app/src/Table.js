import React from "react";
import "./Table.css";


function Table({ countries }) {
  return (
    <div className="table">
      {countries.map(({ country, cases }) => (
        <tr>
          <td>{country}</td>
          <td>
            <strong>{String(cases).replace(
              /(.)(?=(\d{3})+$)/g,
              "$1,"
            )}</strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;