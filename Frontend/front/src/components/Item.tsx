import { Nav } from "react-bootstrap";
import List from "./item/List";
import Draw from "./item/Draw";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { NavTab } from "./atoms/tab/NavTab";
import {findAllItems, createMyItem, findMyItemList, deleteMyItem} from "../api/item/itemApi.txt";

function Item() {
  const [selectedTab, setSelectedTab] = useState("items");
  return (
    <>
      <Nav
        variant="underline"
        activeKey={selectedTab}
        as="div"
        // className="text-grey3"
        style={{
          display: "flex",
          // justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
        }}
      >
        <Nav.Item onClick={() => setSelectedTab("draw")}>
          <Nav.Link
            eventKey="draw"
            active={selectedTab == "draw"}
            style={{ color: selectedTab == "draw" ? "#176DEE" : "#B9BEC6" }}
          >
            뽑기
          </Nav.Link>
        </Nav.Item>
        <Nav.Item as="div" onClick={() => setSelectedTab("items")}>
          <Nav.Link
            eventKey="draw"
            active={selectedTab == "items"}
            style={{ color: selectedTab == "items" ? "#176DEE" : "#B9BEC6" }}
          >
            내 아이템
          </Nav.Link>
        </Nav.Item>
        {/* <NavTab label="내아이템" linkto="list" linktype="Nav"></NavTab> */}
      </Nav>
      <div className="border-top my-2"></div>
      {/* <Outlet></Outlet> */}
      {selectedTab == "items" && <List></List>}
      {selectedTab == "draw" && <Draw></Draw>}
    </>
  );
}
export default Item;
