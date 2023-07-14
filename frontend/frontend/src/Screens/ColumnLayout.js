import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import VerticalHeader from "../Components/ColumnLayout/VerticalHeader";
import News from "../Components/ColumnLayout/News";
import SearchEngine from "../Components/ColumnLayout/SearchEngine";
import FriendListComponent from "../Components/ColumnLayout/FriendListComponent";
import LoggedUserInfoComponent from "../Components/ColumnLayout/LoggedUserInfoComponent";

function ColumnLayout({
  middleColumn,
  RightColumnExist = true,
  RightColumnContent = null,
  SearchTagsGroupsExist = true,
  SearchTagsGroupsContent = null,
}) {
  return (
    <Container className="layout">
      <Row className="justify-content-center align-items-center">
        {/* Handle Searching function */}
        {SearchTagsGroupsExist ? (
          <SearchEngine />
        ) : (
          SearchTagsGroupsContent && { SearchTagsGroupsContent }
        )}
      </Row>{" "}
      <Row>
        <Col sm={3} md={3} lg={2}>
          {/* Left Column */}
          <VerticalHeader />
        </Col>
        {RightColumnExist ? (
          <Col sm={9} md={9} lg={6} className="justify-content-md-center mx-0">
            {/* Middle Column (with content render based on URL */}
            {middleColumn}
          </Col>
        ) : RightColumnContent === null ? (
          <Col sm={9} md={9} lg={10} className="justify-content-md-center mx-0">
            {/* Middle Column (with content render based on URL) much bigger in case RightColumnExist = false*/}
            {middleColumn}
          </Col>
        ) : (
          <Col sm={9} md={9} lg={6} className="justify-content-md-center mx-0">
            {/* Middle Column (with content render based on URL) much bigger in case RightColumnExist = false*/}
            {middleColumn}
          </Col>
        )}
        {/*Check if the RightColumntExist param is set to true */}
        {RightColumnExist ? (
          <Col sm={3} md={3} lg={3} className="mx-5">
            <Row>
              <LoggedUserInfoComponent />
            </Row>
            {/* Right Column */}
            <News />
          </Col>
        ) : (
          <Col sm={3} md={3} lg={3} className="mx-5">
            {RightColumnContent}
          </Col>
        )}
      </Row>
      <FriendListComponent />
    </Container>
  );
}

export default ColumnLayout;
