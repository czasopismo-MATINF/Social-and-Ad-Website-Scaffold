import React, { useState } from "react";

import { useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { Link } from "react-router-dom";


function MainPage(props) {

  const categoriesInfo = useSelector(state => state.main.categoriesInfo);

  return (
    <>
      {categoriesInfo?.categories?.categories?.map(ci => (
        <div key={ci.id}>
            <Link
            to={`/ads?categories=${ci.id}`}
            style={{
                textDecoration: "none",
                color: "inherit",
                padding: "4px 0",
                transition: "color 0.2s ease, text-decoration-color 0.2s ease"
            }}
            onMouseEnter={(e) => {
                e.target.style.color = "#1976d2";          // MUI primary
                e.target.style.textDecoration = "underline";
            }}
            onMouseLeave={(e) => {
                e.target.style.color = "inherit";
                e.target.style.textDecoration = "none";
            }}
            >
            {ci.description}
            </Link>
        </div>
      ))}
    </>
  );
}

export default MainPage;