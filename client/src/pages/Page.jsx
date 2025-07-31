import React from "react";
import { Link } from "react-router-dom";

function Page() {
  return (
    <>
      <div>
        <h1>Page</h1>
      </div>
      <Link to="/">
        <button>Home</button>
      </Link>
    </>
  );
}

export default Page;
