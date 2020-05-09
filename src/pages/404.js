import React from "react";
import { Link } from "gatsby";
import { Typography } from "@material-ui/core";

const NotFoundPage = () => (
  <>
    <Typography variant="h4">PAGE NOT FOUND</Typography>
    <Link to="/">Back</Link>
  </>
);

export default NotFoundPage;
