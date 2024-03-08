import React, { useState, useEffect } from "react";
function HomeCard() {
  const [collectionData, setCollectionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/get-collection");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setCollectionData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="main lg:max-w-screen-lg md:max-w-screen-md max-w-sm lg:px-0 px-8 pt-8">
      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
        {collectionData.map((item, index) => (
          <div className="homecard">
            <div className="homecard_container">
              <img className="homecard_img" src={item.image_url} />
              <div className="homecard_header">
                <span>{item.level}</span>
                <div className="homecard_ownership">
                  <h3>{item.ownership_rate}%</h3>
                  <p>Ownership / Token</p>
                </div>
              </div>
              <hr></hr>
              <div className="homecard_body">
                <div className="homecard_price">$ {item.price}</div>
                <div className="homecard_description">
                  {item.description.map((item_description, index) => (
                    <div className="homecard_collection">
                      <div className="homecard_icon">
                        {item_description.icon}
                      </div>
                      <span>{item_description.body}</span>
                    </div>
                  ))}
                </div>
                <button className="homecard_btn">Button s</button>
                <p className="homecard_ptext">
                  Launch Date: {item.launched_at}
                </p>
              </div>
              {item.mint_mode ? ("") : (<div className="homecard_disabled_overlay"></div>)}
            </div>
            <p className="homecard_ptext">{item.invocations} Tokens</p>
          </div>
        ))}
      </div>

      <div className="home_btn_view_more text-right lg:px-0 md:px-8 sm:px-0">
        Valuation method <span>--&gt;</span>
      </div>
    </div>
  );
}
export default HomeCard;
