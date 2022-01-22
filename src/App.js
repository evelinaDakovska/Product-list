import React, { useState } from "react";
import JsonData from "./products.json";

function DisplayData() {
  const [displayData, setDisplayData] = useState(transformData(JsonData));
  const [sortedBy, setSortedBy] = useState();
  const [sortDirection, setSortDirection] = useState();
  const [checked, setChecked] = useState([]);
  const [toggled, setToggled] = useState("false");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

  let allCategories = JsonData.map((product) => {
    return product.Category;
  }).filter((category, index, array) => array.indexOf(category) === index);

  let allManufacturers = JsonData.map((product) => {
    return product.Manufacturer;
  }).filter(
    (manufacturer, index, array) => array.indexOf(manufacturer) === index
  );

  function transformData(data) {
    return data.map((product, i) => {
      return (
        <tr key={product.key} className={`row ${i % 2 !== 0 ? "even" : ""}`}>
          <td key={i}>{i + 1}</td>
          <td key={product.Product}>{product.Product}</td>
          <td key={product.Category}>{product.Category}</td>
          <td key={product.Price}>{product.Price}</td>
          <td key={product.Manufacturer}>{product.Manufacturer}</td>
          <td key={product.ProductionDate}>{product.ProductionDate}</td>
        </tr>
      );
    });
  }

  function sortHandler(e) {
    let target = e.currentTarget.id;
    let coefficient = 1;

    if (
      !sortDirection ||
      sortDirection === "descending" ||
      target !== sortedBy
    ) {
      setSortDirection("ascending");
    } else {
      setSortDirection("descending");
      coefficient = -1;
    }

    setSortedBy(target);

    let sortData = [...JsonData];

    if (target === "ProductionDate") {
      sortData.sort((a, b) => {
        let aDate = new Date(a[target]);
        let bDate = new Date(b[target]);

        if (aDate.getTime() < bDate.getTime()) {
          return -1 * coefficient;
        }
        if (aDate.getTime() > bDate.getTime()) {
          return 1 * coefficient;
        }
        return 0;
      });
    } else {
      sortData.sort((a, b) => {
        if (a[target] < b[target]) {
          return -1 * coefficient;
        }
        if (a[target] > b[target]) {
          return 1 * coefficient;
        }
        return 0;
      });
    }
    setDisplayData(transformData(sortData));
  }

  let optionsHandler = function (e) {
    if (toggled === "true") {
      setToggled("false");
    } else {
      setToggled("true");
    }
  };

  let checkboxHandler = (e) => {
    let updatedList = [...checked];
    if (e.target.checked) {
      updatedList = [...checked, e.target.value];
    } else {
      updatedList.splice(checked.indexOf(e.target.value), 1);
    }
    setChecked(updatedList);
  };

  function applyHandler() {
    let data = [...JsonData];
    let filtered = data.filter(
      (product) =>
        checked.includes(product.Category) ||
        checked.includes(product.Manufacturer)
    );

    if (checked.length === 0) {
      filtered = data;
    }

    if (minPrice) {
      filtered = filtered.filter((product) => product.Price >= minPrice);
    }
    if (maxPrice) {
      filtered = filtered.filter((product) => product.Price <= maxPrice);
    }

    setDisplayData(transformData(filtered));
  }

  function resetHandler() {
    setDisplayData(transformData(JsonData));
    setToggled("false");
  }

  function sum() {
    let data = [...JsonData];
    let sum = data
      .map((product) => product.Price)
      .reduce((prev, curr) => prev + curr, 0);
    return sum;
  }

  let average = (sum() / JsonData.length).toFixed(2);

  function expensive() {
    let data = [...JsonData];
    let mostExpensivePrice = Math.max(...data.map((product) => product.Price));
    let mostExpensiveProduct = data.find(
      (product) => product.Price === mostExpensivePrice
    );
    return `${mostExpensiveProduct.Product} ${mostExpensivePrice}`;
  }

  function cheapest() {
    let data = [...JsonData];
    let cheapestPrice = Math.min(...data.map((product) => product.Price));
    let cheapestProduct = data.find(
      (product) => product.Price === cheapestPrice
    );
    return `${cheapestProduct.Product} ${cheapestPrice}`;
  }

  return (
    <div className="optionsAndTable">
      <button onClick={optionsHandler} className="options">
        Options
      </button>
      <div className={toggled === "true" ? "filter" : "closedFilter"}>
        <h4>Filter by category</h4>
        <div>
          {allCategories.map((category, index) => (
            <div key={index}>
              <input
                value={category}
                type="checkbox"
                onClick={checkboxHandler}
              ></input>
              <span>{category}</span>
            </div>
          ))}
        </div>
        <h4>Filter by manufacturer</h4>
        <div>
          {allManufacturers.map((manufacturer, index) => (
            <div key={index}>
              <input
                value={manufacturer}
                type="checkbox"
                onClick={checkboxHandler}
              ></input>
              <span>{manufacturer}</span>
            </div>
          ))}
        </div>
        <h4>Filter by price</h4>
        <div>
          <label className="label">
            Enter Min Price
            <input
              type="number"
              name="Min Price"
              className="inputPrice"
              onChange={(e) => setMinPrice(e.target.value)}
            ></input>
            Enter Max Price
            <input
              type="number"
              name="Max Price"
              className="inputPrice"
              onChange={(e) => setMaxPrice(e.target.value)}
            ></input>
          </label>
        </div>
        <button onClick={applyHandler}>Apply</button>
        <button onClick={resetHandler}>Reset</button>
      </div>
      <div className="total">
        <div>Total quantity: {displayData.length}</div>
        <div>Total cost: {sum()}lv</div>
        <div>Average price of displayed products: {average}lv</div>
        <div>Most expensive product: {expensive()}lv</div>
        <div>Cheapest product: {cheapest()}lv</div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th onClick={sortHandler} id="Product">
              Product
            </th>
            <th onClick={sortHandler} id="Category">
              Category
            </th>
            <th onClick={sortHandler} id="Price">
              Price
            </th>
            <th onClick={sortHandler} id="Manufacturer">
              Manufacturer
            </th>
            <th onClick={sortHandler} id="ProductionDate">
              Production Date
            </th>
          </tr>
        </thead>
        <tbody>{displayData}</tbody>
      </table>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1>Product list</h1>
      <DisplayData />
    </div>
  );
}

export default App;
